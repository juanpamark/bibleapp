import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SECRET_KEY || ''
);

async function verify() {
  const { count } = await supabase
    .from('verses')
    .select('*', { count: 'exact', head: true })
    .eq('book', 'MAT');

  console.log(`📊 Total absoluto de versículos en Supabase para MAT: ${count} / 1071`);

  const { data: endData, error: endError } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes')
    .eq('book', 'MAT')
    .gte('chapter', 26)
    .order('chapter', { ascending: true })
    .order('verse', { ascending: true });

  if (endError) {
    console.error('Error fetching MAT 26-28:', endError);
    return;
  }

  console.log(`📊 Versículos en capítulos 26-28: ${endData?.length} (esperados: 75 + 66 + 20 = 161)`);

  const targetKeys = [
    { ch: 26, v: 28 },
    { ch: 27, v: 46 },
    { ch: 27, v: 51 },
    { ch: 28, v: 6 },
    { ch: 28, v: 19 },
    { ch: 28, v: 20 },
  ];

  console.log('\n🔍 Verificación de muestras clave en capítulos 26-28:');
  for (const t of targetKeys) {
    const item = (endData || []).find(v => v.chapter === t.ch && v.verse === t.v);
    if (item) {
      console.log(`\n--- [MAT ${item.chapter}:${item.verse}] ---`);
      console.log(`Traducción: "${item.translation}"`);
      console.log(`Notas: "${item.translation_notes?.slice(0, 180)}..."`);
    } else {
      console.log(`❌ No encontrado: MAT ${t.ch}:${t.v}`);
    }
  }
}

verify();
