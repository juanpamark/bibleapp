'use client';

import { useEffect } from 'react';
import { X, BookOpen, Check } from 'lucide-react';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TranslationModal({ isOpen, onClose }: TranslationModalProps) {
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

  const pillars = [
    {
      title: '1. Textos originales',
      text: 'Traducción directa del griego koiné (texto crítico SBLGNT / NA28) en el Nuevo Testamento y, próximamente, del hebreo y arameo bíblico en el Antiguo Testamento.',
    },
    {
      title: '2. Español neutro actual',
      text: 'Redacción clara y fiel en español latinoamericano contemporáneo, evitando arcaísmos innecesarios y priorizando fidelidad al sentido original.',
    },
    {
      title: '3. Notas por versículo',
      text: 'Cada versículo incluye notas de estudio sobre vocabulario original, variantes manuscritas relevantes y contexto histórico del siglo I.',
    },
  ];

  const examples = [
    {
      ref: 'Mateo 6:11',
      title: '«El pan nuestro de cada día» (epioúsion)',
      detail: 'Explica el término griego único usado por Jesús y su eco con la provisión diaria del maná en el desierto.',
    },
    {
      ref: 'Juan 1:1',
      title: '«En el principio era el Verbo» (Logos)',
      detail: 'Distingue el matiz entre existencia eterna («era») e inicio histórico («llegó a ser»), conservando el peso teológico del prólogo.',
    },
    {
      ref: 'Filipenses 2:6',
      title: 'El himno de la humildad de Cristo (harpagmón)',
      detail: 'Expone con claridad el significado de no aferrarse como botín ni explotar la igualdad con Dios.',
    },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Acerca de esta traducción"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 max-h-[88dvh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Traducción Directa (TDO)
              </h2>
              <p className="text-xs text-on-surface-variant">
                Criterios de traducción y notas de estudio
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div className="space-y-2.5">
            {pillars.map((p) => (
              <div key={p.title} className="p-4 rounded-2xl bg-surface-container-low space-y-1">
                <h3 className="text-sm font-semibold text-on-surface">{p.title}</h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2.5">
            <h3 className="font-serif text-base font-bold text-on-surface">
              Cómo funcionan las notas de estudio
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
          </div>
        </div>

        <div className="px-5 py-3.5 border-t border-outline-variant/30 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-tertiary text-on-primary active:scale-95 transition-all"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
