'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Flame,
  BookOpen,
  Bookmark,
  Check,
  ChevronRight,
  Copy,
  Edit3,
  Share2,
  Search,
} from 'lucide-react';
import { supabase, VerseRecord } from '@/lib/supabase';
import {
  getLastRead,
  LastReadPosition,
  getReadingStreak,
  syncReadingState,
  syncCloudUserData,
  getDisplayName,
  fetchDailyVerse,
  isBookmarked,
  toggleBookmark,
} from '@/lib/storage';
import { getBookMeta } from '@/lib/constants';
import TopHeader from '@/components/TopHeader';
import TranslationModal from '@/components/TranslationModal';
import NoteModal from '@/components/NoteModal';
import GlobalSearchModal from '@/components/GlobalSearchModal';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default function InicioPage() {
  const [dailyVerse, setDailyVerse] = useState<VerseRecord | null>(null);
  const [loadingVerse, setLoadingVerse] = useState(true);
  const [lastRead, setLastRead] = useState<LastReadPosition>({
    book: 'MAT',
    chapter: 1,
    verse: 1,
    updatedAt: '',
  });
  const [streak, setStreak] = useState(0);
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('Bienvenido');
  const [showTransModal, setShowTransModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [dailyBookmarked, setDailyBookmarked] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    setLastRead(getLastRead());
    setStreak(getReadingStreak());
    setUserName(getDisplayName());

    async function loadDailyVerse() {
      try {
        setLoadingVerse(true);
        const verse = await fetchDailyVerse();
        if (verse) {
          setDailyVerse(verse);
          setDailyBookmarked(isBookmarked(verse.book, verse.chapter, verse.verse));
        }
      } catch (err) {
        console.error('Error cargando versículo del día:', err);
      } finally {
        setLoadingVerse(false);
      }
    }

    async function syncUser() {
      await syncCloudUserData();
      const state = await syncReadingState();
      setStreak(state.currentStreak);
      setUserName(getDisplayName());
      setLastRead(getLastRead());
    }

    loadDailyVerse();
    syncUser();

    const handleUserDataChange = () => {
      setStreak(getReadingStreak());
      setUserName(getDisplayName());
      setLastRead(getLastRead());
    };
    window.addEventListener('biblia-user-data-change', handleUserDataChange);
    return () => window.removeEventListener('biblia-user-data-change', handleUserDataChange);
  }, []);

  const handleCopyDaily = async () => {
    if (!dailyVerse) return;
    const bookName = getBookMeta(dailyVerse.book)?.name || dailyVerse.book;
    const text = `«${dailyVerse.translation}»\n— ${bookName} ${dailyVerse.chapter}:${dailyVerse.verse} (TDO)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDaily(true);
      setTimeout(() => setCopiedDaily(false), 1800);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareDaily = async () => {
    if (!dailyVerse) return;
    const bookName = getBookMeta(dailyVerse.book)?.name || dailyVerse.book;
    const text = `«${dailyVerse.translation}»\n— ${bookName} ${dailyVerse.chapter}:${dailyVerse.verse} (TDO)`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${bookName} ${dailyVerse.chapter}:${dailyVerse.verse}`,
          text,
        });
      } catch {}
    } else {
      handleCopyDaily();
    }
  };

  const handleBookmarkDaily = () => {
    if (!dailyVerse) return;
    const next = toggleBookmark(
      dailyVerse.book,
      dailyVerse.chapter,
      dailyVerse.verse,
      dailyVerse.translation
    );
    setDailyBookmarked(next);
  };

  const lastReadBookMeta = getBookMeta(lastRead.book);
  const lastReadBookName = lastReadBookMeta ? lastReadBookMeta.name : lastRead.book;

  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="min-h-screen">
      <TopHeader
        title="Biblia"
        onOpenInfo={() => setShowTransModal(true)}
        onSearchClick={() => setShowSearchModal(true)}
      />

      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-6 pb-12">
        {/* 1. Saludo y Racha */}
        <section className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-on-surface-variant capitalize">
              {formattedDate}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-0.5">
              {userName ? `${greeting}, ${userName.split(' ')[0]}` : greeting}
            </h1>
          </div>

          <Link
            href="/perfil"
            className="inline-flex items-center gap-1.5 bg-surface-container-low hover:bg-surface-container text-on-surface px-3.5 py-2 rounded-full border border-outline-variant/40 active:scale-95 transition-all"
            title="Racha de lectura diaria"
          >
            <Flame className="w-4 h-4 text-primary" strokeWidth={2.2} />
            <span className="text-xs sm:text-sm font-semibold">{streak} días</span>
          </Link>
        </section>

        {/* 2. Versículo del Día */}
        <section className="rounded-3xl bg-surface-container-lowest p-5 sm:p-7 shadow-warm border border-outline-variant/40 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-on-surface-variant">
              Versículo del día
            </span>
            <button
              type="button"
              onClick={() => setShowTransModal(true)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              TDO
            </button>
          </div>

          {loadingVerse ? (
            <div className="py-3 animate-pulse space-y-2.5">
              <div className="h-4 bg-outline-variant/30 rounded-md w-full" />
              <div className="h-4 bg-outline-variant/30 rounded-md w-3/4" />
            </div>
          ) : dailyVerse ? (
            <blockquote className="space-y-2.5">
              <p className="font-serif text-lg sm:text-xl text-on-surface leading-relaxed">
                «{dailyVerse.translation}»
              </p>
              <cite className="block not-italic text-sm font-semibold text-primary">
                {getBookMeta(dailyVerse.book)?.name || dailyVerse.book} {dailyVerse.chapter}:
                {dailyVerse.verse}
              </cite>
            </blockquote>
          ) : (
            <blockquote className="space-y-2.5">
              <p className="font-serif text-lg text-on-surface leading-relaxed">
                «Por nada estén afanosos; más bien, en todo, mediante oración y súplica con acción de gracias, sean dadas a conocer sus peticiones delante de Dios.»
              </p>
              <cite className="block not-italic text-sm font-semibold text-primary">
                Filipenses 4:6
              </cite>
            </blockquote>
          )}

          {/* Barra de acciones equilibrada */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/25">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleBookmarkDaily}
                aria-label="Guardar versículo"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-surface-container text-xs font-medium text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              >
                <Bookmark
                  className={`w-4 h-4 ${dailyBookmarked ? 'text-primary fill-primary' : ''}`}
                />
                <span>{dailyBookmarked ? 'Guardado' : 'Guardar'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNoteModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-surface-container text-xs font-medium text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              >
                <Edit3 className="w-4 h-4" />
                <span>Nota</span>
              </button>

              <button
                type="button"
                onClick={handleCopyDaily}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full hover:bg-surface-container text-xs font-medium text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              >
                {copiedDaily ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareDaily}
                aria-label="Compartir versículo"
                className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={`/lector/${dailyVerse?.book || 'PHP'}/${dailyVerse?.chapter || 4}`}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-all"
            >
              <span>Leer capítulo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* Buscador Global directo desde Inicio (Biblia, estudio y notas) */}
        <section>
          <button
            type="button"
            onClick={() => setShowSearchModal(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-surface-container-low hover:bg-surface-container border border-outline-variant/40 text-left transition-all active:scale-[0.99] group"
          >
            <Search className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="flex-1 text-xs sm:text-sm text-on-surface-variant group-hover:text-on-surface transition-colors truncate">
              Buscar versículos, temas, libros o notas...
            </span>
            <span className="text-[11px] font-semibold text-outline bg-surface-container-lowest px-2 py-0.5 rounded-full border border-outline-variant/40 hidden sm:inline">
              Global
            </span>
          </button>
        </section>

        {/* 3. Seguir leyendo */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-on-surface">Seguir leyendo</h2>
            <Link
              href="/lector"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              <span>Abrir Biblia</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Link
            href={`/lector/${lastRead.book}/${lastRead.chapter}`}
            className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/40 flex items-center justify-between gap-3 shadow-warm hover:border-primary/40 active:scale-[0.99] transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface">
                  {lastReadBookName}{' '}
                  {lastRead.chapter === 0 ? '· Contexto' : `capítulo ${lastRead.chapter}`}
                </h3>
                <p className="text-xs text-on-surface-variant">
                  {lastRead.chapter === 0
                    ? 'Introducción y contexto histórico'
                    : lastRead.verse
                    ? `Retomar en el versículo ${lastRead.verse}`
                    : 'Retomar lectura'}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-surface-container text-on-surface text-xs font-semibold flex-shrink-0">
              <span>Leer</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </section>

        {/* 4. Contexto antes de leer & Acerca de la traducción */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-on-surface">
              Empieza por el contexto
            </h2>
            <Link href="/estudio" className="text-xs font-semibold text-primary hover:underline">
              Ver planes
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <Link
              href="/lector/JHN/0"
              className="bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-primary">Contexto · 21 capítulos</span>
                <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  Evangelio según Juan
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Descubre quién lo escribió, a quién iba dirigido y sus siete señales antes de leer el capítulo 1.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Leer contexto</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setShowTransModal(true)}
              className="text-left bg-surface-container-lowest rounded-3xl p-5 border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-secondary">Traducción Directa (TDO)</span>
                <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                  Cómo traducimos los textos
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Conoce los criterios de fidelidad a los idiomas originales y cómo aprovechar las notas de cada versículo.
                </p>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <span>Ver criterios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </section>
      </div>

      <TranslationModal isOpen={showTransModal} onClose={() => setShowTransModal(false)} />
      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      {dailyVerse && (
        <NoteModal
          isOpen={showNoteModal}
          onClose={() => setShowNoteModal(false)}
          verseRef={{
            book: dailyVerse.book,
            chapter: dailyVerse.chapter,
            verse: dailyVerse.verse,
            text: dailyVerse.translation,
          }}
        />
      )}
    </div>
  );
}
