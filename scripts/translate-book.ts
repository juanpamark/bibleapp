import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI, Type } from '@google/genai';

// Interfaz para versículos de entrada
interface InputVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

// Interfaz para la respuesta estructurada de Gemini
interface TranslatedVerseOutput {
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string;
}

interface GeminiBatchResponse {
  verses: TranslatedVerseOutput[];
}

// Interfaz para el registro persistido en la base de datos
interface DatabaseVerseRecord {
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string | null;
}

// Mapeo legible de códigos de libros
const BOOK_NAMES: Record<string, string> = {
  MAT: 'Mateo',
  MRK: 'Marcos',
  LUK: 'Lucas',
  JHN: 'Juan',
  '2JN': '2 Juan',
};

// Validación de credenciales
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  console.error('❌ Error: Faltan credenciales de Supabase en el archivo .env.');
  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.error('❌ Error: Falta GEMINI_API_KEY en el archivo .env.');
  process.exit(1);
}

// Inicialización de clientes
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// System Prompt riguroso
const SYSTEM_PROMPT = `Eres un especialista en filología clásica, griego koiné y traducción bíblica académica. Traduce el texto provisto a español latinoamericano contemporáneo y natural, con equivalencia formal contextualizada. Reglas: registro neutro latinoamericano (usa 'ustedes', nunca 'vosotros'; evita arcaísmos ibéricos); respeta el aspecto verbal griego; traduce fielmente partículas lógicas (gar, oun, de); no insertes paráfrasis doctrinales ajenas al texto original. Incluye notas breves en translation_notes solo cuando haya matices morfológicos o culturales clave.`;

// Esquema JSON estructurado para Gemini
const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verses: {
      type: Type.ARRAY,
      description: 'Lista de versículos traducidos',
      items: {
        type: Type.OBJECT,
        properties: {
          verse: {
            type: Type.INTEGER,
            description: 'Número del versículo',
          },
          greek_text: {
            type: Type.STRING,
            description: 'Texto griego original recibido',
          },
          translation: {
            type: Type.STRING,
            description: 'Traducción fiel y contemporánea en español latinoamericano',
          },
          translation_notes: {
            type: Type.STRING,
            description: 'Notas críticas breves sobre matices morfológicos, léxicos o culturales clave',
          },
        },
        required: ['verse', 'greek_text', 'translation', 'translation_notes'],
      },
    },
  },
  required: ['verses'],
};

// Modelos de producción con cuota estándar
const PRODUCTION_MODELS = [
  process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
];

async function translateBatchWithGemini(
  batch: InputVerse[],
  previousContextVerses: DatabaseVerseRecord[],
  activeModelRef: { current: string }
): Promise<GeminiBatchResponse> {
  const batchInput = batch.map((v) => ({
    verse: v.verse,
    greek_text: v.text,
  }));

  let contextSnippet = '';
  if (previousContextVerses.length > 0) {
    contextSnippet =
      '--- CONTEXTO PREVIO INMEDIATO (Últimos versículos traducidos para mantener coherencia narrativa) ---\n' +
      previousContextVerses
        .map(
          (pv) =>
            `[${pv.book} ${pv.chapter}:${pv.verse}]\n` +
            `Griego: ${pv.greek_text}\n` +
            `Traducción previa: ${pv.translation}`
        )
        .join('\n\n') +
      '\n------------------------------------------------------------------------------------------------\n\n';
  }

  const userPrompt =
    `${contextSnippet}` +
    `Por favor, traduce con rigor académico y según las reglas establecidas los siguientes ${batch.length} versículos del libro ${batch[0].book}, capítulo ${batch[0].chapter}:\n\n` +
    JSON.stringify(batchInput, null, 2);

  let lastError: any = null;

  let modelIndex = PRODUCTION_MODELS.indexOf(activeModelRef.current);
  if (modelIndex === -1) modelIndex = 0;

  for (let i = modelIndex; i < PRODUCTION_MODELS.length; i++) {
    const modelName = PRODUCTION_MODELS[i];
    activeModelRef.current = modelName;

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        console.log(`   📡 Invocando modelo ${modelName} (Intento ${attempt}/4)...`);
        const startTime = Date.now();

        const response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            responseMimeType: 'application/json',
            responseSchema: RESPONSE_SCHEMA,
            temperature: 0.2,
          },
        });

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`   ⏱️ Respuesta recibida en ${elapsed}s de ${modelName}`);

        const textOutput = response.text;
        if (!textOutput) {
          throw new Error('Respuesta vacía recibida de Gemini');
        }

        const parsed = JSON.parse(textOutput) as GeminiBatchResponse;
        if (!parsed.verses || !Array.isArray(parsed.verses)) {
          throw new Error('Estructura JSON inválida: falta el array "verses"');
        }

        return parsed;
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || String(err);

        if (
          errMsg.includes('is no longer available') ||
          errMsg.includes('not found') ||
          errMsg.includes('404') ||
          errMsg.includes('NOT_FOUND')
        ) {
          console.warn(`   ⚠️ Modelo ${modelName} no disponible en la API (${errMsg.slice(0, 80)}...). Alternando al siguiente modelo...`);
          break;
        }

        if (
          errMsg.includes('429') ||
          errMsg.includes('503') ||
          errMsg.includes('RESOURCE_EXHAUSTED') ||
          errMsg.includes('UNAVAILABLE') ||
          errMsg.includes('Too Many Requests')
        ) {
          console.warn(`   ⏳ Rate limit temporal detectado (429/503). Esperando 20 segundos para refrescar la ventana de la API (Intento ${attempt}/4)...`);
          await new Promise((resolve) => setTimeout(resolve, 20000));
          continue;
        }

        console.error(`   ❌ Error al invocar Gemini con ${modelName}:`, errMsg);
        if (attempt < 4) {
          console.warn(`   ⏳ Reintentando en 5s...`);
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
      }
    }
  }

  throw new Error(`Fallaron los modelos de producción estándar. Último error: ${lastError?.message || lastError}`);
}

// Operaciones resilientes en Supabase para tolerar caídas transitorias de red
async function safeUpsert(records: DatabaseVerseRecord[], maxRetries = 5) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase
        .from('verses')
        .upsert(records, { onConflict: 'book,chapter,verse' })
        .select('book, chapter, verse');

      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (err: any) {
      console.warn(`   ⚠️ Advertencia de red con Supabase (${err.message}). Reintentando guardado (${attempt}/${maxRetries}) en 3s...`);
      if (attempt === maxRetries) {
        throw new Error(`Fallo persistente en Supabase tras ${maxRetries} intentos: ${err.message}`);
      }
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

async function safeCheckExisting(
  book: string,
  chapters: number[],
  verseNumbers: number[],
  maxRetries = 4
): Promise<DatabaseVerseRecord[]> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { data, error } = await supabase
        .from('verses')
        .select('book, chapter, verse, translation, greek_text')
        .eq('book', book)
        .in('chapter', chapters)
        .in('verse', verseNumbers);

      if (error) throw new Error(error.message);
      return (data as DatabaseVerseRecord[]) || [];
    } catch (err: any) {
      console.warn(`   ⚠️ Error de red al verificar registros en Supabase (${err.message}). Reintento (${attempt}/${maxRetries})...`);
      if (attempt === maxRetries) {
        return [];
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  return [];
}

async function main() {
  let targetChapter: number | null = null;
  let inputFilePath = 'data/MAT.json';

  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--chapter' || arg === '-c') {
      if (args[i + 1]) {
        targetChapter = parseInt(args[i + 1], 10);
        i++;
      }
    } else if (arg.startsWith('--chapter=')) {
      targetChapter = parseInt(arg.split('=')[1], 10);
    } else if (!arg.startsWith('-')) {
      inputFilePath = arg;
    }
  }

  const fullFilePath = path.resolve(process.cwd(), inputFilePath);

  console.log('╔═════════════════════════════════════════════════════════════════════════╗');
  console.log('║       PIPELINE DE TRADUCCIÓN BÍBLICA: GRIEGO KOINÉ -> ESPAÑOL (ALTA RES)║');
  console.log('╚═════════════════════════════════════════════════════════════════════════╝');
  console.log(`📖 Archivo fuente: ${fullFilePath}`);

  if (!fs.existsSync(fullFilePath)) {
    console.error(`❌ Archivo no encontrado: ${fullFilePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(fullFilePath, 'utf-8');
  let verses: InputVerse[] = JSON.parse(rawData);

  if (!Array.isArray(verses) || verses.length === 0) {
    console.error('❌ El archivo JSON no contiene versículos válidos.');
    process.exit(1);
  }

  const targetBook = verses[0].book;
  const bookDisplayName = BOOK_NAMES[targetBook] || targetBook;

  if (targetChapter !== null) {
    if (isNaN(targetChapter) || targetChapter < 1) {
      console.error(`❌ Capítulo inválido especificado: ${targetChapter}`);
      process.exit(1);
    }
    const filtered = verses.filter((v) => v.chapter === targetChapter);
    if (filtered.length === 0) {
      console.error(`❌ No se encontraron versículos para el capítulo ${targetChapter} en ${inputFilePath}`);
      process.exit(1);
    }
    console.log(`🎯 Modo selectivo activado: Capítulo ${targetChapter} (${filtered.length} versículos)`);
    verses = filtered;
  }

  const totalVersesInScope = verses.length;
  console.log(`📊 Total de versículos en alcance: ${totalVersesInScope}`);
  console.log(`📦 Tamaño de lote: 10 versículos por lote\n`);

  const BATCH_SIZE = 10;
  const totalBatches = Math.ceil(totalVersesInScope / BATCH_SIZE);
  const activeModelRef = { current: PRODUCTION_MODELS[0] };

  // Consultar versículos existentes previamente en Supabase
  let queryCount = supabase
    .from('verses')
    .select('*', { count: 'exact', head: true })
    .eq('book', targetBook);

  if (targetChapter !== null) {
    queryCount = queryCount.eq('chapter', targetChapter);
  }
  const { count: initialCount } = await queryCount;
  let totalSavedCount = initialCount || 0;

  console.log(`🔎 Registros existentes previamente en Supabase: ${totalSavedCount}/${totalVersesInScope}`);

  let previousContextVerses: DatabaseVerseRecord[] = [];

  for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
    const startIdx = batchIdx * BATCH_SIZE;
    const endIdx = Math.min(startIdx + BATCH_SIZE, totalVersesInScope);
    const currentBatch = verses.slice(startIdx, endIdx);

    const firstV = currentBatch[0];
    const lastV = currentBatch[currentBatch.length - 1];

    const rangeLabel =
      firstV.chapter === lastV.chapter
        ? `${firstV.chapter}:${firstV.verse}-${lastV.verse}`
        : `${firstV.chapter}:${firstV.verse} - ${lastV.chapter}:${lastV.verse}`;

    const progressPercent = (((batchIdx * BATCH_SIZE) / totalVersesInScope) * 100).toFixed(1);

    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(
      `🔹 [Lote ${batchIdx + 1}/${totalBatches}] ${bookDisplayName} ${rangeLabel} | Progreso: ${progressPercent}% | Guardados: ${totalSavedCount}/${totalVersesInScope}`
    );

    // 1. Detección resiliente de versículos ya traducidos en Supabase
    const chaptersInBatch = [...new Set(currentBatch.map((v) => v.chapter))];
    const existingInDb = await safeCheckExisting(
      firstV.book,
      chaptersInBatch,
      currentBatch.map((v) => v.verse)
    );

    const existingMap = new Map<string, DatabaseVerseRecord>();
    for (const rec of existingInDb) {
      existingMap.set(`${rec.chapter}:${rec.verse}`, rec);
    }

    const allAlreadyInDb =
      currentBatch.length > 0 &&
      currentBatch.every((v) => existingMap.has(`${v.chapter}:${v.verse}`));

    if (allAlreadyInDb) {
      console.log(`   ⏭️ Todos los versículos del lote ya existen en Supabase. Saltando lote automáticamente...`);
      const lastThree = currentBatch.slice(-3).map((v) => {
        const found = existingMap.get(`${v.chapter}:${v.verse}`)!;
        return {
          book: v.book,
          chapter: v.chapter,
          verse: v.verse,
          greek_text: v.text,
          translation: found.translation,
          translation_notes: null,
        };
      });
      previousContextVerses = lastThree;
      continue;
    }

    // 2. Traducción con Gemini
    const geminiResult = await translateBatchWithGemini(
      currentBatch,
      previousContextVerses,
      activeModelRef
    );

    // 3. Validación estricta
    console.log(`   🔍 Validando correspondencia de versículos...`);
    if (geminiResult.verses.length !== currentBatch.length) {
      throw new Error(
        `Discrepancia en el conteo: enviados ${currentBatch.length}, pero devueltos ${geminiResult.verses.length}`
      );
    }

    const recordsToUpsert: DatabaseVerseRecord[] = [];
    for (const originalVerse of currentBatch) {
      const match = geminiResult.verses.find((gv) => gv.verse === originalVerse.verse);
      if (!match) {
        throw new Error(
          `Versículo faltante en la respuesta de Gemini: versículo ${originalVerse.verse}`
        );
      }

      recordsToUpsert.push({
        book: originalVerse.book,
        chapter: originalVerse.chapter,
        verse: originalVerse.verse,
        greek_text: originalVerse.text,
        translation: match.translation.trim(),
        translation_notes: match.translation_notes ? match.translation_notes.trim() : null,
      });
    }

    console.log(`   ✅ Validación exitosa: ${recordsToUpsert.length} versículos validados correctamente.`);

    // 4. Guardado seguro en Supabase con reintentos
    console.log(`   💾 Guardando en Supabase (tabla 'verses')...`);
    await safeUpsert(recordsToUpsert);

    let newlyInserted = 0;
    for (const rec of recordsToUpsert) {
      if (!existingMap.has(`${rec.chapter}:${rec.verse}`)) {
        newlyInserted++;
      }
    }
    totalSavedCount += newlyInserted;

    console.log(`   ✅ Upsert completado con éxito: ${recordsToUpsert.length} versículos sincronizados.`);

    // Previsualización en consola
    recordsToUpsert.forEach((rec) => {
      console.log(`      • [${rec.book} ${rec.chapter}:${rec.verse}] ${rec.translation}`);
      if (rec.translation_notes) {
        console.log(`        ↳ Nota: ${rec.translation_notes}`);
      }
    });

    previousContextVerses = recordsToUpsert.slice(-3);

    // 5. Pausa defensiva de 3.0s entre lotes exitosos
    if (batchIdx < totalBatches - 1) {
      console.log(`   ⏱️ Pausa defensiva de 3.0s para respetar límite de 15 RPM...`);
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  const finalProgress = ((totalSavedCount / totalVersesInScope) * 100).toFixed(1);
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`🎉 Pipeline finalizado con éxito.`);
  console.log(`📊 Estado final de almacenamiento en Supabase: ${totalSavedCount}/${totalVersesInScope} (${finalProgress}%)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

main().catch((err) => {
  console.error('\n❌ Error crítico durante la ejecución del pipeline:', err.message || err);
  process.exit(1);
});
