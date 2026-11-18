import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

interface TranslatedRecord {
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes?: string | null;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Error: Faltan credenciales de Supabase (SUPABASE_URL / SUPABASE_SECRET_KEY) en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

// Función de upsert con reintentos exponenciales
async function safeUpsert(records: TranslatedRecord[], maxRetries = 4): Promise<boolean> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const { error } = await supabase
        .from('verses')
        .upsert(records, { onConflict: 'book,chapter,verse' });

      if (error) {
        throw error;
      }
      return true;
    } catch (err: any) {
      attempt++;
      console.warn(`⚠️ Error en upsert (intento ${attempt}/${maxRetries}): ${err?.message || err}`);
      if (attempt >= maxRetries) {
        console.error('❌ Se agotaron los reintentos para este lote.');
        return false;
      }
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  return false;
}

async function main() {
  const targetFile = process.argv[2] || path.resolve(process.cwd(), 'data', 'GAL_translated.json');
  console.log(`\n============================================================`);
  console.log(`📦 Inserción de Versículos Traducidos a Supabase`);
  console.log(`============================================================`);
  console.log(`📄 Archivo origen: ${targetFile}`);

  if (!fs.existsSync(targetFile)) {
    console.error(`❌ El archivo ${targetFile} no existe.`);
    process.exit(1);
  }

  const raw = fs.readFileSync(targetFile, 'utf-8');
  let records: TranslatedRecord[] = [];
  try {
    records = JSON.parse(raw);
  } catch (err: any) {
    console.error(`❌ Error al parsear JSON: ${err.message}`);
    process.exit(1);
  }

  if (!Array.isArray(records) || records.length === 0) {
    console.error(`❌ El archivo JSON no contiene un arreglo válido o está vacío.`);
    process.exit(1);
  }

  // Validación de estructura
  const bookCode = records[0].book;
  console.log(`🔍 Validando registros para el libro: ${bookCode}...`);
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    if (!r.book || typeof r.chapter !== 'number' || typeof r.verse !== 'number') {
      console.error(`❌ Registro inválido en índice ${i}:`, r);
      process.exit(1);
    }
    if (!r.greek_text || !r.translation) {
      console.error(`❌ Registro en índice ${i} (${r.book} ${r.chapter}:${r.verse}) carece de texto griego o traducción.`);
      process.exit(1);
    }
  }

  console.log(`✅ Estructura validada: ${records.length} versículos listos.`);
  if (bookCode === 'GAL') {
    if (records.length === 149) {
      console.log(`🎯 Cobertura completa del libro de Gálatas: 149/149 versículos.`);
    } else {
      console.log(`ℹ️ Procesando bloque: ${records.length} versículos de Gálatas.`);
    }
  } else if (bookCode === 'ACT') {
    console.log(`ℹ️ Procesando bloque de Hechos de los Apóstoles: ${records.length} versículos cargados.`);
  } else {
    console.log(`ℹ️ Procesando libro: ${bookCode} (${records.length} versículos).`);
  }

  // Inserción en lotes de 20
  const BATCH_SIZE = 20;
  let totalInserted = 0;
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const chunk = records.slice(i, i + BATCH_SIZE);
    const startVerse = `${chunk[0].chapter}:${chunk[0].verse}`;
    const endVerse = `${chunk[chunk.length - 1].chapter}:${chunk[chunk.length - 1].verse}`;

    process.stdout.write(`⏳ Upsert lote [${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)}] (${bookCode} ${startVerse} - ${endVerse})... `);
    const ok = await safeUpsert(chunk);
    if (ok) {
      totalInserted += chunk.length;
      console.log(`OK (${totalInserted}/${records.length})`);
    } else {
      console.error(`\n❌ Error fatal guardando lote ${startVerse}-${endVerse}.`);
      process.exit(1);
    }
  }

  // Verificación en Supabase
  console.log(`\n🔎 Verificando registros en Supabase para el libro ${bookCode}...`);
  const { count, error: countErr } = await supabase
    .from('verses')
    .select('*', { count: 'exact', head: true })
    .eq('book', bookCode);

  if (countErr) {
    console.error(`⚠️ No se pudo verificar conteo en Supabase:`, countErr.message);
  } else {
    console.log(`📊 Total de versículos en Supabase para ${bookCode}: ${count}`);
  }

  // Muestra de verificación
  const { data: sample, error: sampleErr } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes')
    .eq('book', bookCode)
    .order('chapter', { ascending: true })
    .order('verse', { ascending: true })
    .limit(3);

  if (!sampleErr && sample && sample.length > 0) {
    console.log(`\n📌 Muestra de versículos persistidos:`);
    sample.forEach((s) => {
      console.log(`\n--- [${bookCode} ${s.chapter}:${s.verse}] ---`);
      console.log(`Traducción: "${s.translation}"`);
      console.log(`Notas: "${s.translation_notes ? s.translation_notes.slice(0, 150) + '...' : '(Sin notas)'}"`);
    });
  }

  console.log(`\n🎉 Proceso finalizado exitosamente.`);
}

main().catch((err) => {
  console.error('❌ Error no controlado en insert-translated:', err);
  process.exit(1);
});
