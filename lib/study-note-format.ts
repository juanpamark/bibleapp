export interface ParsedStudyNote {
  isStructured: boolean;
  originalPart: string | null;
  contextPart: string | null;
  plainBody: string;
  teaser: string;
}

const ORIGINAL_PREFIX_RE = /^En el original:\s*/i;
const CONTEXT_PREFIX_RE = /^Para entenderlo mejor:\s*/i;

export function parseStudyNote(raw?: string | null, teaserMaxLen = 82): ParsedStudyNote {
  if (!raw) {
    return {
      isStructured: false,
      originalPart: null,
      contextPart: null,
      plainBody: '',
      teaser: '',
    };
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      isStructured: false,
      originalPart: null,
      contextPart: null,
      plainBody: '',
      teaser: '',
    };
  }

  let originalPart: string | null = null;
  let contextPart: string | null = null;

  const blocks = trimmed
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    if (ORIGINAL_PREFIX_RE.test(block)) {
      originalPart = block.replace(ORIGINAL_PREFIX_RE, '').trim();
    } else if (CONTEXT_PREFIX_RE.test(block)) {
      contextPart = block.replace(CONTEXT_PREFIX_RE, '').trim();
    }
  }

  // Fallback si vino separado por un solo salto de línea
  if (!originalPart && !contextPart && /En el original:/i.test(trimmed)) {
    const match = trimmed.match(
      /En el original:\s*([\s\S]*?)(?:\n+\s*Para entenderlo mejor:\s*([\s\S]*))?$/i
    );
    if (match) {
      originalPart = match[1]?.trim() || null;
      contextPart = match[2]?.trim() || null;
    }
  }

  const isStructured = Boolean(originalPart || contextPart);
  const teaserSource = (originalPart || contextPart || trimmed).replace(/\s+/g, ' ').trim();
  const teaser =
    teaserSource.length <= teaserMaxLen
      ? teaserSource
      : `${teaserSource.slice(0, teaserMaxLen).trimEnd()}…`;

  return {
    isStructured,
    originalPart,
    contextPart,
    plainBody: trimmed,
    teaser,
  };
}
