
-- Enable realtime
ALTER TABLE public.selections REPLICA IDENTITY FULL;
ALTER TABLE public.markets REPLICA IDENTITY FULL;
ALTER TABLE public.matches REPLICA IDENTITY FULL;

DO $$
BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.selections; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.markets;    EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.matches;    EXCEPTION WHEN duplicate_object THEN NULL; END;
END$$;

-- Cash out a pending bet at fair current value
CREATE OR REPLACE FUNCTION public.cash_out_bet(_bet_id uuid)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id UUID := auth.uid();
  v_bet RECORD;
  v_wallet RECORD;
  v_current_odds NUMERIC := 1;
  v_leg RECORD;
  v_cashout NUMERIC;
  v_bal_before NUMERIC;
  v_bal_after NUMERIC;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501'; END IF;

  SELECT * INTO v_bet FROM public.bets WHERE id = _bet_id AND user_id = v_user_id FOR UPDATE;
  IF v_bet IS NULL THEN RAISE EXCEPTION 'Bet not found' USING ERRCODE = '42704'; END IF;
  IF v_bet.status <> 'pending' THEN RAISE EXCEPTION 'Bet is not pending' USING ERRCODE = '22023'; END IF;

  -- All legs must still be open + live/scheduled
  FOR v_leg IN
    SELECT s.odds AS current_odds, m.status AS market_status, mt.status AS match_status
    FROM public.bet_selections bs
    JOIN public.selections s ON s.id = bs.selection_id
    JOIN public.markets m ON m.id = bs.market_id
    JOIN public.matches mt ON mt.id = bs.match_id
    WHERE bs.bet_id = _bet_id
  LOOP
    IF v_leg.market_status <> 'open' OR v_leg.match_status NOT IN ('scheduled','live') THEN
      RAISE EXCEPTION 'Cash-out unavailable — one or more legs have started settling' USING ERRCODE = '22023';
    END IF;
    v_current_odds := v_current_odds * v_leg.current_odds;
  END LOOP;

  -- Fair cash-out: stake * (locked_odds / current_odds) * 0.95 (5% house margin)
  v_cashout := ROUND(v_bet.stake * (v_bet.total_odds / v_current_odds) * 0.95, 2);
  IF v_cashout < 1 THEN v_cashout := 1; END IF;
  IF v_cashout > v_bet.potential_payout THEN v_cashout := v_bet.potential_payout; END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE id = v_bet.wallet_id FOR UPDATE;
  v_bal_before := v_wallet.balance + v_wallet.bonus_balance;

  UPDATE public.wallets
    SET balance = balance + v_cashout,
        locked_amount = GREATEST(locked_amount - v_bet.stake, 0)
    WHERE id = v_wallet.id;

  v_bal_after := v_bal_before + v_cashout;

  UPDATE public.bets
    SET status = 'cashed_out', payout = v_cashout, settled_at = now()
    WHERE id = _bet_id;

  INSERT INTO public.transactions (user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
  VALUES (v_user_id, v_wallet.id, 'cashout', v_cashout, v_bal_before, v_bal_after, 'completed', v_bet.reference, now(),
          jsonb_build_object('bet_id', _bet_id, 'locked_odds', v_bet.total_odds, 'current_odds', ROUND(v_current_odds,2)));

  RETURN jsonb_build_object('bet_id', _bet_id, 'cashout', v_cashout, 'current_odds', ROUND(v_current_odds, 2));
END;
$function$;

REVOKE EXECUTE ON FUNCTION public.cash_out_bet(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.cash_out_bet(uuid) TO authenticated;
