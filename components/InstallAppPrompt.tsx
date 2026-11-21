'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Share, PlusSquare, ChevronRight, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const DISMISS_KEY = 'biblia_install_floating_dismissed';

interface InstallAppPromptProps {
  variant?: 'floating' | 'row';
}

export default function InstallAppPrompt({ variant = 'floating' }: InstallAppPromptProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installedJustNow, setInstalledJustNow] = useState(false);
  const [hiddenByModal, setHiddenByModal] = useState(false);

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
      if (variant === 'floating' && localStorage.getItem(DISMISS_KEY) === '1') {
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
      setShowInstructions(false);
      setTimeout(() => setIsStandalone(true), 1600);
    };

    const handleToggleNav = (e: CustomEvent<{ visible?: boolean }>) => {
      if (e?.detail?.visible !== undefined) {
        setHiddenByModal(!e.detail.visible);
        if (!e.detail.visible) setShowInstructions(false);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('biblia-toggle-nav', handleToggleNav as EventListener);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('biblia-toggle-nav', handleToggleNav as EventListener);
    };
  }, [variant]);

  if (!mounted || isStandalone) return null;

  // En modo flotante: ocultar si fue cerrado, si hay un modal abierto o dentro del lector bíblico
  if (variant === 'floating') {
    if (dismissed || hiddenByModal || pathname.startsWith('/lector')) return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalledJustNow(true);
          setDeferredPrompt(null);
          setShowInstructions(false);
        }
      } catch {
        setShowInstructions((v) => !v);
      }
      return;
    }
    setShowInstructions((v) => !v);
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    setShowInstructions(false);
    try {
      localStorage.setItem(DISMISS_KEY, '1');
    } catch {}
  };

  const renderInstructionsContent = () =>
    isIOS ? (
      <ol className="space-y-1.5 text-xs text-on-surface-variant">
        <li className="flex items-start gap-2">
          <span className="font-bold text-primary">1.</span>
          <span>
            Toca <strong className="text-on-surface">Compartir</strong>{' '}
            <Share className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> abajo en Safari.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span className="font-bold text-primary">2.</span>
          <span>
            Elige <strong className="text-on-surface">«Agregar a inicio»</strong>{' '}
            <PlusSquare className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> para crear el atajo con tu logo.
          </span>
        </li>
      </ol>
    ) : (
      <p className="text-xs text-on-surface-variant leading-relaxed">
        Abre el menú del navegador (<strong className="text-on-surface">⋮</strong> o barra de direcciones) y selecciona{' '}
        <strong className="text-on-surface">«Agregar a pantalla de inicio»</strong> o{' '}
        <strong className="text-on-surface">«Instalar app»</strong>.
      </p>
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
              <Download className="w-4 h-4 text-primary flex-shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                {installedJustNow ? 'Agregada a tu inicio' : 'Agregar a pantalla de inicio'}
              </p>
              <p className="text-xs text-on-surface-variant">
                {deferredPrompt
                  ? 'Crea el atajo en 1 toque con el ícono oficial'
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
        {showInstructions && (
          <div className="mt-3 pt-3 border-t border-outline-variant/25 animate-fade-in">
            {renderInstructionsContent()}
          </div>
        )}
      </div>
    );
  }

  // Variante flotante sobrepuesta abajo a la derecha (encima de la barra inferior en móvil)
  return (
    <div
      aria-label="Agregar Biblia TDO a pantalla de inicio"
      className="fixed bottom-[86px] right-3.5 md:bottom-5 md:right-5 z-[38] flex flex-col items-end gap-2 pointer-events-none"
    >
      {/* Burbuja de instrucciones hacia arriba (iPhone Safari / navegadores sin prompt nativo) */}
      {showInstructions && (
        <div className="pointer-events-auto w-72 max-w-[calc(100vw-2rem)] liquid-glass-elevated rounded-3xl p-4 space-y-2.5 animate-fade-in origin-bottom-right">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-on-surface">
              Crear atajo en tu pantalla
            </span>
            <button
              type="button"
              onClick={() => setShowInstructions(false)}
              aria-label="Cerrar instrucciones"
              className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-on-surface/10"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {renderInstructionsContent()}
        </div>
      )}

      {/* Cápsula flotante compacta Liquid Glass con ícono de descarga */}
      <div className="pointer-events-auto liquid-glass-elevated rounded-full pl-1.5 pr-1.5 py-1.5 flex items-center gap-1.5 animate-fade-in">
        <button
          type="button"
          onClick={handleInstallClick}
          className="inline-flex items-center gap-2 pr-1.5 rounded-full active:scale-95 transition-transform"
          title="Agregar Biblia TDO a tu pantalla de inicio"
        >
          <span className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-xs flex-shrink-0">
            {installedJustNow ? (
              <Check className="w-4 h-4" strokeWidth={2.5} />
            ) : (
              <Download className="w-4 h-4" strokeWidth={2.2} />
            )}
          </span>
          <span className="text-xs font-semibold text-on-surface whitespace-nowrap">
            {installedJustNow ? '¡Agregada!' : 'Agregar al inicio'}
          </span>
        </button>

        {!installedJustNow && (
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Ocultar aviso de agregar al inicio"
            title="Ocultar"
            className="w-6 h-6 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-on-surface/10 active:scale-95 transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
