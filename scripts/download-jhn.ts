import * as fs from 'fs';
import * as path from 'path';

async function downloadJohn() {
  const url = 'https://raw.githubusercontent.com/morphgnt/sblgnt/master/64-Jn-morphgnt.txt';
  console.log(`Descargando texto crítico del Evangelio según Juan desde ${url}...`);

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

    // Limpiar signos del aparato crítico (⸀ ⸁ ⸂ ⸃ ⸄ ⸅ etc.)
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
      book: 'JHN',
      chapter: item.chapter,
      verse: item.verse,
      text: item.words.join(' ')
    };
  });

  console.log(`Versículos procesados de Juan: ${structured.length}`);

  const chapterCounts: { [ch: number]: number } = {};
  for (const v of structured) {
    chapterCounts[v.chapter] = (chapterCounts[v.chapter] || 0) + 1;
  }
  console.log('Versículos por capítulo en Juan:', chapterCounts);

  const outPath = path.resolve(process.cwd(), 'data/JHN.json');
  fs.writeFileSync(outPath, JSON.stringify(structured, null, 2), 'utf-8');
  console.log(`Guardado exitosamente en: ${outPath}`);
}

downloadJohn().catch(err => {
  console.error('Error al descargar Juan:', err);
  process.exit(1);
});
