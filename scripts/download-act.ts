import * as fs from 'fs';
import * as path from 'path';

async function downloadActs() {
  const url = 'https://raw.githubusercontent.com/morphgnt/sblgnt/master/65-Ac-morphgnt.txt';
  console.log(`Descargando texto crítico de Hechos de los Apóstoles desde ${url}...`);

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
      book: 'ACT',
      chapter: item.chapter,
      verse: item.verse,
      text: item.words.join(' ').replace(/\s+([,.:;·!])/g, '$1')
    };
  });

  const outputPath = path.resolve(process.cwd(), 'data/ACT.json');
  fs.writeFileSync(outputPath, JSON.stringify(structured, null, 2), 'utf-8');

  console.log(`✅ Guardado data/ACT.json con éxito.`);
  console.log(`📊 Total de versículos: ${structured.length} (esperados: 1007)`);

  const chapters = new Set(structured.map(v => v.chapter));
  console.log(`Capítulos encontrados: ${chapters.size} (esperados: 28)`);
  
  let totalCount = 0;
  for (let c = 1; c <= 28; c++) {
    const count = structured.filter(v => v.chapter === c).length;
    totalCount += count;
    console.log(`  Capítulo ${c}: ${count} versículos`);
  }
  console.log(`Suma total de versículos: ${totalCount}`);
}

downloadActs().catch(console.error);
