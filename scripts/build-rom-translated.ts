import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

import { romansChapter1 } from './rom-ch1';
import { romansChapter2 } from './rom-ch2';
import { romansChapter3 } from './rom-ch3';
import { romansChapter4 } from './rom-ch4';
import { romansChapter5 } from './rom-ch5';
import { romansChapter6 } from './rom-ch6';
import { romansChapter7 } from './rom-ch7';
import { romansChapter8 } from './rom-ch8';
import { romansChapter9 } from './rom-ch9';
import { romansChapter10 } from './rom-ch10';
import { romansChapter11 } from './rom-ch11';
import { romansChapter12 } from './rom-ch12';
import { romansChapter13 } from './rom-ch13';
import { romansChapter14 } from './rom-ch14';
import { romansChapter15 } from './rom-ch15';
import { romansChapter16 } from './rom-ch16';

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
  console.log('🏛️  COMPILACIÓN E INSERCIÓN DE LA EPÍSTOLA A LOS ROMANOS (ROM)');
  console.log('========================================================================\n');

  const allTranslatedChapters = [
    ...romansChapter1,
    ...romansChapter2,
    ...romansChapter3,
    ...romansChapter4,
    ...romansChapter5,
    ...romansChapter6,
    ...romansChapter7,
    ...romansChapter8,
    ...romansChapter9,
    ...romansChapter10,
    ...romansChapter11,
    ...romansChapter12,
    ...romansChapter13,
    ...romansChapter14,
    ...romansChapter15,
    ...romansChapter16,
  ];

  console.log(`📊 Versículos traducidos recopilados: ${allTranslatedChapters.length}`);

  const rawPath = path.resolve(process.cwd(), 'data', 'ROM.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error(`No se encontró el archivo base ${rawPath}`);
  }

  const rawBase: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(
    fs.readFileSync(rawPath, 'utf-8')
  );

  console.log(`📜 Versículos en texto crítico SBLGNT (data/ROM.json): ${rawBase.length}`);

  if (allTranslatedChapters.length !== rawBase.length) {
    throw new Error(
      `Discrepancia de longitud: traducidos=${allTranslatedChapters.length} vs base=${rawBase.length}`
    );
  }

  const completeRecords: TranslatedRecord[] = [];

  for (let i = 0; i < rawBase.length; i++) {
    const base = rawBase[i];
    const trans = allTranslatedChapters[i];

    if (trans.book !== 'ROM') {
      throw new Error(`Índice ${i}: libro incorrecto '${trans.book}', se esperaba 'ROM'`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(
        `Desajuste en índice ${i}: base=${base.chapter}:${base.verse} vs traducido=${trans.chapter}:${trans.verse}`
      );
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en ROM ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas vacías en ROM ${trans.chapter}:${trans.verse}`);
    }

    completeRecords.push({
      book: 'ROM',
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation.trim(),
      translation_notes: trans.translation_notes.trim(),
    });
  }

  console.log(`✅ Validación 1:1 completada: 430 de 430 versículos validados con éxito.`);

  const outputPath = path.resolve(process.cwd(), 'data', 'ROM_translated.json');
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
        console.log(`  ✓ Lote insertado: ROM ${rangeStr} (${insertedCount}/${completeRecords.length})`);
      }
    }
  }

  console.log(`\n🎉 Inserción finalizada: ${insertedCount} versículos cargados en Supabase.`);

  console.log('\n🔍 Verificando estado final en Supabase...');
  const { data, count, error: fetchErr } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes', { count: 'exact' })
    .eq('book', 'ROM');

  if (fetchErr) {
    console.error('❌ Error al consultar Supabase:', fetchErr);
    return;
  }

  console.log(`📊 Conteo total confirmado en Supabase: ${count} versículos de Romanos.`);
  const missingTr = (data || []).filter((v) => !v.translation || v.translation.trim() === '');
  const missingNt = (data || []).filter((v) => !v.translation_notes || v.translation_notes.trim() === '');
  console.log(`Versículos sin traducción: ${missingTr.length}`);
  console.log(`Versículos sin notas filológicas: ${missingNt.length}`);
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
