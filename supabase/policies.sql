ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "media_select_public" ON public.media;
CREATE POLICY "media_select_public"
  ON public.media
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "media_insert_public" ON public.media;
CREATE POLICY "media_insert_public"
  ON public.media
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "media_update_public" ON public.media;
CREATE POLICY "media_update_public"
  ON public.media
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "media_delete_public" ON public.media;
CREATE POLICY "media_delete_public"
  ON public.media
  FOR DELETE
  TO authenticated
  USING (true);



ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "seasons_select_public" ON public.seasons;
CREATE POLICY "seasons_select_public"
  ON public.seasons
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "seasons_insert_public" ON public.seasons;
CREATE POLICY "seasons_insert_public"
  ON public.seasons
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "seasons_update_public" ON public.seasons;
CREATE POLICY "seasons_update_public"
  ON public.seasons
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "seasons_delete_public" ON public.seasons;
CREATE POLICY "seasons_delete_public"
  ON public.seasons
  FOR DELETE
  TO authenticated
  USING (true);

  


ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "episodes_select_public" ON public.episodes;
CREATE POLICY "episodes_select_public"
  ON public.episodes
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "episodes_insert_public" ON public.episodes;
CREATE POLICY "episodes_insert_public"
  ON public.episodes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "episodes_update_public" ON public.episodes;
CREATE POLICY "episodes_update_public"
  ON public.episodes
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "episodes_delete_public" ON public.episodes;
CREATE POLICY "episodes_delete_public"
  ON public.episodes
  FOR DELETE
  TO authenticated
  USING (true);

CREATE OR REPLACE FUNCTION public.add_tv_to_library(
  p_media jsonb,
  p_description text,
  p_seasons jsonb,
  p_episodes jsonb
)
RETURNS public.media
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  created_media public.media;
BEGIN
  INSERT INTO public.media (tmdb_id, type, title, poster_path, description)
  VALUES (
    (p_media->>'tmdb_id')::bigint,
    p_media->>'type',
    p_media->>'title',
    p_media->>'poster_path',
    p_description
  )
  RETURNING * INTO created_media;

  INSERT INTO public.seasons (media_id, tmdb_id, season_number, name)
  SELECT created_media.id, season.tmdb_id, season.season_number, season.name
  FROM jsonb_to_recordset(p_seasons) AS season(
    tmdb_id bigint,
    season_number integer,
    name text
  );

  INSERT INTO public.episodes (
    season_id, tmdb_id, episode_number, name
  )
  SELECT saved_season.id, episode.tmdb_id, episode.episode_number, episode.name
  FROM jsonb_to_recordset(p_episodes) AS episode(
    season_number integer,
    tmdb_id bigint,
    episode_number integer,
    name text
  )
  JOIN public.seasons AS saved_season
    ON saved_season.media_id = created_media.id
   AND saved_season.season_number = episode.season_number;

  RETURN created_media;
END;
$$;

GRANT EXECUTE ON FUNCTION public.add_tv_to_library(jsonb, text, jsonb, jsonb)
  TO authenticated;
