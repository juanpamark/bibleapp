'use client';

import { useState, useEffect } from 'react';
import { X, Copy, Check, BookOpen, Edit3, Languages, Sparkles } from 'lucide-react';
import { VerseRecord } from '@/lib/supabase';
import { getBookMeta } from '@/lib/constants';
import { parseStudyNote } from '@/lib/study-note-format';

interface ExegesisDrawerProps {
  verse: VerseRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote?: (verse: VerseRecord) => void;
}

export default function ExegesisDrawer({
  verse,
  isOpen,
  onClose,
  onAddNote,
}: ExegesisDrawerProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !verse) return null;

  const bookMeta = getBookMeta(verse.book);
  const bookName = bookMeta ? bookMeta.name : verse.book;
  const reference = `${bookName} ${verse.chapter}:${verse.verse}`;
  const parsedNote = parseStudyNote(verse.translation_notes);

  const handleCopyNote = async () => {
    const textToCopy = `${reference} (TDO)\n«${verse.translation}»\n\nTexto original:\n${verse.greek_text}\n\nNota de estudio:\n${verse.translation_notes || 'Lectura directa del texto base.'}`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setTimeout(() => setCopied(false), 0), 2000);
    } catch (e) {
      console.error('Error al copiar:', e);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Estudio de ${reference}`}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 max-h-[88dvh] flex flex-col z-10 animate-slide-up sm:animate-fade-in overflow-hidden">
        <div className="w-10 h-1 bg-outline-variant rounded-full mx-auto mt-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-lg font-bold text-primary">{reference}</h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
                TDO
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Aprende del texto griego original
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar estudio del versículo"
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">
              Traducción TDO
            </span>
            <p className="font-serif text-base sm:text-lg leading-relaxed text-on-surface">
              «{verse.translation}»
            </p>
          </div>

          {parsedNote.isStructured ? (
            <div className="space-y-3.5 pt-1">
              {parsedNote.originalPart && (
                <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/35 space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      En el original
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-on-surface/95">
                    {parsedNote.originalPart}
                  </p>
                </div>
              )}

              {parsedNote.contextPart && (
                <div className="p-4 rounded-2xl bg-surface-container/60 border-l-2 border-primary space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-on-surface">
                      Para entenderlo mejor
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] leading-relaxed text-on-surface/90">
                    {parsedNote.contextPart}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-1.5 text-on-surface">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  Notas de estudio
                </h3>
              </div>
              {verse.translation_notes ? (
                <div className="text-sm sm:text-[15px] leading-relaxed text-on-surface/90 whitespace-pre-line">
                  {verse.translation_notes}
                </div>
              ) : (
                <p className="text-sm text-on-surface-variant italic">
                  Este versículo sigue de manera unánime la lectura de los manuscritos más antiguos.
                </p>
              )}
            </div>
          )}

          <div className="p-3.5 rounded-2xl bg-surface-container-low/70 border border-outline-variant/25 space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant block">
              Manuscrito griego (SBLGNT)
            </span>
            <p className="font-serif text-base sm:text-[17px] text-on-surface/85 leading-relaxed">
              {verse.greek_text || '(Texto original no disponible)'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleCopyNote}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-on-surface bg-surface-container hover:bg-surface-container-high active:scale-95 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-primary" />
                <span>Copiar estudio</span>
              </>
            )}
          </button>

          {onAddNote && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onAddNote(verse);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-primary hover:bg-tertiary text-on-primary active:scale-95 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Escribir nota</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
