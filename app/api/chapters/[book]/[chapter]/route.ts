import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(
  _request: Request,
  context: { params: { book: string; chapter: string } }
) {
  const book = (context.params.book || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const chapter = parseInt(context.params.chapter || '', 10);

  if (!book || book.length < 2 || book.length > 5 || !Number.isFinite(chapter) || chapter < 1 || chapter > 150) {
    return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 });
  }

  try {
    const serverSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await serverSupabase
      .from('verses')
      .select('id, book, chapter, verse, greek_text, translation, translation_notes')
      .eq('book', book)
      .eq('chapter', chapter)
      .order('verse', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error consultando capítulo' }, { status: 500 });
    }

    return NextResponse.json(
      { verses: data || [] },
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
