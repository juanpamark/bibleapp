import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter5 } from './mat-ch5';
import { matthewChapter6 } from './mat-ch6';
import { matthewChapter7 } from './mat-ch7';

async function main() {
  console.log('🔄 Ensamblando Bloque 3 de Mateo (Capítulos 5 al 7 - El Sermón del Monte)...');

  const allVerses = [
    ...matthewChapter5,
    ...matthewChapter6,
    ...matthewChapter7,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock3 = baseVerses.filter(v => v.chapter >= 5 && v.chapter <= 7);

  if (baseBlock3.length !== 111) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock3.length} versículos en capítulos 5-7, se esperaban 111.`);
  }

  if (allVerses.length !== 111) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 111.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 111; i++) {
    const base = baseBlock3[i];
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

  console.log('✅ Validación completada: Los 111 versículos coinciden exactamente en capítulo y versículo con el texto crítico.');

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch5-7_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`💾 Archivo guardado con éxito: ${outputPath}`);
  console.log(`📦 Tamaño del archivo: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error('❌ Error en compilación de Mateo Bloque 3:', err);
  process.exit(1);
});
