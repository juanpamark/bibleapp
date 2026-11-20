'use client';

import { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Phone, CheckCircle2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  ensureUserScope,
  migrateGuestDataToCloud,
  setDisplayName,
  syncCloudUserData,
} from '@/lib/storage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COUNTRY_CODES = [
  { code: '+57', label: '🇨🇴 +57' },
  { code: '+52', label: '🇲🇽 +52' },
  { code: '+1', label: '🇺🇸 +1' },
  { code: '+34', label: '🇪🇸 +34' },
  { code: '+54', label: '🇦🇷 +54' },
  { code: '+51', label: '🇵🇪 +51' },
  { code: '+56', label: '🇨🇱 +56' },
  { code: '+593', label: '🇪🇨 +593' },
  { code: '+58', label: '🇻🇪 +58' },
  { code: '+506', label: '🇨🇷 +506' },
  { code: '+507', label: '🇵🇦 +507' },
  { code: '+502', label: '🇬🇹 +502' },
];

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [countryCode, setCountryCode] = useState('+57');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [pendingVerifyEmail, setPendingVerifyEmail] = useState<string | null>(null);
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

  const normalizedDigits = phoneDigits.replace(/\D/g, '');
  const fullPhone = `${countryCode}${normalizedDigits}`;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const redirectTo =
        typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Google aún no está activado en este proyecto.';
      setMsg({
        type: 'error',
        text: message.includes('provider')
          ? 'El acceso con Google aún no está habilitado en Supabase. Puedes registrarte con tu correo y teléfono.'
          : message,
      });
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!pendingVerifyEmail) return;
    setResending(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingVerifyEmail,
        options: {
          emailRedirectTo:
            typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined,
        },
      });
      if (error) throw error;
      setMsg({
        type: 'success',
        text: 'Te reenviamos el correo de confirmación. Revisa tu bandeja o spam.',
      });
    } catch (err: unknown) {
      setMsg({
        type: 'error',
        text: err instanceof Error ? err.message : 'No se pudo reenviar el correo.',
      });
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setMsg(null);

    if (authMode === 'signup') {
      const cleanName = fullName.trim();
      if (cleanName.length < 2) {
        setMsg({ type: 'error', text: 'Ingresa tu nombre completo (mínimo 2 caracteres).' });
        return;
      }
      if (normalizedDigits.length < 7 || normalizedDigits.length > 13) {
        setMsg({
          type: 'error',
          text: 'Ingresa un número de teléfono válido (entre 7 y 13 dígitos).',
        });
        return;
      }
    }

    setLoading(true);

    try {
      if (authMode === 'signup') {
        // Verificar que el teléfono no esté ya registrado en otra cuenta
        try {
          const { data: available, error: phoneErr } = await supabase.rpc(
            'check_phone_available',
            { p_phone: fullPhone }
          );
          if (!phoneErr && available === false) {
            setMsg({
              type: 'error',
              text: 'Este número de teléfono ya está asociado a otra cuenta. Inicia sesión con tu correo.',
            });
            setLoading(false);
            return;
          }
        } catch {}

        const cleanName = fullName.trim();
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo:
              typeof window !== 'undefined' ? `${window.location.origin}/perfil` : undefined,
            data: {
              full_name: cleanName,
              phone: fullPhone,
            },
          },
        });

        if (error) {
          if (error.message?.toLowerCase().includes('already registered')) {
            throw new Error('Este correo ya está registrado. Intenta iniciar sesión.');
          }
          if (error.message?.toLowerCase().includes('database error')) {
            throw new Error(
              'Ese número de teléfono ya pertenece a otra cuenta o los datos no son válidos.'
            );
          }
          throw error;
        }

        if (data?.session?.user) {
          ensureUserScope(data.session.user.id);
          setDisplayName(cleanName);
          await migrateGuestDataToCloud();
          await syncCloudUserData();
          setMsg({ type: 'success', text: '¡Cuenta creada y sincronizada!' });
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 500);
        } else {
          setPendingVerifyEmail(email.trim());
          setMsg({
            type: 'success',
            text: 'Cuenta registrada. Revisa tu correo para confirmar tu dirección antes de iniciar sesión.',
          });
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) {
          if (error.message?.toLowerCase().includes('email not confirmed')) {
            setPendingVerifyEmail(email.trim());
            throw new Error(
              'Debes confirmar tu correo electrónico antes de entrar. Revisa tu bandeja de entrada.'
            );
          }
          throw error;
        }

        if (data?.user) {
          ensureUserScope(data.user.id);
          await migrateGuestDataToCloud();
          await syncCloudUserData();
        }

        setMsg({ type: 'success', text: 'Sesión iniciada.' });
        setTimeout(() => {
          onSuccess?.();
          onClose();
        }, 450);
      }
    } catch (err: unknown) {
      setMsg({
        type: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'No se pudo completar. Verifica tus datos e intenta de nuevo.',
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

      <div className="relative w-full max-w-md bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 p-5 sm:p-6 z-10 animate-slide-up sm:animate-fade-in space-y-4 max-h-[92dvh] overflow-y-auto">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto -mt-1 sm:hidden" />

        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-on-surface">
              {pendingVerifyEmail
                ? 'Confirma tu correo'
                : authMode === 'signin'
                ? 'Iniciar sesión'
                : 'Crear cuenta gratuita'}
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {pendingVerifyEmail
                ? 'Verifica tu correo para proteger y sincronizar tu cuenta.'
                : 'Respalda tus notas, resaltados, marcadores y racha individual.'}
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

        {pendingVerifyEmail ? (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/40 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs leading-relaxed">
                <p className="font-semibold text-on-surface">
                  Enviamos un enlace de verificación a:
                </p>
                <p className="font-mono text-primary break-all">{pendingVerifyEmail}</p>
                <p className="text-on-surface-variant">
                  Haz clic en el enlace del correo para activar tu cuenta (revisa también la carpeta de spam).
                </p>
              </div>
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

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                <span>{resending ? 'Reenviando...' : 'Reenviar correo de verificación'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPendingVerifyEmail(null);
                  setAuthMode('signin');
                  setMsg(null);
                }}
                className="w-full py-2.5 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold transition-all"
              >
                Ya confirmé mi correo · Iniciar sesión
              </button>
            </div>
          </div>
        ) : (
          <>
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

            <form onSubmit={handleSubmit} className="space-y-3">
              {authMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Nombre completo
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        minLength={2}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ej. María Gómez"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface border border-transparent focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                      Teléfono celular <span className="text-[11px] font-normal">(1 cuenta por número)</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Código de país"
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="px-2.5 py-2.5 rounded-xl bg-surface-container text-xs font-semibold text-on-surface border border-transparent focus:border-primary outline-none"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="tel"
                          required
                          inputMode="numeric"
                          value={phoneDigits}
                          onChange={(e) => setPhoneDigits(e.target.value.replace(/[^\d\s-]/g, ''))}
                          placeholder="300 123 4567"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container text-sm text-on-surface border border-transparent focus:border-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

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

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-outline-variant/40" />
              <span className="px-3 text-[11px] font-medium text-on-surface-variant">o</span>
              <div className="flex-grow border-t border-outline-variant/40" />
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs inline-flex items-center justify-center gap-2 border border-outline-variant/40 active:scale-[0.99] transition-all disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
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
              <span>Continuar con Google</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
