import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

import { johnChapter1 } from './jhn-ch1';
import { johnChapter2 } from './jhn-ch2';
import { johnChapter3 } from './jhn-ch3';
import { johnChapter4 } from './jhn-ch4';
import { johnChapter5 } from './jhn-ch5';
import { johnChapter6 } from './jhn-ch6';
import { johnChapter7 } from './jhn-ch7';
import { johnChapter8 } from './jhn-ch8';
import { johnChapter9 } from './jhn-ch9';
import { johnChapter10 } from './jhn-ch10';
import { johnChapter11 } from './jhn-ch11';
import { johnChapter12 } from './jhn-ch12';
import { johnChapter13 } from './jhn-ch13';
import { johnChapter14 } from './jhn-ch14';
import { johnChapter15 } from './jhn-ch15';
import { johnChapter16 } from './jhn-ch16';
import { johnChapter17 } from './jhn-ch17';
import { johnChapter18 } from './jhn-ch18';
import { johnChapter19 } from './jhn-ch19';
import { johnChapter20 } from './jhn-ch20';
import { johnChapter21 } from './jhn-ch21';

export interface VerseTranslation {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  translation_notes: string;
}

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
  console.log('🏛️  COMPILACIÓN E INSERCIÓN DEL EVANGELIO SEGÚN JUAN (JHN)');
  console.log('========================================================================\n');

  const allTranslatedChapters: VerseTranslation[] = [
    ...johnChapter1,
    ...johnChapter2,
    ...johnChapter3,
    ...johnChapter4,
    ...johnChapter5,
    ...johnChapter6,
    ...johnChapter7,
    ...johnChapter8,
    ...johnChapter9,
    ...johnChapter10,
    ...johnChapter11,
    ...johnChapter12,
    ...johnChapter13,
    ...johnChapter14,
    ...johnChapter15,
    ...johnChapter16,
    ...johnChapter17,
    ...johnChapter18,
    ...johnChapter19,
    ...johnChapter20,
    ...johnChapter21,
  ];

  console.log(`📊 Versículos traducidos recopilados: ${allTranslatedChapters.length}`);

  const rawPath = path.resolve(process.cwd(), 'data', 'JHN.json');
  if (!fs.existsSync(rawPath)) {
    throw new Error(`No se encontró el archivo base ${rawPath}`);
  }

  const rawBase: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(
    fs.readFileSync(rawPath, 'utf-8')
  );

  console.log(`📜 Versículos en texto crítico SBLGNT (data/JHN.json): ${rawBase.length}`);

  if (allTranslatedChapters.length !== rawBase.length) {
    throw new Error(
      `Discrepancia de longitud: traducidos=${allTranslatedChapters.length} vs base=${rawBase.length}`
    );
  }

  const completeRecords: TranslatedRecord[] = [];

  for (let i = 0; i < rawBase.length; i++) {
    const base = rawBase[i];
    const trans = allTranslatedChapters[i];

    if (trans.book !== 'JHN') {
      throw new Error(`Índice ${i}: libro incorrecto '${trans.book}', se esperaba 'JHN'`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(
        `Desajuste en índice ${i}: base=${base.chapter}:${base.verse} vs traducido=${trans.chapter}:${trans.verse}`
      );
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en JHN ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas vacías en JHN ${trans.chapter}:${trans.verse}`);
    }

    completeRecords.push({
      book: 'JHN',
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation.trim(),
      translation_notes: trans.translation_notes.trim(),
    });
  }

  console.log(`✅ Validación 1:1 completada: ${completeRecords.length} de ${rawBase.length} versículos validados con éxito.`);

  const outputPath = path.resolve(process.cwd(), 'data', 'JHN_translated.json');
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
        console.log(`  ✓ Lote insertado: JHN ${rangeStr} (${insertedCount}/${completeRecords.length})`);
      }
    }
  }

  console.log(`\n🎉 Inserción finalizada: ${insertedCount} versículos cargados en Supabase.`);

  console.log('\n🔍 Verificando estado final en Supabase...');
  const { data, count, error: fetchErr } = await supabase
    .from('verses')
    .select('chapter, verse, translation, translation_notes', { count: 'exact' })
    .eq('book', 'JHN');

  if (fetchErr) {
    console.error('❌ Error al consultar Supabase:', fetchErr);
    return;
  }

  console.log(`📊 Conteo total confirmado en Supabase: ${count} versículos de Juan.`);
  const missingTr = (data || []).filter((v) => !v.translation || v.translation.trim() === '');
  const missingNt = (data || []).filter((v) => !v.translation_notes || v.translation_notes.trim() === '');
  console.log(`Versículos sin traducción: ${missingTr.length}`);
  console.log(`Versículos sin notas filológicas: ${missingNt.length}`);
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
