import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter23 } from './mat-ch23';
import { matthewChapter24 } from './mat-ch24';
import { matthewChapter25 } from './mat-ch25';

async function main() {
  console.log('🔄 Ensamblando Bloque 9 de Mateo (Capítulos 23 al 25 - Los Siete Ayes, Discurso del Monte de los Olivos y Parábolas Escatológicas)...');

  const allVerses = [
    ...matthewChapter23,
    ...matthewChapter24,
    ...matthewChapter25,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock9 = baseVerses.filter(v => v.chapter >= 23 && v.chapter <= 25);

  if (baseBlock9.length !== 136) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock9.length} versículos en capítulos 23-25, se esperaban 136.`);
  }

  if (allVerses.length !== 136) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 136.`);
  }

  // Validar correspondencia 1:1 de capítulo y versículo
  for (let i = 0; i < 136; i++) {
    const base = baseBlock9[i];
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

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch23-25_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(allVerses, null, 2), 'utf-8');
  console.log(`✅ Bloque 9 guardado exitosamente en: ${outputPath}`);
}

main().catch(err => {
  console.error('❌ Error fatal al ensamblar Bloque 9:', err);
  process.exit(1);
});
