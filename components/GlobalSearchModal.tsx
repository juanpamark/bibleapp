'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  Check,
  Search,
  X,
  SlidersHorizontal,
  BookOpen,
  Compass,
  Edit3,
  Bookmark,
  Highlighter,
  ChevronRight,
} from 'lucide-react';
import { supabase, VerseRecord, UserNote } from '@/lib/supabase';
import { NT_BOOKS, AVAILABLE_BOOKS, getBookMeta } from '@/lib/constants';
import { NT_BOOK_INTROS } from '@/lib/book-intros';
import { STUDY_PLANS, BIBLICAL_THEMES } from '@/lib/study-catalog';
import { getNotes, getAllHighlights, getBookmarkItems, VerseHighlight, BookmarkMetaItem } from '@/lib/storage';

type SearchTab = 'todos' | 'biblia' | 'estudio' | 'notas';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  contextBookCode?: string;
  initialQuery?: string;
}

const BOOK_ALIASES: Record<string, string> = {
  mateo: 'MAT',
  mt: 'MAT',
  marcos: 'MRK',
  mc: 'MRK',
  mr: 'MRK',
  lucas: 'LUK',
  lc: 'LUK',
  juan: 'JHN',
  jn: 'JHN',
  hechos: 'ACT',
  hch: 'ACT',
  romanos: 'ROM',
  rom: 'ROM',
  rm: 'ROM',
  '1 corintios': '1CO',
  '1co': '1CO',
  '2 corintios': '2CO',
  '2co': '2CO',
  galatas: 'GAL',
  gal: 'GAL',
  efesios: 'EPH',
  ef: 'EPH',
  filipenses: 'PHP',
  fil: 'PHP',
  flp: 'PHP',
  colosenses: 'COL',
  col: 'COL',
  '1 tesalonicenses': '1TH',
  '2 tesalonicenses': '2TH',
  '1 timoteo': '1TI',
  '2 timoteo': '2TI',
  tito: 'TIT',
  filemon: 'PHM',
  hebreos: 'HEB',
  heb: 'HEB',
  santiago: 'JAS',
  stg: 'JAS',
  '1 pedro': '1PE',
  '1p': '1PE',
  '2 pedro': '2PE',
  '2p': '2PE',
  '1 juan': '1JN',
  '1jn': '1JN',
  '2 juan': '2JN',
  '2jn': '2JN',
  '3 juan': '3JN',
  '3jn': '3JN',
  judas: 'JUD',
  apocalipsis: 'REV',
  ap: 'REV',
};

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function parseScriptureRef(rawQuery: string): { book: string; chapter: number; verse?: number } | null {
  const norm = normalizeText(rawQuery);
  const match = norm.match(/^([1-3]?\s*[a-záéíóú]+)\s+(\d+)(?:[:\s](\d+))?$/i);
  if (!match) return null;

  const rawBook = match[1].replace(/\s+/g, ' ').trim();
  const chapter = parseInt(match[2], 10);
  const verse = match[3] ? parseInt(match[3], 10) : undefined;

  const matchedCode =
    BOOK_ALIASES[rawBook] ||
    NT_BOOKS.find((b) => normalizeText(b.name).startsWith(rawBook))?.code;

  if (!matchedCode) return null;
  const meta = getBookMeta(matchedCode);
  if (!meta) return null;
  const safeChapter = Math.min(Math.max(0, chapter), meta.chapters);
  return { book: matchedCode, chapter: safeChapter, verse };
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  contextBookCode,
  initialQuery = '',
}: GlobalSearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>('todos');
  const [bookFilter, setBookFilter] = useState<string>('ALL');
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const [verseResults, setVerseResults] = useState<VerseRecord[]>([]);
  const [searchingVerses, setSearchingVerses] = useState(false);
  const [localNotes, setLocalNotes] = useState<UserNote[]>([]);
  const [localHighlights, setLocalHighlights] = useState<VerseHighlight[]>([]);
  const [localBookmarks, setLocalBookmarks] = useState<BookmarkMetaItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));
      getNotes().then(setLocalNotes);
      setLocalHighlights(getAllHighlights());
      setLocalBookmarks(getBookmarkItems());
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: true } }));
      setShowFilterMenu(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const parsedRef = useMemo(() => parseScriptureRef(query), [query]);

  // Búsqueda en Supabase sobre todos los libros (o filtrado)
  useEffect(() => {
    if (!isOpen) return;
    const trimmed = query.trim();

    if (trimmed.length < 2 && !parsedRef) {
      setVerseResults([]);
      setSearchingVerses(false);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setSearchingVerses(true);
      try {
        if (parsedRef) {
          let refQuery = supabase
            .from('verses')
            .select('*')
            .eq('book', parsedRef.book)
            .eq('chapter', parsedRef.chapter || 1)
            .order('verse', { ascending: true });
          if (parsedRef.verse) {
            refQuery = refQuery.eq('verse', parsedRef.verse);
          } else {
            refQuery = refQuery.limit(12);
          }
          const { data } = await refQuery;
          if (!cancelled) setVerseResults(data || []);
        } else {
          const safeTerm = trimmed
            .replace(/[^\p{L}\p{N}\s\-']/gu, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 80);

          if (safeTerm.length < 2) {
            if (!cancelled) setVerseResults([]);
            return;
          }

          let dbQuery = supabase
            .from('verses')
            .select('*')
            .or(`translation.ilike.%${safeTerm}%,translation_notes.ilike.%${safeTerm}%`)
            .limit(40);

          if (bookFilter !== 'ALL') {
            dbQuery = dbQuery.eq('book', bookFilter);
          }

          const { data } = await dbQuery;
          if (!cancelled) setVerseResults(data || []);
        }
      } catch (err) {
        console.error('Error en búsqueda global:', err);
      } finally {
        if (!cancelled) setSearchingVerses(false);
      }
    }, 240);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, bookFilter, isOpen, parsedRef]);

  // Coincidencias en Estudio (Planes + Temas + Contexto de los 27 libros)
  const studyMatches = useMemo(() => {
    const q = normalizeText(query);
    if (q.length < 2) return { plans: [], intros: [], themes: [] };

    const plans = STUDY_PLANS.filter(
      (p) =>
        normalizeText(p.title).includes(q) ||
        normalizeText(p.subtitle).includes(q) ||
        normalizeText(p.theme).includes(q)
    );

    const themes = BIBLICAL_THEMES.filter(
      (t) => normalizeText(t.name).includes(q) || normalizeText(t.desc).includes(q)
    );

    const intros = Object.values(NT_BOOK_INTROS).filter(
      (intro) =>
        normalizeText(intro.fullTitle).includes(q) ||
        normalizeText(intro.authorAndDate).includes(q) ||
        normalizeText(intro.audienceAndOccasion).includes(q) ||
        normalizeText(intro.centralTheme).includes(q)
    );

    return { plans, themes, intros };
  }, [query]);

  // Coincidencias en Notas, Resaltados y Guardados
  const notesMatches = useMemo(() => {
    const q = normalizeText(query);
    if (q.length < 2) return { notes: [], highlights: [], bookmarks: [] };

    const notes = localNotes.filter((n) => {
      const bookName = getBookMeta(n.book)?.name || n.book;
      return (
        normalizeText(n.title).includes(q) ||
        normalizeText(n.content).includes(q) ||
        normalizeText(bookName).includes(q) ||
        (n.tags && n.tags.some((t) => normalizeText(t).includes(q)))
      );
    });

    const highlights = localHighlights.filter((h) => {
      const bookName = getBookMeta(h.book)?.name || h.book;
      return (
        normalizeText(bookName).includes(q) ||
        (h.text && normalizeText(h.text).includes(q))
      );
    });

    const bookmarks = localBookmarks.filter((b) => {
      const bookName = getBookMeta(b.book)?.name || b.book;
      return (
        normalizeText(bookName).includes(q) ||
        (b.text && normalizeText(b.text).includes(q))
      );
    });

    return { notes, highlights, bookmarks };
  }, [query, localNotes, localHighlights, localBookmarks]);

  const navigateTo = (href: string) => {
    onClose();
    router.push(href);
  };

  if (!isOpen) return null;

  const hasQuery = query.trim().length >= 2 || Boolean(parsedRef);
  const studyTotal =
    studyMatches.plans.length + studyMatches.themes.length + studyMatches.intros.length;
  const notesTotal =
    notesMatches.notes.length +
    notesMatches.highlights.length +
    notesMatches.bookmarks.length;

  const renderHighlightedText = (text: string, term: string) => {
    const clean = term.trim();
    if (!clean || parsedRef) return text;
    try {
      const escaped = clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
      return parts.map((part, idx) =>
        part.toLowerCase() === clean.toLowerCase() ? (
          <mark
            key={idx}
            className="bg-primary/20 text-on-surface font-semibold rounded-xs px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      );
    } catch {
      return text;
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Buscador global"
      className="fixed inset-0 z-50 bg-background text-on-surface flex flex-col animate-fade-in"
    >
      {/* Cabecera superior estilo captura YouVersion */}
      <div className="w-full max-w-2xl mx-auto px-4 pt-3 pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            aria-label="Volver"
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-on-surface active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Listo"
            className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-on-surface active:scale-95 transition-transform"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>

        {/* Input de búsqueda */}
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-4 pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            enterKeyHint="search"
            maxLength={80}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar versículos, temas, libros o notas..."
            className="w-full pl-11 pr-10 py-3 rounded-2xl bg-surface-container text-sm sm:text-[15px] text-on-surface placeholder:text-on-surface-variant outline-none border border-outline-variant/30 focus:border-primary/60 transition-colors"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              aria-label="Limpiar búsqueda"
              className="absolute right-3 w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Píldoras de filtro horizontal */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {(
            [
              { id: 'todos', label: 'Todos' },
              { id: 'biblia', label: 'Biblia' },
              { id: 'estudio', label: 'Estudio' },
              { id: 'notas', label: 'Notas' },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  active
                    ? 'bg-on-surface text-background shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 py-3 pb-16 space-y-6">
          {!hasQuery ? (
            /* Estado inicial con sugerencias rápidas */
            <div className="space-y-5 pt-2">
              <div className="space-y-2.5">
                <span className="text-xs font-semibold text-on-surface-variant block">
                  Búsquedas rápidas
                </span>
                <div className="flex flex-wrap gap-2">
                  {['Juan 3:16', 'amor', 'paz', 'espíritu', 'fe', 'Romanos 8'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => setQuery(term)}
                      className="px-3.5 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-colors active:scale-95"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant leading-relaxed">
                Puedes escribir una palabra clave (ej. <strong className="text-on-surface">gracia</strong>), una cita directa (ej. <strong className="text-on-surface">Juan 1:1</strong>), un autor o tema para buscar al instante en toda la aplicación.
              </div>
            </div>
          ) : (
            <>
              {/* Salto directo por cita bíblica */}
              {parsedRef && (activeTab === 'todos' || activeTab === 'biblia') && (
                <button
                  type="button"
                  onClick={() =>
                    navigateTo(
                      `/lector/${parsedRef.book}/${parsedRef.chapter}${
                        parsedRef.verse ? `#verse-${parsedRef.verse}` : ''
                      }`
                    )
                  }
                  className="w-full p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between text-left hover:border-primary/50 active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/12 text-primary flex items-center justify-center">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-primary block">
                        Ir al pasaje
                      </span>
                      <span className="font-serif text-base font-bold text-on-surface">
                        {getBookMeta(parsedRef.book)?.name} {parsedRef.chapter}
                        {parsedRef.verse ? `:${parsedRef.verse}` : ''}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant" />
                </button>
              )}

              {/* SECCIÓN 1: BIBLIA */}
              {(activeTab === 'todos' || activeTab === 'biblia') && (
                <section className="space-y-3">
                  <div className="flex items-center justify-between relative">
                    <h2 className="font-serif text-base font-bold text-on-surface">
                      Biblia {verseResults.length > 0 && `(${verseResults.length})`}
                    </h2>

                    <button
                      type="button"
                      onClick={() => setShowFilterMenu((s) => !s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        bookFilter !== 'ALL'
                          ? 'bg-primary/15 text-primary font-semibold'
                          : 'text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>
                        {bookFilter === 'ALL'
                          ? 'Filtro'
                          : getBookMeta(bookFilter)?.name || bookFilter}
                      </span>
                    </button>

                    {showFilterMenu && (
                      <div className="absolute right-0 top-9 z-30 w-56 liquid-glass-elevated rounded-2xl p-2 space-y-1 animate-fade-in">
                        <button
                          type="button"
                          onClick={() => {
                            setBookFilter('ALL');
                            setShowFilterMenu(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                            bookFilter === 'ALL'
                              ? 'bg-primary text-on-primary'
                              : 'hover:bg-on-surface/5'
                          }`}
                        >
                          Todos los libros disponibles
                        </button>
                        {contextBookCode && (
                          <button
                            type="button"
                            onClick={() => {
                              setBookFilter(contextBookCode);
                              setShowFilterMenu(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium ${
                              bookFilter === contextBookCode
                                ? 'bg-primary text-on-primary'
                                : 'hover:bg-on-surface/5'
                            }`}
                          >
                            Solo {getBookMeta(contextBookCode)?.name || contextBookCode}
                          </button>
                        )}
                        <div className="border-t border-outline-variant/30 my-1" />
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {AVAILABLE_BOOKS.map((b) => (
                            <button
                              key={b.code}
                              type="button"
                              onClick={() => {
                                setBookFilter(b.code);
                                setShowFilterMenu(false);
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs ${
                                bookFilter === b.code
                                  ? 'bg-primary/15 text-primary font-semibold'
                                  : 'hover:bg-on-surface/5 text-on-surface'
                              }`}
                            >
                              {b.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {searchingVerses ? (
                    <div className="space-y-3 py-2 animate-pulse">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-2 py-2">
                          <div className="h-4 bg-surface-container rounded w-28" />
                          <div className="h-3.5 bg-surface-container rounded w-full" />
                        </div>
                      ))}
                    </div>
                  ) : verseResults.length === 0 ? (
                    <p className="text-xs text-on-surface-variant py-2">
                      No se encontraron versículos con «{query}».
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {verseResults.map((v) => {
                        const name = getBookMeta(v.book)?.name || v.book;
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() =>
                              navigateTo(`/lector/${v.book}/${v.chapter}#verse-${v.verse}`)
                            }
                            className="w-full text-left block group active:opacity-80 transition-opacity"
                          >
                            <h3 className="text-sm sm:text-[15px] font-bold text-on-surface group-hover:text-primary transition-colors mb-1.5">
                              {name} {v.chapter}:{v.verse}
                            </h3>
                            <div className="border-l-2 border-outline-variant/70 pl-3.5 text-sm leading-relaxed text-on-surface/85 font-serif">
                              <sup className="font-sans text-[10px] font-bold text-on-surface-variant mr-1">
                                {v.verse}
                              </sup>
                              {renderHighlightedText(v.translation, query)}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}

              {/* SECCIÓN 2: ESTUDIO Y CONTEXTO */}
              {(activeTab === 'todos' || activeTab === 'estudio') && (
                <section className="space-y-3">
                  <h2 className="font-serif text-base font-bold text-on-surface">
                    Estudio y Contexto {studyTotal > 0 && `(${studyTotal})`}
                  </h2>

                  {studyTotal === 0 ? (
                    <p className="text-xs text-on-surface-variant">
                      No hay planes ni introducciones que coincidan con «{query}».
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {studyMatches.intros.map((intro) => (
                        <button
                          key={intro.book}
                          type="button"
                          onClick={() => navigateTo(`/lector/${intro.book}/0`)}
                          className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1 transition-all"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Contexto del libro</span>
                          </div>
                          <h3 className="font-serif text-sm font-bold text-on-surface">
                            {intro.fullTitle}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {intro.centralTheme}
                          </p>
                        </button>
                      ))}

                      {studyMatches.plans.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => navigateTo(p.route)}
                          className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1 transition-all"
                        >
                          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-secondary">
                            <Compass className="w-3.5 h-3.5" />
                            <span>Plan · {p.days} días</span>
                          </div>
                          <h3 className="font-serif text-sm font-bold text-on-surface">
                            {p.title}
                          </h3>
                          <p className="text-xs text-on-surface-variant line-clamp-2">
                            {p.subtitle}
                          </p>
                        </button>
                      ))}

                      {studyMatches.themes.map((t) => (
                        <button
                          key={t.name + t.code}
                          type="button"
                          onClick={() => navigateTo(`/lector/${t.code}/${t.chapter}`)}
                          className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1 transition-all"
                        >
                          <h3 className="font-serif text-sm font-bold text-on-surface">{t.name}</h3>
                          <p className="text-xs text-on-surface-variant">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* SECCIÓN 3: NOTAS, RESALTADOS Y GUARDADOS */}
              {(activeTab === 'todos' || activeTab === 'notas') && (
                <section className="space-y-3">
                  <h2 className="font-serif text-base font-bold text-on-surface">
                    Notas y Guardados {notesTotal > 0 && `(${notesTotal})`}
                  </h2>

                  {notesTotal === 0 ? (
                    <p className="text-xs text-on-surface-variant">
                      No hay notas ni pasajes guardados que coincidan con «{query}».
                    </p>
                  ) : (
                    <div className="space-y-2.5">
                      {notesMatches.notes.map((n) => {
                        const name = getBookMeta(n.book)?.name || n.book;
                        return (
                          <button
                            key={n.id}
                            type="button"
                            onClick={() => navigateTo(`/lector/${n.book}/${n.chapter}#verse-${n.verse}`)}
                            className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1.5 transition-all"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>
                                Nota · {name} {n.chapter}:{n.verse}
                              </span>
                            </div>
                            <h3 className="font-serif text-sm font-bold text-on-surface">{n.title}</h3>
                            <p className="text-xs text-on-surface-variant line-clamp-2">{n.content}</p>
                          </button>
                        );
                      })}

                      {notesMatches.highlights.map((h) => {
                        const name = getBookMeta(h.book)?.name || h.book;
                        return (
                          <button
                            key={`${h.book}-${h.chapter}-${h.verse}`}
                            type="button"
                            onClick={() => navigateTo(`/lector/${h.book}/${h.chapter}#verse-${h.verse}`)}
                            className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1 transition-all"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant">
                              <Highlighter className="w-3.5 h-3.5" />
                              <span>
                                Resaltado · {name} {h.chapter}:{h.verse}
                              </span>
                            </div>
                            {h.text && (
                              <p className="text-xs text-on-surface/85 border-l-2 pl-2.5 line-clamp-2" style={{ borderColor: h.color }}>
                                {h.text}
                              </p>
                            )}
                          </button>
                        );
                      })}

                      {notesMatches.bookmarks.map((b) => {
                        const name = getBookMeta(b.book)?.name || b.book;
                        return (
                          <button
                            key={`${b.book}-${b.chapter}-${b.verse}-bm`}
                            type="button"
                            onClick={() => navigateTo(`/lector/${b.book}/${b.chapter}#verse-${b.verse}`)}
                            className="w-full text-left p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 hover:border-primary/40 space-y-1 transition-all"
                          >
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
                              <Bookmark className="w-3.5 h-3.5 fill-primary" />
                              <span>
                                Guardado · {name} {b.chapter}:{b.verse}
                              </span>
                            </div>
                            {b.text && (
                              <p className="text-xs text-on-surface/85 line-clamp-2">{b.text}</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
