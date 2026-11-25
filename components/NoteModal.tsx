'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Folder, Tag, Save, Check } from 'lucide-react';
import { NoteFolder, UserNote } from '@/lib/supabase';
import { getFolders, createNote, updateNote } from '@/lib/storage';
import { getBookMeta } from '@/lib/constants';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseRef?: {
    book: string;
    chapter: number;
    verse: number;
    text?: string;
  };
  existingNote?: UserNote;
  onSaved?: (note: UserNote) => void;
}

export default function NoteModal({
  isOpen,
  onClose,
  verseRef,
  existingNote,
  onSaved,
}: NoteModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedFolderId, setSelectedFolderId] = useState<string>('');
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      getFolders().then((f) => {
        setFolders(f);
        if (f.length > 0 && !selectedFolderId) {
          setSelectedFolderId(f[0].id);
        }
      });

      if (existingNote) {
        setTitle(existingNote.title);
        setContent(existingNote.content);
        setTagsInput(existingNote.tags ? existingNote.tags.join(', ') : '');
        setSelectedFolderId(existingNote.folder_id || '');
      } else if (verseRef) {
        const bookMeta = getBookMeta(verseRef.book);
        const bookName = bookMeta ? bookMeta.name : verseRef.book;
        setTitle(`Reflexión en ${bookName} ${verseRef.chapter}:${verseRef.verse}`);
        setContent('');
        setTagsInput('Estudio, Exégesis');
      }
    }
  }, [isOpen, existingNote, verseRef]);

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

  const bookName = verseRef ? getBookMeta(verseRef.book)?.name || verseRef.book : '';
  const refDisplay = verseRef ? `${bookName} ${verseRef.chapter}:${verseRef.verse}` : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, '').slice(0, 32))
      .filter((t) => t.length > 0)
      .slice(0, 15);

    const book = verseRef?.book || existingNote?.book || 'MAT';
    const chapter = verseRef?.chapter || existingNote?.chapter || 1;
    const verse = verseRef?.verse || existingNote?.verse || 1;

    try {
      const saved = existingNote
        ? (await updateNote(existingNote.id, {
            title,
            content,
            tags,
            folder_id: selectedFolderId || null,
          })) || existingNote
        : await createNote({
            book,
            chapter,
            verse,
            title,
            content,
            tags,
            folder_id: selectedFolderId || null,
          });

      setSavedSuccess(true);
      if (onSaved) onSaved(saved);
      setTimeout(() => {
        setSavedSuccess(false);
        setSaving(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error('Error guardando apunte:', err);
      setSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={existingNote ? 'Editar nota' : 'Nueva nota de estudio'}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/45 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-surface-container-lowest text-on-surface rounded-t-3xl sm:rounded-3xl shadow-2xl border border-outline-variant/50 overflow-hidden z-10 animate-slide-up sm:animate-fade-in flex flex-col max-h-[90dvh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/30 flex items-center justify-between bg-surface-container-low/60">
          <div>
            <h3 className="font-serif text-lg font-bold text-primary">
              {existingNote ? 'Editar Apunte' : 'Nuevo Apunte de Estudio'}
            </h3>
            {refDisplay && (
              <span className="text-xs font-semibold text-secondary block mt-0.5">
                Vinculado a: {refDisplay}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-container active:scale-95 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Título del Apunte
            </label>
            <input
              type="text"
              required
              maxLength={200}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. La gracia transformadora y la ley..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm font-medium outline-none transition-colors"
            />
          </div>

          {/* Carpeta */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              <Folder className="w-3.5 h-3.5 inline mr-1 text-secondary" />
              Carpeta de Estudio
            </label>
            <select
              value={selectedFolderId}
              onChange={(e) => setSelectedFolderId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary text-on-surface text-sm outline-none transition-colors"
            >
              <option value="">Sin carpeta específica</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              Contenido & Reflexión Exegética
            </label>
            <textarea
              required
              rows={4}
              maxLength={20000}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Escribe tus observaciones teológicas, aplicaciones y términos clave..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary focus:ring-1 focus:ring-primary text-on-surface text-sm leading-relaxed outline-none transition-colors"
            />
          </div>

          {/* Etiquetas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1">
              <Tag className="w-3.5 h-3.5 inline mr-1 text-secondary" />
              Etiquetas (separadas por comas)
            </label>
            <input
              type="text"
              maxLength={240}
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Paz, Justificación, Cristo"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 focus:border-primary text-on-surface text-sm outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary hover:bg-tertiary text-on-primary active:scale-95 transition-all shadow-sm disabled:opacity-50"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-green-300" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Guardando...' : 'Guardar Apunte'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
