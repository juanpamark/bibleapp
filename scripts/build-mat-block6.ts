import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter14 } from './mat-ch14';
import { matthewChapter15 } from './mat-ch15';
import { matthewChapter16 } from './mat-ch16';

async function main() {
  console.log('🔄 Ensamblando Bloque 6 de Mateo (Capítulos 14 al 16 - Multiplicaciones, Fe Cananea y Confesión de Pedro)...');

  const allVerses = [
    ...matthewChapter14,
    ...matthewChapter15,
    ...matthewChapter16,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock6 = baseVerses.filter(v => v.chapter >= 14 && v.chapter <= 16);

  if (baseBlock6.length !== 103) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock6.length} versículos en capítulos 14-16, se esperaban 103.`);
  }

  if (allVerses.length !== 103) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 103.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 103; i++) {
    const base = baseBlock6[i];
    const trans = allVerses[i];

    if (trans.book !== 'MAT') {
      throw new Error(`Versículo ${i + 1} tiene libro '${trans.book}', se esperaba 'MAT'.`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(`Desajuste en índice ${i}: base es ${base.chapter}:${base.verse}, traducido es ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en MAT ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas filológicas vacías en MAT ${trans.chapter}:${trans.verse}`);
    }
  }

  console.log('✅ Validación completada: Los 103 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch14-16_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 6:', err);
  process.exit(1);
});
