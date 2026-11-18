import * as fs from 'fs';
import * as path from 'path';
import { pathToFileURL } from 'url';

export interface TranslatedVerse {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  translation_notes: string;
}

interface BaseVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

async function buildBook(bookCode: string): Promise<void> {
  const code = bookCode.toUpperCase();
  const basePath = path.resolve(process.cwd(), 'data', `${code}.json`);
  if (!fs.existsSync(basePath)) {
    throw new Error(`No existe archivo base: ${basePath}`);
  }

  const baseVerses: BaseVerse[] = JSON.parse(fs.readFileSync(basePath, 'utf-8'));
  const chapters = Array.from(new Set(baseVerses.map((v) => v.chapter))).sort((a, b) => a - b);

  const compiled: TranslatedVerse[] = [];
  for (const ch of chapters) {
    const chFile = path.resolve(process.cwd(), 'scripts', `${code.toLowerCase()}-ch${ch}.ts`);
    if (!fs.existsSync(chFile)) {
      throw new Error(`Falta archivo de capítulo: ${chFile}`);
    }
    const mod = await import(pathToFileURL(chFile).href);
    const arr = Object.values(mod).find((val) => Array.isArray(val)) as TranslatedVerse[] | undefined;
    if (!arr) {
      throw new Error(`No se encontró arreglo exportado de versículos en ${chFile}`);
    }
    compiled.push(...arr);
  }

  if (compiled.length !== baseVerses.length) {
    throw new Error(
      `${code}: se compilaron ${compiled.length} versículos, pero el texto base SBLGNT tiene ${baseVerses.length}.`
    );
  }

  const finalVerses = baseVerses.map((base, i) => {
    const trans = compiled[i];
    if (trans.book !== code) {
      throw new Error(`Índice ${i}: libro '${trans.book}' != '${code}'.`);
    }
    if (trans.chapter !== base.chapter || trans.verse !== base.verse) {
      throw new Error(
        `Desajuste en índice ${i}: base ${base.chapter}:${base.verse} vs traducido ${trans.chapter}:${trans.verse}`
      );
    }
    if (!trans.translation || trans.translation.trim().length === 0) {
      throw new Error(`Traducción vacía en ${code} ${trans.chapter}:${trans.verse}`);
    }
    if (!trans.translation_notes || trans.translation_notes.trim().length === 0) {
      throw new Error(`Notas filológicas vacías en ${code} ${trans.chapter}:${trans.verse}`);
    }

    return {
      book: code,
      chapter: trans.chapter,
      verse: trans.verse,
      greek_text: base.text,
      translation: trans.translation.trim(),
      translation_notes: trans.translation_notes.trim(),
    };
  });

  const outPath = path.resolve(process.cwd(), 'data', `${code}_translated.json`);
  fs.writeFileSync(outPath, JSON.stringify(finalVerses, null, 2), 'utf-8');
  console.log(`✅ ${code} ensamblado (${finalVerses.length} versículos) -> ${outPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Uso: npx tsx scripts/build-book-translated.ts EPH COL PHM ...');
    process.exit(1);
  }
  for (const arg of args) {
    await buildBook(arg);
  }
}

main().catch((err) => {
  console.error('❌ Error al ensamblar libro:', err);
  process.exit(1);
});
