
-- Index for settlement performance
CREATE INDEX IF NOT EXISTS idx_bets_status ON public.bets(status);
CREATE INDEX IF NOT EXISTS idx_bet_selections_match ON public.bet_selections(match_id);

-- Update place_bet to enforce self-exclusion and daily bet limit
CREATE OR REPLACE FUNCTION public.place_bet(_selection_ids uuid[], _stake numeric, _bet_type bet_type DEFAULT 'single'::bet_type)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_profile RECORD;
  v_wallet RECORD;
  v_limits RECORD;
  v_total_odds NUMERIC := 1;
  v_sel RECORD;
  v_bet_id UUID;
  v_ref TEXT;
  v_potential NUMERIC;
  v_real_used NUMERIC := 0;
  v_bonus_used NUMERIC := 0;
  v_bal_before NUMERIC;
  v_bal_after NUMERIC;
  v_count INT;
  v_today_total NUMERIC;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501'; END IF;
  IF _stake IS NULL OR _stake < 5 THEN RAISE EXCEPTION 'Minimum stake is R5' USING ERRCODE = '22023'; END IF;
  IF _stake > 10000 THEN RAISE EXCEPTION 'Maximum single stake is R10,000' USING ERRCODE = '22023'; END IF;

  v_count := array_length(_selection_ids, 1);
  IF v_count IS NULL OR v_count = 0 THEN RAISE EXCEPTION 'No selections provided' USING ERRCODE = '22023'; END IF;
  IF _bet_type = 'single' AND v_count <> 1 THEN RAISE EXCEPTION 'Single bet must have exactly one selection' USING ERRCODE = '22023'; END IF;
  IF _bet_type = 'multiple' AND v_count < 2 THEN RAISE EXCEPTION 'Multiple bet requires at least two selections' USING ERRCODE = '22023'; END IF;

  SELECT kyc_status, account_status, date_of_birth INTO v_profile FROM public.profiles WHERE id = v_user_id;
  IF v_profile IS NULL THEN RAISE EXCEPTION 'Profile missing' USING ERRCODE = '42704'; END IF;
  IF v_profile.account_status <> 'active' THEN RAISE EXCEPTION 'Account is not active' USING ERRCODE = '42501'; END IF;
  IF (CURRENT_DATE - v_profile.date_of_birth) < 6570 THEN RAISE EXCEPTION 'You must be 18 or older to bet' USING ERRCODE = '42501'; END IF;

  -- Responsible gaming: self-exclusion + daily bet limit
  SELECT * INTO v_limits FROM public.user_limits WHERE user_id = v_user_id;
  IF v_limits.self_exclusion_until IS NOT NULL AND v_limits.self_exclusion_until > now() THEN
    RAISE EXCEPTION 'You are self-excluded until %', to_char(v_limits.self_exclusion_until, 'YYYY-MM-DD') USING ERRCODE = '42501';
  END IF;
  IF v_limits.daily_bet_limit IS NOT NULL THEN
    SELECT COALESCE(SUM(stake),0) INTO v_today_total FROM public.bets
      WHERE user_id = v_user_id AND placed_at::date = CURRENT_DATE;
    IF (v_today_total + _stake) > v_limits.daily_bet_limit THEN
      RAISE EXCEPTION 'Daily bet limit of R% reached', v_limits.daily_bet_limit USING ERRCODE = '22023';
    END IF;
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_wallet IS NULL THEN RAISE EXCEPTION 'Wallet missing' USING ERRCODE = '42704'; END IF;
  IF (v_wallet.balance + v_wallet.bonus_balance) < _stake THEN RAISE EXCEPTION 'Insufficient funds' USING ERRCODE = '22000'; END IF;

  FOR v_sel IN
    SELECT s.id AS selection_id, s.odds, s.market_id, m.match_id, m.status AS market_status, mt.status AS match_status
    FROM public.selections s JOIN public.markets m ON m.id = s.market_id JOIN public.matches mt ON mt.id = m.match_id
    WHERE s.id = ANY(_selection_ids)
  LOOP
    IF v_sel.market_status <> 'open' THEN RAISE EXCEPTION 'Market is not open' USING ERRCODE = '22023'; END IF;
    IF v_sel.match_status NOT IN ('scheduled','live') THEN RAISE EXCEPTION 'Match is not bettable' USING ERRCODE = '22023'; END IF;
    v_total_odds := v_total_odds * v_sel.odds;
  END LOOP;

  IF (SELECT COUNT(*) FROM public.selections WHERE id = ANY(_selection_ids)) <> v_count THEN
    RAISE EXCEPTION 'Invalid selection' USING ERRCODE = '22023';
  END IF;

  v_total_odds := ROUND(v_total_odds, 2);
  v_potential := LEAST(ROUND(_stake * v_total_odds, 2), 500000);
  v_real_used := LEAST(v_wallet.balance, _stake);
  v_bonus_used := _stake - v_real_used;
  v_bal_before := v_wallet.balance + v_wallet.bonus_balance;

  UPDATE public.wallets SET balance = balance - v_real_used, bonus_balance = bonus_balance - v_bonus_used,
    locked_amount = locked_amount + _stake WHERE id = v_wallet.id;

  v_bal_after := v_bal_before - _stake;
  v_ref := 'BET-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));

  INSERT INTO public.bets (user_id, wallet_id, type, stake, bonus_stake, total_odds, potential_payout, status, reference)
  VALUES (v_user_id, v_wallet.id, _bet_type, _stake, v_bonus_used, v_total_odds, v_potential, 'pending', v_ref)
  RETURNING id INTO v_bet_id;

  INSERT INTO public.bet_selections (bet_id, selection_id, market_id, match_id, odds_snapshot)
  SELECT v_bet_id, s.id, s.market_id, m.match_id, s.odds
  FROM public.selections s JOIN public.markets m ON m.id = s.market_id WHERE s.id = ANY(_selection_ids);

  INSERT INTO public.transactions (user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
  VALUES (v_user_id, v_wallet.id, 'bet_placed', -_stake, v_bal_before, v_bal_after, 'completed', v_ref, now(),
          jsonb_build_object('bet_id', v_bet_id, 'selections', v_count, 'total_odds', v_total_odds));

  RETURN jsonb_build_object('bet_id', v_bet_id, 'reference', v_ref, 'stake', _stake,
    'total_odds', v_total_odds, 'potential_payout', v_potential);
END;
$function$;

-- Settle a match: admin marks winning selections per market, then settle all affected bets
CREATE OR REPLACE FUNCTION public.settle_match(_match_id uuid, _winning_selection_ids uuid[])
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_admin UUID := auth.uid();
  v_bet RECORD;
  v_all_won BOOLEAN;
  v_any_lost BOOLEAN;
  v_payout NUMERIC;
  v_wallet RECORD;
  v_bal_before NUMERIC;
  v_bal_after NUMERIC;
  v_settled INT := 0;
BEGIN
  IF NOT public.has_role(v_admin, 'admin'::app_role) THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE = '42501';
  END IF;

  -- Mark selections won/lost for this match
  UPDATE public.selections SET won = (id = ANY(_winning_selection_ids))
  WHERE market_id IN (SELECT id FROM public.markets WHERE match_id = _match_id);

  -- Mark bet_selections result
  UPDATE public.bet_selections SET result = CASE WHEN selection_id = ANY(_winning_selection_ids) THEN 'won' ELSE 'lost' END
  WHERE match_id = _match_id;

  -- Close markets and match
  UPDATE public.markets SET status = 'settled' WHERE match_id = _match_id;
  UPDATE public.matches SET status = 'finished' WHERE id = _match_id;

  -- Iterate pending bets touching this match
  FOR v_bet IN
    SELECT DISTINCT b.* FROM public.bets b
    JOIN public.bet_selections bs ON bs.bet_id = b.id
    WHERE bs.match_id = _match_id AND b.status = 'pending'
    FOR UPDATE OF b
  LOOP
    -- Skip bets that still have unsettled legs
    IF EXISTS (SELECT 1 FROM public.bet_selections WHERE bet_id = v_bet.id AND result IS NULL) THEN
      CONTINUE;
    END IF;

    SELECT bool_and(result = 'won'), bool_or(result = 'lost')
      INTO v_all_won, v_any_lost
    FROM public.bet_selections WHERE bet_id = v_bet.id;

    SELECT * INTO v_wallet FROM public.wallets WHERE id = v_bet.wallet_id FOR UPDATE;
    v_bal_before := v_wallet.balance + v_wallet.bonus_balance;

    IF v_all_won THEN
      v_payout := v_bet.potential_payout;
      UPDATE public.wallets SET balance = balance + v_payout,
        locked_amount = GREATEST(locked_amount - v_bet.stake, 0) WHERE id = v_wallet.id;
      UPDATE public.bets SET status = 'won', payout = v_payout, settled_at = now() WHERE id = v_bet.id;
      v_bal_after := v_bal_before + v_payout;
      INSERT INTO public.transactions (user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
      VALUES (v_bet.user_id, v_wallet.id, 'bet_won', v_payout, v_bal_before, v_bal_after, 'completed', v_bet.reference, now(),
              jsonb_build_object('bet_id', v_bet.id));
    ELSE
      UPDATE public.wallets SET locked_amount = GREATEST(locked_amount - v_bet.stake, 0) WHERE id = v_wallet.id;
      UPDATE public.bets SET status = 'lost', payout = 0, settled_at = now() WHERE id = v_bet.id;
      INSERT INTO public.transactions (user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
      VALUES (v_bet.user_id, v_wallet.id, 'bet_lost', 0, v_bal_before, v_bal_before, 'completed', v_bet.reference, now(),
              jsonb_build_object('bet_id', v_bet.id));
    END IF;
    v_settled := v_settled + 1;
  END LOOP;

  RETURN jsonb_build_object('match_id', _match_id, 'bets_settled', v_settled);
END;
$function$;

-- User-managed responsible gaming limits
CREATE OR REPLACE FUNCTION public.set_user_limits(
  _daily_deposit numeric DEFAULT NULL,
  _weekly_deposit numeric DEFAULT NULL,
  _monthly_deposit numeric DEFAULT NULL,
  _daily_bet numeric DEFAULT NULL,
  _session_minutes int DEFAULT NULL,
  _self_exclude_days int DEFAULT NULL
)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user UUID := auth.uid();
  v_existing RECORD;
  v_excl_until TIMESTAMPTZ;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501'; END IF;

  SELECT * INTO v_existing FROM public.user_limits WHERE user_id = v_user;

  IF _self_exclude_days IS NOT NULL AND _self_exclude_days > 0 THEN
    v_excl_until := now() + (_self_exclude_days || ' days')::interval;
  ELSE
    v_excl_until := v_existing.self_exclusion_until;
  END IF;

  IF v_existing IS NULL THEN
    INSERT INTO public.user_limits (user_id, daily_deposit_limit, weekly_deposit_limit, monthly_deposit_limit,
      daily_bet_limit, session_time_limit_min, self_exclusion_until)
    VALUES (v_user, _daily_deposit, _weekly_deposit, _monthly_deposit, _daily_bet, _session_minutes, v_excl_until);
  ELSE
    -- Tightening allowed immediately; loosening still allowed (could add cooling-off later)
    UPDATE public.user_limits SET
      daily_deposit_limit = COALESCE(_daily_deposit, daily_deposit_limit),
      weekly_deposit_limit = COALESCE(_weekly_deposit, weekly_deposit_limit),
      monthly_deposit_limit = COALESCE(_monthly_deposit, monthly_deposit_limit),
      daily_bet_limit = COALESCE(_daily_bet, daily_bet_limit),
      session_time_limit_min = COALESCE(_session_minutes, session_time_limit_min),
      self_exclusion_until = v_excl_until
    WHERE user_id = v_user;
  END IF;

  RETURN jsonb_build_object('ok', true);
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.settle_match(uuid, uuid[]) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.settle_match(uuid, uuid[]) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.set_user_limits(numeric, numeric, numeric, numeric, int, int) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.set_user_limits(numeric, numeric, numeric, numeric, int, int) TO authenticated;
