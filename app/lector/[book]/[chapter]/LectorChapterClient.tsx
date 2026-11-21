'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Edit3,
  Copy,
  Check,
  Share2,
  Search,
  X,
  Bookmark,
  Eraser,
  Languages,
} from 'lucide-react';
import { VerseRecord, UserNote } from '@/lib/supabase';
import { fetchChapterWithCache } from '@/lib/chapter-cache';
import { getBookMeta } from '@/lib/constants';
import { getBookIntro } from '@/lib/book-intros';
import {
  saveLastRead,
  getFontSize,
  setFontSize as persistFontSize,
  getReadingTheme,
  ReadingTheme,
  getShowNoteIndicators,
  getStudyMode,
  setStudyMode as persistStudyMode,
  getNotes,
  getHighlights,
  saveHighlight,
  removeHighlight,
  isBookmarked,
  toggleBookmark,
  recordDailyReading,
} from '@/lib/storage';
import {
  EDITORIAL_HIGHLIGHTS,
  getHighlightBackground,
  getHighlightAccent,
  resolveHighlightSpec,
} from '@/lib/highlights';
import ExegesisDrawer from '@/components/ExegesisDrawer';
import NoteModal from '@/components/NoteModal';
import TranslationModal from '@/components/TranslationModal';
import BookChapterSheet from '@/components/BookChapterSheet';
import GlobalSearchModal from '@/components/GlobalSearchModal';

interface LectorPageProps {
  params: {
    book: string;
    chapter: string;
  };
}

function getNoteTeaser(notes?: string | null, maxLen = 78): string | null {
  if (!notes) return null;
  const cleaned = notes.replace(/\s+/g, ' ').trim();
  if (!cleaned) return null;
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen).trimEnd()}…`;
}

function pickChapterGreekGem(verses: VerseRecord[]): VerseRecord | null {
  if (!verses || verses.length === 0) return null;
  let best: VerseRecord | null = null;
  let bestScore = -1;

  for (const v of verses) {
    const notes = v.translation_notes?.trim();
    if (!notes || notes.length < 25) continue;

    let score = 0;
    // Priorizar notas con escritura griega explícita
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(notes)) score += 60;
    // Términos propios de matices léxicos del original
    if (/(griego|original|literalmente|verbo|término|expresión|matiz|raíz)/i.test(notes)) {
      score += 25;
    }
    // Longitud informativa equilibrada (ni demasiado corta ni excesiva)
    if (notes.length >= 70 && notes.length <= 520) score += 20;
    else if (notes.length > 520) score += 10;

    if (score > bestScore) {
      bestScore = score;
      best = v;
    }
  }
  return best;
}

export default function LectorChapterPage({ params }: LectorPageProps) {
  const router = useRouter();
  const bookCode = (params.book || 'MAT').toUpperCase();
  const rawChapter = (params.chapter || '1').toLowerCase();
  const chapterNum = rawChapter === 'intro' ? 0 : Math.max(0, parseInt(rawChapter, 10) || 0);

  const [verses, setVerses] = useState<VerseRecord[]>([]);
  const [loading, setLoading] = useState(chapterNum > 0);
  const [selectedVerseNums, setSelectedVerseNums] = useState<number[]>([]);
  const [exegesisVerse, setExegesisVerse] = useState<VerseRecord | null>(null);
  const [isExegesisOpen, setIsExegesisOpen] = useState(false);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isTransModalOpen, setIsTransModalOpen] = useState(false);
  const [showBookSheet, setShowBookSheet] = useState(false);

  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [theme, setThemeState] = useState<ReadingTheme>('light');
  const [showNoteIndicators, setShowNoteIndicators] = useState(true);
  const [studyMode, setStudyModeState] = useState(false);
  const [showStudyToast, setShowStudyToast] = useState(false);
  const studyToastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showAppearanceMenu, setShowAppearanceMenu] = useState(false);

  const [chapterNotes, setChapterNotes] = useState<UserNote[]>([]);
  const [highlights, setHighlights] = useState<Record<number, string>>({});
  const [bookmarkTick, setBookmarkTick] = useState(0);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [chromeVisible, setChromeVisible] = useState(true);

  // 1:1 Swipe tracking state (capítulos horizontal + dock griego vertical)
  const [dragOffsetX, setDragOffsetX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dockDragY, setDockDragY] = useState(0);
  const [isDockDragging, setIsDockDragging] = useState(false);
  const dockSwipeRef = useRef<{ startY: number; startTime: number } | null>(null);
  const swipeRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    locked: 'none' | 'horizontal' | 'vertical';
  } | null>(null);

  const bookMeta = getBookMeta(bookCode) || {
    code: bookCode,
    name: bookCode,
    testament: 'NT' as const,
    genre: 'Epístolas Paulinas' as const,
    chapters: 28,
    isAvailable: true,
    theme: '',
    description: '',
  };

  const bookIntro = getBookIntro(bookCode);
  const canGoPrev = chapterNum > 0;
  const canGoNext = chapterNum < bookMeta.chapters;

  // Sincronizar con visibilidad de GlobalNav al scrollear
  useEffect(() => {
    const handleChrome = (e: CustomEvent<{ visible?: boolean }>) => {
      if (e?.detail?.visible !== undefined) {
        setChromeVisible(e.detail.visible);
      }
    };
    const handleTheme = (e: CustomEvent<{ theme?: ReadingTheme }>) => {
      if (e?.detail?.theme) setThemeState(e.detail.theme);
    };
    const handleSettings = () => {
      setShowNoteIndicators(getShowNoteIndicators());
      setFontSizeState(getFontSize());
      setThemeState(getReadingTheme());
      setStudyModeState(getStudyMode());
    };

    window.addEventListener('biblia-chrome-visibility', handleChrome as EventListener);
    window.addEventListener('biblia-theme-change', handleTheme as EventListener);
    window.addEventListener('biblia-settings-change', handleSettings as EventListener);
    return () => {
      window.removeEventListener('biblia-chrome-visibility', handleChrome as EventListener);
      window.removeEventListener('biblia-theme-change', handleTheme as EventListener);
      window.removeEventListener('biblia-settings-change', handleSettings as EventListener);
      if (studyToastTimerRef.current) {
        clearTimeout(studyToastTimerRef.current);
      }
    };
  }, []);

  const openExegesis = (v: VerseRecord) => {
    setExegesisVerse(v);
    setIsExegesisOpen(true);
  };

  const handleToggleStudyMode = () => {
    const next = !studyMode;
    setStudyModeState(next);
    persistStudyMode(next);

    if (studyToastTimerRef.current) {
      clearTimeout(studyToastTimerRef.current);
      studyToastTimerRef.current = null;
    }

    if (next) {
      setShowStudyToast(true);
      studyToastTimerRef.current = setTimeout(() => {
        setShowStudyToast(false);
        studyToastTimerRef.current = null;
      }, 2800);
    } else {
      setShowStudyToast(false);
    }
  };

  // Cargar capítulo o contexto
  useEffect(() => {
    setSelectedVerseNums([]);
    setShowAppearanceMenu(false);
    setChromeVisible(true);
    saveLastRead(bookCode, chapterNum);
    setFontSizeState(getFontSize());
    setThemeState(getReadingTheme());
    setShowNoteIndicators(getShowNoteIndicators());
    setStudyModeState(getStudyMode());

    if (chapterNum === 0) {
      setVerses([]);
      setLoading(false);
      setHighlights({});
      setChapterNotes([]);
      return;
    }

    setHighlights(getHighlights(bookCode, chapterNum));
    void recordDailyReading(bookCode, chapterNum);

    async function fetchChapter() {
      setLoading(true);
      try {
        const data = await fetchChapterWithCache(bookCode, chapterNum);
        setVerses(data);

        const allNotes = await getNotes();
        setChapterNotes(
          allNotes.filter((n) => n.book.toUpperCase() === bookCode && n.chapter === chapterNum)
        );
      } catch (err) {
        console.error('Error fetching verses:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchChapter();
  }, [bookCode, chapterNum]);

  // Deep link (?verse=N&note=1) desde Palabras del Original, Oración o Buscador
  useEffect(() => {
    if (loading || verses.length === 0 || typeof window === 'undefined') return;
    const sp = new URLSearchParams(window.location.search);
    const verseParam = sp.get('verse');
    const noteParam = sp.get('note');
    if (!verseParam) return;

    const targetNum = parseInt(verseParam, 10);
    if (!Number.isFinite(targetNum)) return;

    const targetVerse = verses.find((v) => v.verse === targetNum);
    if (!targetVerse) return;

    const raf = window.requestAnimationFrame(() => {
      const el = document.getElementById(`verse-${targetVerse.verse}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (noteParam === '1') {
        openExegesis(targetVerse);
      }
      // Limpiar query params para no reabrir al recargar
      window.history.replaceState({}, '', window.location.pathname);
    });

    return () => window.cancelAnimationFrame(raf);
  }, [loading, verses]);

  // Ocultar GlobalNav mientras hay versículos seleccionados
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent('biblia-toggle-nav', { detail: { visible: selectedVerseNums.length === 0 } })
    );
  }, [selectedVerseNums.length]);

  // ==========================================
  // SWIPE FÍSICO 1:1 ENTRE CAPÍTULOS (0 <-> 1 <-> N)
  // ==========================================
  const handleTouchStart = (e: React.TouchEvent) => {
    if (showBookSheet || isExegesisOpen || isNoteModalOpen || isTransModalOpen) return;
    const t = e.touches[0];
    swipeRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      startTime: performance.now(),
      locked: 'none',
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const state = swipeRef.current;
    if (!state) return;
    const t = e.touches[0];
    const dx = t.clientX - state.startX;
    const dy = t.clientY - state.startY;

    if (state.locked === 'none') {
      if (Math.abs(dx) < 12 && Math.abs(dy) < 12) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.35) {
        state.locked = 'horizontal';
        setIsDragging(true);
      } else {
        state.locked = 'vertical';
        return;
      }
    }

    if (state.locked === 'horizontal') {
      const goingPrev = dx > 0;
      const goingNext = dx < 0;
      const blocked = (goingPrev && !canGoPrev) || (goingNext && !canGoNext);

      if (blocked) {
        // Rubber-band resistance at chapter limits
        setDragOffsetX(dx * 0.22);
      } else {
        setDragOffsetX(Math.max(-140, Math.min(140, dx * 0.65)));
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const state = swipeRef.current;
    swipeRef.current = null;
    if (!state) return;

    const wasHorizontal = state.locked === 'horizontal';
    setIsDragging(false);

    if (!wasHorizontal) {
      setDragOffsetX(0);
      return;
    }

    const t = e.changedTouches[0];
    const dx = t.clientX - state.startX;
    const elapsed = Math.max(16, performance.now() - state.startTime);
    const velocity = Math.abs(dx) / elapsed; // px/ms

    const passedThreshold = Math.abs(dx) > 75 || (velocity > 0.45 && Math.abs(dx) > 36);

    setDragOffsetX(0);

    if (passedThreshold) {
      if (dx < 0 && canGoNext) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        router.push(`/lector/${bookCode}/${chapterNum + 1}`);
      } else if (dx > 0 && canGoPrev) {
        window.scrollTo({ top: 0, behavior: 'auto' });
        router.push(`/lector/${bookCode}/${chapterNum - 1}`);
      }
    }
  };

  // ==========================================
  // SELECCIÓN Y ACCIONES DE VERSÍCULOS
  // ==========================================
  const selectedVerses = useMemo(() => {
    const sortedNums = [...selectedVerseNums].sort((a, b) => a - b);
    return sortedNums
      .map((num) => verses.find((v) => v.verse === num))
      .filter((v): v is VerseRecord => Boolean(v));
  }, [selectedVerseNums, verses]);

  const primarySelectedVerse = selectedVerses.length === 1 ? selectedVerses[0] : null;

  const selectedRefLabel = useMemo(() => {
    if (selectedVerses.length === 0) return '';
    if (selectedVerses.length === 1) {
      return `${bookMeta.name} ${chapterNum}:${selectedVerses[0].verse}`;
    }
    const nums = selectedVerses.map((v) => v.verse);
    return `${bookMeta.name} ${chapterNum}:${nums[0]}–${nums[nums.length - 1]} (${nums.length})`;
  }, [selectedVerses, bookMeta.name, chapterNum]);

  const handleVerseClick = (v: VerseRecord) => {
    setSelectedVerseNums((prev) =>
      prev.includes(v.verse) ? prev.filter((n) => n !== v.verse) : [...prev, v.verse]
    );
  };

  const handleApplyColor = (color: string) => {
    if (selectedVerseNums.length === 0) return;
    selectedVerseNums.forEach((vNum) => {
      const vObj = verses.find((item) => item.verse === vNum);
      saveHighlight(bookCode, chapterNum, vNum, color, vObj?.translation);
    });
    setHighlights(getHighlights(bookCode, chapterNum));
    void recordDailyReading(bookCode, chapterNum);
    // Auto-cerrar el dock para seguir leyendo sin fricción
    setSelectedVerseNums([]);
    setDockDragY(0);
  };

  const handleRemoveColor = () => {
    if (selectedVerseNums.length === 0) return;
    selectedVerseNums.forEach((vNum) => removeHighlight(bookCode, chapterNum, vNum));
    setHighlights(getHighlights(bookCode, chapterNum));
    void recordDailyReading(bookCode, chapterNum);
    setSelectedVerseNums([]);
    setDockDragY(0);
  };

  const handleToggleBookmark = () => {
    if (selectedVerseNums.length === 0) return;
    selectedVerseNums.forEach((vNum) => {
      const vObj = verses.find((item) => item.verse === vNum);
      toggleBookmark(bookCode, chapterNum, vNum, vObj?.translation);
    });
    setBookmarkTick((t) => t + 1);
  };

  // Gesto 1:1 deslizar hacia arriba en el dock para leer el griego y sus notas (solo 1 versículo)
  const handleDockTouchStart = (e: React.TouchEvent) => {
    if (!primarySelectedVerse) return;
    e.stopPropagation();
    dockSwipeRef.current = {
      startY: e.touches[0].clientY,
      startTime: performance.now(),
    };
    setIsDockDragging(true);
  };

  const handleDockTouchMove = (e: React.TouchEvent) => {
    const state = dockSwipeRef.current;
    if (!state || !primarySelectedVerse) return;
    e.stopPropagation();
    const dy = e.touches[0].clientY - state.startY;
    if (dy < 0) {
      const clamped = dy < -60 ? -60 + (dy + 60) * 0.25 : dy;
      setDockDragY(clamped);
    } else {
      setDockDragY(0);
    }
  };

  const handleDockTouchEnd = (e: React.TouchEvent) => {
    const state = dockSwipeRef.current;
    if (!state) return;
    e.stopPropagation();
    const dy = e.changedTouches[0].clientY - state.startY;
    const elapsed = Math.max(1, performance.now() - state.startTime);
    const velocityUp = -dy / elapsed;

    dockSwipeRef.current = null;
    setIsDockDragging(false);
    setDockDragY(0);

    if (primarySelectedVerse && (dy <= -32 || (dy <= -16 && velocityUp > 0.35))) {
      openExegesis(primarySelectedVerse);
    }
  };

  const buildShareText = () => {
    if (selectedVerses.length === 0) return '';
    const joined = selectedVerses
      .map((v) => (selectedVerses.length > 1 ? `${v.verse} ${v.translation}` : v.translation))
      .join(' ');
    const ref =
      selectedVerses.length === 1
        ? `${bookMeta.name} ${chapterNum}:${selectedVerses[0].verse}`
        : `${bookMeta.name} ${chapterNum}:${selectedVerses[0].verse}-${selectedVerses[selectedVerses.length - 1].verse}`;
    return `«${joined}»\n— ${ref} (TDO)`;
  };

  const handleCopyVerse = async () => {
    const text = buildShareText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareVerse = async () => {
    const text = buildShareText();
    if (!text) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: selectedRefLabel,
          text,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyVerse();
    }
  };

  const fontSizes = {
    sm: 'text-[16px] leading-[1.85]',
    md: 'text-[18px] sm:text-[19px] leading-[1.95]',
    lg: 'text-[20px] sm:text-[22px] leading-[2.0]',
    xl: 'text-[23px] sm:text-[26px] leading-[2.05]',
  };

  const hasNote = (verseNumber: number) => chapterNotes.some((n) => n.verse === verseNumber);

  const chapterGreekGem = useMemo(() => pickChapterGreekGem(verses), [verses]);
  const dockNoteTeaser = useMemo(
    () => getNoteTeaser(primarySelectedVerse?.translation_notes),
    [primarySelectedVerse]
  );

  const anySelectedHasHighlight = selectedVerseNums.some((n) => Boolean(highlights[n]));
  const allSelectedBookmarked =
    selectedVerseNums.length > 0 &&
    bookmarkTick >= 0 &&
    selectedVerseNums.every((n) => isBookmarked(bookCode, chapterNum, n));

  return (
    <div
      className="min-h-screen flex flex-col justify-between touch-pan-y overflow-x-clip"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* ========================================================
          1. BARRA FLOTANTE LIQUID GLASS DEL LECTOR
      ======================================================== */}
      <div
        className={`sticky top-3 md:top-[72px] z-30 px-3 sm:px-4 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          chromeVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
        }`}
      >
        <div
          className={`max-w-2xl mx-auto flex flex-col gap-2 ${
            chromeVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <div className="liquid-glass rounded-full px-2 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2">
            {/* Píldoras estilo YouVersion: [ Libro Capítulo ] + [ TDO ] */}
            <div className="flex items-center gap-1 min-w-0">
              <button
                type="button"
                onClick={() => setShowBookSheet(true)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-on-surface/[0.06] hover:bg-on-surface/[0.1] text-on-surface transition-all active:scale-[0.97] min-w-0"
              >
                <span className="font-serif text-sm sm:text-[15px] font-bold tracking-tight truncate">
                  {bookMeta.name} {chapterNum === 0 ? '· Contexto' : chapterNum}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant flex-shrink-0" />
              </button>

              <button
                type="button"
                onClick={() => setIsTransModalOpen(true)}
                className="px-2 sm:px-2.5 py-1.5 rounded-full hover:bg-on-surface/[0.07] text-xs font-bold tracking-wide text-primary transition-all active:scale-[0.97] flex-shrink-0"
                title="Acerca de esta traducción"
              >
                TDO
              </button>
            </div>

            {/* Herramientas de lectura: Modo Estudio (interruptor directo), Buscar, Aa */}
            <div className="flex items-center gap-1 relative flex-shrink-0">
              {chapterNum >= 1 && (
                <button
                  type="button"
                  role="switch"
                  aria-checked={studyMode}
                  aria-label="Modo estudio: mostrar puntos de notas del griego"
                  title={
                    studyMode
                      ? 'Modo estudio activado (toca el punto dorado en los versículos)'
                      : 'Activar modo estudio para leer notas del griego en un toque'
                  }
                  onClick={handleToggleStudyMode}
                  className={`inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full border transition-all active:scale-95 ${
                    studyMode
                      ? 'bg-primary/10 border-primary/30 text-primary'
                      : 'bg-on-surface/[0.04] border-transparent text-on-surface-variant hover:bg-on-surface/[0.08]'
                  }`}
                >
                  <span className="text-[11px] font-semibold tracking-tight hidden min-[400px]:inline">
                    Estudio
                  </span>
                  <span
                    aria-hidden="true"
                    className={`relative inline-flex h-[18px] w-8 items-center rounded-full transition-colors duration-200 ${
                      studyMode ? 'bg-primary' : 'bg-on-surface/20'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 transform rounded-full shadow-xs transition-transform duration-200 ${
                        studyMode ? 'translate-x-[16px] bg-on-primary' : 'translate-x-[2px] bg-white'
                      }`}
                    />
                  </span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowSearch(true)}
                aria-label="Buscar en toda la aplicación"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all active:scale-95 text-on-surface-variant hover:bg-on-surface/[0.07]"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowAppearanceMenu((m) => !m)}
                aria-label="Tamaño de letra"
                className={`relative z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-serif font-bold transition-all active:scale-95 ${
                  showAppearanceMenu
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-on-surface/[0.07]'
                }`}
              >
                Aa
              </button>

              {/* Menú Tamaño de letra (Claro/Oscuro ahora vive en Perfil -> Configuración) */}
              {showAppearanceMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    aria-hidden="true"
                    onClick={() => setShowAppearanceMenu(false)}
                  />
                  <div className="absolute right-0 top-12 z-40 w-56 liquid-glass-elevated rounded-3xl p-4 space-y-2.5 animate-fade-in origin-top-right">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">
                      Tamaño de letra
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(['sm', 'md', 'lg', 'xl'] as const).map((s, idx) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setFontSizeState(s);
                            persistFontSize(s);
                          }}
                          className={`py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                            fontSize === s
                              ? 'bg-primary text-on-primary shadow-xs'
                              : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {idx === 0 && 'S'}
                          {idx === 1 && 'M'}
                          {idx === 2 && 'L'}
                          {idx === 3 && 'XL'}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast sutil centrado al activar Modo Estudio */}
      {showStudyToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 flex justify-center pointer-events-none"
        >
          <div className="liquid-glass-elevated rounded-3xl px-5 py-3.5 max-w-xs sm:max-w-sm text-center animate-fade-in space-y-1">
            <div className="inline-flex items-center justify-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: 'var(--color-study-dot)',
                  boxShadow: '0 0 0 3px var(--color-study-dot-ring)',
                }}
                aria-hidden="true"
              />
              <span className="text-xs sm:text-sm font-semibold text-on-surface">
                Modo estudio activado
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
              Toca el punto dorado junto a un versículo para entender más desde el original.
            </p>
          </div>
        </div>
      )}

      {/* Indicador visual al deslizar entre capítulos */}
      {isDragging && Math.abs(dragOffsetX) > 20 && (
        <div
          className={`fixed top-1/2 -translate-y-1/2 z-40 pointer-events-none liquid-glass-elevated px-3.5 py-2 rounded-full text-xs font-semibold text-on-surface flex items-center gap-1.5 ${
            dragOffsetX > 0 ? 'left-3' : 'right-3'
          }`}
        >
          {dragOffsetX > 0 ? (
            canGoPrev ? (
              <>
                <ChevronLeft className="w-4 h-4 text-primary" />
                <span>{chapterNum - 1 === 0 ? 'Contexto' : `Cap. ${chapterNum - 1}`}</span>
              </>
            ) : (
              <span className="text-on-surface-variant">Inicio del libro</span>
            )
          ) : canGoNext ? (
            <>
              <span>Cap. {chapterNum + 1}</span>
              <ChevronRight className="w-4 h-4 text-primary" />
            </>
          ) : (
            <span className="text-on-surface-variant">Fin del libro</span>
          )}
        </div>
      )}

      {/* ========================================================
          2. LIENZO DE LECTURA (CAPÍTULO 0 CONTEXTO O CAPÍTULO N)
      ======================================================== */}
      <main
        className="flex-1 w-full max-w-[65ch] mx-auto px-5 sm:px-8 pt-7 sm:pt-10 pb-36 select-text"
        style={{
          transform: dragOffsetX !== 0 ? `translateX(${dragOffsetX}px)` : undefined,
          transition: isDragging ? 'none' : 'transform 260ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        {chapterNum === 0 ? (
          /* CAPÍTULO 0: CONTEXTO DEL LIBRO */
          <article className="space-y-8 animate-fade-in">
            <header className="text-center space-y-2 pb-4 border-b border-outline-variant/30">
              <span className="text-xs font-semibold uppercase tracking-widest text-primary block">
                Contexto del libro
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">
                {bookIntro?.fullTitle || bookMeta.name}
              </h1>
              <p className="text-sm text-on-surface-variant">
                {bookIntro?.categoryLabel || `${bookMeta.genre} · ${bookMeta.chapters} capítulos`}
              </p>
            </header>

            {bookIntro ? (
              <div className="space-y-7 text-[16px] sm:text-[17px] leading-[1.85] text-on-surface/95">
                <section className="space-y-2">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    Quién lo escribió y cuándo
                  </h2>
                  <p className="font-serif text-on-surface/90">{bookIntro.authorAndDate}</p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-lg font-bold text-primary">
                    A quién iba dirigido y por qué se escribió
                  </h2>
                  <p className="font-serif text-on-surface/90">{bookIntro.audienceAndOccasion}</p>
                </section>

                <section className="space-y-2">
                  <h2 className="font-serif text-lg font-bold text-primary">Idea central</h2>
                  <p className="font-serif text-on-surface/90">{bookIntro.centralTheme}</p>
                </section>

                <section className="p-5 rounded-3xl bg-surface-container-low space-y-3">
                  <h2 className="font-serif text-base font-bold text-on-surface">
                    Claves para aprovechar la lectura
                  </h2>
                  <ul className="space-y-2.5 text-sm sm:text-[15px] leading-relaxed text-on-surface-variant">
                    {bookIntro.readingKeys.map((key, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span>{key}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant leading-relaxed">
                {bookMeta.description}
              </p>
            )}

            <div className="pt-4 flex items-center justify-between gap-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setShowBookSheet(true)}
                className="px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs sm:text-sm font-semibold text-on-surface transition-all active:scale-95"
              >
                Ver otros libros
              </button>

              <Link
                href={`/lector/${bookCode}/1`}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs sm:text-sm font-semibold shadow-sm active:scale-95 transition-all"
              >
                <span>Comenzar capítulo 1</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </article>
        ) : (
          /* CAPÍTULOS DE LECTURA (1..N) */
          <>
            <div className="text-center mb-9 space-y-1.5">
              <h1 className="font-serif text-3xl sm:text-4xl text-on-surface font-bold tracking-tight">
                {bookMeta.name} {chapterNum}
              </h1>
              {bookMeta.theme && (
                <p className="font-serif text-sm italic text-on-surface-variant">
                  {bookMeta.theme}
                </p>
              )}
              {chapterNum === 1 && bookIntro && (
                <div className="pt-1">
                  <Link
                    href={`/lector/${bookCode}/0`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Leer contexto del libro</span>
                  </Link>
                </div>
              )}
            </div>

            {loading ? (
              <div className="space-y-4 py-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 bg-outline-variant/25 rounded-md w-full" />
                    <div className="h-4 bg-outline-variant/25 rounded-md w-4/5" />
                  </div>
                ))}
              </div>
            ) : verses.length === 0 ? (
              <div className="py-14 px-6 text-center rounded-3xl bg-surface-container-low space-y-4">
                <BookOpen className="w-8 h-8 text-primary mx-auto" />
                <div className="space-y-1">
                  <h2 className="font-serif text-lg font-bold text-on-surface">
                    {bookMeta.name} aún está en preparación
                  </h2>
                  <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                    Mientras terminamos su traducción directa de los textos originales, ya puedes leer su contexto histórico o abrir otro libro.
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <Link
                    href={`/lector/${bookCode}/0`}
                    className="px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold active:scale-95 transition-all"
                  >
                    Leer contexto del libro
                  </Link>
                  <button
                    type="button"
                    onClick={() => setShowBookSheet(true)}
                    className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold active:scale-95 transition-all"
                  >
                    Elegir otro libro
                  </button>
                </div>
              </div>
            ) : (
              <article className={`font-serif ${fontSizes[fontSize]} text-on-surface space-y-3`}>
                {verses.map((v) => {
                  const isSelected = selectedVerseNums.includes(v.verse);
                  const verseHasNote = hasNote(v.verse);
                  const highlightColor = highlights[v.verse];
                  const hlBg = getHighlightBackground(highlightColor, theme);
                  const hlAccent = getHighlightAccent(highlightColor, theme);

                  return (
                    <div
                      key={v.id}
                      id={`verse-${v.verse}`}
                      onClick={() => handleVerseClick(v)}
                      className={`group relative rounded-xl px-3 py-1.5 -mx-3 transition-colors duration-150 cursor-pointer ${
                        isSelected
                          ? 'bg-primary/[0.09]'
                          : 'hover:bg-on-surface/[0.03]'
                      }`}
                      style={{
                        backgroundColor: hlBg,
                        boxShadow: hlAccent ? `inset 3px 0 0 0 ${hlAccent}` : undefined,
                      }}
                    >
                      <p>
                        <sup className="font-sans text-[11px] sm:text-xs text-primary font-bold mr-1.5 select-none inline-flex items-center gap-0.5 align-baseline">
                          <span>{v.verse}</span>
                          {verseHasNote && showNoteIndicators && (
                            <Edit3
                              aria-label="Tiene nota personal"
                              className="w-2.5 h-2.5 text-secondary inline"
                            />
                          )}
                        </sup>

                        <span
                          className={
                            isSelected
                              ? 'underline decoration-dotted decoration-primary/70 decoration-2 underline-offset-4'
                              : ''
                          }
                        >
                          {v.translation}
                        </span>

                        {studyMode &&
                          v.translation_notes &&
                          v.translation_notes.trim().length > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openExegesis(v);
                              }}
                              aria-label={`Leer nota del original de ${bookMeta.name} ${chapterNum}:${v.verse}`}
                              title="Nota del griego original"
                              className="inline-flex items-center justify-center align-middle ml-1 p-2 -m-1.5 rounded-full hover:bg-primary/10 active:scale-90 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            >
                              <span
                                className="w-[7px] h-[7px] rounded-full block"
                                style={{
                                  backgroundColor: 'var(--color-study-dot)',
                                  boxShadow: '0 0 0 3px var(--color-study-dot-ring)',
                                }}
                              />
                            </button>
                          )}
                      </p>
                    </div>
                  );
                })}
              </article>
            )}

            {/* Cápsula editorial: Joya del Griego al final del capítulo (Idea 4) */}
            {!loading && chapterGreekGem && (
              <section
                aria-label="Joya del griego en este capítulo"
                className="mt-10 rounded-3xl bg-surface-container-low border border-outline-variant/40 p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{
                        backgroundColor: 'var(--color-study-dot)',
                        boxShadow: '0 0 0 3px var(--color-study-dot-ring)',
                      }}
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                      Joya del griego en este capítulo
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    {bookMeta.name} {chapterNum}:{chapterGreekGem.verse}
                  </span>
                </div>

                {chapterGreekGem.greek_text && (
                  <p className="font-serif text-sm sm:text-base text-primary/90 leading-relaxed line-clamp-2">
                    {chapterGreekGem.greek_text}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed line-clamp-3">
                  {chapterGreekGem.translation_notes}
                </p>

                <div className="pt-1 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-on-surface-variant">
                    <Languages className="w-3.5 h-3.5 text-primary" />
                    <span>Traducción Directa (TDO)</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => openExegesis(chapterGreekGem)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container-lowest hover:bg-surface-container text-xs font-semibold text-primary border border-outline-variant/40 active:scale-95 transition-all"
                  >
                    <span>Leer nota completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </section>
            )}

            {/* Navegación pie de capítulo */}
            <div className="mt-12 pt-6 border-t border-outline-variant/30 flex items-center justify-between gap-3">
              {chapterNum === 1 ? (
                <Link
                  href={`/lector/${bookCode}/0`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs sm:text-sm font-semibold text-on-surface active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Contexto</span>
                </Link>
              ) : (
                <Link
                  href={`/lector/${bookCode}/${chapterNum - 1}`}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs sm:text-sm font-semibold text-on-surface active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Capítulo {chapterNum - 1}</span>
                </Link>
              )}

              {chapterNum < bookMeta.chapters ? (
                <Link
                  href={`/lector/${bookCode}/${chapterNum + 1}`}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-tertiary text-xs sm:text-sm font-semibold text-on-primary active:scale-95 transition-all shadow-sm"
                >
                  <span>Capítulo {chapterNum + 1}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowBookSheet(true)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-xs sm:text-sm font-semibold text-on-surface active:scale-95 transition-all"
                >
                  <span>Elegir otro libro</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </>
        )}
      </main>

      {/* ========================================================
          3. BARRA FLOTANTE CENTRADA DE ACCIONES DEL VERSÍCULO (LIQUID GLASS)
      ======================================================== */}
      {selectedVerses.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-3 pointer-events-none">
          <aside
            aria-label="Acciones de versículo"
            onTouchStart={handleDockTouchStart}
            onTouchMove={handleDockTouchMove}
            onTouchEnd={handleDockTouchEnd}
            style={{
              transform: dockDragY !== 0 ? `translate3d(0, ${dockDragY}px, 0)` : undefined,
              transition: isDockDragging ? 'none' : 'transform 280ms cubic-bezier(0.23, 1, 0.32, 1)',
            }}
            className="pointer-events-auto w-full max-w-md liquid-glass-elevated rounded-3xl p-3.5 animate-dock-in space-y-2.5 touch-none"
          >
            {/* Mango deslizable hacia arriba SOLO cuando hay 1 versículo seleccionado + 1 línea de adelanto real (Idea 1) */}
            {primarySelectedVerse && (
              <button
                type="button"
                onClick={() => openExegesis(primarySelectedVerse)}
                className="w-full flex flex-col items-center gap-1 pb-2 border-b border-outline-variant/25 group cursor-grab active:cursor-grabbing text-center"
              >
                <span className="w-9 h-1 rounded-full bg-on-surface/20 group-hover:bg-primary/50 transition-colors" />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Desliza o toca para leer el griego y sus notas</span>
                </span>
                {dockNoteTeaser && (
                  <span className="w-full px-2 text-[11px] text-on-surface-variant truncate">
                    {dockNoteTeaser}
                  </span>
                )}
              </button>
            )}

            {/* Referencia seleccionada + Cerrar */}
            <div className="flex items-center justify-between gap-2 px-1">
              <span className="text-xs font-semibold text-on-surface truncate">
                {selectedRefLabel}
              </span>
              <button
                type="button"
                onClick={() => setSelectedVerseNums([])}
                aria-label="Deseleccionar versículo"
                className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-on-surface/10 active:scale-95 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Paleta calibrada de 10 colores dual-mode (5x2, cierra automáticamente al elegir) */}
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="grid grid-cols-5 gap-2">
                {EDITORIAL_HIGHLIGHTS.map((c) => {
                  const activeSpec =
                    selectedVerseNums.length === 1
                      ? resolveHighlightSpec(highlights[selectedVerseNums[0]])
                      : undefined;
                  const isActiveColor = activeSpec?.id === c.id;
                  const swatchHex = theme === 'dark' ? c.swatchDark : c.swatch;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleApplyColor(c.id)}
                      aria-label={`Resaltar en ${c.name} (${c.purpose})`}
                      title={`${c.name} · ${c.purpose}`}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-transform hover:scale-110 active:scale-95 border border-black/15 dark:border-white/15 ${
                        isActiveColor ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : ''
                      }`}
                      style={{ backgroundColor: swatchHex }}
                    />
                  );
                })}
              </div>

              {anySelectedHasHighlight && (
                <button
                  type="button"
                  onClick={handleRemoveColor}
                  aria-label="Quitar resaltado"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-on-surface/[0.07] hover:bg-on-surface/[0.12] text-xs font-medium text-on-surface-variant active:scale-95 transition-all flex-shrink-0"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Quitar</span>
                </button>
              )}
            </div>

            {/* Acciones principales */}
            <div
              className={`grid gap-1 pt-1 border-t border-outline-variant/30 ${
                primarySelectedVerse ? 'grid-cols-5' : 'grid-cols-4'
              }`}
            >
              <button
                type="button"
                onClick={handleToggleBookmark}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-on-surface hover:bg-on-surface/[0.06] active:scale-95 transition-all min-h-[48px]"
              >
                <Bookmark
                  className={`w-4 h-4 ${allSelectedBookmarked ? 'text-primary fill-primary' : ''}`}
                />
                <span className="text-[11px] font-medium mt-1">
                  {allSelectedBookmarked ? 'Guardado' : 'Guardar'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsNoteModalOpen(true)}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-on-surface hover:bg-on-surface/[0.06] active:scale-95 transition-all min-h-[48px]"
              >
                <Edit3 className="w-4 h-4" />
                <span className="text-[11px] font-medium mt-1">Nota</span>
              </button>

              <button
                type="button"
                onClick={handleCopyVerse}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-on-surface hover:bg-on-surface/[0.06] active:scale-95 transition-all min-h-[48px]"
              >
                {copiedSuccess ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span className="text-[11px] font-medium mt-1">
                  {copiedSuccess ? 'Copiado' : 'Copiar'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleShareVerse}
                className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl text-on-surface hover:bg-on-surface/[0.06] active:scale-95 transition-all min-h-[48px]"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-[11px] font-medium mt-1">Enviar</span>
              </button>

              {primarySelectedVerse && (
                <button
                  type="button"
                  onClick={() => openExegesis(primarySelectedVerse)}
                  className="flex flex-col items-center justify-center py-2 px-1 rounded-2xl transition-all min-h-[48px] text-primary hover:bg-primary/10 active:scale-95 font-semibold"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[11px] font-medium mt-1">Griego</span>
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Buscador Global de toda la aplicación */}
      <GlobalSearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        contextBookCode={bookCode}
      />

      {/* Selector Acordeón de Libros y Capítulos estilo YouVersion */}
      <BookChapterSheet
        isOpen={showBookSheet}
        onClose={() => setShowBookSheet(false)}
        currentBookCode={bookCode}
        currentChapter={chapterNum}
      />

      {/* Drawer de Texto Original y Notas */}
      <ExegesisDrawer
        verse={exegesisVerse || primarySelectedVerse}
        isOpen={isExegesisOpen}
        onClose={() => setIsExegesisOpen(false)}
        onAddNote={(v) => {
          setSelectedVerseNums([v.verse]);
          setIsNoteModalOpen(true);
        }}
      />

      {/* Modal de Añadir Nota */}
      {selectedVerses.length > 0 && (
        <NoteModal
          isOpen={isNoteModalOpen}
          onClose={() => {
            setIsNoteModalOpen(false);
            getNotes().then((all) => {
              setChapterNotes(
                all.filter((n) => n.book.toUpperCase() === bookCode && n.chapter === chapterNum)
              );
            });
          }}
          verseRef={{
            book: selectedVerses[0].book,
            chapter: selectedVerses[0].chapter,
            verse: selectedVerses[0].verse,
            text: selectedVerses.map((v) => v.translation).join(' '),
          }}
        />
      )}

      {/* Modal Acerca de TDO */}
      <TranslationModal
        isOpen={isTransModalOpen}
        onClose={() => setIsTransModalOpen(false)}
      />
    </div>
  );
}
