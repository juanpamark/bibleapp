import type { ReadingTheme } from './storage';

export type HighlightColorId =
  | 'amber'
  | 'orange'
  | 'crimson'
  | 'rose'
  | 'violet'
  | 'indigo'
  | 'sky'
  | 'teal'
  | 'emerald'
  | 'slate';

export interface HighlightColorSpec {
  id: HighlightColorId;
  name: string;
  purpose: string;
  swatch: string;
  swatchDark: string;
  lightBg: string;
  darkBg: string;
  lightAccent: string;
  darkAccent: string;
}

export const EDITORIAL_HIGHLIGHTS: HighlightColorSpec[] = [
  {
    id: 'amber',
    name: 'Ámbar',
    purpose: 'Promesas',
    swatch: '#EAB308',
    swatchDark: '#FACC15',
    lightBg: 'rgba(253, 224, 71, 0.44)',
    darkBg: 'rgba(234, 179, 8, 0.22)',
    lightAccent: 'rgba(202, 138, 4, 0.55)',
    darkAccent: 'rgba(250, 204, 21, 0.55)',
  },
  {
    id: 'orange',
    name: 'Durazno',
    purpose: 'Aplicación',
    swatch: '#F97316',
    swatchDark: '#FB923C',
    lightBg: 'rgba(253, 186, 116, 0.42)',
    darkBg: 'rgba(249, 115, 22, 0.22)',
    lightAccent: 'rgba(234, 88, 12, 0.50)',
    darkAccent: 'rgba(251, 146, 60, 0.55)',
  },
  {
    id: 'crimson',
    name: 'Carmesí',
    purpose: 'Advertencias',
    swatch: '#EF4444',
    swatchDark: '#F87171',
    lightBg: 'rgba(252, 165, 165, 0.40)',
    darkBg: 'rgba(239, 68, 68, 0.22)',
    lightAccent: 'rgba(220, 38, 38, 0.50)',
    darkAccent: 'rgba(248, 113, 113, 0.55)',
  },
  {
    id: 'rose',
    name: 'Rosa',
    purpose: 'Gracia y amor',
    swatch: '#EC4899',
    swatchDark: '#F472B6',
    lightBg: 'rgba(249, 168, 212, 0.40)',
    darkBg: 'rgba(236, 72, 153, 0.22)',
    lightAccent: 'rgba(219, 39, 119, 0.48)',
    darkAccent: 'rgba(244, 114, 182, 0.55)',
  },
  {
    id: 'violet',
    name: 'Lavanda',
    purpose: 'Oración',
    swatch: '#A855F7',
    swatchDark: '#C084FC',
    lightBg: 'rgba(216, 180, 254, 0.42)',
    darkBg: 'rgba(168, 85, 247, 0.23)',
    lightAccent: 'rgba(147, 51, 234, 0.48)',
    darkAccent: 'rgba(192, 132, 252, 0.55)',
  },
  {
    id: 'indigo',
    name: 'Índigo',
    purpose: 'Doctrina',
    swatch: '#6366F1',
    swatchDark: '#818CF8',
    lightBg: 'rgba(165, 180, 252, 0.42)',
    darkBg: 'rgba(99, 102, 241, 0.24)',
    lightAccent: 'rgba(79, 70, 229, 0.50)',
    darkAccent: 'rgba(129, 140, 248, 0.55)',
  },
  {
    id: 'sky',
    name: 'Cielo',
    purpose: 'Reino y fe',
    swatch: '#0EA5E9',
    swatchDark: '#38BDF8',
    lightBg: 'rgba(125, 211, 252, 0.40)',
    darkBg: 'rgba(14, 165, 233, 0.22)',
    lightAccent: 'rgba(2, 132, 199, 0.50)',
    darkAccent: 'rgba(56, 189, 248, 0.55)',
  },
  {
    id: 'teal',
    name: 'Turquesa',
    purpose: 'Griego',
    swatch: '#14B8A6',
    swatchDark: '#2DD4BF',
    lightBg: 'rgba(94, 234, 212, 0.38)',
    darkBg: 'rgba(20, 184, 166, 0.22)',
    lightAccent: 'rgba(13, 148, 136, 0.50)',
    darkAccent: 'rgba(45, 212, 191, 0.55)',
  },
  {
    id: 'emerald',
    name: 'Salvia',
    purpose: 'Vida nueva',
    swatch: '#22C55E',
    swatchDark: '#4ADE80',
    lightBg: 'rgba(134, 239, 172, 0.40)',
    darkBg: 'rgba(34, 197, 94, 0.21)',
    lightAccent: 'rgba(22, 163, 74, 0.50)',
    darkAccent: 'rgba(74, 222, 128, 0.55)',
  },
  {
    id: 'slate',
    name: 'Pizarra',
    purpose: 'Estructura',
    swatch: '#64748B',
    swatchDark: '#94A3B8',
    lightBg: 'rgba(203, 213, 225, 0.52)',
    darkBg: 'rgba(148, 163, 184, 0.21)',
    lightAccent: 'rgba(100, 116, 139, 0.55)',
    darkAccent: 'rgba(148, 163, 184, 0.55)',
  },
];

const LEGACY_HEX_TO_ID: Record<string, HighlightColorId> = {
  '#FDE68A': 'amber',
  '#FDE2B8': 'amber',
  '#FED7AA': 'orange',
  '#FECDD3': 'rose',
  '#E9D5FF': 'violet',
  '#C7D2FE': 'indigo',
  '#BAE6FD': 'sky',
  '#99F6E4': 'teal',
  '#BBF7D0': 'emerald',
};

export function resolveHighlightSpec(colorValue?: string | null): HighlightColorSpec | undefined {
  if (!colorValue) return undefined;
  const trimmed = colorValue.trim();
  const byId = EDITORIAL_HIGHLIGHTS.find((c) => c.id === trimmed.toLowerCase());
  if (byId) return byId;

  const upper = trimmed.toUpperCase();
  const mappedId = LEGACY_HEX_TO_ID[upper];
  if (mappedId) {
    return EDITORIAL_HIGHLIGHTS.find((c) => c.id === mappedId);
  }

  const bySwatch = EDITORIAL_HIGHLIGHTS.find(
    (c) => c.swatch.toUpperCase() === upper || c.swatchDark.toUpperCase() === upper
  );
  return bySwatch;
}

export function normalizeHighlightColor(colorValue: string): string {
  return resolveHighlightSpec(colorValue)?.id || colorValue;
}

export function getHighlightBackground(
  colorValue: string | undefined,
  theme: ReadingTheme
): string | undefined {
  if (!colorValue) return undefined;
  const spec = resolveHighlightSpec(colorValue);
  if (spec) {
    return theme === 'dark' ? spec.darkBg : spec.lightBg;
  }
  return theme === 'dark' ? `${colorValue}30` : `${colorValue}55`;
}

export function getHighlightAccent(
  colorValue: string | undefined,
  theme: ReadingTheme
): string | undefined {
  if (!colorValue) return undefined;
  const spec = resolveHighlightSpec(colorValue);
  if (spec) {
    return theme === 'dark' ? spec.darkAccent : spec.lightAccent;
  }
  return colorValue;
}

export function getHighlightSwatch(
  colorValue: string | undefined,
  theme: ReadingTheme = 'light'
): string {
  if (!colorValue) return '#EAB308';
  const spec = resolveHighlightSpec(colorValue);
  if (spec) {
    return theme === 'dark' ? spec.swatchDark : spec.swatch;
  }
  return colorValue;
}
