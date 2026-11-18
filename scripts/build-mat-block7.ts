import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter17 } from './mat-ch17';
import { matthewChapter18 } from './mat-ch18';
import { matthewChapter19 } from './mat-ch19';

async function main() {
  console.log('🔄 Ensamblando Bloque 7 de Mateo (Capítulos 17 al 19 - Transfiguración, Discurso Eclesial y Debate del Divorcio)...');

  const allVerses = [
    ...matthewChapter17,
    ...matthewChapter18,
    ...matthewChapter19,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock7 = baseVerses.filter(v => v.chapter >= 17 && v.chapter <= 19);

  if (baseBlock7.length !== 92) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock7.length} versículos en capítulos 17-19, se esperaban 92.`);
  }

  if (allVerses.length !== 92) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 92.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 92; i++) {
    const base = baseBlock7[i];
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

  console.log('✅ Validación completada: Los 92 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch17-19_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 7:', err);
  process.exit(1);
});
