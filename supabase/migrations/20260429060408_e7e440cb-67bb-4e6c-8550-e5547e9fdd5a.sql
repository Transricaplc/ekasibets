
CREATE OR REPLACE FUNCTION public.get_leaderboard(
  _metric TEXT DEFAULT 'winnings',  -- 'winnings' | 'biggest_win' | 'streak'
  _period TEXT DEFAULT 'all',       -- 'all' | 'week'
  _limit INT DEFAULT 20
)
RETURNS TABLE(
  rank INT,
  user_id UUID,
  display_name TEXT,
  value NUMERIC,
  bets_count INT
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_since TIMESTAMPTZ;
BEGIN
  IF _limit > 100 THEN _limit := 100; END IF;
  IF _period = 'week' THEN v_since := now() - interval '7 days'; ELSE v_since := 'epoch'::timestamptz; END IF;

  IF _metric = 'biggest_win' THEN
    RETURN QUERY
    WITH ranked AS (
      SELECT b.user_id, MAX(b.payout - b.stake) AS profit, COUNT(*)::INT AS cnt
      FROM public.bets b
      WHERE b.status = 'won' AND b.settled_at >= v_since
      GROUP BY b.user_id
    )
    SELECT (ROW_NUMBER() OVER (ORDER BY r.profit DESC))::INT,
           r.user_id,
           (p.first_name || ' ' || COALESCE(LEFT(p.last_name,1),'') || '.') AS display_name,
           ROUND(r.profit, 2),
           r.cnt
    FROM ranked r JOIN public.profiles p ON p.id = r.user_id
    ORDER BY r.profit DESC
    LIMIT _limit;

  ELSIF _metric = 'streak' THEN
    -- Current streak: count consecutive wins from latest settled bet backwards
    RETURN QUERY
    WITH ordered AS (
      SELECT b.user_id, b.status, b.settled_at,
             ROW_NUMBER() OVER (PARTITION BY b.user_id ORDER BY b.settled_at DESC) AS rn
      FROM public.bets b
      WHERE b.status IN ('won','lost') AND b.settled_at >= v_since
    ),
    streaks AS (
      SELECT o.user_id,
             COUNT(*) FILTER (
               WHERE o.status = 'won'
                 AND o.rn <= COALESCE((
                   SELECT MIN(rn) - 1 FROM ordered o2
                   WHERE o2.user_id = o.user_id AND o2.status = 'lost'
                 ), 9999)
             )::INT AS streak
      FROM ordered o GROUP BY o.user_id
    )
    SELECT (ROW_NUMBER() OVER (ORDER BY s.streak DESC))::INT,
           s.user_id,
           (p.first_name || ' ' || COALESCE(LEFT(p.last_name,1),'') || '.'),
           s.streak::NUMERIC,
           s.streak
    FROM streaks s JOIN public.profiles p ON p.id = s.user_id
    WHERE s.streak > 0
    ORDER BY s.streak DESC
    LIMIT _limit;

  ELSE  -- 'winnings'
    RETURN QUERY
    WITH ranked AS (
      SELECT b.user_id,
             SUM(b.payout - b.stake) AS profit,
             COUNT(*)::INT AS cnt
      FROM public.bets b
      WHERE b.status IN ('won','cashed_out') AND b.settled_at >= v_since
      GROUP BY b.user_id
      HAVING SUM(b.payout - b.stake) > 0
    )
    SELECT (ROW_NUMBER() OVER (ORDER BY r.profit DESC))::INT,
           r.user_id,
           (p.first_name || ' ' || COALESCE(LEFT(p.last_name,1),'') || '.'),
           ROUND(r.profit, 2),
           r.cnt
    FROM ranked r JOIN public.profiles p ON p.id = r.user_id
    ORDER BY r.profit DESC
    LIMIT _limit;
  END IF;
END;
$$;
