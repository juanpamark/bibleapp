import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

async function verify() {
  const { data, count, error } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes', { count: 'exact' })
    .eq('book', 'PHP')
    .order('chapter', { ascending: true })
    .order('verse', { ascending: true });

  if (error) {
    console.error('Error fetching PHP:', error);
    return;
  }

  console.log(`📊 Total de versículos en Supabase para PHP: ${count} / 104`);
  const missingTranslation = (data || []).filter(v => !v.translation || v.translation.trim() === '');
  const missingNotes = (data || []).filter(v => !v.translation_notes || v.translation_notes.trim() === '');
  console.log('Versículos sin traducción:', missingTranslation.length);
  console.log('Versículos sin notas:', missingNotes.length);

  const sampleRefs = [
    { ch: 1, v: 21 },
    { ch: 2, v: 6 },
    { ch: 2, v: 11 },
    { ch: 3, v: 8 },
    { ch: 3, v: 20 },
    { ch: 4, v: 7 },
    { ch: 4, v: 13 },
  ];

  console.log('\n🔍 Muestras de versículos clave en Filipenses:');
  for (const ref of sampleRefs) {
    const item = (data || []).find(v => v.chapter === ref.ch && v.verse === ref.v);
    if (item) {
      console.log(`\n--- [PHP ${item.chapter}:${item.verse}] ---`);
      console.log(`Traducción: "${item.translation}"`);
      console.log(`Notas: "${item.translation_notes?.slice(0, 160)}..."`);
    } else {
      console.log(`❌ No encontrado: PHP ${ref.ch}:${ref.v}`);
    }
  }
}

verify();
