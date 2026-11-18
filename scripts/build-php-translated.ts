import * as fs from 'fs';
import * as path from 'path';
import { philippiansChapter1 } from './php-ch1';
import { philippiansChapter2 } from './php-ch2';
import { philippiansChapter3 } from './php-ch3';
import { philippiansChapter4 } from './php-ch4';

async function main() {
  console.log('🔄 Ensamblando la Epístola a los Filipenses (Capítulos 1 al 4, 104 versículos)...');

  const allVerses = [
    ...philippiansChapter1,
    ...philippiansChapter2,
    ...philippiansChapter3,
    ...philippiansChapter4,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/PHP.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/PHP.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  if (baseVerses.length !== 104) {
    throw new Error(`El texto base data/PHP.json tiene ${baseVerses.length} versículos, se esperaban 104.`);
  }

  if (allVerses.length !== 104) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 104.`);
  }

  const finalVerses = [];

  // Validar correspondencia 1:1 de capítulo y versículo e inyectar greek_text
  for (let i = 0; i < 104; i++) {
    const base = baseVerses[i];
    const trans = allVerses[i];

    if (trans.book !== 'PHP') {
      throw new Error(`Versículo ${i + 1} tiene libro '${trans.book}', se esperaba 'PHP'.`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(`Desajuste en índice ${i}: base es ${base.chapter}:${base.verse}, traducido es ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en PHP ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas filológicas vacías en PHP ${trans.chapter}:${trans.verse}`);
    }

    finalVerses.push({
      book: 'PHP',
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation,
      translation_notes: trans.translation_notes,
    });
  }

  const outputPath = path.resolve(process.cwd(), 'data/PHP_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalVerses, null, 2), 'utf-8');
  console.log(`✅ Filipenses completo guardado exitosamente en: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error('❌ Error fatal al ensamblar Filipenses:', err);
  process.exit(1);
});
