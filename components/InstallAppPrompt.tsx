'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X, Share, PlusSquare, ChevronRight, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'biblia_install_prompt_dismissed';

interface InstallAppPromptProps {
  variant?: 'banner' | 'row';
}

export default function InstallAppPrompt({ variant = 'banner' }: InstallAppPromptProps) {
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installedJustNow, setInstalledJustNow] = useState(false);

  useEffect(() => {
    setMounted(true);

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent || '';
    const iosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    setIsIOS(iosDevice);

    try {
      if (variant === 'banner' && localStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {}

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleInstalled = () => {
      setInstalledJustNow(true);
      setDeferredPrompt(null);
      setTimeout(() => setIsStandalone(true), 1600);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, [variant]);

  if (!mounted || isStandalone) return null;
  if (variant === 'banner' && dismissed) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledJustNow(true);
          setDeferredPrompt(null);
        }
      } catch {
        setShowInstructions((v) => !v);
      }
      return;
    }
    setShowInstructions((v) => !v);
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  const instructionsBlock = showInstructions && (
    <div className="mt-3 pt-3 border-t border-outline-variant/25 space-y-2 text-xs text-on-surface-variant animate-fade-in">
      {isIOS ? (
        <ol className="space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">1.</span>
            <span>
              Toca el botón <strong className="text-on-surface">Compartir</strong>{' '}
              <Share className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> en la barra inferior de Safari.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-primary">2.</span>
            <span>
              Desliza y elige <strong className="text-on-surface">«Agregar a inicio»</strong>{' '}
              <PlusSquare className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> para tener el ícono directo en tu teléfono.
            </span>
          </li>
        </ol>
      ) : (
        <p className="leading-relaxed">
          Abre el menú de tu navegador (<strong className="text-on-surface">⋮</strong> o barra de direcciones) y elige{' '}
          <strong className="text-on-surface">«Agregar a pantalla de inicio»</strong> o{' '}
          <strong className="text-on-surface">«Instalar aplicación»</strong>.
        </p>
      )}
    </div>
  );

  if (variant === 'row') {
    return (
      <div className="p-4">
        <button
          type="button"
          onClick={handleInstallClick}
          className="w-full flex items-center justify-between gap-3 text-left group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {installedJustNow ? (
              <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            ) : (
              <Smartphone className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                {installedJustNow ? 'Agregada a tu inicio' : 'Agregar a pantalla de inicio'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {deferredPrompt
                  ? 'Instálala en 1 toque con el ícono oficial'
                  : 'Úsala como app directa desde tu teléfono'}
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-outline flex-shrink-0 transition-transform ${
              showInstructions ? 'rotate-90' : ''
            }`}
          />
        </button>
        {instructionsBlock}
      </div>
    );
  }

  return (
    <section
      aria-label="Agregar Biblia TDO a pantalla de inicio"
      className="rounded-3xl bg-surface-container-low/90 border border-outline-variant/40 p-4 sm:p-4.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-center text-primary flex-shrink-0">
            {installedJustNow ? (
              <Check className="w-5 h-5 text-emerald-500" />
            ) : (
              <Smartphone className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-semibold text-on-surface leading-snug">
              {installedJustNow ? '¡Lista en tu pantalla de inicio!' : 'Lleva Biblia TDO en tu inicio'}
            </p>
            <p className="text-[11px] sm:text-xs text-on-surface-variant leading-snug">
              {deferredPrompt
                ? 'Agrégala en 1 toque para abrirla como app.'
                : 'Ábrela directo con su ícono en tu pantalla.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {!installedJustNow && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="px-3.5 py-2 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-transform"
            >
              Agregar
            </button>
          )}
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Ocultar sugerencia de instalación"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {instructionsBlock}
    </section>
  );
}
