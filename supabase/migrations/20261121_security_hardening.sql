-- ============================================================================
-- MIGRACIÓN DE ENDURECIMIENTO DE SEGURIDAD (OWASP + SUPABASE ADVISORS)
-- ============================================================================

-- 1. Revocar ejecución pública de función heredada de enumeración anónima de teléfonos
REVOKE ALL ON FUNCTION public.check_phone_available(text) FROM PUBLIC, anon, authenticated;

-- 2. Revocar ejecución pública del trigger interno handle_new_user()
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- 3. Convertir get_daily_verse a SECURITY INVOKER y acotar p_offset_hours
CREATE OR REPLACE FUNCTION public.get_daily_verse(
  p_tz text DEFAULT 'America/Bogota'::text,
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE(
  id uuid,
  book character varying,
  chapter integer,
  verse integer,
  greek_text text,
  translation text,
  translation_notes text,
  devotional_date date
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE
  v_tz text := 'America/Bogota';
  v_offset integer := LEAST(GREATEST(COALESCE(p_offset_hours, 5), 0), 6);
  v_devotional_date date;
  v_total integer;
  v_slot integer;
BEGIN
  IF p_tz IS NOT NULL AND char_length(p_tz) <= 64 AND EXISTS (
    SELECT 1 FROM pg_timezone_names WHERE name = p_tz
  ) THEN
    v_tz := p_tz;
  END IF;

  v_devotional_date := ((now() AT TIME ZONE v_tz) - make_interval(hours => v_offset))::date;

  SELECT COUNT(*) INTO v_total FROM public.daily_verse_pool;
  IF v_total = 0 THEN
    RETURN;
  END IF;

  v_slot := ((((v_devotional_date - DATE '2026-01-01') % v_total) + v_total) % v_total) + 1;

  RETURN QUERY
  SELECT
    v.id,
    v.book,
    v.chapter,
    v.verse,
    v.greek_text,
    v.translation,
    v.translation_notes,
    v_devotional_date AS devotional_date
  FROM public.daily_verse_pool p
  JOIN public.verses v
    ON v.book = p.book AND v.chapter = p.chapter AND v.verse = p.verse
  WHERE p.slot_index = v_slot
  LIMIT 1;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_daily_verse(text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_daily_verse(text, integer) TO anon, authenticated;

-- 4. Convertir get_my_reading_state a SECURITY INVOKER y restringir SOLO a authenticated
CREATE OR REPLACE FUNCTION public.get_my_reading_state(
  p_tz text DEFAULT 'America/Bogota'::text,
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE(
  current_streak integer,
  longest_streak integer,
  last_active_date date,
  last_book text,
  last_chapter integer,
  last_verse integer
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_tz text := 'America/Bogota';
  v_offset integer := 5;
  v_today date;
  v_state public.user_reading_state%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  IF p_tz IS NOT NULL AND char_length(p_tz) <= 64 AND EXISTS (
    SELECT 1 FROM pg_timezone_names WHERE name = p_tz
  ) THEN
    v_tz := p_tz;
  END IF;

  v_today := ((now() AT TIME ZONE v_tz) - make_interval(hours => v_offset))::date;

  SELECT * INTO v_state FROM public.user_reading_state WHERE user_id = v_uid;
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0, 0, NULL::date, 'MAT'::text, 1, 1;
    RETURN;
  END IF;

  IF v_state.last_active_date IS NULL OR v_state.last_active_date < (v_today - 1) THEN
    RETURN QUERY SELECT 0, v_state.longest_streak, v_state.last_active_date, v_state.last_book, v_state.last_chapter, v_state.last_verse;
  ELSE
    RETURN QUERY SELECT v_state.current_streak, v_state.longest_streak, v_state.last_active_date, v_state.last_book, v_state.last_chapter, v_state.last_verse;
  END IF;
END;
$function$;

REVOKE ALL ON FUNCTION public.get_my_reading_state(text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_my_reading_state(text, integer) TO authenticated;

-- 5. Convertir record_daily_reading a SECURITY INVOKER, fijar corte 5 a.m. en servidor y validar rangos
CREATE OR REPLACE FUNCTION public.record_daily_reading(
  p_book text,
  p_chapter integer,
  p_verse integer DEFAULT 1,
  p_tz text DEFAULT 'America/Bogota'::text,
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE(
  current_streak integer,
  longest_streak integer,
  last_active_date date
)
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE
  v_uid uuid := auth.uid();
  v_tz text := 'America/Bogota';
  v_offset integer := 5;
  v_today date;
  v_book text := LEFT(UPPER(regexp_replace(COALESCE(p_book, 'MAT'), '[^A-Za-z0-9]', '', 'g')), 10);
  v_chapter integer := LEAST(GREATEST(COALESCE(p_chapter, 1), 0), 150);
  v_verse integer := LEAST(GREATEST(COALESCE(p_verse, 1), 1), 200);
  v_state public.user_reading_state%ROWTYPE;
  v_next_streak integer;
  v_next_longest integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  IF char_length(v_book) < 2 THEN
    v_book := 'MAT';
  END IF;

  IF p_tz IS NOT NULL AND char_length(p_tz) <= 64 AND EXISTS (
    SELECT 1 FROM pg_timezone_names WHERE name = p_tz
  ) THEN
    v_tz := p_tz;
  END IF;

  v_today := ((now() AT TIME ZONE v_tz) - make_interval(hours => v_offset))::date;

  SELECT * INTO v_state
  FROM public.user_reading_state
  WHERE user_id = v_uid
  FOR UPDATE;

  IF NOT FOUND THEN
    v_next_streak := 1;
    v_next_longest := 1;
    INSERT INTO public.user_reading_state (
      user_id, current_streak, longest_streak, last_active_date, last_book, last_chapter, last_verse, updated_at
    ) VALUES (
      v_uid, v_next_streak, v_next_longest, v_today, v_book, v_chapter, v_verse, now()
    );
  ELSE
    IF v_state.last_active_date = v_today THEN
      v_next_streak := GREATEST(v_state.current_streak, 1);
    ELSIF v_state.last_active_date = (v_today - 1) THEN
      v_next_streak := v_state.current_streak + 1;
    ELSE
      v_next_streak := 1;
    END IF;

    v_next_longest := GREATEST(v_state.longest_streak, v_next_streak);

    UPDATE public.user_reading_state
    SET current_streak = v_next_streak,
        longest_streak = v_next_longest,
        last_active_date = v_today,
        last_book = v_book,
        last_chapter = v_chapter,
        last_verse = v_verse,
        updated_at = now()
    WHERE user_id = v_uid;
  END IF;

  RETURN QUERY SELECT v_next_streak, v_next_longest, v_today;
END;
$function$;

REVOKE ALL ON FUNCTION public.record_daily_reading(text, integer, integer, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.record_daily_reading(text, integer, integer, text, integer) TO authenticated;

-- 6. Endurecer RLS de tablas privadas estrictamente TO authenticated + NOT NULL en user_id
ALTER TABLE public.user_notes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.note_folders ALTER COLUMN user_id SET NOT NULL;

ALTER POLICY "Users can manage own folders"
  ON public.note_folders
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Users can manage own notes"
  ON public.user_notes
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Users can view own profile"
  ON public.profiles
  TO authenticated
  USING ((SELECT auth.uid()) = id);

ALTER POLICY "Users can insert own profile"
  ON public.profiles
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

ALTER POLICY "Users can update own profile"
  ON public.profiles
  TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

ALTER POLICY "Users can manage own bookmarks"
  ON public.user_bookmarks
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Users can manage own highlights"
  ON public.user_highlights
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

ALTER POLICY "Users can manage own reading state"
  ON public.user_reading_state
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- 7. Restricciones CHECK anti-agotamiento de almacenamiento (DoS sobre 500 MB)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS chk_profiles_full_name_len,
  DROP CONSTRAINT IF EXISTS chk_profiles_phone_len;
ALTER TABLE public.profiles
  ADD CONSTRAINT chk_profiles_full_name_len CHECK (char_length(full_name) <= 120),
  ADD CONSTRAINT chk_profiles_phone_len CHECK (phone IS NULL OR char_length(phone) <= 32);

ALTER TABLE public.note_folders
  DROP CONSTRAINT IF EXISTS chk_note_folders_name_len,
  DROP CONSTRAINT IF EXISTS chk_note_folders_icon_len,
  DROP CONSTRAINT IF EXISTS chk_note_folders_desc_len;
ALTER TABLE public.note_folders
  ADD CONSTRAINT chk_note_folders_name_len CHECK (char_length(name) BETWEEN 1 AND 80),
  ADD CONSTRAINT chk_note_folders_icon_len CHECK (icon IS NULL OR char_length(icon) <= 40),
  ADD CONSTRAINT chk_note_folders_desc_len CHECK (description IS NULL OR char_length(description) <= 300);

ALTER TABLE public.user_notes
  DROP CONSTRAINT IF EXISTS chk_user_notes_book_len,
  DROP CONSTRAINT IF EXISTS chk_user_notes_chapter_range,
  DROP CONSTRAINT IF EXISTS chk_user_notes_verse_range,
  DROP CONSTRAINT IF EXISTS chk_user_notes_title_len,
  DROP CONSTRAINT IF EXISTS chk_user_notes_content_len,
  DROP CONSTRAINT IF EXISTS chk_user_notes_tags_count;
ALTER TABLE public.user_notes
  ADD CONSTRAINT chk_user_notes_book_len CHECK (char_length(book) BETWEEN 2 AND 10),
  ADD CONSTRAINT chk_user_notes_chapter_range CHECK (chapter BETWEEN 0 AND 150),
  ADD CONSTRAINT chk_user_notes_verse_range CHECK (verse BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_user_notes_title_len CHECK (char_length(title) <= 200),
  ADD CONSTRAINT chk_user_notes_content_len CHECK (char_length(content) <= 20000),
  ADD CONSTRAINT chk_user_notes_tags_count CHECK (COALESCE(array_length(tags, 1), 0) <= 15);

ALTER TABLE public.user_highlights
  DROP CONSTRAINT IF EXISTS chk_user_highlights_book_len,
  DROP CONSTRAINT IF EXISTS chk_user_highlights_chapter_range,
  DROP CONSTRAINT IF EXISTS chk_user_highlights_verse_range,
  DROP CONSTRAINT IF EXISTS chk_user_highlights_color_len;
ALTER TABLE public.user_highlights
  ADD CONSTRAINT chk_user_highlights_book_len CHECK (char_length(book) BETWEEN 2 AND 10),
  ADD CONSTRAINT chk_user_highlights_chapter_range CHECK (chapter BETWEEN 0 AND 150),
  ADD CONSTRAINT chk_user_highlights_verse_range CHECK (verse BETWEEN 1 AND 200),
  ADD CONSTRAINT chk_user_highlights_color_len CHECK (char_length(color) <= 32);

ALTER TABLE public.user_bookmarks
  DROP CONSTRAINT IF EXISTS chk_user_bookmarks_book_len,
  DROP CONSTRAINT IF EXISTS chk_user_bookmarks_chapter_range,
  DROP CONSTRAINT IF EXISTS chk_user_bookmarks_verse_range;
ALTER TABLE public.user_bookmarks
  ADD CONSTRAINT chk_user_bookmarks_book_len CHECK (char_length(book) BETWEEN 2 AND 10),
  ADD CONSTRAINT chk_user_bookmarks_chapter_range CHECK (chapter BETWEEN 0 AND 150),
  ADD CONSTRAINT chk_user_bookmarks_verse_range CHECK (verse BETWEEN 1 AND 200);

-- 8. Mover extensión pg_trgm fuera de public hacia el esquema extensions
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;
