'use client';

import { useEffect, useRef } from 'react';
import { X, BookOpen, Check, Languages, ScrollText, Sparkles } from 'lucide-react';
import { useSwipeToClose } from '@/lib/useSwipeToClose';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationModal({ isOpen, onClose }: TranslationModalProps) {
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

  const pillars = [
    {
      title: '1. Directo de los textos originales',
      text: 'El Nuevo Testamento fue traducido directamente desde el griego koiné (texto crítico SBLGNT / NA28), sin pasar por traducciones puente en otros idiomas. El Antiguo Testamento se preparará directamente del hebreo y arameo bíblico.',
    },
    {
      title: '2. Español neutro actual, fiel al autor',
      text: 'Redactada en español latinoamericano contemporáneo (usando «ustedes» en lugar de arcaísmos), buscando que el texto suene natural hoy sin suavizar ni perder la fuerza exacta que tenía en el siglo I.',
    },
    {
      title: '3. Notas de estudio en cada versículo',
      text: 'En lugar de obligarte a adivinar por qué se tradujo una palabra de cierta manera, cada versículo incluye el texto griego y notas claras sobre vocabulario, tiempos verbales, contexto histórico y variantes manuscritas.',
    },
  ];

  const greekNuances = [
    {
      title: 'Tiempos verbales continuos vs. puntuales',
      detail:
        'En griego, un mandato en presente suele indicar una acción continua («sigan buscando», «sigan transformándose»), mientras el aoristo señala una decisión o hecho puntual. Las notas te muestran esa diferencia.',
    },
    {
      title: 'Palabras que en español necesitan una frase entera',
      detail:
        'Términos como «gracia» (cháris), «arrepentimiento» (metánoia) o «paz» (eirḗnē) cargan siglos de trasfondo bíblico y cultural que una sola palabra moderna no siempre alcanza a abarcar.',
    },
    {
      title: 'Transparencia con los manuscritos y corchetes [ ]',
      detail:
        'Cuando los manuscritos griegos más antiguos presentan diferencias notables o un pasaje aparece en testimonios posteriores, lo señalamos con [corchetes] y explicamos el contexto textual en la nota sin ocultarte nada.',
    },
  ];

  const examples = [
    {
      ref: 'Juan 1:1',
      title: '«En el principio era el Verbo» (Lógos · ἦν)',
      detail:
        'Distingue el matiz entre existencia eterna continua («era», en imperfecto griego) e inicio creado («llegó a ser»), conservando todo el peso teológico del prólogo de Juan.',
    },
    {
      ref: 'Mateo 6:11',
      title: '«El pan nuestro de cada día» (epioúsion)',
      detail:
        'Explica este vocablo rarísimo usado por Jesús —casi exclusivo del Padre Nuestro— y su conexión con la provisión diaria del maná en el desierto.',
    },
    {
      ref: 'Filipenses 2:6',
      title: 'El himno de la humildad de Cristo (harpagmón)',
      detail:
        'Aclara que Cristo no consideró su igualdad con Dios como un «botín al cual aferrarse» ni como ventaja para explotar, sino que se despojó a sí mismo por amor.',
    },
    {
      ref: 'Filipenses 4:7',
      title: '«La paz de Dios guardará sus corazones» (phrourḗsei)',
      detail:
        'El verbo griego describe una guarnición de soldados montando guardia alrededor de una ciudad: la paz de Dios custodia activamente tu corazón y tus pensamientos.',
    },
    {
      ref: 'Romanos 12:2',
      title: '«Transfórmense mediante la renovación de su mente» (metamorphoústhe)',
      detail:
        'En presente pasivo imperativo: una transformación profunda y continua desde adentro hacia afuera, opuesta a amoldarse pasivamente al molde externo de esta época.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Acerca de esta traducción"
      className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />

      <div
        style={sheetStyle}
        className="relative w-full sm:max-w-2xl bg-surface-container-lowest text-on-surface rounded-none sm:rounded-3xl shadow-2xl sm:border sm:border-outline-variant/50 h-[100dvh] sm:h-auto sm:max-h-[90vh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden pt-[env(safe-area-inset-top)] sm:pt-0"
      >
        <div {...headerTouchHandlers} className="touch-none select-none">
          <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

          <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between gap-3 bg-surface-container-low/50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-serif text-lg font-bold text-on-surface truncate">
                  Traducción Directa (TDO)
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Metodología, manuscritos y cómo estudiar el texto original
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
          </div>
        </div>

        <div
          ref={scrollContainerRef}
          {...bodyTouchHandlers}
          className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1"
        >
          {/* Introducción editorial */}
          <section className="space-y-2">
            <p className="font-serif text-sm sm:text-[15px] text-on-surface leading-relaxed">
              Al traducir un texto antiguo a otro idioma, siempre hay matices, juegos de palabras y énfasis del autor que no caben en una sola equivalencia. <strong>Biblia · TDO</strong> nace para acercarte lo más posible a lo que leyeron y escucharon las primeras comunidades cristianas, con total claridad y sin necesitar estudios previos de griego.
            </p>
          </section>

          {/* Pilares fundamentales */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-base font-bold text-on-surface">
                Los tres pilares de esta traducción
              </h3>
            </div>
            <div className="space-y-2.5">
              {pillars.map((p) => (
                <div key={p.title} className="p-4 rounded-2xl bg-surface-container-low space-y-1">
                  <h4 className="text-sm font-semibold text-on-surface">{p.title}</h4>
                  <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Qué se suele perder al traducir */}
          <section className="space-y-2.5">
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-base font-bold text-on-surface">
                Lo que el idioma original revela
              </h3>
            </div>
            <div className="space-y-2">
              {greekNuances.map((item) => (
                <div
                  key={item.title}
                  className="p-3.5 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest space-y-1"
                >
                  <p className="text-xs sm:text-sm font-semibold text-on-surface">{item.title}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Cómo sacarle provecho en la app */}
          <section className="p-4 rounded-2xl bg-primary/[0.07] border border-primary/20 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <h3 className="font-serif text-sm sm:text-base font-bold text-on-surface">
                Cómo aprovechar las notas mientras lees
              </h3>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              <li>
                • <strong className="text-on-surface">Modo Estudio:</strong> activa el interruptor en la barra superior del lector y toca el{' '}
                <span className="font-semibold text-primary">punto dorado</span> al final de cualquier versículo para abrir el griego en 1 toque.
              </li>
              <li>
                • <strong className="text-on-surface">Joya del griego:</strong> al terminar cada capítulo verás destacada la nota léxica más rica de ese pasaje.
              </li>
              <li>
                • <strong className="text-on-surface">Contexto del libro (Cap. 0):</strong> antes de empezar un libro nuevo, lee quién lo escribió, a quién y por qué.
              </li>
            </ul>
          </section>

          {/* 5 Ejemplos prácticos */}
          <section className="space-y-2.5">
            <h3 className="font-serif text-base font-bold text-on-surface">
              Ejemplos reales en la TDO
            </h3>
            <div className="space-y-2">
              {examples.map((ex) => (
                <div
                  key={ex.ref}
                  className="p-3.5 rounded-2xl border border-outline-variant/40 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-sm font-bold text-primary">{ex.ref}</span>
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs font-semibold text-on-surface">{ex.title}</p>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{ex.detail}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="px-5 py-3.5 pb-[calc(0.875rem+env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-outline-variant/30 flex justify-end bg-surface-container-low/40">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-tertiary text-on-primary active:scale-95 transition-transform"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
