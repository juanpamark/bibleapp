import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter27 } from './mat-ch27';
import { matthewChapter28 } from './mat-ch28';

async function main() {
  console.log('🔄 Ensamblando Bloque 11 de Mateo (Capítulos 27 y 28 - Juicio ante Pilato, Crucifixión, Sepultura, Resurrección y la Gran Comisión)...');

  const allVerses = [
    ...matthewChapter27,
    ...matthewChapter28,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock11 = baseVerses.filter(v => v.chapter >= 27 && v.chapter <= 28);

  if (baseBlock11.length !== 86) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock11.length} versículos en capítulos 27-28, se esperaban 86.`);
  }

  if (allVerses.length !== 86) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 86.`);
  }

  const finalVerses = [];

  // Validar correspondencia 1:1 de capítulo y versículo e inyectar greek_text
  for (let i = 0; i < 86; i++) {
    const base = baseBlock11[i];
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

    finalVerses.push({
      book: 'MAT',
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation,
      translation_notes: trans.translation_notes,
    });
  }

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch27-28_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalVerses, null, 2), 'utf-8');
  console.log(`✅ Bloque 11 guardado exitosamente en: ${outputPath}`);
}

main().catch(err => {
  console.error('❌ Error fatal al ensamblar Bloque 11:', err);
  process.exit(1);
});
