'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

let launchCompletedInSession = false;

interface AppLaunchExperienceProps {
  onRevealStart?: () => void;
}

/**
 * Propuesta 1: «El Sello y la Palabra»
 * Mini-experiencia editorial de apertura (~1.35s, 100% GPU, 0 peticiones de red,
 * totalmente interrumpible con un toque y con fallback CSS automático).
 */
export default function AppLaunchExperience({ onRevealStart }: AppLaunchExperienceProps) {
  const [visible, setVisible] = useState(() => !launchCompletedInSession);
  const [exiting, setExiting] = useState(false);
  const revealFiredRef = useRef(false);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const unmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerRevealAndExit = useCallback(
    (fast = false) => {
      launchCompletedInSession = true;
      if (!revealFiredRef.current) {
        revealFiredRef.current = true;
        onRevealStart?.();
      }
      setExiting(true);

      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);

      unmountTimerRef.current = setTimeout(
        () => {
          setVisible(false);
        },
        fast ? 260 : 380
      );
    },
    [onRevealStart]
  );

  useEffect(() => {
    if (launchCompletedInSession) {
      setVisible(false);
      return;
    }

    // A los 1020ms inicia la salida suave del velo y despierta la cascada de Inicio debajo
    exitTimerRef.current = setTimeout(() => {
      triggerRevealAndExit(false);
    }, 1020);

    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
    };
  }, [triggerRevealAndExit]);

  if (!visible) return null;

  return (
    <div
      role="presentation"
      aria-hidden="true"
      onClick={() => triggerRevealAndExit(true)}
      onTouchStart={() => triggerRevealAndExit(true)}
      className={`launch-veil-root fixed inset-0 z-[60] flex flex-col items-center justify-center px-6 select-none bg-background/95 backdrop-blur-md ${
        exiting ? 'launch-veil-exit pointer-events-none' : 'cursor-pointer'
      }`}
    >
      {/* Halo ambiental cálido de fondo (GPU transform + opacity) */}
      <div className="launch-ambient-glow pointer-events-none absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-primary/15 blur-2xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-xs sm:max-w-sm">
        {/* Eyebrow griego koiné + TDO */}
        <span className="launch-eyebrow text-[11px] font-bold uppercase tracking-[0.26em] text-primary mb-3.5">
          Λόγος · Texto Original
        </span>

        {/* El Sello: Logo oficial con anillo dorado SVG */}
        <div className="relative flex items-center justify-center mb-5">
          <svg
            className="launch-ring-svg absolute -inset-3 w-[104px] h-[104px] sm:w-[112px] sm:h-[112px] -rotate-90 pointer-events-none"
            viewBox="0 0 108 108"
          >
            <circle
              cx="54"
              cy="54"
              r="50"
              fill="none"
              stroke="rgb(var(--color-primary))"
              strokeOpacity="0.32"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="314"
              className="launch-ring-stroke"
            />
          </svg>

          <div className="launch-emblem relative w-20 h-20 sm:w-22 sm:h-22 rounded-[26px] overflow-hidden bg-surface-container-lowest border border-outline-variant/60 shadow-xl flex items-center justify-center">
            <img
              src="/icon-192.png"
              alt=""
              width={88}
              height={88}
              className="w-full h-full object-cover"
            />
            <div className="launch-emblem-sheen absolute inset-y-0 -left-1/2 w-3/4 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* La Palabra: Título editorial + línea dorada + frase */}
        <div className="space-y-2">
          <h2 className="launch-title font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Biblia · TDO
          </h2>

          <div className="launch-divider w-12 h-[1.5px] bg-primary/45 rounded-full mx-auto" />

          <p className="launch-subtitle font-serif italic text-xs sm:text-sm text-on-surface-variant pt-0.5">
            «Lo que el autor realmente escribió»
          </p>
        </div>
      </div>
    </div>
  );
}
