
-- Promo codes
CREATE TABLE public.promo_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  bonus_amount NUMERIC NOT NULL CHECK (bonus_amount > 0),
  max_redemptions INTEGER,
  total_redemptions INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN NOT NULL DEFAULT true,
  min_deposit NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.promo_redemptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  bonus_credited NUMERIC NOT NULL,
  redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, promo_code_id)
);

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public view active promos" ON public.promo_codes
  FOR SELECT USING (active = true);
CREATE POLICY "Admins manage promos" ON public.promo_codes
  FOR ALL USING (has_role(auth.uid(),'admin'::app_role))
  WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE POLICY "Users view own redemptions" ON public.promo_redemptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all redemptions" ON public.promo_redemptions
  FOR SELECT USING (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER promo_codes_updated BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Redeem function
CREATE OR REPLACE FUNCTION public.redeem_promo_code(_code TEXT)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_promo RECORD;
  v_wallet RECORD;
  v_bal_before NUMERIC;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE='42501'; END IF;
  IF _code IS NULL OR length(trim(_code))=0 THEN RAISE EXCEPTION 'Code required' USING ERRCODE='22023'; END IF;

  SELECT * INTO v_promo FROM public.promo_codes
    WHERE upper(code) = upper(trim(_code)) FOR UPDATE;
  IF v_promo IS NULL THEN RAISE EXCEPTION 'Invalid promo code' USING ERRCODE='42704'; END IF;
  IF NOT v_promo.active THEN RAISE EXCEPTION 'Promo no longer active' USING ERRCODE='22023'; END IF;
  IF v_promo.expires_at IS NOT NULL AND v_promo.expires_at < now() THEN
    RAISE EXCEPTION 'Promo has expired' USING ERRCODE='22023'; END IF;
  IF v_promo.max_redemptions IS NOT NULL AND v_promo.total_redemptions >= v_promo.max_redemptions THEN
    RAISE EXCEPTION 'Promo fully redeemed' USING ERRCODE='22023'; END IF;

  IF EXISTS(SELECT 1 FROM public.promo_redemptions WHERE user_id=v_user AND promo_code_id=v_promo.id) THEN
    RAISE EXCEPTION 'You have already used this promo' USING ERRCODE='22023';
  END IF;

  SELECT * INTO v_wallet FROM public.wallets WHERE user_id=v_user FOR UPDATE;
  IF v_wallet IS NULL THEN RAISE EXCEPTION 'Wallet missing' USING ERRCODE='42704'; END IF;

  v_bal_before := v_wallet.balance + v_wallet.bonus_balance;

  UPDATE public.wallets SET bonus_balance = bonus_balance + v_promo.bonus_amount
    WHERE id = v_wallet.id;

  UPDATE public.promo_codes SET total_redemptions = total_redemptions + 1 WHERE id = v_promo.id;

  INSERT INTO public.promo_redemptions(user_id, promo_code_id, bonus_credited)
    VALUES (v_user, v_promo.id, v_promo.bonus_amount);

  INSERT INTO public.transactions(user_id, wallet_id, type, amount, balance_before, balance_after, status, reference, completed_at, metadata)
  VALUES (v_user, v_wallet.id, 'bonus_credit', v_promo.bonus_amount, v_bal_before, v_bal_before + v_promo.bonus_amount,
          'completed', 'PROMO-' || upper(v_promo.code), now(),
          jsonb_build_object('promo_code_id', v_promo.id, 'code', v_promo.code));

  RETURN jsonb_build_object('ok', true, 'bonus', v_promo.bonus_amount, 'code', v_promo.code);
END;
$$;

-- Seed a few sample promos
INSERT INTO public.promo_codes (code, description, bonus_amount, max_redemptions, expires_at) VALUES
  ('KASI50', 'R50 free bonus for new bettors', 50, 1000, now() + interval '30 days'),
  ('CHIEFS100', 'Amakhosi supporters get R100 boost', 100, 500, now() + interval '14 days'),
  ('BRAAI25', 'Weekend braai bonus — R25 free', 25, NULL, now() + interval '7 days');
