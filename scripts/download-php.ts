import * as fs from 'fs';
import * as path from 'path';

async function downloadPhilippians() {
  const url = 'https://raw.githubusercontent.com/morphgnt/sblgnt/master/71-Php-morphgnt.txt';
  console.log(`Descargando texto crítico de Filipenses desde ${url}...`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error en descarga: ${res.status} ${res.statusText}`);
  }

  const rawText = await res.text();
  const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
  console.log(`Líneas recibidas: ${lines.length}`);

  const versesMap = new Map<string, { chapter: number; verse: number; words: string[] }>();

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length < 4) continue;
    const ref = parts[0];
    const chapter = parseInt(ref.slice(2, 4), 10);
    const verse = parseInt(ref.slice(4), 10);
    const rawWord = parts[3];

    // Limpiar signos del aparato crítico
    const cleanWord = rawWord.replace(/[⸀⸁⸂⸃⸄⸅]/g, '').trim();
    if (!cleanWord) continue;

    const key = `${chapter}:${verse}`;
    if (!versesMap.has(key)) {
      versesMap.set(key, { chapter, verse, words: [] });
    }
    versesMap.get(key)!.words.push(cleanWord);
  }

  const sortedKeys = Array.from(versesMap.keys()).sort((a, b) => {
    const [c1, v1] = a.split(':').map(Number);
    const [c2, v2] = b.split(':').map(Number);
    if (c1 !== c2) return c1 - c2;
    return v1 - v2;
  });

  const structured = sortedKeys.map(k => {
    const item = versesMap.get(k)!;
    return {
      book: 'PHP',
      chapter: item.chapter,
      verse: item.verse,
      text: item.words.join(' ')
    };
  });

  console.log(`Versículos procesados: ${structured.length}`);
  const outPath = path.resolve(process.cwd(), 'data/PHP.json');
  fs.writeFileSync(outPath, JSON.stringify(structured, null, 2), 'utf-8');
  console.log(`Guardado en: ${outPath}`);
}

downloadPhilippians().catch(err => {
  console.error('Error fatal:', err);
  process.exit(1);
});
