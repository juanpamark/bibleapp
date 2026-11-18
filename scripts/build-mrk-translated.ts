import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

import { markChapter1 } from './mrk-ch1';
import { markChapter2 } from './mrk-ch2';
import { markChapter3 } from './mrk-ch3';
import { markChapter4 } from './mrk-ch4';
import { markChapter5 } from './mrk-ch5';
import { markChapter6 } from './mrk-ch6';
import { markChapter7 } from './mrk-ch7';
import { markChapter8 } from './mrk-ch8';
import { markChapter9 } from './mrk-ch9';
import { markChapter10 } from './mrk-ch10';
import { markChapter11 } from './mrk-ch11';
import { markChapter12 } from './mrk-ch12';
import { markChapter13 } from './mrk-ch13';
import { markChapter14 } from './mrk-ch14';
import { markChapter15 } from './mrk-ch15';
import { markChapter16 } from './mrk-ch16';

interface TranslatedRecord {
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string;
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Error: Faltan credenciales de Supabase en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

async function main() {
  console.log('========================================================================');
  console.log('🏛️  COMPILACIÓN E INSERCIÓN DEL EVANGELIO SEGÚN MARCOS (MRK)');
  console.log('========================================================================\n');

  const allTranslatedChapters = [
    ...markChapter1,
    ...markChapter2,
    ...markChapter3,
    ...markChapter4,
    ...markChapter5,
    ...markChapter6,
    ...markChapter7,
    ...markChapter8,
    ...markChapter9,
    ...markChapter10,
    ...markChapter11,
    ...markChapter12,
    ...markChapter13,
    ...markChapter14,
    ...markChapter15,
    ...markChapter16,
  ];

  console.log(`📊 Versículos traducidos recopilados: ${allTranslatedChapters.length}`);

  const rawPath = path.resolve(process.cwd(), 'data', 'MRK.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error(`No se encontró el archivo base ${rawPath}`);
  }

  const rawBase: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(
    fs.readFileSync(rawPath, 'utf-8')
  );

  console.log(`📜 Versículos en texto crítico SBLGNT (data/MRK.json): ${rawBase.length}`);

  if (allTranslatedChapters.length !== rawBase.length) {
    throw new Error(
      `Discrepancia de longitud: traducidos=${allTranslatedChapters.length} vs base=${rawBase.length}`
    );
  }

  const completeRecords: TranslatedRecord[] = [];

  for (let i = 0; i < rawBase.length; i++) {
    const base = rawBase[i];
    const trans = allTranslatedChapters[i];

    if (trans.book !== 'MRK') {
      throw new Error(`Índice ${i}: libro incorrecto '${trans.book}', se esperaba 'MRK'`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(
        `Desajuste en índice ${i}: base=${base.chapter}:${base.verse} vs traducido=${trans.chapter}:${trans.verse}`
      );
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en MRK ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas vacías en MRK ${trans.chapter}:${trans.verse}`);
    }

    completeRecords.push({
      book: 'MRK',
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation.trim(),
      translation_notes: trans.translation_notes.trim(),
    });
  }

  console.log(`✅ Validación 1:1 completada: ${completeRecords.length} de ${rawBase.length} versículos validados con éxito.`);

  const outputPath = path.resolve(process.cwd(), 'data', 'MRK_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(completeRecords, null, 2), 'utf-8');
  console.log(`💾 Archivo generado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB\n`);

  console.log('🚀 Iniciando inserción / upsert en tabla `verses` de Supabase...');
  const BATCH_SIZE = 50;
  let insertedCount = 0;

  for (let i = 0; i < completeRecords.length; i += BATCH_SIZE) {
    const batch = completeRecords.slice(i, i + BATCH_SIZE);
    const rangeStr = `${batch[0].chapter}:${batch[0].verse} - ${batch[batch.length - 1].chapter}:${batch[batch.length - 1].verse}`;

    let success = false;
    let attempts = 0;

    while (!success && attempts < 4) {
      attempts++;
      const { error } = await supabase
        .from('verses')
        .upsert(batch, { onConflict: 'book,chapter,verse' });

      if (error) {
        console.warn(`⚠️ Error en lote (${rangeStr}, intento ${attempts}/4):`, error.message);
        if (attempts >= 4) {
          throw error;
        }
        await new Promise((r) => setTimeout(r, 2000 * attempts));
      } else {
        success = true;
        insertedCount += batch.length;
        console.log(`  ✓ Lote insertado: MRK ${rangeStr} (${insertedCount}/${completeRecords.length})`);
      }
    }
  }

  console.log(`\n🎉 Inserción finalizada: ${insertedCount} versículos cargados en Supabase.`);

  console.log('\n🔍 Verificando estado final en Supabase...');
  const { data, count, error: fetchErr } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes', { count: 'exact' })
    .eq('book', 'MRK');

  if (fetchErr) {
    console.error('❌ Error al consultar Supabase:', fetchErr);
    return;
  }

  console.log(`📊 Conteo total confirmado en Supabase: ${count} versículos de Marcos.`);
  const missingTr = (data || []).filter((v) => !v.translation || v.translation.trim() === '');
  const missingNt = (data || []).filter((v) => !v.translation_notes || v.translation_notes.trim() === '');
  console.log(`Versículos sin traducción: ${missingTr.length}`);
  console.log(`Versículos sin notas filológicas: ${missingNt.length}`);
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
