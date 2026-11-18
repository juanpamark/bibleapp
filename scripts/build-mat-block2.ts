import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter3 } from './mat-ch3';
import { matthewChapter4 } from './mat-ch4';

async function main() {
  console.log('🔄 Ensamblando Bloque 2 de Mateo (Capítulos 3 y 4 - Bautismo, Desierto y Llamamiento)...');

  const allVerses = [
    ...matthewChapter3,
    ...matthewChapter4,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock2 = baseVerses.filter(v => v.chapter >= 3 && v.chapter <= 4);

  if (baseBlock2.length !== 42) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock2.length} versículos en capítulos 3-4, se esperaban 42.`);
  }

  if (allVerses.length !== 42) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 42.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 42; i++) {
    const base = baseBlock2[i];
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

  console.log('✅ Validación completada: Los 42 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch3-4_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 2:', err);
  process.exit(1);
});
