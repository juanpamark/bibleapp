import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getBookMeta } from '@/lib/constants';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Caché en memoria en servidor (24h) para blindar Postgres incluso contra query-string cache-busting
const CHAPTER_TTL_MS = 24 * 60 * 60 * 1000;
const chapterMemoryCache = new Map<string, { verses: unknown[]; expiresAt: number }>();

export async function GET(
  _request: Request,
  context: { params: Promise<{ book: string; chapter: string }> }
) {
  const resolvedParams = await context.params;
  const book = (resolvedParams.book || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const chapterRaw = (resolvedParams.chapter || '').trim();
  const chapter = /^\d{1,3}$/.test(chapterRaw) ? parseInt(chapterRaw, 10) : NaN;

  const meta = getBookMeta(book);
  if (
    !meta ||
    !meta.isAvailable ||
    !Number.isInteger(chapter) ||
    chapter < 1 ||
    chapter > meta.chapters
  ) {
    return NextResponse.json(
      { error: 'Capítulo no disponible' },
      {
        status: 404,
        headers: {
          'Cache-Control': 'public, s-maxage=3600',
        },
      }
    );
  }

  const cacheKey = `${meta.code}:${chapter}`;
  const cached = chapterMemoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(
      { verses: cached.verses },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  }

  try {
    const serverSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await serverSupabase
      .from('verses')
      .select('id, book, chapter, verse, greek_text, translation, translation_notes')
      .eq('book', meta.code)
      .eq('chapter', chapter)
      .order('verse', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error consultando capítulo' }, { status: 500 });
    }

    const verses = data || [];
    if (chapterMemoryCache.size > 300) {
      chapterMemoryCache.clear();
    }
    chapterMemoryCache.set(cacheKey, {
      verses,
      expiresAt: Date.now() + CHAPTER_TTL_MS,
    });

    return NextResponse.json(
      { verses },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        },
      }
    );
  } catch {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
