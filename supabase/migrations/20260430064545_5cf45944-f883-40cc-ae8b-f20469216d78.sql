
-- Enums
CREATE TYPE public.reward_category AS ENUM ('airtime','voucher','braai','data','other');
CREATE TYPE public.redemption_status AS ENUM ('pending','fulfilled','cancelled');

-- Catalog
CREATE TABLE public.reward_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category reward_category NOT NULL,
  points_cost INTEGER NOT NULL CHECK (points_cost > 0),
  rand_value NUMERIC NOT NULL DEFAULT 0,
  stock INTEGER,  -- null = unlimited
  active BOOLEAN NOT NULL DEFAULT true,
  image_emoji TEXT NOT NULL DEFAULT '🎁',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reward_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view active rewards" ON public.reward_items FOR SELECT USING (active = true);
CREATE POLICY "Admins manage rewards" ON public.reward_items FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER set_reward_items_updated BEFORE UPDATE ON public.reward_items
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- User points
CREATE TABLE public.user_points (
  user_id UUID PRIMARY KEY,
  points INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own points" ON public.user_points FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all points" ON public.user_points FOR SELECT USING (public.has_role(auth.uid(),'admin'));

-- Redemptions
CREATE TABLE public.reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  reward_item_id UUID NOT NULL REFERENCES public.reward_items(id),
  points_spent INTEGER NOT NULL,
  status redemption_status NOT NULL DEFAULT 'pending',
  delivery_phone TEXT,
  delivery_notes TEXT,
  voucher_code TEXT,
  fulfilled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own redemptions" ON public.reward_redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all redemptions" ON public.reward_redemptions FOR SELECT USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins update redemptions" ON public.reward_redemptions FOR UPDATE USING (public.has_role(auth.uid(),'admin'));

-- Award points on bet placement: 1 pt per R10 staked
CREATE OR REPLACE FUNCTION public.tg_award_points_on_bet()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE v_pts INT;
BEGIN
  v_pts := FLOOR(NEW.stake / 10)::INT;
  IF v_pts <= 0 THEN RETURN NEW; END IF;
  INSERT INTO public.user_points(user_id, points, lifetime_earned)
    VALUES (NEW.user_id, v_pts, v_pts)
    ON CONFLICT (user_id) DO UPDATE
      SET points = user_points.points + v_pts,
          lifetime_earned = user_points.lifetime_earned + v_pts,
          updated_at = now();
  RETURN NEW;
END $$;
CREATE TRIGGER award_points_after_bet AFTER INSERT ON public.bets
  FOR EACH ROW EXECUTE FUNCTION public.tg_award_points_on_bet();

-- Redeem function
CREATE OR REPLACE FUNCTION public.redeem_reward(_item_id UUID, _phone TEXT DEFAULT NULL, _notes TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  v_user UUID := auth.uid();
  v_item RECORD;
  v_pts RECORD;
  v_redemption_id UUID;
BEGIN
  IF v_user IS NULL THEN RAISE EXCEPTION 'Not authenticated' USING ERRCODE='42501'; END IF;

  SELECT * INTO v_item FROM public.reward_items WHERE id = _item_id FOR UPDATE;
  IF v_item IS NULL OR NOT v_item.active THEN RAISE EXCEPTION 'Reward unavailable' USING ERRCODE='42704'; END IF;
  IF v_item.stock IS NOT NULL AND v_item.stock <= 0 THEN RAISE EXCEPTION 'Out of stock' USING ERRCODE='22023'; END IF;

  SELECT * INTO v_pts FROM public.user_points WHERE user_id = v_user FOR UPDATE;
  IF v_pts IS NULL OR v_pts.points < v_item.points_cost THEN
    RAISE EXCEPTION 'Insufficient points' USING ERRCODE='22000';
  END IF;

  IF v_item.category IN ('airtime','data') AND (_phone IS NULL OR length(trim(_phone)) < 9) THEN
    RAISE EXCEPTION 'Valid phone number required for airtime/data' USING ERRCODE='22023';
  END IF;

  UPDATE public.user_points SET points = points - v_item.points_cost, updated_at = now() WHERE user_id = v_user;
  IF v_item.stock IS NOT NULL THEN
    UPDATE public.reward_items SET stock = stock - 1 WHERE id = v_item.id;
  END IF;

  INSERT INTO public.reward_redemptions(user_id, reward_item_id, points_spent, delivery_phone, delivery_notes)
    VALUES (v_user, v_item.id, v_item.points_cost, _phone, _notes)
    RETURNING id INTO v_redemption_id;

  RETURN jsonb_build_object('ok', true, 'redemption_id', v_redemption_id, 'remaining_points', v_pts.points - v_item.points_cost);
END $$;

-- Seed catalog
INSERT INTO public.reward_items (name, description, category, points_cost, rand_value, image_emoji) VALUES
  ('R20 Airtime Voucher','Top up any SA mobile network','airtime',200,20,'📱'),
  ('R50 Airtime Voucher','Top up any SA mobile network','airtime',480,50,'📱'),
  ('R100 Spaza Voucher','Redeem at participating spaza shops','voucher',950,100,'🛒'),
  ('Braai Meat Pack','2kg mixed braai pack — collect at partner butchery','braai',1200,150,'🥩'),
  ('1GB Data Bundle','Any network, valid 30 days','data',650,75,'📶');
