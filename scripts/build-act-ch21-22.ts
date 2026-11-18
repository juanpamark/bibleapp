import * as fs from 'fs';
import * as path from 'path';
import { actsChapter21 } from './act-ch21';
import { actsChapter22 } from './act-ch22';

async function main() {
  console.log('🔄 Ensamblando Bloque 10 de Hechos de los Apóstoles (Capítulos 21 y 22)...');

  const allVerses = [
    ...actsChapter21,
    ...actsChapter22,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/ACT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/ACT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock10 = baseVerses.filter(v => v.chapter >= 21 && v.chapter <= 22);

  if (baseBlock10.length !== 70) {
    throw new Error(`El texto base data/ACT.json tiene ${baseBlock10.length} versículos en capítulos 21-22, se esperaban 70.`);
  }

  if (allVerses.length !== 70) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 70.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 70; i++) {
    const base = baseBlock10[i];
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

  console.log('✅ Validación completada: Los 70 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/ACT_ch21-22_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Hechos 21-22:', err);
  process.exit(1);
});
