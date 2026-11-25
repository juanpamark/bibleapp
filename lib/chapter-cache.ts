import { supabase, VerseRecord } from './supabase';

const CACHE_VERSION = 'v2';
const CACHE_PREFIX = `biblia_ch_${CACHE_VERSION}_`;
const CACHE_INDEX_KEY = `biblia_ch_${CACHE_VERSION}_index`;
const MAX_CACHED_CHAPTERS = 40;
const CACHE_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 días

interface CachedChapterEntry {
  cachedAt: number;
  verses: VerseRecord[];
}

function getKey(book: string, chapter: number): string {
  return `${CACHE_PREFIX}${book.toUpperCase()}_${chapter}`;
}

export function getCachedChapter(book: string, chapter: number): VerseRecord[] | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getKey(book, chapter));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedChapterEntry;
    if (!parsed || !Array.isArray(parsed.verses) || parsed.verses.length === 0) return null;
    if (Date.now() - parsed.cachedAt > CACHE_TTL_MS) {
      localStorage.removeItem(getKey(book, chapter));
      return null;
    }
    return parsed.verses;
  } catch {
    return null;
  }
}

export function saveCachedChapter(book: string, chapter: number, verses: VerseRecord[]): void {
  if (typeof window === 'undefined' || verses.length === 0) return;
  const key = getKey(book, chapter);
  const payload: CachedChapterEntry = { cachedAt: Date.now(), verses };

  try {
    let index: string[] = [];
    try {
      const rawIdx = localStorage.getItem(CACHE_INDEX_KEY);
      if (rawIdx) index = JSON.parse(rawIdx);
    } catch {}

    index = [key, ...index.filter((k) => k !== key)];

    while (index.length > MAX_CACHED_CHAPTERS) {
      const evicted = index.pop();
      if (evicted) localStorage.removeItem(evicted);
    }

    localStorage.setItem(key, JSON.stringify(payload));
    localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
  } catch {
    // Si localStorage está lleno, liberar los 5 capítulos más antiguos y reintentar una vez
    try {
      const rawIdx = localStorage.getItem(CACHE_INDEX_KEY);
      const index: string[] = rawIdx ? JSON.parse(rawIdx) : [];
      for (let i = 0; i < 5 && index.length > 0; i++) {
        const oldKey = index.pop();
        if (oldKey) localStorage.removeItem(oldKey);
      }
      index.unshift(key);
      localStorage.setItem(key, JSON.stringify(payload));
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index));
    } catch {}
  }
}

/**
 * Obtiene un capítulo con estrategia de 3 niveles ($0):
 * 1. Caché local LRU en el navegador (0 ms, funciona offline).
 * 2. Endpoint Edge-cacheado en Vercel `/api/chapters/[book]/[chapter]` (s-maxage=24h).
 * 3. Respaldo directo a Supabase si el endpoint fallara.
 */
export async function fetchChapterWithCache(
  book: string,
  chapter: number
): Promise<VerseRecord[]> {
  const normalizedBook = book.toUpperCase();

  // 1. Caché local instantánea
  const cached = getCachedChapter(normalizedBook, chapter);
  if (cached) {
    return cached;
  }

  // 2. API cacheada en el CDN de Vercel
  try {
    const res = await fetch(
      `/api/chapters/${encodeURIComponent(normalizedBook)}/${chapter}?v=${CACHE_VERSION}`
    );
    if (res.ok) {
      const json = (await res.json()) as { verses?: VerseRecord[] };
      if (Array.isArray(json.verses) && json.verses.length > 0) {
        saveCachedChapter(normalizedBook, chapter, json.verses);
        return json.verses;
      }
    }
  } catch {
    // Continúa al respaldo directo si estamos offline o si falla el fetch
  }

  // 3. Respaldo directo a Supabase
  const { data, error } = await supabase
    .from('verses')
    .select('id, book, chapter, verse, greek_text, translation, translation_notes')
    .eq('book', normalizedBook)
    .eq('chapter', chapter)
    .order('verse', { ascending: true });

  if (!error && data && data.length > 0) {
    saveCachedChapter(normalizedBook, chapter, data as VerseRecord[]);
    return data as VerseRecord[];
  }

  return [];
}
