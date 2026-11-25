'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Download, X, Share, PlusSquare, ChevronRight, Check, ExternalLink } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __bibliaDeferredPrompt?: BeforeInstallPromptEvent | null;
  }
}

type BrowserEnvironment =
  | 'ios-inapp'
  | 'ios-safari'
  | 'ios-other'
  | 'android-inapp'
  | 'android-firefox'
  | 'android-samsung'
  | 'android-chromium'
  | 'mac-safari'
  | 'desktop-firefox'
  | 'desktop-chromium';

const DISMISS_KEY = 'biblia_install_floating_dismissed';

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return true;
  const mqStandalone =
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: window-controls-overlay)').matches;
  const iosStandalone =
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
  const androidTwa =
    typeof document !== 'undefined' && document.referrer.startsWith('android-app://');
  return Boolean(mqStandalone || iosStandalone || androidTwa);
}

function detectBrowserEnvironment(): BrowserEnvironment {
  if (typeof window === 'undefined') return 'desktop-chromium';
  const ua = window.navigator.userAgent || '';
  const isInApp =
    /FBAN|FBAV|Instagram|WhatsApp|Line\/|MicroMessenger|TikTok|BytedanceWebview|Snapchat|LinkedInApp|GSA\//i.test(
      ua
    );
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

  if (isIOS) {
    if (isInApp) return 'ios-inapp';
    const isOtherIOSBrowser = /CriOS|EdgiOS|FxiOS|OPiOS|DuckDuckGo/i.test(ua);
    return isOtherIOSBrowser ? 'ios-other' : 'ios-safari';
  }

  const isAndroid = /Android/i.test(ua);
  if (isAndroid) {
    if (isInApp || /;\s*wv\)/i.test(ua)) return 'android-inapp';
    if (/Firefox|FxiOS/i.test(ua)) return 'android-firefox';
    if (/SamsungBrowser/i.test(ua)) return 'android-samsung';
    return 'android-chromium';
  }

  if (/Firefox/i.test(ua)) return 'desktop-firefox';
  const isMacSafari =
    /Macintosh/i.test(ua) && /Safari/i.test(ua) && !/Chrome|Chromium|Edg|OPR|Brave/i.test(ua);
  if (isMacSafari) return 'mac-safari';

  return 'desktop-chromium';
}

interface InstallAppPromptProps {
  variant?: 'floating' | 'row';
}

export default function InstallAppPrompt({ variant = 'floating' }: InstallAppPromptProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isStandalone, setIsStandalone] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [browserEnv, setBrowserEnv] = useState<BrowserEnvironment>('desktop-chromium');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [installedJustNow, setInstalledJustNow] = useState(false);
  const [hiddenByModal, setHiddenByModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsStandalone(detectStandalone());
    setBrowserEnv(detectBrowserEnvironment());

    if (window.__bibliaDeferredPrompt) {
      setDeferredPrompt(window.__bibliaDeferredPrompt);
    }

    try {
      if (variant === 'floating' && localStorage.getItem(DISMISS_KEY) === '1') {
        setDismissed(true);
      }
    } catch {}

    const syncPromptFromWindow = () => {
      setDeferredPrompt(window.__bibliaDeferredPrompt || null);
    };

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__bibliaDeferredPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleInstalled = () => {
      window.__bibliaDeferredPrompt = null;
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

    const mq = window.matchMedia?.('(display-mode: standalone)');
    const handleDisplayModeChange = () => {
      setIsStandalone(detectStandalone());
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('biblia-pwa-prompt-ready', syncPromptFromWindow);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener('biblia-pwa-installed', handleInstalled);
    window.addEventListener('biblia-toggle-nav', handleToggleNav as EventListener);
    mq?.addEventListener?.('change', handleDisplayModeChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('biblia-pwa-prompt-ready', syncPromptFromWindow);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener('biblia-pwa-installed', handleInstalled);
      window.removeEventListener('biblia-toggle-nav', handleToggleNav as EventListener);
      mq?.removeEventListener?.('change', handleDisplayModeChange);
    };
  }, [variant]);

  useEffect(() => {
    setHiddenByModal(false);
    setShowInstructions(false);
  }, [pathname]);

  if (!mounted || isStandalone) return null;

  // En modo flotante: ocultar si fue cerrado, si hay un modal abierto o dentro del lector bíblico
  if (variant === 'floating') {
    if (dismissed || hiddenByModal || pathname.startsWith('/lector')) return null;
  }

  const handleInstallClick = async () => {
    const activePrompt = deferredPrompt || window.__bibliaDeferredPrompt || null;
    if (activePrompt) {
      try {
        await activePrompt.prompt();
        const choice = await activePrompt.userChoice;
        window.__bibliaDeferredPrompt = null;
        setDeferredPrompt(null);
        if (choice.outcome === 'accepted') {
          setInstalledJustNow(true);
          setShowInstructions(false);
          window.dispatchEvent(new Event('biblia-pwa-installed'));
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

  const renderInstructionsContent = () => {
    switch (browserEnv) {
      case 'ios-inapp':
        return (
          <ol className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>
                Toca el menú <strong className="text-on-surface">⋯</strong> arriba y elige{' '}
                <strong className="text-on-surface">«Abrir en Safari / navegador»</strong>{' '}
                <ExternalLink className="w-3 h-3 inline text-primary -mt-0.5" />.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>
                En Safari toca <strong className="text-on-surface">Compartir</strong>{' '}
                <Share className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> y luego{' '}
                <strong className="text-on-surface">«Agregar a inicio»</strong>.
              </span>
            </li>
          </ol>
        );

      case 'ios-safari':
        return (
          <ol className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>
                Toca el botón <strong className="text-on-surface">Compartir</strong>{' '}
                <Share className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> en la barra de Safari.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>
                Desliza y elige <strong className="text-on-surface">«Agregar a inicio»</strong>{' '}
                <PlusSquare className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> para instalarla con su logo.
              </span>
            </li>
          </ol>
        );

      case 'ios-other':
        return (
          <ol className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>
                Toca <strong className="text-on-surface">Compartir</strong>{' '}
                <Share className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> en la esquina superior derecha de la barra de direcciones.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>
                Selecciona <strong className="text-on-surface">«Agregar a inicio»</strong>{' '}
                <PlusSquare className="w-3.5 h-3.5 inline text-primary -mt-0.5" /> (si no aparece, ábrela en Safari).
              </span>
            </li>
          </ol>
        );

      case 'android-inapp':
        return (
          <ol className="space-y-1.5 text-xs text-on-surface-variant leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              <span>
                Toca <strong className="text-on-surface">⋮</strong> arriba a la derecha y elige{' '}
                <strong className="text-on-surface">«Abrir en Chrome / navegador externo»</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              <span>
                Allí toca <strong className="text-on-surface">«Agregar al inicio»</strong> o{' '}
                <strong className="text-on-surface">«Instalar aplicación»</strong>.
              </span>
            </li>
          </ol>
        );

      case 'android-firefox':
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Toca el menú <strong className="text-on-surface">⋮</strong> de Firefox y selecciona{' '}
            <strong className="text-on-surface">«Instalar»</strong> o{' '}
            <strong className="text-on-surface">«Añadir a la pantalla de inicio»</strong>.
          </p>
        );

      case 'android-samsung':
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Toca el menú <strong className="text-on-surface">≡</strong> abajo a la derecha, elige{' '}
            <strong className="text-on-surface">«Añadir pág. a»</strong> y luego{' '}
            <strong className="text-on-surface">«Pantalla de inicio»</strong>.
          </p>
        );

      case 'android-chromium':
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Abre el menú <strong className="text-on-surface">⋮</strong> arriba a la derecha y selecciona{' '}
            <strong className="text-on-surface">«Instalar aplicación»</strong> o{' '}
            <strong className="text-on-surface">«Agregar a la pantalla principal»</strong>.
          </p>
        );

      case 'mac-safari':
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            En la barra superior de Safari abre <strong className="text-on-surface">Archivo → «Agregar al Dock…»</strong>{' '}
            (o toca <strong className="text-on-surface">Compartir → «Agregar al Dock»</strong>).
          </p>
        );

      case 'desktop-firefox':
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Firefox en computadora no instala apps web en el escritorio; puedes guardarla en marcadores (<strong className="text-on-surface">Ctrl+D</strong>) o abrirla en <strong className="text-on-surface">Chrome, Edge o Safari</strong> para instalarla como app.
          </p>
        );

      case 'desktop-chromium':
      default:
        return (
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Haz clic en el ícono de instalar en el extremo derecho de la barra de direcciones, o abre el menú{' '}
            <strong className="text-on-surface">⋮</strong> →{' '}
            <strong className="text-on-surface">«Guardar y compartir» → «Instalar Biblia · TDO»</strong>.
          </p>
        );
    }
  };

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
                  ? 'Instálala en 1 toque con el ícono oficial'
                  : 'Úsala como app directa desde tu teléfono o computadora'}
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

  // Variante flotante sobrepuesta abajo a la derecha (respetando safe-area en iOS/Android)
  return (
    <div
      aria-label="Agregar Biblia TDO a pantalla de inicio"
      className="fixed floating-install-safe-bottom right-3.5 md:right-5 z-[38] flex flex-col items-end gap-2 pointer-events-none"
    >
      {/* Burbuja de instrucciones hacia arriba */}
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
