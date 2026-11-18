import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter1 } from './mat-ch1';
import { matthewChapter2 } from './mat-ch2';

async function main() {
  console.log('🔄 Ensamblando Bloque 1 de Mateo (Capítulos 1 y 2 - Infancia y Fórmulas Proféticas)...');

  const allVerses = [
    ...matthewChapter1,
    ...matthewChapter2,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock1 = baseVerses.filter(v => v.chapter >= 1 && v.chapter <= 2);

  if (baseBlock1.length !== 48) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock1.length} versículos en capítulos 1-2, se esperaban 48.`);
  }

  if (allVerses.length !== 48) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 48.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 48; i++) {
    const base = baseBlock1[i];
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
    if (trans.translation_notes.trim().length < 100) {
      console.warn(`⚠️ Nota relativamente breve en MAT ${trans.chapter}:${trans.verse} (${trans.translation_notes.length} caracteres)`);
    }
  }

  console.log('✅ Validación completada: Los 48 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch1-2_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 1:', err);
  process.exit(1);
});
