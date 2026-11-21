-- Optimización de búsqueda full-text / substring ($0) sobre public.verses
-- Acelera las búsquedas `ilike '%palabra%'` en traducción y notas del griego
-- evitando escaneos secuenciales bajo carga concurrente.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_verses_translation_trgm
  ON public.verses
  USING gin (translation gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_verses_notes_trgm
  ON public.verses
  USING gin (translation_notes gin_trgm_ops);
