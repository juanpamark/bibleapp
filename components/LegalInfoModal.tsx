'use client';

import { useEffect, useRef } from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { useSwipeToClose } from '@/lib/useSwipeToClose';

export type LegalSection = 'privacy' | 'terms';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: LegalSection;
}

export default function LegalInfoModal({ isOpen, onClose, section }: LegalInfoModalProps) {
  const { scrollContainerRef, headerTouchHandlers, bodyTouchHandlers, sheetStyle } =
    useSwipeToClose({ onClose });
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

  const isPrivacy = section === 'privacy';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={isPrivacy ? 'Política de Privacidad' : 'Términos de Uso'}
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div
        style={sheetStyle}
        className="relative w-full sm:max-w-xl bg-surface-container-lowest text-on-surface rounded-none sm:rounded-3xl shadow-2xl sm:border sm:border-outline-variant/50 h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden pt-[env(safe-area-inset-top)] sm:pt-0"
      >
        <div {...headerTouchHandlers} className="touch-none select-none">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

          <header className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between gap-3 bg-surface-container-low/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                {isPrivacy ? <ShieldCheck className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-bold text-on-surface truncate">
                  {isPrivacy ? 'Política de Privacidad' : 'Términos de Uso'}
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Biblia · Traducción Directa de los Originales (TDO)
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </header>
        </div>

        <div
          ref={scrollContainerRef}
          {...bodyTouchHandlers}
          className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm leading-relaxed text-on-surface-variant"
        >
          {isPrivacy ? (
            <>
              <p className="text-on-surface">
                En <strong>Biblia · TDO</strong> valoramos tu tranquilidad espiritual y digital. Aquí explicamos con total claridad qué datos se guardan, para qué se usan y cómo mantienes siempre el control.
              </p>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  1. Datos guardados en tu dispositivo
                </h3>
                <p>
                  Puedes leer, resaltar versículos, escribir notas, activar el Modo Estudio y usar la guía diaria de oración sin crear ninguna cuenta. Toda esa actividad se almacena localmente en el navegador de tu teléfono o computadora.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  2. Inicio de sesión opcional con Google
                </h3>
                <p>
                  Si decides conectar tu cuenta de Google para respaldar tu estudio entre dispositivos, únicamente recibimos tu <strong>nombre, correo electrónico y foto de perfil</strong> a través del sistema de autenticación de Google y Supabase. No accedemos a tus contactos, correos ni archivos de Google.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  3. Privacidad y seguridad de tus notas
                </h3>
                <p>
                  Tus notas personales, carpetas, resaltados, versículos guardados y racha de lectura sincronizados en la nube están protegidos mediante políticas de seguridad por usuario (Row Level Security). Solo tu cuenta autenticada puede leer o modificar tu contenido personal.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  4. Cero venta o cesión de datos
                </h3>
                <p>
                  No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales ni de perfilamiento. La infraestructura técnica (Vercel y Supabase) se utiliza estrictamente para servir la aplicación y resguardar tus apuntes.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  5. Control y eliminación de tus datos
                </h3>
                <p>
                  En cualquier momento puedes editar o eliminar tus notas y resaltados dentro de la app, o cerrar sesión desde <strong>Perfil</strong> para limpiar inmediatamente los datos de tu cuenta en ese dispositivo.
                </p>
              </section>
            </>
          ) : (
            <>
              <p className="text-on-surface">
                Al utilizar <strong>Biblia · TDO</strong> aceptas estos términos pensados para proteger el propósito gratuito, respetuoso y formativo de esta aplicación.
              </p>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  1. Uso personal, devocional y comunitario
                </h3>
                <p>
                  Esta aplicación es de acceso libre para la lectura diaria, el estudio bíblico personal, la oración y la enseñanza en familias, grupos pequeños e iglesias. Puedes compartir versículos, notas de estudio y el enlace de la app mencionando «Biblia TDO».
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  2. Texto y notas de la Traducción Directa (TDO)
                </h3>
                <p>
                  La traducción al español contemporáneo y sus notas lingüísticas e históricas fueron elaboradas directamente a partir de ediciones críticas del griego koiné (SBLGNT / NA28). No está permitida la reproducción masiva con fines comerciales sin autorización expresa del proyecto.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  3. Tu cuenta y tu contenido personal
                </h3>
                <p>
                  Todo lo que escribes en tu cuaderno de notas te pertenece. Eres responsable de cuidar el acceso a tu cuenta de Google y de utilizar la aplicación conforme a la ley y al respeto mutuo.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  4. Mejora continua y apartados en desarrollo
                </h3>
                <p>
                  Biblia TDO evoluciona continuamente —incluyendo módulos marcados como <em>En desarrollo</em> (como planes ampliados de Estudio y la futura traducción directa del Antiguo Testamento)—. Aunque procuramos máxima estabilidad y fidelidad textual, el servicio se ofrece «tal cual», sujeto a mantenimientos y mejoras progresivas.
                </p>
              </section>

              <section className="space-y-1.5">
                <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                  5. Actualizaciones de estos términos
                </h3>
                <p>
                  Podemos actualizar estas condiciones cuando incorporemos nuevas herramientas para la comunidad. La versión vigente siempre estará disponible en este apartado dentro de <strong>Perfil &gt; Más</strong>.
                </p>
              </section>
            </>
          )}

          <p className="text-[11px] text-outline pt-2 border-t border-outline-variant/25">
            Última actualización: noviembre de 2026
          </p>
        </div>

        <footer className="px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-outline-variant/30 flex justify-end bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-tertiary text-on-primary active:scale-95 transition-transform"
          >
            Entendido
          </button>
        </footer>
      </div>
    </div>
  );
}
