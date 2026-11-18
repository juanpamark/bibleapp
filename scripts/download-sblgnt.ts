import * as fs from 'fs';
import * as path from 'path';

const SBLGNT_FILES: Record<string, string> = {
  MAT: '61-Mt-morphgnt.txt',
  MRK: '62-Mk-morphgnt.txt',
  LUK: '63-Lk-morphgnt.txt',
  JHN: '64-Jn-morphgnt.txt',
  ACT: '65-Ac-morphgnt.txt',
  ROM: '66-Ro-morphgnt.txt',
  '1CO': '67-1Co-morphgnt.txt',
  '2CO': '68-2Co-morphgnt.txt',
  GAL: '69-Ga-morphgnt.txt',
  EPH: '70-Eph-morphgnt.txt',
  PHP: '71-Php-morphgnt.txt',
  COL: '72-Col-morphgnt.txt',
  '1TH': '73-1Th-morphgnt.txt',
  '2TH': '74-2Th-morphgnt.txt',
  '1TI': '75-1Ti-morphgnt.txt',
  '2TI': '76-2Ti-morphgnt.txt',
  TIT: '77-Tit-morphgnt.txt',
  PHM: '78-Phm-morphgnt.txt',
  HEB: '79-Heb-morphgnt.txt',
  JAS: '80-Jas-morphgnt.txt',
  '1PE': '81-1Pe-morphgnt.txt',
  '2PE': '82-2Pe-morphgnt.txt',
  '1JN': '83-1Jn-morphgnt.txt',
  '2JN': '84-2Jn-morphgnt.txt',
  '3JN': '85-3Jn-morphgnt.txt',
  JUD: '86-Jud-morphgnt.txt',
  REV: '87-Re-morphgnt.txt',
};

interface BaseVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

async function downloadBook(bookCode: string): Promise<void> {
  const code = bookCode.toUpperCase();
  const filename = SBLGNT_FILES[code];
  if (!filename) {
    throw new Error(`Código de libro no soportado: ${code}`);
  }

  const url = `https://raw.githubusercontent.com/morphgnt/sblgnt/master/${filename}`;
  console.log(`Descargando ${code} desde ${url}...`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al descargar ${code}: ${res.status} ${res.statusText}`);
  }

  const rawText = await res.text();
  const lines = rawText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const versesMap = new Map<string, { chapter: number; verse: number; words: string[] }>();

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length < 4) continue;
    const ref = parts[0];
    const chapter = parseInt(ref.slice(2, 4), 10);
    const verse = parseInt(ref.slice(4), 10);
    const cleanWord = parts[3].replace(/[⸀⸁⸂⸃⸄⸅]/g, '').trim();
    if (!cleanWord) continue;

    const key = `${chapter}:${verse}`;
    let entry = versesMap.get(key);
    if (!entry) {
      entry = { chapter, verse, words: [] };
      versesMap.set(key, entry);
    }
    entry.words.push(cleanWord);
  }

  const sortedKeys = Array.from(versesMap.keys()).sort((a, b) => {
    const [c1, v1] = a.split(':').map(Number);
    const [c2, v2] = b.split(':').map(Number);
    return c1 !== c2 ? c1 - c2 : v1 - v2;
  });

  const structured: BaseVerse[] = sortedKeys.map((k) => {
    const item = versesMap.get(k)!;
    return {
      book: code,
      chapter: item.chapter,
      verse: item.verse,
      text: item.words.join(' '),
    };
  });

  const outPath = path.resolve(process.cwd(), 'data', `${code}.json`);
  fs.writeFileSync(outPath, JSON.stringify(structured, null, 2), 'utf-8');
  console.log(`✅ ${code}: ${structured.length} versículos guardados en ${outPath}`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Uso: npx tsx scripts/download-sblgnt.ts EPH COL PHM ...');
    process.exit(1);
  }

  for (const arg of args) {
    await downloadBook(arg);
  }
}

main().catch((err) => {
  console.error('Error fatal:', err);
  process.exit(1);
});
