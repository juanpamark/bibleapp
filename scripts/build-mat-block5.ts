import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter11 } from './mat-ch11';
import { matthewChapter12 } from './mat-ch12';
import { matthewChapter13 } from './mat-ch13';

async function main() {
  console.log('🔄 Ensamblando Bloque 5 de Mateo (Capítulos 11 al 13 - Parábolas y Controversias)...');

  const allVerses = [
    ...matthewChapter11,
    ...matthewChapter12,
    ...matthewChapter13,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock5 = baseVerses.filter(v => v.chapter >= 11 && v.chapter <= 13);

  if (baseBlock5.length !== 138) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock5.length} versículos en capítulos 11-13, se esperaban 138.`);
  }

  if (allVerses.length !== 138) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 138.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 138; i++) {
    const base = baseBlock5[i];
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

  console.log('✅ Validación completada: Los 138 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch11-13_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 5:', err);
  process.exit(1);
});
