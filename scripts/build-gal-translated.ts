import * as fs from 'fs';
import * as path from 'path';
import { galatiansChapters1And2 } from './generate-gal-translated';
import { galatiansChapter3 } from './gal-ch3';
import { galatiansChapter4 } from './gal-ch4';
import { galatiansChapter5 } from './gal-ch5';
import { galatiansChapter6 } from './gal-ch6';

async function main() {
  console.log('🔄 Ensamblando la Epístola a los Gálatas completa (Capítulos 1 al 6)...');

  const allVerses = [
    ...galatiansChapters1And2,
    ...galatiansChapter3,
    ...galatiansChapter4,
    ...galatiansChapter5,
    ...galatiansChapter6,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original para contrastar
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/GAL.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  if (baseVerses.length !== 149) {
    throw new Error(`El texto base data/GAL.json tiene ${baseVerses.length} versículos, se esperaban 149.`);
  }

  if (allVerses.length !== 149) {
    throw new Error(`Se ensamblaron ${allVerses.length} versículos, se esperaban exactamente 149.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 149; i++) {
    const base = baseVerses[i];
    const trans = allVerses[i];

    if (trans.book !== 'GAL') {
      throw new Error(`Versículo ${i + 1} tiene libro '${trans.book}', se esperaba 'GAL'.`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(`Desajuste en índice ${i}: base es ${base.chapter}:${base.verse}, traducido es ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en GAL ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas filológicas vacías en GAL ${trans.chapter}:${trans.verse}`);
    }
  }

  console.log('✅ Validación completada: Los 149 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/GAL_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Gálatas:', err);
  process.exit(1);
});
