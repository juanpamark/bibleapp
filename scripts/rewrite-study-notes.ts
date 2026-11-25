import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenAI } from '@google/genai';

interface DbVerse {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  greek_text: string;
  translation: string;
  translation_notes: string | null;
}

interface RewrittenNoteItem {
  chapter: number;
  verse: number;
  in_original: string;
  to_understand_better: string;
}

interface BatchResponse {
  notes: RewrittenNoteItem[];
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!SUPABASE_URL || !SUPABASE_SECRET_KEY || !GEMINI_API_KEY) {
  console.error('❌ Faltan SUPABASE_URL, SUPABASE_SECRET_KEY o GEMINI_API_KEY en .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const client = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// Modelos actuales conforme a la guía oficial (sin modelos deprecados)
const MODELS = ['gemini-3.5-flash-lite', 'gemini-4-argon', 'gemini-4-hydrogen'];

const SYSTEM_INSTRUCTION = `Eres un maestro bíblico y pedagogo experto en griego koiné que escribe notas de estudio para lectores hispanohablantes curiosos que NO saben griego ni lingüística técnica, pero quieren aprender qué dice exactamente el texto original y entender mejor cada versículo.

Tu misión es transformar cada nota en DOS micro-bloques claros, breves, amenos y memorables, en español latinoamericano neutro (usa "ustedes", jamás "vosotros"):

1. "in_original" (1 sola oración concisa, aprox. 90 a 175 caracteres):
   - Elige SOLO 1 o máximo 2 palabras o expresiones clave del griego que realmente aporten un matiz interesante al lector.
   - Escríbelas SIEMPRE con este formato exacto: «traducción en español» (transliteración sencilla, palabra griega), seguido de qué significa o qué imagen evoca.
     Ejemplo: «simulación» (hypókrisis, ὑπόκρισις) viene del teatro griego y describe al actor que oculta su rostro tras una máscara.
   - PROHIBIDO copiar frases u oraciones largas en griego (el lector ya ve el versículo griego aparte). Nunca pongas más de 3 palabras griegas seguidas.
   - PROHIBIDO usar jerga gramatical o académica cruda: NUNCA escribas palabras como "aoristo", "genitivo", "dativo", "acusativo", "nominativo", "subjuntivo", "optativo", "participio", "infinitivo", "perifrástico", "hapax", "anacoluto", "prótasis", "apódosis", "escatológico", "soteriológico", "ontológico", "epistemológico", "parenético", "ilativo", "forense", "fiduciario", "inmanente", "veterotestamentario", "neotestamentario". Si el tiempo verbal importa, dilo en lenguaje cotidiano (ej. "el verbo expresa una acción continua" o "indica una decisión definitiva").

2. "to_understand_better" (1 a 2 oraciones claras, aprox. 110 a 220 caracteres):
   - Explica de forma concreta y directa el trasfondo histórico, cultural, humano o bíblico que hace que el versículo cobre vida.
   - Si la nota previa contiene datos históricos valiosos (costumbres grecorromanas, leyes judías, geografía, citas del Antiguo Testamento, contexto de la iglesia), CONCÉNTRA Y RESCATA esa joya en palabras sencillas.
   - Si la nota previa es muy corta o pobre, enriquécela con contexto histórico o bíblico real y verificable del pasaje.
   - No repitas con otras palabras lo que el versículo en español ya dice de forma obvia: enseña algo que ayude de verdad a comprenderlo.`;

const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    notes: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          chapter: { type: 'integer' },
          verse: { type: 'integer' },
          in_original: { type: 'string' },
          to_understand_better: { type: 'string' },
        },
        required: ['chapter', 'verse', 'in_original', 'to_understand_better'],
      },
    },
  },
  required: ['notes'],
};

const FORBIDDEN_JARGON_RE =
  /\b(aoristo|genitivo|dativo|acusativo|nominativo|subjuntivo|optativo|participio|perifr[aá]stic\w*|hapax|h[aá]pax|anacoluto|pr[oó]tasis|ap[oó]dosis|escatol[oó]gic\w*|soteriol[oó]gic\w*|ontol[oó]gic\w*|epistemol[oó]gic\w*|paren[eé]tic\w*|ilativ\w*|fiduciari\w*|inmanent\w*|veterotestamentari\w*|neotestamentari\w*|deponente|ablativo|locativo|encl[ií]tic\w*)\b/i;

// Más de 3 palabras griegas seguidas = copió una cláusula entera
const LONG_GREEK_PHRASE_RE =
  /[\u0370-\u03FF\u1F00-\u1FFF]+\s+[\u0370-\u03FF\u1F00-\u1FFF]+\s+[\u0370-\u03FF\u1F00-\u1FFF]+\s+[\u0370-\u03FF\u1F00-\u1FFF]+/;

function validateItem(item: RewrittenNoteItem): string[] {
  const errs: string[] = [];
  const orig = (item.in_original || '').trim();
  const ctx = (item.to_understand_better || '').trim();
  const combined = `En el original: ${orig}\n\nPara entenderlo mejor: ${ctx}`;

  if (orig.length < 45 || orig.length > 260) {
    errs.push(`in_original longitud fuera de rango (${orig.length})`);
  }
  if (ctx.length < 55 || ctx.length > 310) {
    errs.push(`to_understand_better longitud fuera de rango (${ctx.length})`);
  }
  if (combined.length > 560) {
    errs.push(`nota combinada demasiado larga (${combined.length})`);
  }
  const jargonMatch = combined.match(FORBIDDEN_JARGON_RE);
  if (jargonMatch) {
    errs.push(`jerga prohibida detectada: "${jargonMatch[0]}"`);
  }
  if (LONG_GREEK_PHRASE_RE.test(combined)) {
    errs.push('contiene frase griega de 4+ palabras seguidas');
  }
  if (!/[\u0370-\u03FF\u1F00-\u1FFF]/.test(orig)) {
    errs.push('in_original debe incluir 1 palabra o expresión breve en griego junto con su transliteración');
  }
  if (!/\([a-zA-ZáéíóúÁÉÍÓÚāēīōū\s'\-]+,\s*[\u0370-\u03FF\u1F00-\u1FFF\s'’ʼ]+\)/.test(orig)) {
    errs.push('in_original debe usar el formato exacto (transliteración, griego)');
  }
  if (/(?:[a-zA-ZáéíóúÁÉÍÓÚ]+[\u0370-\u03FF\u1F00-\u1FFF]+|[\u0370-\u03FF\u1F00-\u1FFF]+[a-zA-ZáéíóúÁÉÍÓÚ]+)/.test(combined)) {
    errs.push('palabra corrupta mezclando letras griegas y latinas');
  }
  if (/\bvosotros\b|\bvuestro\b|\bvuestra\b/i.test(combined)) {
    errs.push('contiene español ibérico (vosotros/vuestro)');
  }
  return errs;
}

function cleanField(text: string, prefixRe: RegExp): string {
  return text.replace(prefixRe, '').replace(/\s+/g, ' ').trim();
}

async function rewriteBatch(batch: DbVerse[], feedback = ''): Promise<RewrittenNoteItem[]> {
  const payload = batch.map((v) => ({
    chapter: v.chapter,
    verse: v.verse,
    greek_text: v.greek_text,
    translation_tdo: v.translation,
    previous_note: v.translation_notes || '',
  }));

  const prompt =
    `Reescribe las notas de estudio de estos ${batch.length} versículos de ${batch[0].book} siguiendo estrictamente todas las reglas pedagógicas.\n` +
    (feedback ? `\nCORRECCIÓN OBLIGATORIA DEL INTENTO ANTERIOR:\n${feedback}\n` : '') +
    `\nVersículos de entrada:\n${JSON.stringify(payload, null, 2)}`;

  let lastErr: any = null;
  for (const model of MODELS) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const interaction = await client.interactions.create({
          model,
          store: false,
          system_instruction: SYSTEM_INSTRUCTION,
          response_format: RESPONSE_SCHEMA,
          input: prompt,
        });

        const rawText = interaction.output_text;
        if (!rawText) throw new Error('output_text vacío');
        const parsed = JSON.parse(rawText) as BatchResponse;
        if (!parsed.notes || parsed.notes.length !== batch.length) {
          throw new Error(`Conteo devuelto ${parsed.notes?.length} != esperado ${batch.length}`);
        }
        return parsed.notes;
      } catch (err: any) {
        lastErr = err;
        const msg = err?.message || String(err);
        if (msg.includes('503') || msg.includes('429') || msg.includes('high demand') || msg.includes('RESOURCE_EXHAUSTED')) {
          console.warn(`   ⚠️ ${model} ocupado/rate-limit (intento ${attempt}/3): ${msg.slice(0, 90)}`);
          await new Promise((r) => setTimeout(r, 3500 * attempt));
          continue;
        }
        console.warn(`   ⚠️ Error en ${model} (intento ${attempt}/3): ${msg.slice(0, 110)}`);
        await new Promise((r) => setTimeout(r, 2000));
      }
    }
  }
  throw lastErr || new Error('Fallaron todos los modelos');
}

async function main() {
  const args = process.argv.slice(2);
  const book = (args.find((a) => !a.startsWith('-')) || 'GAL').toUpperCase();
  const dryRun = args.includes('--dry-run');

  console.log(`\n📘 Reescritura pedagógica de notas del original · Libro: ${book} ${dryRun ? '(DRY RUN)' : ''}`);

  const { data, error } = await supabase
    .from('verses')
    .select('id, book, chapter, verse, greek_text, translation, translation_notes')
    .eq('book', book)
    .order('chapter', { ascending: true })
    .order('verse', { ascending: true });

  if (error || !data || data.length === 0) {
    throw new Error(`Error cargando ${book}: ${error?.message || '0 filas'}`);
  }

  const verses = data as DbVerse[];
  console.log(`📊 Versículos cargados desde Supabase: ${verses.length}`);

  // Respaldo inmutable inicial (nunca sobrescribe si ya existe)
  const backupDir = path.resolve(process.cwd(), 'data', 'backups');
  fs.mkdirSync(backupDir, { recursive: true });
  const backupFile = path.join(backupDir, `${book}_notes_backup.json`);
  if (!fs.existsSync(backupFile)) {
    fs.writeFileSync(backupFile, JSON.stringify(verses, null, 2), 'utf-8');
    console.log(`🛡️ Respaldo original creado: ${backupFile}`);
  } else {
    console.log(`🛡️ Respaldo original existente preservado: ${backupFile}`);
  }

  const BATCH_SIZE = 15;
  const results: Array<DbVerse & { new_notes: string }> = [];

  for (let i = 0; i < verses.length; i += BATCH_SIZE) {
    const batch = verses.slice(i, i + BATCH_SIZE);
    const label = `${book} ${batch[0].chapter}:${batch[0].verse}–${batch[batch.length - 1].chapter}:${batch[batch.length - 1].verse}`;
    console.log(`🔹 Procesando lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(verses.length / BATCH_SIZE)} (${label})...`);

    let feedback = '';
    let accepted: RewrittenNoteItem[] | null = null;

    for (let vAttempt = 1; vAttempt <= 4; vAttempt++) {
      const candidate = await rewriteBatch(batch, feedback);
      const batchErrors: string[] = [];

      for (const src of batch) {
        const found = candidate.find((c) => c.chapter === src.chapter && c.verse === src.verse);
        if (!found) {
          batchErrors.push(`Falta ${src.chapter}:${src.verse}`);
          continue;
        }
        found.in_original = cleanField(found.in_original, /^En el original:\s*/i);
        found.to_understand_better = cleanField(found.to_understand_better, /^Para entenderlo mejor:\s*/i);
        const itemErrs = validateItem(found);
        if (itemErrs.length > 0) {
          batchErrors.push(`${src.chapter}:${src.verse} -> ${itemErrs.join('; ')}`);
        }
      }

      if (batchErrors.length === 0) {
        accepted = candidate;
        break;
      }

      console.warn(`   🔄 Re-ajustando lote por control de calidad (${batchErrors.length} detalles): ${batchErrors.slice(0, 3).join(' | ')}`);
      feedback = batchErrors.join('\n');
    }

    if (!accepted) {
      throw new Error(`El lote ${label} no superó el control de calidad estricto tras 4 intentos.`);
    }

    for (const src of batch) {
      const item = accepted.find((c) => c.chapter === src.chapter && c.verse === src.verse)!;
      const formatted = `En el original: ${item.in_original}\n\nPara entenderlo mejor: ${item.to_understand_better}`;
      results.push({ ...src, new_notes: formatted });
    }

    if (!dryRun) {
      await Promise.all(
        results.slice(i, i + batch.length).map(async (row) => {
          const { error: upErr } = await supabase
            .from('verses')
            .update({ translation_notes: row.new_notes })
            .eq('id', row.id);
          if (upErr) throw new Error(`Error actualizando ${row.book} ${row.chapter}:${row.verse}: ${upErr.message}`);
        })
      );
      console.log(`   ✅ Lote validado y actualizado en Supabase (${Math.min(i + BATCH_SIZE, verses.length)}/${verses.length})`);
    }
  }

  const outDir = path.resolve(process.cwd(), 'data', 'notes_rewritten');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${book}_notes.json`);
  fs.writeFileSync(
    outFile,
    JSON.stringify(
      results.map((r) => ({
        book: r.book,
        chapter: r.chapter,
        verse: r.verse,
        translation: r.translation,
        old_notes: r.translation_notes,
        new_notes: r.new_notes,
      })),
      null,
      2
    ),
    'utf-8'
  );

  console.log(`\n🎉 Completado ${book}: ${results.length}/${verses.length} notas validadas y guardadas en ${outFile}`);
}

main().catch((err) => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
