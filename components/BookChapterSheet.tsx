'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, Search, ChevronDown, ChevronRight, BookOpen, Clock, ArrowUpDown } from 'lucide-react';
import { NT_BOOKS, OT_BOOKS, BookMeta, getBookMeta } from '@/lib/constants';
import { getRecentPassages, LastReadPosition } from '@/lib/storage';

interface BookChapterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentBookCode: string;
  currentChapter: number;
}

export default function BookChapterSheet({
  isOpen,
  onClose,
  currentBookCode,
  currentChapter,
}: BookChapterSheetProps) {
  const router = useRouter();
  const [testament, setTestament] = useState<'NT' | 'AT'>('NT');
  const [sortMode, setSortMode] = useState<'canonical' | 'alpha'>('canonical');
  const [search, setSearch] = useState('');
  const [expandedBook, setExpandedBook] = useState<string>(currentBookCode);
  const [recents, setRecents] = useState<LastReadPosition[]>([]);
  const activeBookRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setExpandedBook(currentBookCode.toUpperCase());
      setRecents(getRecentPassages());
      setSearch('');
      const meta = getBookMeta(currentBookCode);
      setTestament(meta?.testament === 'AT' ? 'AT' : 'NT');
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));

      setTimeout(() => {
        activeBookRowRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 80);
    } else {
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: true } }));
    }
  }, [isOpen, currentBookCode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const booksList = useMemo(() => {
    const source = testament === 'NT' ? NT_BOOKS : OT_BOOKS;
    const q = search.trim().toLowerCase();
    let list = q
      ? source.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.code.toLowerCase().includes(q) ||
            b.genre.toLowerCase().includes(q)
        )
      : [...source];

    if (sortMode === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    return list;
  }, [testament, sortMode, search]);

  if (!isOpen) return null;

  const navigateTo = (bookCode: string, chapter: number) => {
    onClose();
    router.push(`/lector/${bookCode}/${chapter}`);
  };

  const handleToggleBook = (b: BookMeta) => {
    setExpandedBook((prev) => (prev === b.code ? '' : b.code));
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Seleccionar libro y capítulo"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 h-[88dvh] sm:h-[82vh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden">
        {/* Drag handle móvil */}
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-4 pt-3 pb-3 border-b border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-on-surface">Libros</h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSortMode((m) => (m === 'canonical' ? 'alpha' : 'canonical'))}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface-variant transition-colors active:scale-95"
                title="Cambiar orden de libros"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>{sortMode === 'canonical' ? 'Orden bíblico' : 'A–Z'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar selector"
                className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Buscador rápido */}
          <div className="relative">
            <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar libro (ej. Juan, Romanos, Salmos...)"
              className="w-full pl-9 pr-8 py-2 rounded-full bg-surface-container text-sm text-on-surface placeholder:text-outline outline-none border border-transparent focus:border-primary/50 transition-colors"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                aria-label="Limpiar búsqueda"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pestañas Antiguo / Nuevo Testamento */}
          <div className="grid grid-cols-2 p-1 rounded-full bg-surface-container text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTestament('NT')}
              className={`py-1.5 rounded-full transition-all ${
                testament === 'NT'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Nuevo Testamento
            </button>
            <button
              type="button"
              onClick={() => setTestament('AT')}
              className={`py-1.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
                testament === 'AT'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Antiguo Testamento</span>
            </button>
          </div>
        </div>

        {/* Lista vertical estilo acordeón YouVersion */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {/* Recientes */}
          {!search && recents.length > 0 && testament === 'NT' && (
            <div className="px-1 pb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-on-surface-variant mb-2">
                <Clock className="w-3.5 h-3.5" />
                <span>Recientes</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                {recents.map((item) => {
                  const meta = getBookMeta(item.book);
                  if (!meta) return null;
                  return (
                    <button
                      key={`${item.book}-${item.chapter}`}
                      type="button"
                      onClick={() => navigateTo(item.book, item.chapter)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-medium text-on-surface transition-all active:scale-95"
                    >
                      {meta.name} {item.chapter === 0 ? '· Contexto' : item.chapter}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {testament === 'AT' && (
            <div className="mx-1 mb-2 px-3.5 py-2.5 rounded-2xl bg-surface-container-low text-xs text-on-surface-variant flex items-center justify-between">
              <span>Traducción directa del hebreo y arameo en preparación.</span>
              <span className="font-semibold text-primary">Próximamente</span>
            </div>
          )}

          {/* Lista 1 columna en orden canónico */}
          <div className="divide-y divide-outline-variant/25">
            {booksList.map((b) => {
              const isExpanded = expandedBook === b.code;
              const isCurrentBook = b.code === currentBookCode.toUpperCase();

              return (
                <div
                  key={b.code}
                  ref={isCurrentBook ? activeBookRowRef : null}
                  className="py-0.5"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleBook(b)}
                    aria-expanded={isExpanded}
                    className={`w-full flex items-center justify-between px-3 py-3.5 rounded-xl text-left transition-colors active:scale-[0.99] ${
                      isExpanded || isCurrentBook
                        ? 'bg-surface-container-low/80 text-on-surface'
                        : 'hover:bg-surface-container-low/50 text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`font-serif text-[15px] sm:text-base truncate ${
                          isCurrentBook ? 'font-bold text-primary' : 'font-semibold'
                        }`}
                      >
                        {b.name}
                      </span>
                      {b.testament === 'AT' && (
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                          Próximamente
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0 text-on-surface-variant">
                      <span className="text-xs">
                        {b.chapters} {b.chapters === 1 ? 'cap.' : 'caps.'}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-outline" />
                      )}
                    </div>
                  </button>

                  {/* Acordeón de Contexto (Cap. 0) + Capítulos */}
                  {isExpanded && (
                    <div className="px-3 pt-2 pb-4 space-y-2.5 animate-fade-in">
                      {b.testament !== 'AT' ? (
                        <>
                          {/* Capítulo 0: Contexto del libro */}
                          <button
                            type="button"
                            onClick={() => navigateTo(b.code, 0)}
                            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-left transition-all active:scale-[0.99] ${
                              isCurrentBook && currentChapter === 0
                                ? 'bg-primary text-on-primary border-primary font-semibold'
                                : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/40 text-on-surface'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <BookOpen
                                className={`w-4 h-4 ${
                                  isCurrentBook && currentChapter === 0 ? 'text-on-primary' : 'text-primary'
                                }`}
                              />
                              <div>
                                <span className="text-xs font-semibold block">
                                  Contexto del libro
                                </span>
                                <span
                                  className={`text-[11px] block ${
                                    isCurrentBook && currentChapter === 0
                                      ? 'text-on-primary/80'
                                      : 'text-on-surface-variant'
                                  }`}
                                >
                                  Autor, destinatarios y propósito antes del capítulo 1
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-75" />
                          </button>

                          {/* Grilla numérica de capítulos */}
                          <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                            {Array.from({ length: b.chapters }, (_, i) => i + 1).map((c) => {
                              const isCurrentChapter = isCurrentBook && c === currentChapter;
                              return (
                                <button
                                  key={c}
                                  type="button"
                                  onClick={() => navigateTo(b.code, c)}
                                  className={`h-11 rounded-xl flex items-center justify-center text-sm font-semibold transition-all active:scale-95 ${
                                    isCurrentChapter
                                      ? 'bg-primary text-on-primary shadow-xs font-bold'
                                      : b.isAvailable
                                      ? 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                                      : 'bg-surface-container-low/70 hover:bg-surface-container text-on-surface-variant'
                                  }`}
                                >
                                  {c}
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-on-surface-variant py-2 px-1">
                          Este libro del Antiguo Testamento se habilitará cuando iniciemos la traducción del texto hebreo y arameo.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {booksList.length === 0 && (
              <div className="py-12 text-center text-sm text-on-surface-variant">
                No se encontraron libros para «{search}».
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
