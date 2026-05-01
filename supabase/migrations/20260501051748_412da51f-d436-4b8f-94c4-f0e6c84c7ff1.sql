
-- Notifications enum + table
CREATE TYPE public.notification_type AS ENUM ('bet_settled','redemption','promo','system','event');

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins manage all notifications"
  ON public.notifications FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Mark all read RPC
CREATE OR REPLACE FUNCTION public.mark_notifications_read(_ids UUID[] DEFAULT NULL)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _count INT;
BEGIN
  IF _ids IS NULL THEN
    UPDATE public.notifications SET read_at = now()
      WHERE user_id = auth.uid() AND read_at IS NULL;
  ELSE
    UPDATE public.notifications SET read_at = now()
      WHERE user_id = auth.uid() AND id = ANY(_ids) AND read_at IS NULL;
  END IF;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$;

-- Trigger: bet status changes
CREATE OR REPLACE FUNCTION public.tg_notify_bet_settled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status IN ('won','lost','void') AND NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications(user_id, type, title, body, link, metadata)
    VALUES (
      NEW.user_id,
      'bet_settled',
      CASE NEW.status
        WHEN 'won' THEN '🎉 Bet Won! +R' || COALESCE(NEW.potential_payout::text, '0')
        WHEN 'lost' THEN 'Bet settled — better luck next time'
        ELSE 'Bet voided — stake refunded'
      END,
      'Stake R' || COALESCE(NEW.stake::text,'0') || ' · ' || NEW.status,
      '/my-bets',
      jsonb_build_object('bet_id', NEW.id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS bet_settled_notify ON public.bets;
CREATE TRIGGER bet_settled_notify
  AFTER UPDATE ON public.bets
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_bet_settled();

-- Trigger: redemption status changes
CREATE OR REPLACE FUNCTION public.tg_notify_redemption()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link, metadata)
    VALUES (NEW.user_id, 'redemption', 'Reward request received',
      'We''re processing your redemption.', '/rewards',
      jsonb_build_object('redemption_id', NEW.id));
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    INSERT INTO public.notifications(user_id, type, title, body, link, metadata)
    VALUES (NEW.user_id, 'redemption',
      CASE NEW.status
        WHEN 'fulfilled' THEN '✅ Reward fulfilled'
        WHEN 'cancelled' THEN 'Reward cancelled — points refunded'
        ELSE 'Reward update: ' || NEW.status
      END,
      COALESCE(NEW.voucher_code, 'Check rewards for details'),
      '/rewards',
      jsonb_build_object('redemption_id', NEW.id, 'status', NEW.status));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS redemption_notify ON public.reward_redemptions;
CREATE TRIGGER redemption_notify
  AFTER INSERT OR UPDATE ON public.reward_redemptions
  FOR EACH ROW EXECUTE FUNCTION public.tg_notify_redemption();

-- Broadcast promo to all users (admin RPC)
CREATE OR REPLACE FUNCTION public.broadcast_notification(_title TEXT, _body TEXT, _link TEXT DEFAULT NULL, _type public.notification_type DEFAULT 'promo')
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _count INT;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;
  INSERT INTO public.notifications(user_id, type, title, body, link)
  SELECT id, _type, _title, _body, _link FROM auth.users;
  GET DIAGNOSTICS _count = ROW_COUNT;
  RETURN _count;
END;
$$;
