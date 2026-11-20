import { supabase, NoteFolder, UserNote, VerseRecord } from './supabase';
import { normalizeHighlightColor } from './highlights';

export type ReadingTheme = 'light' | 'dark';

const STORAGE_KEYS = {
  ACTIVE_USER_ID: 'biblia_active_user_id',
  LAST_READ: 'biblia_last_read',
  RECENT_PASSAGES: 'biblia_recent_passages',
  FONT_SIZE: 'biblia_font_size',
  THEME: 'biblia_reading_theme',
  SHOW_NOTE_BADGES: 'biblia_show_note_badges',
  DISPLAY_NAME: 'biblia_display_name',
  LOCAL_FOLDERS: 'biblia_folders_local',
  LOCAL_NOTES: 'biblia_notes_local',
  STREAK: 'biblia_reading_streak',
  STREAK_STATE: 'biblia_reading_streak_state',
  HIGHLIGHTS: 'biblia_highlights',
  BOOKMARKS: 'biblia_bookmarks',
  BOOKMARK_META: 'biblia_bookmark_meta',
  DAILY_VERSE_CACHE: 'biblia_daily_verse_cache',
};

export interface LastReadPosition {
  book: string;
  chapter: number;
  verse?: number;
  updatedAt: string;
}

export interface BookmarkMetaItem {
  book: string;
  chapter: number;
  verse: number;
  text?: string;
  created_at: string;
}

export interface VerseHighlight {
  book: string;
  chapter: number;
  verse: number;
  color: string;
  text?: string;
  updated_at: string;
}

export interface ReadingStreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
}

const DEFAULT_FOLDERS: NoteFolder[] = [
  {
    id: 'f-1',
    name: 'Sermones y Devoción',
    icon: 'folder',
    description: 'Reflexiones y aplicaciones prácticas',
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-2',
    name: 'Versículos Favoritos',
    icon: 'bookmark_heart',
    description: 'Pasajes de consuelo y promesa',
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-3',
    name: 'Notas del Texto Griego',
    icon: 'history_edu',
    description: 'Análisis léxico y contexto histórico',
    created_at: new Date().toISOString(),
  },
];

// Catálogo curado de respaldo (64 versículos del NT TDO, rotación 5:00 a.m.)
const CURATED_DAILY_REFS: Array<{ book: string; chapter: number; verse: number }> = [
  { book: 'PHP', chapter: 4, verse: 6 },
  { book: 'JHN', chapter: 3, verse: 16 },
  { book: 'MAT', chapter: 11, verse: 28 },
  { book: 'ROM', chapter: 8, verse: 28 },
  { book: '2CO', chapter: 12, verse: 9 },
  { book: 'GAL', chapter: 2, verse: 20 },
  { book: 'EPH', chapter: 2, verse: 8 },
  { book: 'COL', chapter: 3, verse: 23 },
  { book: 'HEB', chapter: 11, verse: 1 },
  { book: 'JAS', chapter: 1, verse: 5 },
  { book: '1PE', chapter: 5, verse: 7 },
  { book: '1JN', chapter: 4, verse: 18 },
  { book: 'REV', chapter: 21, verse: 4 },
  { book: 'LUK', chapter: 1, verse: 37 },
  { book: 'ACT', chapter: 1, verse: 8 },
  { book: '1CO', chapter: 13, verse: 4 },
  { book: 'MAT', chapter: 5, verse: 14 },
  { book: 'JHN', chapter: 14, verse: 6 },
  { book: 'ROM', chapter: 12, verse: 2 },
  { book: 'PHP', chapter: 4, verse: 13 },
  { book: '2TI', chapter: 1, verse: 7 },
  { book: '1TH', chapter: 5, verse: 16 },
  { book: 'HEB', chapter: 4, verse: 16 },
  { book: 'JHN', chapter: 8, verse: 12 },
  { book: 'MAT', chapter: 6, verse: 33 },
  { book: 'ROM', chapter: 8, verse: 38 },
  { book: 'GAL', chapter: 5, verse: 22 },
  { book: 'EPH', chapter: 3, verse: 20 },
  { book: 'COL', chapter: 3, verse: 15 },
  { book: '1CO', chapter: 16, verse: 14 },
  { book: '2CO', chapter: 5, verse: 17 },
  { book: 'HEB', chapter: 12, verse: 1 },
  { book: 'JAS', chapter: 1, verse: 19 },
  { book: '1JN', chapter: 1, verse: 9 },
  { book: 'JHN', chapter: 16, verse: 33 },
  { book: 'MAT', chapter: 5, verse: 16 },
  { book: 'LUK', chapter: 6, verse: 31 },
  { book: 'ROM', chapter: 5, verse: 8 },
  { book: 'PHP', chapter: 2, verse: 5 },
  { book: 'EPH', chapter: 6, verse: 10 },
  { book: '1PE', chapter: 2, verse: 9 },
  { book: '2PE', chapter: 3, verse: 9 },
  { book: 'REV', chapter: 3, verse: 20 },
  { book: 'MRK', chapter: 10, verse: 45 },
  { book: 'JHN', chapter: 10, verse: 10 },
  { book: 'MAT', chapter: 28, verse: 20 },
  { book: 'ROM', chapter: 15, verse: 13 },
  { book: '2CO', chapter: 4, verse: 16 },
  { book: 'GAL', chapter: 6, verse: 9 },
  { book: 'COL', chapter: 1, verse: 17 },
  { book: '1TI', chapter: 4, verse: 12 },
  { book: 'TIT', chapter: 3, verse: 5 },
  { book: 'HEB', chapter: 13, verse: 8 },
  { book: '1JN', chapter: 3, verse: 1 },
  { book: 'JUD', chapter: 1, verse: 24 },
  { book: 'LUK', chapter: 12, verse: 34 },
  { book: 'ACT', chapter: 4, verse: 12 },
  { book: '1CO', chapter: 10, verse: 13 },
  { book: 'EPH', chapter: 4, verse: 32 },
  { book: 'PHP', chapter: 4, verse: 8 },
  { book: '2TH', chapter: 3, verse: 3 },
  { book: 'JHN', chapter: 15, verse: 5 },
  { book: 'MAT', chapter: 7, verse: 7 },
  { book: 'ROM', chapter: 8, verse: 1 },
];

// ==========================================
// FECHAS DEVOCIONALES (CORTE 5:00 A.M.) & ZONA HORARIA
// ==========================================

export function getBrowserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Bogota';
  } catch {
    return 'America/Bogota';
  }
}

/**
 * Devuelve la fecha devocional local en formato YYYY-MM-DD con corte a las 5:00 a.m.
 * Antes de las 5:00 a.m. sigue perteneciendo al día anterior; a las 5:00 a.m. cambia de día.
 */
export function getDevotionalDateStr(date = new Date(), offsetHours = 5): string {
  const shifted = new Date(date.getTime() - offsetHours * 3600 * 1000);
  const y = shifted.getFullYear();
  const m = String(shifted.getMonth() + 1).padStart(2, '0');
  const d = String(shifted.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getPreviousDateStr(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map((n) => parseInt(n, 10));
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().slice(0, 10);
}

// ==========================================
// AISLAMIENTO MULTIUSUARIO EN NAVEGADOR
// ==========================================

export function clearUserSessionLocalData(): void {
  if (typeof window === 'undefined') return;
  const userScopedKeys = [
    STORAGE_KEYS.ACTIVE_USER_ID,
    STORAGE_KEYS.DISPLAY_NAME,
    STORAGE_KEYS.LAST_READ,
    STORAGE_KEYS.RECENT_PASSAGES,
    STORAGE_KEYS.LOCAL_FOLDERS,
    STORAGE_KEYS.LOCAL_NOTES,
    STORAGE_KEYS.STREAK,
    STORAGE_KEYS.STREAK_STATE,
    STORAGE_KEYS.HIGHLIGHTS,
    STORAGE_KEYS.BOOKMARKS,
    STORAGE_KEYS.BOOKMARK_META,
  ];
  userScopedKeys.forEach((k) => localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent('biblia-user-data-change'));
}

export function ensureUserScope(userId: string | null): void {
  if (typeof window === 'undefined') return;
  const prev = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  if (userId) {
    if (prev && prev !== userId) {
      clearUserSessionLocalData();
    }
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  }
}

async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const uid = data?.session?.user?.id || null;
    if (uid) ensureUserScope(uid);
    return uid;
  } catch {
    return null;
  }
}

// ==========================================
// VERSÍCULO DEL DÍA (CAMBIO 5:00 A.M. · TDO)
// ==========================================

export async function fetchDailyVerse(): Promise<VerseRecord | null> {
  const todayDevotional = getDevotionalDateStr();
  const tz = getBrowserTimeZone();

  // 1. Caché local válida solo hasta el próximo corte de las 5:00 a.m.
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.DAILY_VERSE_CACHE);
      if (raw) {
        const cached = JSON.parse(raw) as { date?: string; verse?: VerseRecord };
        if (cached?.date === todayDevotional && cached?.verse?.translation) {
          return cached.verse;
        }
      }
    } catch {}
  }

  // 2. RPC determinista en Supabase (corte a las 5:00 a.m.)
  try {
    const { data, error } = await supabase.rpc('get_daily_verse', {
      p_tz: tz,
      p_offset_hours: 5,
    });

    const row = Array.isArray(data) ? data[0] : data;
    if (!error && row && row.translation) {
      const verseRecord: VerseRecord = {
        id: row.id,
        book: row.book,
        chapter: row.chapter,
        verse: row.verse,
        greek_text: row.greek_text,
        translation: row.translation,
        translation_notes: row.translation_notes,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEYS.DAILY_VERSE_CACHE,
          JSON.stringify({ date: row.devotional_date || todayDevotional, verse: verseRecord })
        );
      }
      return verseRecord;
    }
  } catch {}

  // 3. Respaldo determinista contra tabla verses (TDO) usando la misma fecha devocional 5:00 a.m.
  try {
    const [y, m, d] = todayDevotional.split('-').map((n) => parseInt(n, 10));
    const daysSinceEpoch = Math.floor(Date.UTC(y, m - 1, d) / 86400000);
    const ref = CURATED_DAILY_REFS[Math.abs(daysSinceEpoch) % CURATED_DAILY_REFS.length];

    const { data, error } = await supabase
      .from('verses')
      .select('*')
      .eq('book', ref.book)
      .eq('chapter', ref.chapter)
      .eq('verse', ref.verse)
      .maybeSingle();

    if (data && !error) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          STORAGE_KEYS.DAILY_VERSE_CACHE,
          JSON.stringify({ date: todayDevotional, verse: data })
        );
      }
      return data;
    }
  } catch (err) {
    console.error('Error cargando versículo del día:', err);
  }

  return null;
}

// ==========================================
// ÚLTIMA LECTURA, RECIENTES & PREFERENCIAS
// ==========================================

export function getLastRead(): LastReadPosition {
  if (typeof window === 'undefined') {
    return { book: 'MAT', chapter: 1, verse: 1, updatedAt: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LAST_READ);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error leyendo last_read:', e);
  }
  return { book: 'MAT', chapter: 1, verse: 1, updatedAt: new Date().toISOString() };
}

export function saveLastRead(book: string, chapter: number, verse?: number): void {
  if (typeof window === 'undefined') return;
  try {
    const normalizedBook = book.toUpperCase();
    const data: LastReadPosition = {
      book: normalizedBook,
      chapter,
      verse: verse || 1,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.LAST_READ, JSON.stringify(data));
    if (chapter >= 1) {
      pushRecentPassage(normalizedBook, chapter);
    }
  } catch (e) {
    console.error('Error guardando last_read:', e);
  }
}

export function getRecentPassages(): LastReadPosition[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECENT_PASSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushRecentPassage(book: string, chapter: number): void {
  if (typeof window === 'undefined') return;
  try {
    const normalizedBook = book.toUpperCase();
    const current = getRecentPassages().filter(
      (p) => !(p.book.toUpperCase() === normalizedBook && p.chapter === chapter)
    );
    const updated: LastReadPosition[] = [
      { book: normalizedBook, chapter, updatedAt: new Date().toISOString() },
      ...current,
    ].slice(0, 6);
    localStorage.setItem(STORAGE_KEYS.RECENT_PASSAGES, JSON.stringify(updated));
  } catch {}
}

export function getFontSize(): 'sm' | 'md' | 'lg' | 'xl' {
  if (typeof window === 'undefined') return 'md';
  return (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as 'sm' | 'md' | 'lg' | 'xl') || 'md';
}

export function setFontSize(size: 'sm' | 'md' | 'lg' | 'xl'): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size);
}

export function getReadingTheme(): ReadingTheme {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEYS.THEME);
  if (stored === 'dark' || stored === 'light') return stored;
  if (stored === 'sepia') {
    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
    return 'light';
  }
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function setReadingTheme(theme: ReadingTheme): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
  document.documentElement.setAttribute('data-theme', theme);
  window.dispatchEvent(new CustomEvent('biblia-theme-change', { detail: { theme } }));
}

export function getShowNoteIndicators(): boolean {
  if (typeof window === 'undefined') return true;
  const raw = localStorage.getItem(STORAGE_KEYS.SHOW_NOTE_BADGES);
  return raw === null ? true : raw === 'true';
}

export function setShowNoteIndicators(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.SHOW_NOTE_BADGES, String(enabled));
}

export function getDisplayName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_KEYS.DISPLAY_NAME) || '';
}

export function setDisplayName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.DISPLAY_NAME, name.trim());
}

export async function saveProfileNameCloud(name: string): Promise<void> {
  const cleaned = name.trim();
  setDisplayName(cleaned);
  const uid = await getCurrentUserId();
  if (!uid || !cleaned) return;
  try {
    await Promise.all([
      supabase.from('profiles').update({ full_name: cleaned, updated_at: new Date().toISOString() }).eq('id', uid),
      supabase.auth.updateUser({ data: { full_name: cleaned } }),
    ]);
  } catch (e) {
    console.error('Error actualizando nombre en nube:', e);
  }
}

// ==========================================
// RACHA DE LECTURA INDIVIDUAL (SIN VALOR FIJO 14)
// ==========================================

function readLocalStreakState(): ReadingStreakState {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
  // Limpiar clave legacy que podía guardar '14' estático sin fecha asociada
  if (localStorage.getItem(STORAGE_KEYS.STREAK)) {
    localStorage.removeItem(STORAGE_KEYS.STREAK);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STREAK_STATE);
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
    const parsed = JSON.parse(raw) as ReadingStreakState;
    const today = getDevotionalDateStr();
    const yesterday = getPreviousDateStr(today);
    if (!parsed.lastActiveDate || parsed.lastActiveDate < yesterday) {
      return {
        currentStreak: 0,
        longestStreak: parsed.longestStreak || 0,
        lastActiveDate: parsed.lastActiveDate || null,
      };
    }
    return {
      currentStreak: parsed.currentStreak || 0,
      longestStreak: parsed.longestStreak || 0,
      lastActiveDate: parsed.lastActiveDate,
    };
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActiveDate: null };
  }
}

function writeLocalStreakState(state: ReadingStreakState): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.STREAK_STATE, JSON.stringify(state));
}

export function getReadingStreak(): number {
  return readLocalStreakState().currentStreak;
}

export function getReadingStreakState(): ReadingStreakState {
  return readLocalStreakState();
}

export function resetReadingStreak(): void {
  writeLocalStreakState({ currentStreak: 0, longestStreak: 0, lastActiveDate: null });
}

export async function syncReadingState(): Promise<ReadingStreakState> {
  const uid = await getCurrentUserId();
  if (!uid) {
    return readLocalStreakState();
  }

  try {
    const tz = getBrowserTimeZone();
    const { data, error } = await supabase.rpc('get_my_reading_state', {
      p_tz: tz,
      p_offset_hours: 5,
    });
    const row = Array.isArray(data) ? data[0] : data;
    if (!error && row) {
      const next: ReadingStreakState = {
        currentStreak: row.current_streak ?? 0,
        longestStreak: row.longest_streak ?? 0,
        lastActiveDate: row.last_active_date ?? null,
      };
      writeLocalStreakState(next);
      if (row.last_book && row.last_chapter) {
        const localLast = getLastRead();
        if (!localLast.updatedAt) {
          localStorage.setItem(
            STORAGE_KEYS.LAST_READ,
            JSON.stringify({
              book: row.last_book,
              chapter: row.last_chapter,
              verse: row.last_verse || 1,
              updatedAt: new Date().toISOString(),
            })
          );
        }
      }
      return next;
    }
  } catch {}

  return readLocalStreakState();
}

export async function recordDailyReading(
  book: string,
  chapter: number,
  verse = 1
): Promise<ReadingStreakState> {
  if (chapter < 1) return readLocalStreakState();

  const today = getDevotionalDateStr();
  const yesterday = getPreviousDateStr(today);
  const current = readLocalStreakState();

  let nextStreak = 1;
  if (current.lastActiveDate === today) {
    nextStreak = Math.max(current.currentStreak, 1);
  } else if (current.lastActiveDate === yesterday) {
    nextStreak = current.currentStreak + 1;
  } else {
    nextStreak = 1;
  }
  const nextState: ReadingStreakState = {
    currentStreak: nextStreak,
    longestStreak: Math.max(current.longestStreak, nextStreak),
    lastActiveDate: today,
  };
  writeLocalStreakState(nextState);

  const uid = await getCurrentUserId();
  if (uid) {
    try {
      const { data, error } = await supabase.rpc('record_daily_reading', {
        p_book: book.toUpperCase(),
        p_chapter: chapter,
        p_verse: verse,
        p_tz: getBrowserTimeZone(),
        p_offset_hours: 5,
      });
      const row = Array.isArray(data) ? data[0] : data;
      if (!error && row) {
        const cloudState: ReadingStreakState = {
          currentStreak: row.current_streak ?? nextStreak,
          longestStreak: row.longest_streak ?? nextState.longestStreak,
          lastActiveDate: row.last_active_date ?? today,
        };
        writeLocalStreakState(cloudState);
        return cloudState;
      }
    } catch {}
  }

  return nextState;
}

// ==========================================
// SINCRONIZACIÓN COMPLETA DE CUENTA EN NUBE
// ==========================================

export async function syncCloudUserData(): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid) return;

  try {
    const [profileRes, hlRes, bmRes] = await Promise.all([
      supabase.from('profiles').select('full_name, phone').eq('id', uid).maybeSingle(),
      supabase
        .from('user_highlights')
        .select('book, chapter, verse, color, updated_at')
        .order('updated_at', { ascending: false }),
      supabase
        .from('user_bookmarks')
        .select('book, chapter, verse, created_at')
        .order('created_at', { ascending: false }),
    ]);

    if (profileRes.data?.full_name) {
      setDisplayName(profileRes.data.full_name);
    }

    if (!hlRes.error && hlRes.data) {
      const normalized: VerseHighlight[] = hlRes.data.map((h) => ({
        book: h.book.toUpperCase(),
        chapter: h.chapter,
        verse: h.verse,
        color: normalizeHighlightColor(h.color),
        updated_at: h.updated_at,
      }));
      localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(normalized));
    }

    if (!bmRes.error && bmRes.data) {
      const keys: string[] = [];
      const meta: Record<string, { created_at: string }> = {};
      for (const b of bmRes.data) {
        const k = `${b.book.toUpperCase()}_${b.chapter}_${b.verse}`;
        keys.push(k);
        meta[k] = { created_at: b.created_at };
      }
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(keys));
      localStorage.setItem(STORAGE_KEYS.BOOKMARK_META, JSON.stringify(meta));
    }

    await syncReadingState();
    window.dispatchEvent(new CustomEvent('biblia-user-data-change'));
  } catch (e) {
    console.error('Error sincronizando datos de usuario:', e);
  }
}

export async function migrateGuestDataToCloud(): Promise<void> {
  const uid = await getCurrentUserId();
  if (!uid || typeof window === 'undefined') return;

  try {
    const localHl = getAllHighlights();
    if (localHl.length > 0) {
      const rows = localHl.map((h) => ({
        user_id: uid,
        book: h.book.toUpperCase(),
        chapter: h.chapter,
        verse: h.verse,
        color: normalizeHighlightColor(h.color),
        updated_at: h.updated_at || new Date().toISOString(),
      }));
      await supabase
        .from('user_highlights')
        .upsert(rows, { onConflict: 'user_id,book,chapter,verse' });
    }

    const localBm = getBookmarkItems();
    if (localBm.length > 0) {
      const bmRows = localBm.map((b) => ({
        user_id: uid,
        book: b.book.toUpperCase(),
        chapter: b.chapter,
        verse: b.verse,
        created_at: b.created_at || new Date().toISOString(),
      }));
      await supabase
        .from('user_bookmarks')
        .upsert(bmRows, { onConflict: 'user_id,book,chapter,verse' });
    }
  } catch (e) {
    console.error('Error migrando datos locales:', e);
  }
}

// ==========================================
// GESTIÓN DE CARPETAS (AISLADO POR CUENTA)
// ==========================================

export async function getFolders(): Promise<NoteFolder[]> {
  try {
    const uid = await getCurrentUserId();
    if (uid) {
      const { data, error } = await supabase
        .from('note_folders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data;
      }
      return [];
    }
  } catch {}

  if (typeof window === 'undefined') return DEFAULT_FOLDERS;
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_FOLDERS);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.LOCAL_FOLDERS, JSON.stringify(DEFAULT_FOLDERS));
    return DEFAULT_FOLDERS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return DEFAULT_FOLDERS;
  }
}

export async function createFolder(folder: {
  name: string;
  description?: string;
  icon?: string;
}): Promise<NoteFolder> {
  const newFolder: NoteFolder = {
    id: 'f-' + Date.now(),
    name: folder.name,
    description: folder.description || '',
    icon: folder.icon || 'folder',
    created_at: new Date().toISOString(),
  };

  try {
    const uid = await getCurrentUserId();
    if (uid) {
      const { data, error } = await supabase
        .from('note_folders')
        .insert({
          user_id: uid,
          name: folder.name,
          description: folder.description,
          icon: folder.icon || 'folder',
        })
        .select()
        .single();
      if (!error && data) return data;
    }
  } catch {}

  if (typeof window !== 'undefined') {
    const current = await getFolders();
    const updated = [newFolder, ...current];
    localStorage.setItem(STORAGE_KEYS.LOCAL_FOLDERS, JSON.stringify(updated));
  }
  return newFolder;
}

// ==========================================
// GESTIÓN DE APUNTES / NOTAS (AISLADO POR CUENTA)
// ==========================================

export async function getNotes(filterFolderId?: string): Promise<UserNote[]> {
  try {
    const uid = await getCurrentUserId();
    if (uid) {
      let query = supabase.from('user_notes').select('*').order('created_at', { ascending: false });
      if (filterFolderId) {
        query = query.eq('folder_id', filterFolderId);
      }
      const { data, error } = await query;
      if (!error && data) return data;
      return [];
    }
  } catch {}

  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_NOTES);
  let notes: UserNote[] = [];
  if (raw) {
    try {
      notes = JSON.parse(raw);
    } catch {
      notes = [];
    }
  }

  if (filterFolderId) {
    return notes.filter((n) => n.folder_id === filterFolderId);
  }
  return notes;
}

export async function createNote(note: {
  book: string;
  chapter: number;
  verse: number;
  title: string;
  content: string;
  tags?: string[];
  folder_id?: string | null;
}): Promise<UserNote> {
  const newNote: UserNote = {
    id: 'n-' + Date.now(),
    book: note.book.toUpperCase(),
    chapter: note.chapter,
    verse: note.verse,
    title: note.title,
    content: note.content,
    tags: note.tags || [],
    folder_id: note.folder_id || null,
    created_at: new Date().toISOString(),
  };

  try {
    const uid = await getCurrentUserId();
    if (uid) {
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: uid,
          book: note.book.toUpperCase(),
          chapter: note.chapter,
          verse: note.verse,
          title: note.title,
          content: note.content,
          tags: note.tags || [],
          folder_id: note.folder_id || null,
        })
        .select()
        .single();
      if (!error && data) return data;
    }
  } catch {}

  if (typeof window !== 'undefined') {
    const current = await getNotes();
    const updated = [newNote, ...current];
    localStorage.setItem(STORAGE_KEYS.LOCAL_NOTES, JSON.stringify(updated));
  }
  return newNote;
}

export async function updateNote(
  id: string,
  updates: {
    title: string;
    content: string;
    tags?: string[];
    folder_id?: string | null;
  }
): Promise<UserNote | null> {
  try {
    const uid = await getCurrentUserId();
    if (uid) {
      const { data, error } = await supabase
        .from('user_notes')
        .update({
          title: updates.title,
          content: updates.content,
          tags: updates.tags || [],
          folder_id: updates.folder_id || null,
        })
        .eq('id', id)
        .eq('user_id', uid)
        .select()
        .single();
      if (!error && data) return data;
    }
  } catch {}

  if (typeof window !== 'undefined') {
    const current = await getNotes();
    let updatedItem: UserNote | null = null;
    const updated = current.map((n) => {
      if (n.id === id) {
        updatedItem = {
          ...n,
          title: updates.title,
          content: updates.content,
          tags: updates.tags || [],
          folder_id: updates.folder_id ?? n.folder_id,
        };
        return updatedItem;
      }
      return n;
    });
    localStorage.setItem(STORAGE_KEYS.LOCAL_NOTES, JSON.stringify(updated));
    return updatedItem;
  }
  return null;
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    const uid = await getCurrentUserId();
    if (uid) {
      await supabase.from('user_notes').delete().eq('id', id).eq('user_id', uid);
      return true;
    }
  } catch {}

  if (typeof window !== 'undefined') {
    const current = await getNotes();
    const updated = current.filter((n) => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.LOCAL_NOTES, JSON.stringify(updated));
  }
  return true;
}

// ==========================================
// RESALTADOS / SUBRAYADO DE VERSÍCULOS
// ==========================================

export function getAllHighlights(): VerseHighlight[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HIGHLIGHTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getHighlights(book: string, chapter: number): Record<number, string> {
  if (typeof window === 'undefined') return {};
  try {
    const all = getAllHighlights();
    const map: Record<number, string> = {};
    all
      .filter((h) => h.book.toUpperCase() === book.toUpperCase() && h.chapter === chapter)
      .forEach((h) => {
        map[h.verse] = normalizeHighlightColor(h.color);
      });
    return map;
  } catch (e) {
    console.error('Error cargando resaltados:', e);
    return {};
  }
}

export function saveHighlight(
  book: string,
  chapter: number,
  verse: number,
  color: string,
  text?: string
): void {
  if (typeof window === 'undefined') return;
  const normalizedColor = normalizeHighlightColor(color);
  const normalizedBook = book.toUpperCase();
  const nowIso = new Date().toISOString();

  try {
    let all = getAllHighlights();
    all = all.filter(
      (h) => !(h.book.toUpperCase() === normalizedBook && h.chapter === chapter && h.verse === verse)
    );
    all.unshift({
      book: normalizedBook,
      chapter,
      verse,
      color: normalizedColor,
      text,
      updated_at: nowIso,
    });
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Error guardando resaltado:', e);
  }

  void getCurrentUserId().then((uid) => {
    if (!uid) return;
    supabase
      .from('user_highlights')
      .upsert(
        {
          user_id: uid,
          book: normalizedBook,
          chapter,
          verse,
          color: normalizedColor,
          updated_at: nowIso,
        },
        { onConflict: 'user_id,book,chapter,verse' }
      )
      .then(() => {});
  });
}

export function removeHighlight(book: string, chapter: number, verse: number): void {
  if (typeof window === 'undefined') return;
  const normalizedBook = book.toUpperCase();
  try {
    const all = getAllHighlights().filter(
      (h) => !(h.book.toUpperCase() === normalizedBook && h.chapter === chapter && h.verse === verse)
    );
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Error eliminando resaltado:', e);
  }

  void getCurrentUserId().then((uid) => {
    if (!uid) return;
    supabase
      .from('user_highlights')
      .delete()
      .eq('user_id', uid)
      .eq('book', normalizedBook)
      .eq('chapter', chapter)
      .eq('verse', verse)
      .then(() => {});
  });
}

// ==========================================
// MARCADORES / VERSÍCULOS GUARDADOS
// ==========================================

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getBookmarkItems(): BookmarkMetaItem[] {
  if (typeof window === 'undefined') return [];
  const keys = getBookmarks();
  let metaMap: Record<string, { text?: string; created_at?: string }> = {};
  try {
    const rawMeta = localStorage.getItem(STORAGE_KEYS.BOOKMARK_META);
    if (rawMeta) metaMap = JSON.parse(rawMeta);
  } catch {}

  return keys.map((key) => {
    const [book, ch, vs] = key.split('_');
    const meta = metaMap[key] || {};
    return {
      book: book || 'MAT',
      chapter: parseInt(ch || '1', 10),
      verse: parseInt(vs || '1', 10),
      text: meta.text,
      created_at: meta.created_at || new Date().toISOString(),
    };
  });
}

export function isBookmarked(book: string, chapter: number, verse: number): boolean {
  const key = `${book.toUpperCase()}_${chapter}_${verse}`;
  return getBookmarks().includes(key);
}

export function toggleBookmark(
  book: string,
  chapter: number,
  verse: number,
  text?: string
): boolean {
  if (typeof window === 'undefined') return false;
  const normalizedBook = book.toUpperCase();
  const key = `${normalizedBook}_${chapter}_${verse}`;
  let bookmarks = getBookmarks();
  let metaMap: Record<string, { text?: string; created_at?: string }> = {};
  try {
    const rawMeta = localStorage.getItem(STORAGE_KEYS.BOOKMARK_META);
    if (rawMeta) metaMap = JSON.parse(rawMeta);
  } catch {}

  let state = false;
  const nowIso = new Date().toISOString();
  if (bookmarks.includes(key)) {
    bookmarks = bookmarks.filter((k) => k !== key);
    delete metaMap[key];
    state = false;
  } else {
    bookmarks.unshift(key);
    metaMap[key] = { text, created_at: nowIso };
    state = true;
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  localStorage.setItem(STORAGE_KEYS.BOOKMARK_META, JSON.stringify(metaMap));

  void getCurrentUserId().then((uid) => {
    if (!uid) return;
    if (state) {
      supabase
        .from('user_bookmarks')
        .upsert(
          {
            user_id: uid,
            book: normalizedBook,
            chapter,
            verse,
            created_at: nowIso,
          },
          { onConflict: 'user_id,book,chapter,verse' }
        )
        .then(() => {});
    } else {
      supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', uid)
        .eq('book', normalizedBook)
        .eq('chapter', chapter)
        .eq('verse', verse)
        .then(() => {});
    }
  });

  return state;
}
