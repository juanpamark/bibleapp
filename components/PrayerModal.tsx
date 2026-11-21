'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { supabase, VerseRecord } from '@/lib/supabase';
import { PrayerTheme, PRAYER_THEMES } from '@/lib/prayers';
import { getBookMeta } from '@/lib/constants';

interface PrayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTheme: PrayerTheme;
}

function playGentleChime() {
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  } catch {}
}

export default function PrayerModal({ isOpen, onClose, initialTheme }: PrayerModalProps) {
  const [activeTheme, setActiveTheme] = useState<PrayerTheme>(initialTheme);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [verses, setVerses] = useState<VerseRecord[]>([]);
  const [loadingVerses, setLoadingVerses] = useState(true);

  const totalMs = activeTheme.durationMinutes * 60 * 1000;
  const [remainingMs, setRemainingMs] = useState(totalMs);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [confirmExit, setConfirmExit] = useState(false);

  const endTimeRef = useRef<number | null>(null);
  const wakeLockRef = useRef<{ release: () => Promise<void> } | null>(null);

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

  // Reset & autostart 10-minute timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTheme(initialTheme);
      const ms = initialTheme.durationMinutes * 60 * 1000;
      setRemainingMs(ms);
      setIsCompleted(false);
      setConfirmExit(false);
      setShowThemePicker(false);
      endTimeRef.current = Date.now() + ms;
      setIsRunning(true);
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));
    } else {
      setIsRunning(false);
      endTimeRef.current = null;
      void releaseWakeLock();
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: true } }));
    }
  }, [isOpen, initialTheme, releaseWakeLock]);

  // Wake Lock tied to running state
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

  // Precision timestamp countdown (drift-free on phone lock / tab switch)
  useEffect(() => {
    if (!isOpen || !isRunning || endTimeRef.current === null) return;

    const tick = () => {
      if (endTimeRef.current === null) return;
      const left = Math.max(0, endTimeRef.current - Date.now());
      setRemainingMs(left);
      if (left <= 0) {
        setIsRunning(false);
        setIsCompleted(true);
        endTimeRef.current = null;
        if (soundEnabled) playGentleChime();
      }
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [isOpen, isRunning, soundEnabled]);

  // Fetch the 5 TDO verses for activeTheme
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;

    async function fetchPrayerVerses() {
      setLoadingVerses(true);
      try {
        const orFilter = activeTheme.verses
          .map((v) => `and(book.eq.${v.book},chapter.eq.${v.chapter},verse.eq.${v.verse})`)
          .join(',');
        const { data, error } = await supabase
          .from('verses')
          .select('*')
          .or(orFilter);

        if (!cancelled && !error && data) {
          const ordered: VerseRecord[] = [];
          for (const ref of activeTheme.verses) {
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
  }, [isOpen, activeTheme]);

  const attemptClose = useCallback(() => {
    if (isRunning && remainingMs > 0 && remainingMs < totalMs - 5000 && !confirmExit) {
      setConfirmExit(true);
      return;
    }
    setConfirmExit(false);
    onClose();
  }, [isRunning, remainingMs, totalMs, confirmExit, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') attemptClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, attemptClose]);

  if (!isOpen) return null;

  const handleToggleRun = () => {
    if (isCompleted) {
      const ms = activeTheme.durationMinutes * 60 * 1000;
      setRemainingMs(ms);
      setIsCompleted(false);
      endTimeRef.current = Date.now() + ms;
      setIsRunning(true);
      return;
    }
    if (isRunning) {
      if (endTimeRef.current !== null) {
        setRemainingMs(Math.max(0, endTimeRef.current - Date.now()));
      }
      endTimeRef.current = null;
      setIsRunning(false);
    } else {
      endTimeRef.current = Date.now() + remainingMs;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    const ms = activeTheme.durationMinutes * 60 * 1000;
    setRemainingMs(ms);
    setIsCompleted(false);
    endTimeRef.current = Date.now() + ms;
    setIsRunning(true);
    setConfirmExit(false);
  };

  const handleSelectTheme = (theme: PrayerTheme) => {
    setActiveTheme(theme);
    setShowThemePicker(false);
  };

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const progress = Math.max(0, Math.min(1, 1 - remainingMs / totalMs));
  const ringRadius = 15;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - progress);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeTheme.title}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[3px] transition-opacity"
        onClick={attemptClose}
      />

      <div className="relative w-full max-w-2xl bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 max-h-[92dvh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header con Temporizador de 10 minutos en esquina superior derecha */}
        <header className="px-4 sm:px-6 py-4 border-b border-outline-variant/30 flex items-start justify-between gap-3 bg-surface-container-low/60">
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Tiempo de oración
              </span>
              <button
                type="button"
                onClick={() => setShowThemePicker((v) => !v)}
                className="text-[11px] font-semibold text-on-surface-variant hover:text-primary underline underline-offset-2"
              >
                {showThemePicker ? 'Cerrar lista' : 'Cambiar tema'}
              </button>
            </div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface leading-snug">
              {activeTheme.title}
            </h2>
          </div>

          {/* Cápsula de Temporizador 10:00 en esquina + botón cerrar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div
              className={`flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-full border transition-colors ${
                isCompleted
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                  : 'bg-surface-container border-outline-variant/50 text-on-surface'
              }`}
            >
              <svg className="w-8 h-8 -rotate-90 flex-shrink-0" viewBox="0 0 36 36" aria-hidden="true">
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
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
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
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
            </div>

            <button
              type="button"
              onClick={attemptClose}
              aria-label="Cerrar guía de oración"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Confirmación amable si intenta cerrar con el temporizador en marcha */}
        {confirmExit && (
          <div className="px-5 py-3 bg-primary/10 border-b border-primary/25 flex items-center justify-between gap-3 text-xs">
            <span className="text-on-surface font-medium">
              Tu tiempo de oración sigue corriendo ({formattedTime}). ¿Deseas salir ahora?
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => setConfirmExit(false)}
                className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-on-surface font-semibold"
              >
                Continuar
              </button>
              <button
                type="button"
                onClick={() => {
                  setConfirmExit(false);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-semibold"
              >
                Salir
              </button>
            </div>
          </div>
        )}

        {/* Selector opcional de los 12 temas */}
        {showThemePicker && (
          <div className="px-5 py-3.5 bg-surface-container-low border-b border-outline-variant/30 max-h-56 overflow-y-auto space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
              Elige otro motivo de oración ({PRAYER_THEMES.length} disponibles)
            </p>
            <div className="flex flex-wrap gap-1.5">
              {PRAYER_THEMES.map((t) => {
                const selected = t.id === activeTheme.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleSelectTheme(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selected
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-container-lowest text-on-surface border border-outline-variant/40 hover:border-primary/50'
                    }`}
                  >
                    {t.shortTitle}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Cuerpo scrolleable */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Aviso sereno al completar los 10 minutos */}
          {isCompleted && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-on-surface">
                  Has completado tus 10 minutos de oración
                </p>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Que la paz de Dios guarde tu corazón y tus pensamientos durante el resto del día.
                </p>
              </div>
            </div>
          )}

          {/* Introducción + llamado contemplativo */}
          <div className="space-y-2">
            <p className="text-sm sm:text-[15px] text-on-surface leading-relaxed">
              {activeTheme.shortIntro}
            </p>
            <p className="font-serif text-xs sm:text-sm italic text-primary">
              {activeTheme.closingCall}
            </p>
          </div>

          {/* Guía de estructura (NO es una oración prefabricada) */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Cómo puedes guiar este tiempo (con tus propias palabras)
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeTheme.guideSteps.map((step) => (
                <div
                  key={step.label}
                  className="p-3.5 rounded-2xl bg-surface-container-low border border-outline-variant/30 space-y-1"
                >
                  <p className="text-xs font-bold text-primary">{step.label}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{step.guidance}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disparadores personales para conversar con Dios */}
          <section className="p-4 rounded-2xl bg-surface-container-low/80 border border-outline-variant/35 space-y-2.5">
            <h3 className="font-serif text-sm font-bold text-on-surface">
              Puntos para conversar con Dios ahora
            </h3>
            <ul className="space-y-2">
              {activeTheme.prompts.map((prompt, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-on-surface/90 leading-relaxed">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5 Versículos de nuestra traducción TDO */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  5 versículos para meditar y orar (TDO)
                </h3>
              </div>
              <span className="text-[11px] font-semibold text-primary">Traducción Directa</span>
            </div>

            {loadingVerses ? (
              <div className="space-y-3 animate-pulse">
                {[1, 2, 3].map((n) => (
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
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <cite className="not-italic text-xs font-semibold text-primary">
                          {idx + 1}. {bookName} {v.chapter}:{v.verse}
                        </cite>
                        <Link
                          href={`/lector/${v.book}/${v.chapter}?verse=${v.verse}&note=1`}
                          onClick={onClose}
                          className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <span>Ver nota y capítulo</span>
                          <ChevronRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </blockquote>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="px-5 py-3.5 border-t border-outline-variant/30 bg-surface-container-low/60 flex items-center justify-between gap-3">
          <span className="text-[11px] text-on-surface-variant">
            {isCompleted
              ? 'Oración completada · Amén'
              : isRunning
              ? 'Temporizador activo · Sin apuros, a tu ritmo'
              : 'Temporizador en pausa'}
          </span>
          <button
            type="button"
            onClick={() => {
              setConfirmExit(false);
              onClose();
            }}
            className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface active:scale-95 transition-all"
          >
            Terminar
          </button>
        </footer>
      </div>
    </div>
  );
}
