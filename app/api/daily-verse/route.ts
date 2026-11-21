import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tz = (searchParams.get('tz') || 'America/Bogota').slice(0, 64);

  try {
    const serverSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await serverSupabase.rpc('get_daily_verse', {
      p_tz: tz,
      p_offset_hours: 5,
    });

    const row = Array.isArray(data) ? data[0] : data;
    if (error || !row?.translation) {
      return NextResponse.json({ verse: null }, { status: 200 });
    }

    return NextResponse.json(
      { verse: row },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  } catch {
    return NextResponse.json({ verse: null }, { status: 500 });
  }
}
