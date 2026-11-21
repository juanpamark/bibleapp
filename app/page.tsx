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
  Clock,
  Languages,
  CheckCircle2,
} from 'lucide-react';
import { VerseRecord } from '@/lib/supabase';
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
  getPrayerSession,
  isPrayerCompletedToday,
} from '@/lib/storage';
import { getBookMeta } from '@/lib/constants';
import {
  HOME_MEDIA,
  PRAYER_THEMES,
  PrayerTheme,
  getPrayerDateStr,
  getTodayPrayerTheme,
} from '@/lib/prayers';
import TopHeader from '@/components/TopHeader';
import TranslationModal from '@/components/TranslationModal';
import NoteModal from '@/components/NoteModal';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import PrayerModal from '@/components/PrayerModal';
import ExegesisDrawer from '@/components/ExegesisDrawer';
import AppLaunchExperience from '@/components/AppLaunchExperience';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showDailyExegesis, setShowDailyExegesis] = useState(false);
  const [prayerDateStr, setPrayerDateStr] = useState('');
  const [todayPrayer, setTodayPrayer] = useState<PrayerTheme>(PRAYER_THEMES[0]);
  const [prayerCompleted, setPrayerCompleted] = useState(false);
  const [prayerLiveStatus, setPrayerLiveStatus] = useState<{
    status: 'running' | 'paused';
    remainingMs: number;
  } | null>(null);
  const [copiedDaily, setCopiedDaily] = useState(false);
  const [dailyBookmarked, setDailyBookmarked] = useState(false);
  const [playIntro, setPlayIntro] = useState(false);

  useEffect(() => {
    setGreeting(getGreeting());
    setLastRead(getLastRead());
    setStreak(getReadingStreak());
    setUserName(getDisplayName());

    const refreshPrayerState = () => {
      const dateStr = getPrayerDateStr();
      setPrayerDateStr(dateStr);
      setTodayPrayer(getTodayPrayerTheme(dateStr));
      setPrayerCompleted(isPrayerCompletedToday(dateStr));

      const session = getPrayerSession(dateStr);
      if (session && session.status === 'running' && session.endTimeMs !== null) {
        setPrayerLiveStatus({
          status: 'running',
          remainingMs: Math.max(0, session.endTimeMs - Date.now()),
        });
      } else if (session && session.status === 'paused' && session.pausedRemainingMs !== null) {
        setPrayerLiveStatus({
          status: 'paused',
          remainingMs: Math.max(0, session.pausedRemainingMs),
        });
      } else {
        setPrayerLiveStatus(null);
      }
    };

    refreshPrayerState();

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
    const handleVisibilityOrFocus = () => {
      refreshPrayerState();
    };

    window.addEventListener('biblia-user-data-change', handleUserDataChange);
    window.addEventListener('biblia-prayer-change', refreshPrayerState);
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    return () => {
      window.removeEventListener('biblia-user-data-change', handleUserDataChange);
      window.removeEventListener('biblia-prayer-change', refreshPrayerState);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
    };
  }, []);

  // Actualizar la visualización del reloj en segundo plano en Inicio si el usuario cerró con X
  useEffect(() => {
    if (!prayerDateStr || showPrayerModal || prayerLiveStatus?.status !== 'running') return;
    const syncTick = () => {
      const session = getPrayerSession(prayerDateStr);
      if (session && session.status === 'running' && session.endTimeMs !== null) {
        setPrayerLiveStatus({
          status: 'running',
          remainingMs: Math.max(0, session.endTimeMs - Date.now()),
        });
      } else {
        setPrayerLiveStatus(null);
      }
    };
    syncTick();
    const id = window.setInterval(syncTick, 1000);
    return () => window.clearInterval(id);
  }, [prayerDateStr, showPrayerModal, prayerLiveStatus?.status]);

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
      <AppLaunchExperience onRevealStart={() => setPlayIntro(true)} />

      <TopHeader
        title="Inicio"
        onOpenInfo={() => setShowTransModal(true)}
        onSearchClick={() => setShowSearchModal(true)}
      />

      <div
        className={`max-w-screen-md mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-6 pb-12 ${
          playIntro ? 'home-intro-active' : ''
        }`}
      >
        {/* 1. Saludo y Racha */}
        <section className="home-intro-lead flex items-center justify-between gap-3">
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
            <span className="text-xs sm:text-sm font-semibold">
              {streak} {streak === 1 ? 'día' : 'días'}
            </span>
          </Link>
        </section>

        {/* 2. Versículo del Día con fondo de nubes luminoso y scrim equilibrado */}
        <section className="home-intro-hero relative overflow-hidden rounded-3xl shadow-warm border border-outline-variant/30 min-h-[296px] sm:min-h-[320px] flex flex-col justify-between bg-[#241B14]">
          <img
            src={HOME_MEDIA.dailyVerseClouds}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none ${
              playIntro ? 'home-intro-clouds' : 'scale-[1.02]'
            }`}
          />
          {/* Scrim suavizado para lucir más las nubes manteniendo contraste nítido en Claro y Oscuro */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-[#1A130E]/16 via-[#19120D]/32 to-[#120D0A]/64 pointer-events-none"
          />
          {/* Destello cálido sutil de una sola vez al abrir la app */}
          {playIntro && (
            <div
              aria-hidden="true"
              className="home-intro-sheen absolute inset-y-0 -left-1/3 w-2/3 bg-gradient-to-r from-transparent via-[#FFF3DC]/65 to-transparent pointer-events-none"
            />
          )}

          <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-between gap-5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold tracking-wide text-[#FAF6F1]/95 [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]">
                Versículo del día
              </span>
              <button
                type="button"
                onClick={() => setShowTransModal(true)}
                className="text-xs font-semibold text-[var(--daily-hero-accent)] hover:text-white px-2.5 py-1 rounded-full bg-black/22 hover:bg-black/32 backdrop-blur-sm border border-white/20 transition-colors"
              >
                TDO
              </button>
            </div>

            {loadingVerse ? (
              <div className="py-4 animate-pulse space-y-2.5">
                <div className="h-4 bg-white/25 rounded-md w-full" />
                <div className="h-4 bg-white/25 rounded-md w-5/6" />
                <div className="h-3.5 bg-white/20 rounded-md w-1/3 mt-3" />
              </div>
            ) : dailyVerse ? (
              <blockquote className="home-verse-reveal space-y-3">
                <p className="font-serif text-lg sm:text-[22px] text-[#FAF6F1] leading-relaxed [text-shadow:0_1px_14px_rgba(0,0,0,0.52)]">
                  «{dailyVerse.translation}»
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                  <cite className="not-italic text-sm font-semibold text-[var(--daily-hero-accent)] [text-shadow:0_1px_10px_rgba(0,0,0,0.48)]">
                    {getBookMeta(dailyVerse.book)?.name || dailyVerse.book} {dailyVerse.chapter}:
                    {dailyVerse.verse}
                  </cite>
                  <button
                    type="button"
                    onClick={() => setShowDailyExegesis(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 hover:bg-black/38 backdrop-blur-md border border-white/25 text-[#FAF6F1] text-[11px] font-semibold active:scale-95 transition-all"
                  >
                    <Languages className="w-3.5 h-3.5 text-[var(--daily-hero-accent)]" />
                    <span>Nota del griego</span>
                  </button>
                </div>
              </blockquote>
            ) : (
              <blockquote className="space-y-2.5">
                <p className="font-serif text-lg sm:text-[22px] text-[#FAF6F1] leading-relaxed [text-shadow:0_1px_14px_rgba(0,0,0,0.52)]">
                  «Por nada estén afanosos; más bien, en todo, mediante oración y súplica con acción de gracias, sean dadas a conocer sus peticiones delante de Dios.»
                </p>
                <cite className="block not-italic text-sm font-semibold text-[var(--daily-hero-accent)] [text-shadow:0_1px_10px_rgba(0,0,0,0.48)]">
                  Filipenses 4:6
                </cite>
              </blockquote>
            )}

            {/* Barra de acciones: 4 botones circulares solo ícono + Leer capítulo */}
            <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/20">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={handleBookmarkDaily}
                  aria-label={dailyBookmarked ? 'Quitar versículo de guardados' : 'Guardar versículo'}
                  title={dailyBookmarked ? 'Guardado' : 'Guardar'}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/22 hover:bg-black/35 backdrop-blur-md border border-white/20 text-[#FAF6F1] active:scale-95 transition-all"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      dailyBookmarked
                        ? 'text-[var(--daily-hero-accent)] fill-[var(--daily-hero-accent)]'
                        : 'text-[#FAF6F1]'
                    }`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => setShowNoteModal(true)}
                  aria-label="Escribir nota personal"
                  title="Escribir nota"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/22 hover:bg-black/35 backdrop-blur-md border border-white/20 text-[#FAF6F1] active:scale-95 transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyDaily}
                  aria-label={copiedDaily ? 'Versículo copiado' : 'Copiar versículo'}
                  title={copiedDaily ? 'Copiado' : 'Copiar'}
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/22 hover:bg-black/35 backdrop-blur-md border border-white/20 text-[#FAF6F1] active:scale-95 transition-all"
                >
                  {copiedDaily ? (
                    <Check className="w-4 h-4 text-emerald-300" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShareDaily}
                  aria-label="Compartir versículo"
                  title="Compartir"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/22 hover:bg-black/35 backdrop-blur-md border border-white/20 text-[#FAF6F1] active:scale-95 transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <Link
                href={`/lector/${dailyVerse?.book || 'PHP'}/${dailyVerse?.chapter || 4}`}
                className="inline-flex items-center gap-1 px-4 py-2.5 rounded-full bg-[#FAF6F1] hover:bg-white text-[#231914] text-xs font-semibold shadow-sm active:scale-95 transition-all flex-shrink-0"
              >
                <span>Leer capítulo</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Buscador Global directo desde Inicio (Biblia, estudio y notas) */}
        <section className="home-intro-search">
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
        <section className="home-intro-support space-y-3">
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

        {/* 4. Oración diaria guiada (abajo de Seguir leyendo, arriba de Empieza por el contexto) */}
        <section className="home-intro-tail space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-serif text-lg font-bold text-on-surface">Oración</h2>

            {prayerCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/12 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Completado</span>
              </span>
            ) : prayerLiveStatus ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary font-mono tabular-nums">
                <Clock className="w-3.5 h-3.5" />
                <span>
                  {prayerLiveStatus.remainingMs === 0
                    ? 'Tiempo cumplido · 00:00'
                    : `${prayerLiveStatus.status === 'running' ? 'En curso' : 'En pausa'} · ${formatCountdown(prayerLiveStatus.remainingMs)}`}
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                <Clock className="w-3.5 h-3.5" />
                <span>{todayPrayer.durationMinutes} min · Hoy</span>
              </span>
            )}
          </div>

          <div className="rounded-3xl bg-surface-container-lowest p-4 sm:p-5 border border-outline-variant/40 shadow-warm">
            <div className="grid grid-cols-[84px_1fr] gap-x-3.5 gap-y-3 items-center sm:grid-cols-[152px_1fr] sm:gap-x-5 sm:gap-y-2.5 sm:items-start">
              {/* Imagen 1:1 editorial de oración */}
              <div className="sm:row-span-3 w-[84px] h-[84px] sm:w-[152px] sm:h-[152px] aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container flex-shrink-0">
                <img
                  src={HOME_MEDIA.prayerCard}
                  alt="Momento de oración diaria"
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Encabezado compacto junto a la imagen en móvil */}
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block">
                  Propósito de hoy · {todayPrayer.shortTitle}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-bold text-on-surface leading-snug">
                  {todayPrayer.title}
                </h3>
              </div>

              {/* Invitación a ancho completo en móvil y columna derecha en escritorio */}
              <p className="col-span-2 sm:col-span-1 sm:col-start-2 text-xs sm:text-[13px] text-on-surface-variant leading-relaxed">
                {todayPrayer.shortIntro}
              </p>

              {/* Frase contemplativa de cierre + Botón Empezar (siempre accesible incluso si completado) */}
              <div className="col-span-2 sm:col-span-1 sm:col-start-2 pt-3 sm:pt-1 border-t border-outline-variant/25 sm:border-t-0 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <p className="font-serif italic text-xs sm:text-[13px] text-on-surface/85 leading-relaxed">
                  {todayPrayer.closingCall}
                </p>
                <button
                  type="button"
                  onClick={() => setShowPrayerModal(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold shadow-sm active:scale-95 transition-all flex-shrink-0"
                >
                  <span>Empezar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Contexto antes de leer & Acerca de la traducción (imágenes 1:1 solo en vista previa de Inicio) */}
        <section className="home-intro-context space-y-3">
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
              className="bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all flex flex-col justify-between gap-3.5 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container flex-shrink-0">
                  <img
                    src={HOME_MEDIA.contextCard}
                    alt="Contexto histórico bíblico"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-semibold text-primary block">
                    Contexto · 21 capítulos
                  </span>
                  <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    Evangelio según Juan
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Descubre quién lo escribió, a quién iba dirigido y sus siete señales antes del capítulo 1.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary pt-2 border-t border-outline-variant/20">
                <span>Leer contexto</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setShowTransModal(true)}
              className="text-left bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all flex flex-col justify-between gap-3.5 group"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 aspect-square rounded-2xl overflow-hidden border border-outline-variant/30 bg-surface-container flex-shrink-0">
                  <img
                    src={HOME_MEDIA.translationCard}
                    alt="Traducción Directa de los Originales"
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="text-[11px] font-semibold text-secondary block">
                    Traducción Directa (TDO)
                  </span>
                  <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors leading-snug">
                    Cómo traducimos los textos
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Conoce los criterios de fidelidad a los idiomas originales y cómo aprovechar sus notas.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary pt-2 border-t border-outline-variant/20">
                <span>Ver criterios</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </section>
      </div>

      <TranslationModal isOpen={showTransModal} onClose={() => setShowTransModal(false)} />
      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <PrayerModal
        isOpen={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        theme={todayPrayer}
        prayerDateStr={prayerDateStr || getPrayerDateStr()}
      />
      <ExegesisDrawer
        verse={dailyVerse}
        isOpen={showDailyExegesis}
        onClose={() => setShowDailyExegesis(false)}
        onAddNote={() => setShowNoteModal(true)}
      />
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
