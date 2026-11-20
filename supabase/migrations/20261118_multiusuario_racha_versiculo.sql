-- 1. Tabla de perfiles de usuario (nombre + teléfono único)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text UNIQUE,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING ((select auth.uid()) = id) WITH CHECK ((select auth.uid()) = id);

-- 2. Tabla de estado de lectura y racha individual
CREATE TABLE IF NOT EXISTS public.user_reading_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_active_date date,
  last_book text DEFAULT 'MAT',
  last_chapter integer DEFAULT 1,
  last_verse integer DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.user_reading_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own reading state" ON public.user_reading_state;
CREATE POLICY "Users can manage own reading state" ON public.user_reading_state
  FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 3. Tabla de resaltados sincronizados en la nube
CREATE TABLE IF NOT EXISTS public.user_highlights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  color text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, book, chapter, verse)
);

CREATE INDEX IF NOT EXISTS idx_user_highlights_user_book_ch ON public.user_highlights (user_id, book, chapter);
ALTER TABLE public.user_highlights ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own highlights" ON public.user_highlights;
CREATE POLICY "Users can manage own highlights" ON public.user_highlights
  FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 4. Tabla de marcadores / versículos guardados en la nube
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book text NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (user_id, book, chapter, verse)
);

CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON public.user_bookmarks (user_id);
ALTER TABLE public.user_bookmarks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own bookmarks" ON public.user_bookmarks;
CREATE POLICY "Users can manage own bookmarks" ON public.user_bookmarks
  FOR ALL USING ((select auth.uid()) = user_id) WITH CHECK ((select auth.uid()) = user_id);

-- 5. Trigger automático al registrarse un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text;
  v_phone text;
BEGIN
  v_name := COALESCE(
    NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
    NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
    NULLIF(SPLIT_PART(COALESCE(NEW.email, ''), '@', 1), ''),
    'Lector'
  );
  v_phone := NULLIF(TRIM(COALESCE(NEW.raw_user_meta_data->>'phone', NEW.phone, '')), '');

  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, v_name, v_phone)
  ON CONFLICT (id) DO UPDATE
    SET full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name),
        phone = COALESCE(EXCLUDED.phone, public.profiles.phone),
        updated_at = now();

  INSERT INTO public.user_reading_state (user_id, current_streak, longest_streak)
  VALUES (NEW.id, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. RPC segura para verificar disponibilidad de teléfono antes de registrarse
CREATE OR REPLACE FUNCTION public.check_phone_available(p_phone text)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE phone = NULLIF(TRIM(p_phone), '')
  );
$$;

GRANT EXECUTE ON FUNCTION public.check_phone_available(text) TO anon, authenticated;

-- 7. Catálogo curado del Versículo del Día (64 versículos clave de nuestra traducción TDO)
CREATE TABLE IF NOT EXISTS public.daily_verse_pool (
  slot_index integer PRIMARY KEY,
  book varchar NOT NULL,
  chapter integer NOT NULL,
  verse integer NOT NULL
);

ALTER TABLE public.daily_verse_pool ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access for daily verse pool" ON public.daily_verse_pool;
CREATE POLICY "Public read access for daily verse pool" ON public.daily_verse_pool
  FOR SELECT USING (true);

INSERT INTO public.daily_verse_pool (slot_index, book, chapter, verse) VALUES
  (1, 'PHP', 4, 6),
  (2, 'JHN', 3, 16),
  (3, 'MAT', 11, 28),
  (4, 'ROM', 8, 28),
  (5, '2CO', 12, 9),
  (6, 'GAL', 2, 20),
  (7, 'EPH', 2, 8),
  (8, 'COL', 3, 23),
  (9, 'HEB', 11, 1),
  (10, 'JAS', 1, 5),
  (11, '1PE', 5, 7),
  (12, '1JN', 4, 18),
  (13, 'REV', 21, 4),
  (14, 'LUK', 1, 37),
  (15, 'ACT', 1, 8),
  (16, '1CO', 13, 4),
  (17, 'MAT', 5, 14),
  (18, 'JHN', 14, 6),
  (19, 'ROM', 12, 2),
  (20, 'PHP', 4, 13),
  (21, '2TI', 1, 7),
  (22, '1TH', 5, 16),
  (23, 'HEB', 4, 16),
  (24, 'JHN', 8, 12),
  (25, 'MAT', 6, 33),
  (26, 'ROM', 8, 38),
  (27, 'GAL', 5, 22),
  (28, 'EPH', 3, 20),
  (29, 'COL', 3, 15),
  (30, '1CO', 16, 14),
  (31, '2CO', 5, 17),
  (32, 'HEB', 12, 1),
  (33, 'JAS', 1, 19),
  (34, '1JN', 1, 9),
  (35, 'JHN', 16, 33),
  (36, 'MAT', 5, 16),
  (37, 'LUK', 6, 31),
  (38, 'ROM', 5, 8),
  (39, 'PHP', 2, 5),
  (40, 'EPH', 6, 10),
  (41, '1PE', 2, 9),
  (42, '2PE', 3, 9),
  (43, 'REV', 3, 20),
  (44, 'MRK', 10, 45),
  (45, 'JHN', 10, 10),
  (46, 'MAT', 28, 20),
  (47, 'ROM', 15, 13),
  (48, '2CO', 4, 16),
  (49, 'GAL', 6, 9),
  (50, 'COL', 1, 17),
  (51, '1TI', 4, 12),
  (52, 'TIT', 3, 5),
  (53, 'HEB', 13, 8),
  (54, '1JN', 3, 1),
  (55, 'JUD', 1, 24),
  (56, 'LUK', 12, 34),
  (57, 'ACT', 4, 12),
  (58, '1CO', 10, 13),
  (59, 'EPH', 4, 32),
  (60, 'PHP', 4, 8),
  (61, '2TH', 3, 3),
  (62, 'JHN', 15, 5),
  (63, 'MAT', 7, 7),
  (64, 'ROM', 8, 1)
ON CONFLICT (slot_index) DO UPDATE
  SET book = EXCLUDED.book, chapter = EXCLUDED.chapter, verse = EXCLUDED.verse;

-- 8. RPC determinista para Versículo del Día (corte diario a las 5:00 a.m.)
CREATE OR REPLACE FUNCTION public.get_daily_verse(
  p_tz text DEFAULT 'America/Bogota',
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  book varchar,
  chapter integer,
  verse integer,
  greek_text text,
  translation text,
  translation_notes text,
  devotional_date date
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tz text := 'America/Bogota';
  v_devotional_date date;
  v_total integer;
  v_slot integer;
BEGIN
  IF EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = p_tz) THEN
    v_tz := p_tz;
  END IF;

  v_devotional_date := ((now() AT TIME ZONE v_tz) - make_interval(hours => p_offset_hours))::date;

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
$$;

GRANT EXECUTE ON FUNCTION public.get_daily_verse(text, integer) TO anon, authenticated;

-- 9. RPCs para racha individual (lectura y consulta con reseteo automático si se saltó un día)
CREATE OR REPLACE FUNCTION public.record_daily_reading(
  p_book text,
  p_chapter integer,
  p_verse integer DEFAULT 1,
  p_tz text DEFAULT 'America/Bogota',
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE (
  current_streak integer,
  longest_streak integer,
  last_active_date date
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_tz text := 'America/Bogota';
  v_today date;
  v_state public.user_reading_state%ROWTYPE;
  v_next_streak integer;
  v_next_longest integer;
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = p_tz) THEN
    v_tz := p_tz;
  END IF;

  v_today := ((now() AT TIME ZONE v_tz) - make_interval(hours => p_offset_hours))::date;

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
      v_uid, v_next_streak, v_next_longest, v_today, UPPER(p_book), p_chapter, COALESCE(p_verse, 1), now()
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
        last_book = UPPER(p_book),
        last_chapter = p_chapter,
        last_verse = COALESCE(p_verse, 1),
        updated_at = now()
    WHERE user_id = v_uid;
  END IF;

  RETURN QUERY SELECT v_next_streak, v_next_longest, v_today;
END;
$$;

GRANT EXECUTE ON FUNCTION public.record_daily_reading(text, integer, integer, text, integer) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_my_reading_state(
  p_tz text DEFAULT 'America/Bogota',
  p_offset_hours integer DEFAULT 5
)
RETURNS TABLE (
  current_streak integer,
  longest_streak integer,
  last_active_date date,
  last_book text,
  last_chapter integer,
  last_verse integer
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_tz text := 'America/Bogota';
  v_today date;
  v_state public.user_reading_state%ROWTYPE;
BEGIN
  IF v_uid IS NULL THEN
    RETURN;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_timezone_names WHERE name = p_tz) THEN
    v_tz := p_tz;
  END IF;

  v_today := ((now() AT TIME ZONE v_tz) - make_interval(hours => p_offset_hours))::date;

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
$$;

GRANT EXECUTE ON FUNCTION public.get_my_reading_state(text, integer) TO authenticated;
