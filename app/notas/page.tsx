'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Edit3,
  Folder,
  Plus,
  Search,
  ExternalLink,
  Trash2,
  FolderPlus,
  X,
  Bookmark,
  Highlighter,
} from 'lucide-react';
import { NoteFolder, UserNote } from '@/lib/supabase';
import {
  getFolders,
  getNotes,
  deleteNote,
  createFolder,
  getBookmarks,
  getAllHighlights,
  VerseHighlight,
  removeHighlight,
  toggleBookmark,
} from '@/lib/storage';
import { getBookMeta } from '@/lib/constants';
import TopHeader from '@/components/TopHeader';
import NoteModal from '@/components/NoteModal';
import GlobalSearchModal from '@/components/GlobalSearchModal';

export default function NotasPage() {
  const [sectionTab, setSectionTab] = useState<'notas' | 'resaltados' | 'guardados'>('notas');
  const [folders, setFolders] = useState<NoteFolder[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [editingNote, setEditingNote] = useState<UserNote | undefined>(undefined);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [allFolders, allNotes] = await Promise.all([getFolders(), getNotes()]);
      setFolders(allFolders);
      setNotes(allNotes);
      setHighlights(getAllHighlights());
      setBookmarks(getBookmarks());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteNote = async (id: string) => {
    if (confirm('¿Deseas eliminar este apunte de estudio?')) {
      await deleteNote(id);
      loadData();
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    await createFolder({
      name: newFolderName.trim(),
      description: newFolderDesc.trim(),
    });
    setNewFolderName('');
    setNewFolderDesc('');
    setShowNewFolderModal(false);
    loadData();
  };

  const filteredNotes = notes.filter((n) => {
    const matchesFolder = activeFolderId ? n.folder_id === activeFolderId : true;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesFolder;

    const bookName = getBookMeta(n.book)?.name || n.book;
    const matchesQuery =
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      bookName.toLowerCase().includes(q) ||
      (n.tags && n.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesFolder && matchesQuery;
  });

  const getNotesCountForFolder = (folderId: string) =>
    notes.filter((n) => n.folder_id === folderId).length;

  return (
    <div className="min-h-screen">
      <TopHeader title="Notas" onSearchClick={() => setShowSearchModal(true)} />

      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-6 pb-20">
        {/* Header */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Notas y Guardados
            </h1>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
              Tus reflexiones personales, versículos subrayados y marcadores.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingNote(undefined);
              setShowNoteModal(true);
            }}
            className="inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-tertiary text-on-primary font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-full shadow-xs active:scale-95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva nota</span>
          </button>
        </section>

        {/* Tabs Notas / Resaltados / Guardados */}
        <div className="inline-flex p-1 rounded-full bg-surface-container text-xs font-semibold">
          <button
            type="button"
            onClick={() => setSectionTab('notas')}
            className={`px-4 py-2 rounded-full transition-all ${
              sectionTab === 'notas'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Notas ({notes.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionTab('resaltados')}
            className={`px-4 py-2 rounded-full transition-all ${
              sectionTab === 'resaltados'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Resaltados ({highlights.length})
          </button>
          <button
            type="button"
            onClick={() => setSectionTab('guardados')}
            className={`px-4 py-2 rounded-full transition-all ${
              sectionTab === 'guardados'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Guardados ({bookmarks.length})
          </button>
        </div>

        {sectionTab === 'notas' && (
          <>
            {/* Buscador */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por pasaje, tema o contenido..."
                className="w-full pl-10 pr-8 py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/40 focus:border-primary text-xs sm:text-sm text-on-surface outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Limpiar búsqueda"
                  className="absolute right-3 text-outline hover:text-on-surface"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Carpetas en chips limpios horizontales + opción nueva carpeta */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface-variant">Carpetas</span>
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(true)}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <FolderPlus className="w-3.5 h-3.5" />
                  <span>Nueva carpeta</span>
                </button>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button
                  type="button"
                  onClick={() => setActiveFolderId(null)}
                  className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                    activeFolderId === null
                      ? 'bg-primary text-on-primary border-primary'
                      : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-primary/40'
                  }`}
                >
                  <span>Todas</span>
                  <span className="opacity-80">{notes.length}</span>
                </button>

                {folders.map((f) => {
                  const count = getNotesCountForFolder(f.id);
                  const isActive = activeFolderId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setActiveFolderId(isActive ? null : f.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border transition-all active:scale-95 ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary'
                          : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-primary/40'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>{f.name}</span>
                      <span className="opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Lista de notas */}
            <section className="space-y-3">
              {loading ? (
                <div className="space-y-3 py-4 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-28 rounded-2xl bg-surface-container-low" />
                  ))}
                </div>
              ) : filteredNotes.length === 0 ? (
                <div className="p-8 text-center rounded-3xl bg-surface-container-low space-y-3">
                  <Edit3 className="w-7 h-7 text-outline mx-auto" />
                  <p className="text-sm text-on-surface-variant">No hay notas en esta vista.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingNote(undefined);
                      setShowNoteModal(true);
                    }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    + Escribir primera nota
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotes.map((note) => {
                    const bookMeta = getBookMeta(note.book);
                    const bookName = bookMeta ? bookMeta.name : note.book;
                    const refString = `${bookName} ${note.chapter}:${note.verse}`;

                    return (
                      <article
                        key={note.id}
                        className="p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/lector/${note.book}/${note.chapter}#verse-${note.verse}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>{refString}</span>
                            </Link>

                            <span className="text-[11px] text-on-surface-variant">
                              {new Date(note.created_at).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteNote(note.id)}
                            aria-label="Eliminar nota"
                            className="text-outline hover:text-red-600 p-1 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div>
                          <h3 className="font-serif text-base font-bold text-on-surface mb-1">
                            {note.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-on-surface/90 leading-relaxed whitespace-pre-line">
                            {note.content}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-outline-variant/25 flex items-center justify-between gap-2 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {note.tags?.map((t, idx) => (
                              <span
                                key={idx}
                                className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingNote(note);
                              setShowNoteModal(true);
                            }}
                            className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Editar</span>
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {sectionTab === 'resaltados' && (
          <section className="space-y-3">
            {highlights.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-surface-container-low space-y-2">
                <Highlighter className="w-7 h-7 text-outline mx-auto" />
                <p className="text-sm text-on-surface-variant">
                  Aún no has subrayado versículos. Toca cualquier versículo al leer para elegir un color.
                </p>
              </div>
            ) : (
              highlights.map((h) => {
                const name = getBookMeta(h.book)?.name || h.book;
                return (
                  <div
                    key={`${h.book}-${h.chapter}-${h.verse}`}
                    className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between gap-3"
                  >
                    <Link
                      href={`/lector/${h.book}/${h.chapter}#verse-${h.verse}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <span
                        className="w-4 h-4 rounded-full flex-shrink-0 border border-black/10"
                        style={{ backgroundColor: h.color }}
                      />
                      <div className="min-w-0">
                        <p className="font-serif text-sm font-bold text-on-surface truncate">
                          {name} {h.chapter}:{h.verse}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Abrir pasaje en el lector
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        removeHighlight(h.book, h.chapter, h.verse);
                        setHighlights(getAllHighlights());
                      }}
                      aria-label="Quitar resaltado"
                      className="text-outline hover:text-red-600 p-1.5 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </section>
        )}

        {sectionTab === 'guardados' && (
          <section className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-surface-container-low space-y-2">
                <Bookmark className="w-7 h-7 text-outline mx-auto" />
                <p className="text-sm text-on-surface-variant">
                  Aún no has guardado versículos favoritos.
                </p>
              </div>
            ) : (
              bookmarks.map((key) => {
                const [book, ch, vs] = key.split('_');
                const chapter = parseInt(ch || '1', 10);
                const verse = parseInt(vs || '1', 10);
                const name = getBookMeta(book)?.name || book;
                return (
                  <div
                    key={key}
                    className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 flex items-center justify-between gap-3"
                  >
                    <Link
                      href={`/lector/${book}/${chapter}#verse-${verse}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <Bookmark className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
                      <div>
                        <p className="font-serif text-sm font-bold text-on-surface">
                          {name} {chapter}:{verse}
                        </p>
                        <p className="text-[11px] text-on-surface-variant">
                          Ir al versículo
                        </p>
                      </div>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        toggleBookmark(book, chapter, verse);
                        setBookmarks(getBookmarks());
                      }}
                      aria-label="Quitar marcador"
                      className="text-outline hover:text-red-600 p-1.5 rounded-full"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </section>
        )}
      </div>

      <NoteModal
        isOpen={showNoteModal}
        onClose={() => {
          setShowNoteModal(false);
          setEditingNote(undefined);
          loadData();
        }}
        existingNote={editingNote}
        verseRef={
          editingNote
            ? {
                book: editingNote.book,
                chapter: editingNote.chapter,
                verse: editingNote.verse,
              }
            : undefined
        }
      />

      {showNewFolderModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Nueva carpeta"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="fixed inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setShowNewFolderModal(false)}
          />
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-3xl shadow-2xl border border-outline-variant/50 p-5 z-10 animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-on-surface">Nueva carpeta</h3>
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                aria-label="Cerrar"
                className="w-7 h-7 rounded-full flex items-center justify-center text-outline hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Ej. Cartas de la prisión"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Descripción (opcional)
                </label>
                <input
                  type="text"
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                  placeholder="Ej. Filipenses, Efesios y Colosenses"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-sm text-on-surface outline-none focus:border-primary"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewFolderModal(false)}
                  className="px-4 py-2 rounded-full text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-primary text-on-primary hover:bg-tertiary"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </div>
  );
}
