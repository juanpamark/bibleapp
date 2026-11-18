import * as fs from 'fs';
import * as path from 'path';

// Texto griego para las 3 variantes críticas tradicionales que suelen omitirse en el texto alejandrino pero que completan la numeración tradicional de 1.071 versículos (puestas entre corchetes críticos):
const CRITICAL_VARIANTS: Record<string, string> = {
  '17:21': '[τοῦτο δὲ τὸ γένος οὐκ ἐκπορεύεται εἰ μὴ ἐν προσευχῇ καὶ νηστείᾳ.]',
  '18:11': '[ἦλθεν γὰρ ὁ υἱὸς τοῦ ἀνθρώπου σῶσαι τὸ ἀπολωλός.]',
  '23:14': '[Οὐαὶ δὲ ὑμῖν, γραμματεῖς καὶ Φαρισαῖοι ὑποκριταί, ὅτι κατεσθίετε τὰς οἰκίας τῶν χηρῶν καὶ προφάσει μακρὰ προσευχόμενοι· διὰ τοῦτο λήμψεσθε περισσότερον κρίμα.]'
};

async function downloadAndStructureMatthew() {
  console.log('Descargando texto crítico de Mateo (SBLGNT / MorphGNT)...');
  const url = 'https://raw.githubusercontent.com/morphgnt/sblgnt/master/61-Mt-morphgnt.txt';
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error al descargar de GitHub: ${res.status} ${res.statusText}`);
  }

  const rawText = await res.text();
  const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
  console.log(`Líneas recibidas: ${lines.length}`);

  const versesMap = new Map<string, { chapter: number; verse: number; words: string[] }>();

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts.length < 4) continue;
    const ref = parts[0]; // e.g. 010101 -> Book 01, Chap 01, Verse 01
    const chapter = parseInt(ref.slice(2, 4), 10);
    const verse = parseInt(ref.slice(4), 10);
    const rawWord = parts[3];

    // Limpiar signos del aparato crítico de SBL (⸀, ⸁, ⸂, ⸃, etc.) manteniendo puntuación y diacríticos
    const cleanWord = rawWord.replace(/[⸀⸁⸂⸃⸄⸅]/g, '').trim();
    if (!cleanWord) continue;

    const key = `${chapter}:${verse}`;
    if (!versesMap.has(key)) {
      versesMap.set(key, { chapter, verse, words: [] });
    }
    versesMap.get(key)!.words.push(cleanWord);
  }

  // Insertar variantes críticas si no están presentes para completar la versificación estándar de 1.071 versículos
  for (const [key, text] of Object.entries(CRITICAL_VARIANTS)) {
    if (!versesMap.has(key)) {
      const [c, v] = key.split(':').map(Number);
      versesMap.set(key, { chapter: c, verse: v, words: [text] });
      console.log(`+ Incluida variante crítica [${key}] en corchetes para versificación estándar.`);
    }
  }

  // Ordenar canónicamente por capítulo y versículo
  const sortedKeys = Array.from(versesMap.keys()).sort((a, b) => {
    const [c1, v1] = a.split(':').map(Number);
    const [c2, v2] = b.split(':').map(Number);
    if (c1 !== c2) return c1 - c2;
    return v1 - v2;
  });

  const structuredVerses = sortedKeys.map(k => {
    const item = versesMap.get(k)!;
    return {
      book: 'MAT',
      chapter: item.chapter,
      verse: item.verse,
      text: item.words.join(' ').replace(/\s+([,.:;·!])/g, '$1') // evitar espacios antes de puntuación
    };
  });

  console.log(`Total de versículos procesados: ${structuredVerses.length}`);

  const outputPath = path.resolve(process.cwd(), 'data/MAT.json');
  fs.writeFileSync(outputPath, JSON.stringify(structuredVerses, null, 2), 'utf-8');
  console.log(`✅ Archivo guardado con éxito en: ${outputPath}`);

  // Verificaciones de integridad
  const chapters = new Set(structuredVerses.map(v => v.chapter));
  console.log(`Capítulos cubiertos: ${chapters.size} (esperados: 28)`);
  if (structuredVerses.length === 1071 && chapters.size === 28) {
    console.log('🎯 Integridad verificada al 100%: 28 capítulos y exactamente 1.071 versículos.');
  } else {
    console.warn(`⚠️ Advertencia: Versículos ${structuredVerses.length}, Capítulos ${chapters.size}`);
  }
}

downloadAndStructureMatthew().catch(console.error);
