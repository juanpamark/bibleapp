'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
} from 'lucide-react';
import { supabase, VerseRecord } from '@/lib/supabase';
import { PrayerTheme } from '@/lib/prayers';
import { getBookMeta } from '@/lib/constants';
import {
  getPrayerSession,
  savePrayerSession,
  clearPrayerSession,
  markPrayerCompletedToday,
} from '@/lib/storage';
import { useSwipeToClose } from '@/lib/useSwipeToClose';

const COMPLETION_THRESHOLD_MS = 6 * 60 * 1000; // 6 minutos

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: PrayerTheme;
  prayerDateStr: string;
}

function playGentleChime() {
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 warm triad
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.22);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime + idx * 0.22);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + idx * 0.22 + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.22 + 1.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.22);
      osc.stop(ctx.currentTime + idx * 0.22 + 1.9);
    });
    window.setTimeout(() => {
      void ctx.close().catch(() => {});
    }, 2400);
  } catch {}
}

export default function PrayerModal({
  isOpen,
  onClose,
  theme,
  prayerDateStr,
}: PrayerModalProps) {
  const [verses, setVerses] = useState<VerseRecord[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(true);

  const totalMs = theme.durationMinutes * 60 * 1000;
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const endTimeRef = useRef<number | null>(null);
  const completedTriggeredRef = useRef(false);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);
  const wasOpenRef = useRef(false);

  const { scrollContainerRef, headerTouchHandlers, bodyTouchHandlers, sheetStyle } =
    useSwipeToClose({ onClose });

  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      }
    } catch {}
  }, []);

  const requestWakeLock = useCallback(async () => {
    try {
      const nav = navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<{ release: () => Promise<void> }> };
      };
      if (nav.wakeLock) {
        wakeLockRef.current = await nav.wakeLock.request('screen');
      }
    } catch {}
  }, []);

  // Restaurar o iniciar sesión de 10 minutos al abrir la ventana
  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      completedTriggeredRef.current = false;
      const saved = getPrayerSession(prayerDateStr);

      if (saved && saved.status === 'running' && saved.endTimeMs !== null) {
        const left = saved.endTimeMs - Date.now();
        if (left > 0) {
          endTimeRef.current = saved.endTimeMs;
          setRemainingMs(left);
          setIsRunning(true);
        } else {
          // El tiempo llegó a cero mientras la ventana estaba cerrada: no cerrar ni autocompletar sola.
          endTimeRef.current = null;
          setRemainingMs(0);
          setIsRunning(false);
        }
      } else if (saved && saved.status === 'paused' && saved.pausedRemainingMs !== null) {
        endTimeRef.current = null;
        setRemainingMs(Math.max(0, Math.min(totalMs, saved.pausedRemainingMs)));
        setIsRunning(false);
      } else {
        const newEndTime = Date.now() + totalMs;
        endTimeRef.current = newEndTime;
        setRemainingMs(totalMs);
        setIsRunning(true);
        savePrayerSession({
          dateStr: prayerDateStr,
          status: 'running',
          endTimeMs: newEndTime,
          pausedRemainingMs: null,
        });
      }

      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      // Al cerrar por X / swipe / Esc, NO tocamos localStorage para que el contador siga corriendo.
      setIsRunning(false);
      endTimeRef.current = null;
      void releaseWakeLock();
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: true } }));
    }
  }, [isOpen, prayerDateStr, totalMs, releaseWakeLock]);

  // Wake Lock ligado al estado en ejecución dentro del modal
  useEffect(() => {
    if (isOpen && isRunning) {
      void requestWakeLock();
    } else {
      void releaseWakeLock();
    }
    return () => {
      void releaseWakeLock();
    };
  }, [isOpen, isRunning, requestWakeLock, releaseWakeLock]);

  // Temporizador sin deriva basado en Date.now(); al llegar a 00:00 estando abierto -> completa y cierra
  useEffect(() => {
    if (!isOpen || !isRunning || endTimeRef.current === null) return;

    const tick = () => {
      if (endTimeRef.current === null) return;
      const left = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMs(left);

      if (left <= 0 && !completedTriggeredRef.current) {
        completedTriggeredRef.current = true;
        setIsRunning(false);
        endTimeRef.current = null;
        clearPrayerSession();
        markPrayerCompletedToday(prayerDateStr);
        if (soundEnabled) playGentleChime();
        onClose();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [isOpen, isRunning, soundEnabled, prayerDateStr, onClose]);

  // Cargar los 5 versículos exactos del tema del día desde Supabase
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function fetchPrayerVerses() {
      setLoadingVerses(true);
      try {
        const orFilter = theme.verses
          .map((v) => `and(book.eq.${v.book},chapter.eq.${v.chapter},verse.eq.${v.verse})`)
          .join(',');
        const { data, error } = await supabase.from('verses').select('*').or(orFilter);

        if (!cancelled && !error && data) {
          const ordered: VerseRecord[] = [];
          for (const ref of theme.verses) {
            const match = data.find(
              (row) =>
                row.book.toUpperCase() === ref.book.toUpperCase() &&
                row.chapter === ref.chapter &&
                row.verse === ref.verse
            );
            if (match) ordered.push(match);
          }
          setVerses(ordered);
        }
      } catch (e) {
        console.error('Error cargando versículos de oración:', e);
      } finally {
        if (!cancelled) setLoadingVerses(false);
      }
    }

    fetchPrayerVerses();
    return () => {
      cancelled = true;
    };
  }, [isOpen, theme]);

  // Cerrar con Escape (el reloj continúa corriendo en segundo plano)
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleToggleRun = () => {
    if (isRunning) {
      const left =
        endTimeRef.current !== null ? Math.max(0, endTimeRef.current - Date.now()) : remainingMs;
      endTimeRef.current = null;
      setRemainingMs(left);
      setIsRunning(false);
      savePrayerSession({
        dateStr: prayerDateStr,
        status: 'paused',
        endTimeMs: null,
        pausedRemainingMs: left,
      });
    } else {
      const baseMs = remainingMs > 0 ? remainingMs : totalMs;
      const newEndTime = Date.now() + baseMs;
      completedTriggeredRef.current = false;
      endTimeRef.current = newEndTime;
      setRemainingMs(baseMs);
      setIsRunning(true);
      savePrayerSession({
        dateStr: prayerDateStr,
        status: 'running',
        endTimeMs: newEndTime,
        pausedRemainingMs: null,
      });
    }
  };

  const handleReset = () => {
    const newEndTime = Date.now() + totalMs;
    completedTriggeredRef.current = false;
    endTimeRef.current = newEndTime;
    setRemainingMs(totalMs);
    setIsRunning(true);
    savePrayerSession({
      dateStr: prayerDateStr,
      status: 'running',
      endTimeMs: newEndTime,
      pausedRemainingMs: null,
    });
  };

  const handleFinish = () => {
    const currentLeft =
      isRunning && endTimeRef.current !== null
        ? Math.max(0, endTimeRef.current - Date.now())
        : remainingMs;
    const elapsedMs = totalMs - currentLeft;

    if (elapsedMs >= COMPLETION_THRESHOLD_MS) {
      markPrayerCompletedToday(prayerDateStr);
    }

    endTimeRef.current = null;
    setIsRunning(false);
    clearPrayerSession();
    onClose();
  };

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const elapsedMs = totalMs - remainingMs;
  const canMarkCompletedOnFinish = elapsedMs >= COMPLETION_THRESHOLD_MS;

  const progress = Math.max(0, Math.min(1, 1 - remainingMs / totalMs));
  const ringRadius = 15;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={theme.title}
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[3px] transition-opacity"
        onClick={onClose}
      />

      <div
        style={sheetStyle}
        className="relative w-full sm:max-w-2xl bg-surface-container-lowest text-on-surface rounded-none sm:rounded-3xl shadow-2xl sm:border sm:border-outline-variant/50 h-[100dvh] sm:h-auto sm:max-h-[92vh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden pt-[env(safe-area-inset-top)] sm:pt-0"
      >
        {/* Zona superior deslizable hacia abajo para cerrar */}
        <div {...headerTouchHandlers} className="touch-none select-none">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

          {/* Header fijo con título del día y temporizador 10:00 en esquina */}
          <header className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-outline-variant/30 flex items-start justify-between gap-3 bg-surface-container-low/60">
            <div className="min-w-0 flex-1 space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary block">
                Tiempo de oración
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface leading-snug">
                {theme.title}
              </h2>
            </div>

            {/* Cápsula de Temporizador 10:00 en esquina + botón cerrar */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border bg-surface-container border-outline-variant/50 text-on-surface">
                <svg
                  className="w-8 h-8 -rotate-90 flex-shrink-0"
                  viewBox="0 0 36 36"
                  aria-hidden="true"
                >
                  <circle
                    cx="18"
                    cy="18"
                    r={ringRadius}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.16"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r={ringRadius}
                    fill="none"
                    stroke="rgb(var(--color-primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className="transition-[stroke-dashoffset] duration-300"
                  />
                </svg>

                <span className="font-mono text-xs sm:text-sm font-bold tabular-nums tracking-tight min-w-[42px] text-center">
                  {formattedTime}
                </span>

                <button
                  type="button"
                  onClick={handleToggleRun}
                  aria-label={isRunning ? 'Pausar temporizador' : 'Reanudar temporizador'}
                  title={isRunning ? 'Pausar' : 'Reanudar'}
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-on-surface/10 active:scale-95 transition-all"
                >
                  {isRunning ? (
                    <Pause className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3.5 h-3.5 ml-0.5" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  aria-label="Reiniciar 10 minutos"
                  title="Reiniciar"
                  className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-on-surface/10 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => setSoundEnabled((s) => !s)}
                  aria-label={soundEnabled ? 'Silenciar aviso final' : 'Activar aviso final'}
                  title={soundEnabled ? 'Sonido activo' : 'En silencio'}
                  className="w-7 h-7 rounded-full hidden sm:flex items-center justify-center hover:bg-on-surface/10 active:scale-95 transition-all text-on-surface-variant"
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar ventana de oración"
                className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </header>
        </div>

        {/* Cuerpo scrolleable: directo a Puntos para conversar con Dios ahora + 5 versículos */}
        <div
          ref={scrollContainerRef}
          {...bodyTouchHandlers}
          className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1"
        >
          {/* 1. Puntos para conversar con Dios ahora */}
          <section className="p-4 sm:p-5 rounded-2xl bg-surface-container-low/80 border border-outline-variant/35 space-y-3">
            <h3 className="font-serif text-base font-bold text-on-surface">
              Puntos para conversar con Dios ahora
            </h3>
            <ul className="space-y-2.5">
              {theme.prompts.map((prompt, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-sm text-on-surface/90 leading-relaxed"
                >
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. 5 versículos para meditar (sin "Traducción Directa" ni enlaces extra) */}
          <section className="space-y-3">
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                5 versículos para meditar
              </h3>
            </div>

            {loadingVerses ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="p-4 rounded-2xl bg-surface-container-low space-y-2">
                    <div className="h-3.5 bg-outline-variant/30 rounded w-full" />
                    <div className="h-3.5 bg-outline-variant/30 rounded w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {verses.map((v, idx) => {
                  const bookName = getBookMeta(v.book)?.name || v.book;
                  return (
                    <blockquote
                      key={v.id}
                      className="p-4 rounded-2xl bg-surface-container-low/70 border border-outline-variant/35 space-y-2"
                    >
                      <p className="font-serif text-sm sm:text-[15px] text-on-surface leading-relaxed">
                        «{v.translation}»
                      </p>
                      <cite className="block not-italic text-xs font-semibold text-primary pt-0.5">
                        {idx + 1}. {bookName} {v.chapter}:{v.verse}
                      </cite>
                    </blockquote>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-outline-variant/30 bg-surface-container-low/60 flex items-center justify-between gap-3">
          <span className="text-[11px] text-on-surface-variant">
            {canMarkCompletedOnFinish
              ? 'Ya superaste 6 min · Pulsa «Terminar» para completar'
              : isRunning
              ? 'Temporizador activo · Sigue corriendo si sales con X'
              : 'Temporizador en pausa'}
          </span>
          <button
            type="button"
            onClick={handleFinish}
            className={`px-4 py-2 rounded-full text-xs font-semibold active:scale-95 transition-all flex-shrink-0 ${
              canMarkCompletedOnFinish
                ? 'bg-primary hover:bg-tertiary text-on-primary shadow-sm'
                : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
            }`}
          >
            Terminar
          </button>
        </footer>
      </div>
    </div>
  );
}
