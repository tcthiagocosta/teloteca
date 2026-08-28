-- ============================================================
-- HABILITAR RLS
-- ============================================================

ALTER TABLE public.midias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temporadas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodios ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- MÍDIAS
-- ============================================================

CREATE POLICY "midias_select_authenticated"
ON public.midias
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "midias_insert_authenticated"
ON public.midias
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "midias_update_authenticated"
ON public.midias
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "midias_delete_authenticated"
ON public.midias
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- TEMPORADAS
-- ============================================================

CREATE POLICY "temporadas_select_authenticated"
ON public.temporadas
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "temporadas_insert_authenticated"
ON public.temporadas
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "temporadas_update_authenticated"
ON public.temporadas
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "temporadas_delete_authenticated"
ON public.temporadas
FOR DELETE
TO authenticated
USING (true);


-- ============================================================
-- EPISÓDIOS
-- ============================================================

CREATE POLICY "episodios_select_authenticated"
ON public.episodios
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "episodios_insert_authenticated"
ON public.episodios
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "episodios_update_authenticated"
ON public.episodios
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "episodios_delete_authenticated"
ON public.episodios
FOR DELETE
TO authenticated
USING (true);
