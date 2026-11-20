import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface VerseRecord {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes?: string;
  status?: string;
  created_at?: string;
}

export interface NoteFolder {
  id: string;
  user_id?: string | null;
  name: string;
  icon?: string;
  description?: string;
  created_at: string;
  notes_count?: number;
}

export interface UserNote {
  id: string;
  user_id?: string | null;
  folder_id?: string | null;
  book: string;
  chapter: number;
  verse: number;
  title: string;
  content: string;
  tags?: string[];
  created_at: string;
}
