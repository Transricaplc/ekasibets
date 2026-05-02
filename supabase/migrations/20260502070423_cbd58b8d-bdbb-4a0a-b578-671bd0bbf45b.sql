-- Live match state for in-play centre
ALTER TABLE public.matches
  ADD COLUMN IF NOT EXISTS home_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS away_score INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS clock_minute INT,
  ADD COLUMN IF NOT EXISTS period TEXT,
  ADD COLUMN IF NOT EXISTS live_updated_at TIMESTAMPTZ;

-- Match events feed (goals, cards, etc.)
CREATE TABLE IF NOT EXISTS public.match_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  team TEXT,
  player TEXT,
  minute INT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_match_events_match ON public.match_events(match_id, created_at DESC);

ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match events viewable by everyone"
  ON public.match_events FOR SELECT
  USING (true);

CREATE POLICY "Admins manage match events"
  ON public.match_events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Realtime
ALTER TABLE public.matches REPLICA IDENTITY FULL;
ALTER TABLE public.match_events REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_events;

-- Admin RPC: update live score and append event in one call
CREATE OR REPLACE FUNCTION public.update_live_score(
  _match_id UUID,
  _home_score INT,
  _away_score INT,
  _clock_minute INT DEFAULT NULL,
  _period TEXT DEFAULT NULL,
  _event_type TEXT DEFAULT NULL,
  _team TEXT DEFAULT NULL,
  _player TEXT DEFAULT NULL,
  _description TEXT DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Admin only' USING ERRCODE='42501';
  END IF;

  UPDATE public.matches
    SET home_score = _home_score,
        away_score = _away_score,
        clock_minute = COALESCE(_clock_minute, clock_minute),
        period = COALESCE(_period, period),
        status = CASE WHEN status = 'scheduled' THEN 'live'::match_status ELSE status END,
        live_updated_at = now()
    WHERE id = _match_id;

  IF _event_type IS NOT NULL THEN
    INSERT INTO public.match_events(match_id, event_type, team, player, minute, description)
    VALUES (_match_id, _event_type, _team, _player, COALESCE(_clock_minute, 0), _description);
  END IF;

  RETURN jsonb_build_object('ok', true);
END $$;