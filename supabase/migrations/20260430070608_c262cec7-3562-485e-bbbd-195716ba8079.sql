-- Enums
CREATE TYPE public.ambassador_tier AS ENUM ('platinum','gold','community','none');
CREATE TYPE public.pick_confidence AS ENUM ('lock','solid','risky');

-- Artists
CREATE TABLE public.artists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  genre text NOT NULL DEFAULT 'Amapiano',
  bio text,
  image_url text,
  spotify_url text,
  instagram_handle text,
  tier public.ambassador_tier NOT NULL DEFAULT 'none',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_artists_tier ON public.artists(tier) WHERE active;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view artists" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Admins manage artists" ON public.artists FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER set_artists_updated BEFORE UPDATE ON public.artists FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Playlists
CREATE TABLE public.playlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  curated_by text NOT NULL DEFAULT 'eKasiBets Editorial',
  mood text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_playlists_active ON public.playlists(active);
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view playlists" ON public.playlists FOR SELECT USING (true);
CREATE POLICY "Admins manage playlists" ON public.playlists FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER set_playlists_updated BEFORE UPDATE ON public.playlists FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Tracks
CREATE TABLE public.tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id uuid NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  title text NOT NULL,
  artist_name text NOT NULL,
  audio_url text NOT NULL,
  duration int NOT NULL DEFAULT 30,
  display_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_tracks_playlist ON public.tracks(playlist_id, display_order);
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view tracks" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Admins manage tracks" ON public.tracks FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Playlist <-> Artist
CREATE TABLE public.playlist_artists (
  playlist_id uuid NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  PRIMARY KEY (playlist_id, artist_id)
);
ALTER TABLE public.playlist_artists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view playlist_artists" ON public.playlist_artists FOR SELECT USING (true);
CREATE POLICY "Admins manage playlist_artists" ON public.playlist_artists FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Artist follows
CREATE TABLE public.artist_follows (
  user_id uuid NOT NULL,
  artist_id uuid NOT NULL REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, artist_id)
);
ALTER TABLE public.artist_follows ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own follows" ON public.artist_follows FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users follow artists" ON public.artist_follows FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unfollow artists" ON public.artist_follows FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins view follows" ON public.artist_follows FOR SELECT USING (has_role(auth.uid(),'admin'));

-- Influencers
CREATE TABLE public.influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform text NOT NULL DEFAULT 'Instagram',
  handle text NOT NULL,
  followers int NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'Sports',
  image_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_influencers_active ON public.influencers(active, platform);
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view influencers" ON public.influencers FOR SELECT USING (active = true);
CREATE POLICY "Admins manage influencers" ON public.influencers FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER set_influencers_updated BEFORE UPDATE ON public.influencers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- Influencer picks
CREATE TABLE public.influencer_picks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  influencer_id uuid NOT NULL REFERENCES public.influencers(id) ON DELETE CASCADE,
  match_id uuid REFERENCES public.matches(id) ON DELETE CASCADE,
  prediction text NOT NULL,
  confidence public.pick_confidence NOT NULL DEFAULT 'solid',
  reasoning text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_picks_match ON public.influencer_picks(match_id, created_at DESC);
CREATE INDEX idx_picks_influencer ON public.influencer_picks(influencer_id, created_at DESC);
ALTER TABLE public.influencer_picks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view picks" ON public.influencer_picks FOR SELECT USING (true);
CREATE POLICY "Admins manage picks" ON public.influencer_picks FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- Events
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  artist_id uuid REFERENCES public.artists(id) ON DELETE SET NULL,
  venue text NOT NULL,
  city text NOT NULL,
  event_date timestamptz NOT NULL,
  ticket_url text,
  ekasibets_presence boolean NOT NULL DEFAULT false,
  promo_code text,
  image_url text,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_events_date ON public.events(event_date, ekasibets_presence);
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins manage events" ON public.events FOR ALL USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));
CREATE TRIGGER set_events_updated BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();