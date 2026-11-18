import * as fs from 'fs';
import * as path from 'path';
import { actsChapter25 } from './act-ch25';
import { actsChapter26 } from './act-ch26';

async function main() {
  console.log('🔄 Ensamblando Bloque 12 de Hechos de los Apóstoles (Capítulos 25 y 26)...');

  const allVerses = [
    ...actsChapter25,
    ...actsChapter26,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/ACT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/ACT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock12 = baseVerses.filter(v => v.chapter >= 25 && v.chapter <= 26);

  if (baseBlock12.length !== 59) {
    throw new Error(`El texto base data/ACT.json tiene ${baseBlock12.length} versículos en capítulos 25-26, se esperaban 59.`);
  }

  if (allVerses.length !== 59) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 59.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 59; i++) {
    const base = baseBlock12[i];
    const trans = allVerses[i];

    if (trans.book !== 'ACT') {
      throw new Error(`Versículo ${i + 1} tiene libro '${trans.book}', se esperaba 'ACT'.`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(`Desajuste en índice ${i}: base es ${base.chapter}:${base.verse}, traducido es ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en ACT ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas filológicas vacías en ACT ${trans.chapter}:${trans.verse}`);
    }
  }

  console.log('✅ Validación completada: Los 59 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/ACT_ch25-26_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Hechos 25-26:', err);
  process.exit(1);
});
