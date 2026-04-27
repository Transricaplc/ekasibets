
-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE public.match_status AS ENUM ('scheduled', 'live', 'finished', 'postponed', 'cancelled');
CREATE TYPE public.market_status AS ENUM ('open', 'suspended', 'closed', 'settled', 'cancelled');
CREATE TYPE public.bet_type AS ENUM ('single', 'multiple');
CREATE TYPE public.bet_status AS ENUM ('pending', 'won', 'lost', 'void', 'cashed_out');

-- Extend transaction_type if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'bet_placed' AND enumtypid = 'public.transaction_type'::regtype) THEN
    ALTER TYPE public.transaction_type ADD VALUE 'bet_placed';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'bet_won' AND enumtypid = 'public.transaction_type'::regtype) THEN
    ALTER TYPE public.transaction_type ADD VALUE 'bet_won';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'bet_void' AND enumtypid = 'public.transaction_type'::regtype) THEN
    ALTER TYPE public.transaction_type ADD VALUE 'bet_void';
  END IF;
END$$;

-- ============================================================
-- SPORTS / LEAGUES / MATCHES
-- ============================================================
CREATE TABLE public.sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  country TEXT,
  display_order INT NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sport_id, slug)
);
CREATE INDEX idx_leagues_sport ON public.leagues(sport_id);

CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  region TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  status public.match_status NOT NULL DEFAULT 'scheduled',
  home_score INT,
  away_score INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_matches_league ON public.matches(league_id);
CREATE INDEX idx_matches_status_start ON public.matches(status, start_time);

CREATE TABLE public.markets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  key TEXT NOT NULL,        -- e.g. 'match_winner', 'over_under_2_5'
  name TEXT NOT NULL,       -- display name
  status public.market_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (match_id, key)
);
CREATE INDEX idx_markets_match ON public.markets(match_id);

CREATE TABLE public.selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_id UUID NOT NULL REFERENCES public.markets(id) ON DELETE CASCADE,
  label TEXT NOT NULL,                 -- 'Home' / 'Draw' / 'Away' / 'Over' etc.
  odds NUMERIC(10,2) NOT NULL CHECK (odds >= 1.01),
  display_order INT NOT NULL DEFAULT 0,
  won BOOLEAN,                          -- null=unsettled, true=won, false=lost
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_selections_market ON public.selections(market_id);

-- ============================================================
-- BETS
-- ============================================================
CREATE TABLE public.bets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  wallet_id UUID NOT NULL,
  type public.bet_type NOT NULL,
  stake NUMERIC(12,2) NOT NULL CHECK (stake > 0),
  bonus_stake NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (bonus_stake >= 0),
  total_odds NUMERIC(12,2) NOT NULL CHECK (total_odds >= 1.01),
  potential_payout NUMERIC(14,2) NOT NULL,
  payout NUMERIC(14,2),
  status public.bet_status NOT NULL DEFAULT 'pending',
  reference TEXT NOT NULL UNIQUE,
  placed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  settled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bets_user ON public.bets(user_id);
CREATE INDEX idx_bets_status ON public.bets(status);

CREATE TABLE public.bet_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_id UUID NOT NULL REFERENCES public.bets(id) ON DELETE CASCADE,
  selection_id UUID NOT NULL REFERENCES public.selections(id),
  market_id UUID NOT NULL REFERENCES public.markets(id),
  match_id UUID NOT NULL REFERENCES public.matches(id),
  odds_snapshot NUMERIC(10,2) NOT NULL,
  result TEXT,                              -- 'won' | 'lost' | 'void' | null
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_bet_selections_bet ON public.bet_selections(bet_id);

-- ============================================================
-- TRIGGERS for updated_at
-- ============================================================
CREATE TRIGGER trg_sports_updated BEFORE UPDATE ON public.sports FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_leagues_updated BEFORE UPDATE ON public.leagues FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_markets_updated BEFORE UPDATE ON public.markets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_selections_updated BEFORE UPDATE ON public.selections FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_bets_updated BEFORE UPDATE ON public.bets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- ============================================================
-- RLS
-- ============================================================
ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.markets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bet_selections ENABLE ROW LEVEL SECURITY;

-- Public catalogue: anyone can read
CREATE POLICY "Public view sports" ON public.sports FOR SELECT USING (TRUE);
CREATE POLICY "Public view leagues" ON public.leagues FOR SELECT USING (TRUE);
CREATE POLICY "Public view matches" ON public.matches FOR SELECT USING (TRUE);
CREATE POLICY "Public view markets" ON public.markets FOR SELECT USING (TRUE);
CREATE POLICY "Public view selections" ON public.selections FOR SELECT USING (TRUE);

-- Admin write
CREATE POLICY "Admins manage sports" ON public.sports FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage leagues" ON public.leagues FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage matches" ON public.matches FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage markets" ON public.markets FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage selections" ON public.selections FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bets
CREATE POLICY "Users view own bets" ON public.bets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all bets" ON public.bets FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bets" ON public.bets FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own bet selections" ON public.bet_selections FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.bets b WHERE b.id = bet_id AND b.user_id = auth.uid()));
CREATE POLICY "Admins view all bet selections" ON public.bet_selections FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- ============================================================
-- place_bet FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.place_bet(
  _selection_ids UUID[],
  _stake NUMERIC,
  _bet_type public.bet_type DEFAULT 'single'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_profile RECORD;
  v_wallet RECORD;
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
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '42501';
  END IF;

  IF _stake IS NULL OR _stake < 5 THEN
    RAISE EXCEPTION 'Minimum stake is R5' USING ERRCODE = '22023';
  END IF;
  IF _stake > 10000 THEN
    RAISE EXCEPTION 'Maximum single stake is R10,000' USING ERRCODE = '22023';
  END IF;

  v_count := array_length(_selection_ids, 1);
  IF v_count IS NULL OR v_count = 0 THEN
    RAISE EXCEPTION 'No selections provided' USING ERRCODE = '22023';
  END IF;
  IF _bet_type = 'single' AND v_count <> 1 THEN
    RAISE EXCEPTION 'Single bet must have exactly one selection' USING ERRCODE = '22023';
  END IF;
  IF _bet_type = 'multiple' AND v_count < 2 THEN
    RAISE EXCEPTION 'Multiple bet requires at least two selections' USING ERRCODE = '22023';
  END IF;

  -- Profile checks
  SELECT kyc_status, account_status, date_of_birth INTO v_profile
  FROM public.profiles WHERE id = v_user_id;

  IF v_profile IS NULL THEN
    RAISE EXCEPTION 'Profile missing' USING ERRCODE = '42704';
  END IF;
  IF v_profile.account_status <> 'active' THEN
    RAISE EXCEPTION 'Account is not active' USING ERRCODE = '42501';
  END IF;
  IF (CURRENT_DATE - v_profile.date_of_birth) < 6570 THEN  -- 18 years
    RAISE EXCEPTION 'You must be 18 or older to bet' USING ERRCODE = '42501';
  END IF;

  -- Lock wallet
  SELECT * INTO v_wallet FROM public.wallets WHERE user_id = v_user_id FOR UPDATE;
  IF v_wallet IS NULL THEN
    RAISE EXCEPTION 'Wallet missing' USING ERRCODE = '42704';
  END IF;

  IF (v_wallet.balance + v_wallet.bonus_balance) < _stake THEN
    RAISE EXCEPTION 'Insufficient funds' USING ERRCODE = '22000';
  END IF;

  -- Validate selections + compute odds
  FOR v_sel IN
    SELECT s.id AS selection_id, s.odds, s.market_id, m.match_id, m.status AS market_status, mt.status AS match_status, mt.start_time
    FROM public.selections s
    JOIN public.markets m ON m.id = s.market_id
    JOIN public.matches mt ON mt.id = m.match_id
    WHERE s.id = ANY(_selection_ids)
  LOOP
    IF v_sel.market_status <> 'open' THEN
      RAISE EXCEPTION 'Market is not open' USING ERRCODE = '22023';
    END IF;
    IF v_sel.match_status NOT IN ('scheduled','live') THEN
      RAISE EXCEPTION 'Match is not bettable' USING ERRCODE = '22023';
    END IF;
    v_total_odds := v_total_odds * v_sel.odds;
  END LOOP;

  -- Ensure all ids resolved
  IF (SELECT COUNT(*) FROM public.selections WHERE id = ANY(_selection_ids)) <> v_count THEN
    RAISE EXCEPTION 'Invalid selection' USING ERRCODE = '22023';
  END IF;

  v_total_odds := ROUND(v_total_odds, 2);
  v_potential := LEAST(ROUND(_stake * v_total_odds, 2), 500000);

  -- Debit: real first, then bonus
  v_real_used := LEAST(v_wallet.balance, _stake);
  v_bonus_used := _stake - v_real_used;
  v_bal_before := v_wallet.balance + v_wallet.bonus_balance;

  UPDATE public.wallets
  SET balance = balance - v_real_used,
      bonus_balance = bonus_balance - v_bonus_used,
      locked_amount = locked_amount + _stake
  WHERE id = v_wallet.id;

  v_bal_after := v_bal_before - _stake;
  v_ref := 'BET-' || to_char(now(),'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8));

  -- Bet
  INSERT INTO public.bets (user_id, wallet_id, type, stake, bonus_stake, total_odds, potential_payout, status, reference)
  VALUES (v_user_id, v_wallet.id, _bet_type, _stake, v_bonus_used, v_total_odds, v_potential, 'pending', v_ref)
  RETURNING id INTO v_bet_id;

  -- Bet selections snapshot
  INSERT INTO public.bet_selections (bet_id, selection_id, market_id, match_id, odds_snapshot)
  SELECT v_bet_id, s.id, s.market_id, m.match_id, s.odds
  FROM public.selections s JOIN public.markets m ON m.id = s.market_id
  WHERE s.id = ANY(_selection_ids);

  -- Transaction
  INSERT INTO public.transactions (user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
  VALUES (v_user_id, v_wallet.id, 'bet_placed', -_stake, v_bal_before, v_bal_after, 'completed', v_ref, now(),
          jsonb_build_object('bet_id', v_bet_id, 'selections', v_count, 'total_odds', v_total_odds));

  RETURN jsonb_build_object(
    'bet_id', v_bet_id,
    'reference', v_ref,
    'stake', _stake,
    'total_odds', v_total_odds,
    'potential_payout', v_potential
  );
END;
$$;

REVOKE ALL ON FUNCTION public.place_bet(UUID[], NUMERIC, public.bet_type) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.place_bet(UUID[], NUMERIC, public.bet_type) TO authenticated;
