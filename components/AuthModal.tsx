'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('biblia-toggle-nav', { detail: { visible: false } }));
    } else {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setMsg(null);

    try {
      if (authMode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({
          type: 'success',
          text: 'Cuenta registrada. Revisa tu correo o inicia sesión para sincronizar.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg({ type: 'success', text: 'Sesión iniciada.' });
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 500);
      }
    } catch (err: any) {
      setMsg({
        type: 'error',
        text: err?.message || 'No se pudo completar. Verifica tus datos e intenta de nuevo.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cuenta y sincronización"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-md bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 p-5 sm:p-6 z-10 animate-slide-up sm:animate-fade-in space-y-5">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto -mt-1 sm:hidden" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface">
              {authMode === 'signin' ? 'Iniciar sesión' : 'Crear cuenta'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Respalda tus notas, resaltados y marcadores en la nube.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 p-1 rounded-full bg-surface-container text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setMsg(null);
            }}
            className={`py-2 rounded-full transition-all ${
              authMode === 'signin'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setMsg(null);
            }}
            className={`py-2 rounded-full transition-all ${
              authMode === 'signup'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Registrarme
          </button>
        </div>

        {msg && (
          <div
            className={`p-3 rounded-2xl text-xs ${
              msg.type === 'error'
                ? 'bg-red-500/10 text-red-500 border border-red-500/30'
                : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
            }`}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-on-surface-variant mb-1">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface border border-transparent focus:border-primary outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-primary hover:bg-tertiary text-on-primary font-semibold text-sm active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {loading
              ? 'Procesando...'
              : authMode === 'signin'
              ? 'Iniciar sesión'
              : 'Crear cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
