import * as fs from 'fs';
import * as path from 'path';
import { matthewChapter26 } from './mat-ch26';

async function main() {
  console.log('🔄 Ensamblando Bloque 10 de Mateo (Capítulo 26 - El Relato de la Pasión I: La Cena, Getsemaní, Arresto y Juicio ante el Sanedrín)...');

  const allVerses = [
    ...matthewChapter26,
  ];

  console.log(`📊 Total de versículos compilados: ${allVerses.length}`);

  // Cargar texto base original data/MAT.json para verificar correspondencia exacta
  const rawBase = fs.readFileSync(path.resolve(process.cwd(), 'data/MAT.json'), 'utf-8');
  const baseVerses: Array<{ book: string; chapter: number; verse: number; text: string }> = JSON.parse(rawBase);

  const baseBlock10 = baseVerses.filter(v => v.chapter === 26);

  if (baseBlock10.length !== 75) {
    throw new Error(`El texto base data/MAT.json tiene ${baseBlock10.length} versículos en capítulo 26, se esperaban 75.`);
  }

  if (allVerses.length !== 75) {
    throw new Error(`Se compilaron ${allVerses.length} versículos, se esperaban exactamente 75.`);
  }

  const finalVerses = [];

  // Validar correspondencia 1:1 de capítulo y versículo e inyectar greek_text
  for (let i = 0; i < 75; i++) {
    const base = baseBlock10[i];
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

  const outputPath = path.resolve(process.cwd(), 'data/MAT_ch26_translated.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalVerses, null, 2), 'utf-8');
  console.log(`✅ Bloque 10 guardado exitosamente en: ${outputPath}`);
}

main().catch(err => {
  console.error('❌ Error fatal al ensamblar Bloque 10:', err);
  process.exit(1);
});
