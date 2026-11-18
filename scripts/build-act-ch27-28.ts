import * as fs from 'fs';
import * as path from 'path';
import { actsChapter27 } from './act-ch27';
import { actsChapter28 } from './act-ch28';

async function main() {
  console.log('🔄 Ensamblando Bloque 13 de Hechos de los Apóstoles (Capítulos 27 y 28)...');

  const allVerses = [
    ...actsChapter27,
    ...actsChapter28,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/ACT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/ACT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock13 = baseVerses.filter(v => v.chapter >= 27 && v.chapter <= 28);

  if (baseBlock13.length !== 74) {
    throw new Error(`El texto base data/ACT.json tiene ${baseBlock13.length} versículos en capítulos 27-28, se esperaban 74.`);
  }

  if (allVerses.length !== 74) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 74.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 74; i++) {
    const base = baseBlock13[i];
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

  console.log('✅ Validación completada: Los 74 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/ACT_ch27-28_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Hechos 27-28:', err);
  process.exit(1);
});
