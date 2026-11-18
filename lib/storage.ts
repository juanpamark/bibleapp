import { supabase, NoteFolder, UserNote } from './supabase';

export type ReadingTheme = 'light' | 'dark';

const STORAGE_KEYS = {
  LAST_READ: 'biblia_last_read',
  RECENT_PASSAGES: 'biblia_recent_passages',
  FONT_SIZE: 'biblia_font_size',
  THEME: 'biblia_reading_theme',
  SHOW_NOTE_BADGES: 'biblia_show_note_badges',
  DISPLAY_NAME: 'biblia_display_name',
  LOCAL_FOLDERS: 'biblia_folders_local',
  LOCAL_NOTES: 'biblia_notes_local',
  STREAK: 'biblia_reading_streak',
  HIGHLIGHTS: 'biblia_highlights',
  BOOKMARKS: 'biblia_bookmarks',
  BOOKMARK_META: 'biblia_bookmark_meta',
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
    name: 'Estudio de Gálatas',
    icon: 'menu_book',
    description: 'Capítulos 1 al 6: Libertad en Cristo',
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-3',
    name: 'Versículos Favoritos',
    icon: 'bookmark_heart',
    description: 'Pasajes de consuelo y promesa',
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-4',
    name: 'Notas del Texto Griego',
    icon: 'history_edu',
    description: 'Análisis léxico y contexto histórico',
    created_at: new Date().toISOString(),
  },
];

const DEFAULT_NOTES: UserNote[] = [
  {
    id: 'n-1',
    folder_id: 'f-3',
    book: 'PHP',
    chapter: 4,
    verse: 6,
    title: 'La paz que sobrepasa todo entendimiento',
    content:
      'Pablo no promete la ausencia de dificultades, sino la custodia de Dios sobre nuestras emociones y pensamientos («guardará sus corazones»). El término griego phroureō alude a una guarnición que monta guardia; la oración constante con gratitud es nuestro resguardo frente a la ansiedad.',
    tags: ['Paz', 'Oración', 'Filipenses'],
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'n-2',
    folder_id: 'f-4',
    book: 'GAL',
    chapter: 2,
    verse: 16,
    title: 'Justificación por la fe',
    content:
      'El verbo dikaioō expresa el veredicto del tribunal de Dios que declara absuelto al creyente mediante la fidelidad de Cristo. Las «obras de la ley» conectan con los marcadores identitarios del judaísmo del Segundo Templo.',
    tags: ['Justificación', 'Gálatas'],
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'n-3',
    folder_id: 'f-2',
    book: 'MAT',
    chapter: 5,
    verse: 14,
    title: 'Ustedes son la luz del mundo',
    content:
      '«Hymeis este to phōs tou kosmou». El pronombre ustedes (hymeis) es enfático. La comunidad de discípulos refleja la luz de Cristo ante las naciones mediante la justicia cotidiana.',
    tags: ['Sermón del Monte', 'Discipulado'],
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

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
    pushRecentPassage(normalizedBook, chapter);
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

export function getReadingStreak(): number {
  if (typeof window === 'undefined') return 14;
  const raw = localStorage.getItem(STORAGE_KEYS.STREAK);
  return raw ? parseInt(raw, 10) : 14;
}

// ==========================================
// GESTIÓN DE CARPETAS
// ==========================================

export async function getFolders(): Promise<NoteFolder[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data, error } = await supabase
        .from('note_folders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (e) {}

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
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data, error } = await supabase
        .from('note_folders')
        .insert({
          user_id: session.session.user.id,
          name: folder.name,
          description: folder.description,
          icon: folder.icon || 'folder',
        })
        .select()
        .single();
      if (!error && data) return data;
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const current = await getFolders();
    const updated = [newFolder, ...current];
    localStorage.setItem(STORAGE_KEYS.LOCAL_FOLDERS, JSON.stringify(updated));
  }
  return newFolder;
}

// ==========================================
// GESTIÓN DE APUNTES / NOTAS
// ==========================================

export async function getNotes(filterFolderId?: string): Promise<UserNote[]> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      let query = supabase.from('user_notes').select('*').order('created_at', { ascending: false });
      if (filterFolderId) {
        query = query.eq('folder_id', filterFolderId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data;
    }
  } catch (e) {}

  if (typeof window === 'undefined') return DEFAULT_NOTES;
  const raw = localStorage.getItem(STORAGE_KEYS.LOCAL_NOTES);
  let notes: UserNote[] = [];
  if (!raw) {
    notes = DEFAULT_NOTES;
    localStorage.setItem(STORAGE_KEYS.LOCAL_NOTES, JSON.stringify(DEFAULT_NOTES));
  } else {
    try {
      notes = JSON.parse(raw);
    } catch {
      notes = DEFAULT_NOTES;
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
    book: note.book,
    chapter: note.chapter,
    verse: note.verse,
    title: note.title,
    content: note.content,
    tags: note.tags || [],
    folder_id: note.folder_id || null,
    created_at: new Date().toISOString(),
  };

  try {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      const { data, error } = await supabase
        .from('user_notes')
        .insert({
          user_id: session.session.user.id,
          book: note.book,
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
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const current = await getNotes();
    const updated = [newNote, ...current];
    localStorage.setItem(STORAGE_KEYS.LOCAL_NOTES, JSON.stringify(updated));
  }
  return newNote;
}

export async function deleteNote(id: string): Promise<boolean> {
  try {
    const { data: session } = await supabase.auth.getSession();
    if (session?.session?.user) {
      await supabase.from('user_notes').delete().eq('id', id);
    }
  } catch (e) {}

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

export interface VerseHighlight {
  book: string;
  chapter: number;
  verse: number;
  color: string;
  text?: string;
  updated_at: string;
}

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
        map[h.verse] = h.color;
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
  try {
    let all = getAllHighlights();
    all = all.filter(
      (h) => !(h.book.toUpperCase() === book.toUpperCase() && h.chapter === chapter && h.verse === verse)
    );
    all.unshift({
      book: book.toUpperCase(),
      chapter,
      verse,
      color,
      text,
      updated_at: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Error guardando resaltado:', e);
  }
}

export function removeHighlight(book: string, chapter: number, verse: number): void {
  if (typeof window === 'undefined') return;
  try {
    const all = getAllHighlights().filter(
      (h) => !(h.book.toUpperCase() === book.toUpperCase() && h.chapter === chapter && h.verse === verse)
    );
    localStorage.setItem(STORAGE_KEYS.HIGHLIGHTS, JSON.stringify(all));
  } catch (e) {
    console.error('Error eliminando resaltado:', e);
  }
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
  const key = `${book.toUpperCase()}_${chapter}_${verse}`;
  let bookmarks = getBookmarks();
  let metaMap: Record<string, { text?: string; created_at?: string }> = {};
  try {
    const rawMeta = localStorage.getItem(STORAGE_KEYS.BOOKMARK_META);
    if (rawMeta) metaMap = JSON.parse(rawMeta);
  } catch {}

  let state = false;
  if (bookmarks.includes(key)) {
    bookmarks = bookmarks.filter((k) => k !== key);
    delete metaMap[key];
    state = false;
  } else {
    bookmarks.unshift(key);
    metaMap[key] = { text, created_at: new Date().toISOString() };
    state = true;
  }
  localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(bookmarks));
  localStorage.setItem(STORAGE_KEYS.BOOKMARK_META, JSON.stringify(metaMap));
  return state;
}
