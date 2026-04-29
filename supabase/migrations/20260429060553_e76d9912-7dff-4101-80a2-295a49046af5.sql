
CREATE TYPE public.post_type AS ENUM ('text','tip','bet_share');
CREATE TYPE public.reaction_type AS ENUM ('fire','laugh','clap','skull');

CREATE TABLE public.community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL CHECK (length(content) BETWEEN 1 AND 500),
  post_type public.post_type NOT NULL DEFAULT 'text',
  shared_bet_id UUID REFERENCES public.bets(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  reaction public.reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

CREATE INDEX idx_posts_created ON public.community_posts(created_at DESC);
CREATE INDEX idx_reactions_post ON public.post_reactions(post_id);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_reactions ENABLE ROW LEVEL SECURITY;

-- Posts: public read, authenticated create/delete own
CREATE POLICY "Anyone view posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Auth users create posts" ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own posts" ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);
CREATE POLICY "Admins delete any post" ON public.community_posts FOR DELETE
  USING (has_role(auth.uid(),'admin'::app_role));

-- Reactions
CREATE POLICY "Anyone view reactions" ON public.post_reactions FOR SELECT USING (true);
CREATE POLICY "Auth users react" ON public.post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own reaction" ON public.post_reactions FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "Users delete own reaction" ON public.post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.post_reactions;

-- Author display helper (privacy-safe)
CREATE OR REPLACE FUNCTION public.get_post_author(_user_id UUID)
RETURNS TEXT
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT first_name || ' ' || COALESCE(LEFT(last_name,1),'') || '.'
  FROM public.profiles WHERE id = _user_id;
$$;
