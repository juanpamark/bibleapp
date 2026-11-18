import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter20 } from './mat-ch20';
import { matthewChapter21 } from './mat-ch21';
import { matthewChapter22 } from './mat-ch22';

async function main() {
  console.log('🔄 Ensamblando Bloque 8 de Mateo (Capítulos 20 al 22 - Obreros de la Viña, Entrada en Jerusalén y Controversias en el Templo)...');

  const allVerses = [
    ...matthewChapter20,
    ...matthewChapter21,
    ...matthewChapter22,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock8 = baseVerses.filter(v => v.chapter >= 20 && v.chapter <= 22);

  if (baseBlock8.length !== 126) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock8.length} versículos en capítulos 20-22, se esperaban 126.`);
  }

  if (allVerses.length !== 126) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 126.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 126; i++) {
    const base = baseBlock8[i];
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

  console.log('✅ Validación completada: Los 126 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch20-22_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 8:', err);
  process.exit(1);
});
