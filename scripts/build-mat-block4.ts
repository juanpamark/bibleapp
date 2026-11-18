import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter8 } from './mat-ch8';
import { matthewChapter9 } from './mat-ch9';
import { matthewChapter10 } from './mat-ch10';

async function main() {
  console.log('🔄 Ensamblando Bloque 4 de Mateo (Capítulos 8 al 10 - Milagros y Discurso Misionero)...');

  const allVerses = [
    ...matthewChapter8,
    ...matthewChapter9,
    ...matthewChapter10,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock4 = baseVerses.filter(v => v.chapter >= 8 && v.chapter <= 10);

  if (baseBlock4.length !== 114) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock4.length} versículos en capítulos 8-10, se esperaban 114.`);
  }

  if (allVerses.length !== 114) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 114.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 114; i++) {
    const base = baseBlock4[i];
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

  console.log('✅ Validación completada: Los 114 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch8-10_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 4:', err);
  process.exit(1);
});
