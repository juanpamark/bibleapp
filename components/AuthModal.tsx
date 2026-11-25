'use client';

import { useState, useEffect, useRef } from 'react';
import { X, CheckCircle2, Cloud, ShieldCheck, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      wasOpenRef.current = true;
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));
    } else if (wasOpenRef.current) {
      wasOpenRef.current = false;
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: true } }));
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });
      if (error) throw error;
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'No se pudo iniciar sesión con Google en este momento.';
      setErrorMsg(
        message.toLowerCase().includes('provider')
          ? 'El acceso con Google aún no está activado en Supabase. Revisa la configuración de Sign In / Providers → Google.'
          : message
      );
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Iniciar sesión con Google"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 p-5 sm:p-6 z-10 animate-slide-up sm:animate-fade-in space-y-5">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto -mt-1 sm:hidden" />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface">
              Iniciar sesión con Google
            </h2>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              Conecta tu cuenta para sincronizar tus notas, resaltados, versículos guardados y tu racha de lectura entre todos tus dispositivos.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-2.5 rounded-2xl bg-surface-container-low p-4 border border-outline-variant/35">
          <li className="flex items-start gap-2.5 text-xs text-on-surface">
            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Acceso en un clic con tu cuenta de Google, sin contraseñas nuevas.</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs text-on-surface">
            <Cloud className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Tus notas, subrayados y racha respaldados en la nube.</span>
          </li>
          <li className="flex items-start gap-2.5 text-xs text-on-surface">
            <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <span>Sincronización automática entre celular y computadora.</span>
          </li>
        </ul>

        {errorMsg && (
          <div className="p-3 rounded-2xl text-xs bg-red-500/10 text-red-500 border border-red-500/30 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 rotate-45" />
            <span>{errorMsg}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 px-4 rounded-full bg-primary hover:bg-tertiary text-on-primary font-semibold text-sm inline-flex items-center justify-center gap-2.5 shadow-sm active:scale-[0.99] transition-all disabled:opacity-50"
        >
          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center flex-shrink-0">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
              />
            </svg>
          </span>
          <span>{loading ? 'Conectando con Google...' : 'Continuar con Google'}</span>
        </button>
      </div>
    </div>
  );
}
