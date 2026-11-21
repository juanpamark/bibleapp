import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const DEFAULT_TZ = 'America/Bogota';
const IANA_TZ_REGEX = /^(?:UTC|[A-Za-z_]{2,20}(?:\/[A-Za-z0-9_\-+]{1,32}){1,2})$/;

// Caché en memoria (1h) para blindar Postgres ante intentos de cache-busting por querystring
const DAILY_TTL_MS = 60 * 60 * 1000;
const dailyMemoryCache = new Map<string, { verse: unknown; expiresAt: number }>();

function sanitizeTimeZone(raw: string | null): string {
  if (!raw) return DEFAULT_TZ;
  const trimmed = raw.trim().slice(0, 64);
  if (!IANA_TZ_REGEX.test(trimmed)) return DEFAULT_TZ;
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: trimmed });
    return trimmed;
  } catch {
    return DEFAULT_TZ;
  }
}

function getServerDevotionalDateKey(tz: string): string {
  try {
    const shifted = new Date(Date.now() - 5 * 3600 * 1000);
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(shifted);
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tz = sanitizeTimeZone(searchParams.get('tz'));
  const dateKey = getServerDevotionalDateKey(tz);
  const cacheKey = `${tz}:${dateKey}`;

  const cached = dailyMemoryCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(
      { verse: cached.verse },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

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

    if (dailyMemoryCache.size > 120) {
      dailyMemoryCache.clear();
    }
    dailyMemoryCache.set(cacheKey, {
      verse: row,
      expiresAt: Date.now() + DAILY_TTL_MS,
    });

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
