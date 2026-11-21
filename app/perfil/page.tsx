'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Flame,
  Sun,
  Moon,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
  Cloud,
  LogOut,
  BookOpen,
  Edit3,
  Bookmark,
  Highlighter,
  Share2,
  Check,
  Info,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { supabase, UserNote } from '@/lib/supabase';
import {
  getNotes,
  getAllHighlights,
  getBookmarkItems,
  getReadingStreak,
  getReadingTheme,
  setReadingTheme,
  ReadingTheme,
  getFontSize,
  setFontSize,
  getShowNoteIndicators,
  setShowNoteIndicators,
  getDisplayName,
  setDisplayName,
  saveProfileNameCloud,
  syncCloudUserData,
  clearUserSessionLocalData,
  ensureUserScope,
  VerseHighlight,
  BookmarkMetaItem,
} from '@/lib/storage';
import { getHighlightSwatch } from '@/lib/highlights';
import { getBookMeta } from '@/lib/constants';
import { shareBibleApp } from '@/lib/share';
import TopHeader from '@/components/TopHeader';
import TranslationModal from '@/components/TranslationModal';
import GlobalSearchModal from '@/components/GlobalSearchModal';
import AuthModal from '@/components/AuthModal';
import InstallAppPrompt from '@/components/InstallAppPrompt';
import LegalInfoModal, { LegalSection } from '@/components/LegalInfoModal';

type ProfileView = 'main' | 'settings' | 'more';
type ActivityFilter = 'all' | 'highlights' | 'notes' | 'bookmarks';

interface ActivityItem {
  id: string;
  type: 'highlight' | 'note' | 'bookmark';
  book: string;
  chapter: number;
  verse: number;
  refLabel: string;
  verseText?: string;
  noteTitle?: string;
  noteContent?: string;
  color?: string;
  dateIso: string;
}

export default function PerfilPage() {
  const [view, setView] = useState<ProfileView>('main');
  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');

  const [sessionUser, setSessionUser] = useState<any>(null);
  const [profileName, setProfileName] = useState('');
  const [editingName, setEditingName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState<ReadingTheme>('light');
  const [fontSize, setFontSizeState] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [noteIndicators, setNoteIndicators] = useState(true);

  const [notes, setNotes] = useState<UserNote[]>([]);
  const [highlights, setHighlights] = useState<VerseHighlight[]>([]);
  const [bookmarks, setBookmarks] = useState<BookmarkMetaItem[]>([]);
  const [hydratedTexts, setHydratedTexts] = useState<Record<string, string>>({});

  const [showTransModal, setShowTransModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [legalModalSection, setLegalModalSection] = useState<LegalSection | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showGesturesInfo, setShowGesturesInfo] = useState(false);

  const loadAllUserData = async () => {
    setTheme(getReadingTheme());
    setFontSizeState(getFontSize());
    setNoteIndicators(getShowNoteIndicators());

    try {
      const { data: sessionRes } = await supabase.auth.getSession();
      const user = sessionRes?.session?.user || null;
      setSessionUser(user);
      if (user) {
        ensureUserScope(user.id);
        await syncCloudUserData();
      }
    } catch {}

    setStreak(getReadingStreak());
    const storedName = getDisplayName();
    setProfileName(storedName);
    setEditingName(storedName);

    const hl = getAllHighlights();
    const bm = getBookmarkItems();
    setHighlights(hl);
    setBookmarks(bm);

    try {
      const allNotes = await getNotes();
      setNotes(allNotes);

      // Hidratar textos de versículos para resaltados, notas y guardados
      const missingRefs: { book: string; chapter: number; verse: number; key: string }[] = [];
      for (const h of hl) {
        if (!h.text) {
          missingRefs.push({
            book: h.book.toUpperCase(),
            chapter: h.chapter,
            verse: h.verse,
            key: `${h.book.toUpperCase()}:${h.chapter}:${h.verse}`,
          });
        }
      }
      for (const n of allNotes) {
        missingRefs.push({
          book: n.book.toUpperCase(),
          chapter: n.chapter,
          verse: n.verse,
          key: `${n.book.toUpperCase()}:${n.chapter}:${n.verse}`,
        });
      }
      for (const b of bm) {
        if (!b.text) {
          missingRefs.push({
            book: b.book.toUpperCase(),
            chapter: b.chapter,
            verse: b.verse,
            key: `${b.book.toUpperCase()}:${b.chapter}:${b.verse}`,
          });
        }
      }

      if (missingRefs.length > 0) {
        // Deduplicar y consultar exactamente solo las referencias faltantes en bloques de 25
        const uniqueMap = new Map<string, { book: string; chapter: number; verse: number }>();
        for (const r of missingRefs) {
          if (!uniqueMap.has(r.key)) {
            uniqueMap.set(r.key, { book: r.book, chapter: r.chapter, verse: r.verse });
          }
        }
        const exactRefs = Array.from(uniqueMap.values()).slice(0, 75);
        const map: Record<string, string> = {};

        for (let i = 0; i < exactRefs.length; i += 25) {
          const batch = exactRefs.slice(i, i + 25);
          const orFilter = batch
            .map((r) => `and(book.eq.${r.book},chapter.eq.${r.chapter},verse.eq.${r.verse})`)
            .join(',');
          const { data: versesData } = await supabase
            .from('verses')
            .select('book, chapter, verse, translation')
            .or(orFilter);

          if (versesData) {
            for (const v of versesData) {
              map[`${v.book.toUpperCase()}:${v.chapter}:${v.verse}`] = v.translation;
            }
          }
        }
        setHydratedTexts(map);
      }
    } catch (err) {
      console.error('Error cargando datos de perfil:', err);
    }
  };

  useEffect(() => {
    loadAllUserData();

    const handleTheme = (e: CustomEvent<{ theme?: ReadingTheme }>) => {
      if (e?.detail?.theme) setTheme(e.detail.theme);
    };
    window.addEventListener('biblia-theme-change', handleTheme as EventListener);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      setSessionUser(user);
      if (
        event === 'SIGNED_IN' &&
        typeof window !== 'undefined' &&
        (window.location.hash.includes('access_token') || window.location.search.includes('code='))
      ) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      if (user) {
        ensureUserScope(user.id);
        void loadAllUserData();
      }
    });

    return () => {
      window.removeEventListener('biblia-theme-change', handleTheme as EventListener);
      subscription.unsubscribe();
    };
  }, []);

  const activityItems: ActivityItem[] = useMemo(() => {
    const list: ActivityItem[] = [];

    for (const h of highlights) {
      const bookName = getBookMeta(h.book)?.name || h.book;
      const key = `${h.book.toUpperCase()}:${h.chapter}:${h.verse}`;
      list.push({
        id: `hl-${key}`,
        type: 'highlight',
        book: h.book.toUpperCase(),
        chapter: h.chapter,
        verse: h.verse,
        refLabel: `${bookName} ${h.chapter}:${h.verse}`,
        verseText: h.text || hydratedTexts[key],
        color: h.color,
        dateIso: h.updated_at || new Date().toISOString(),
      });
    }

    for (const n of notes) {
      const bookName = getBookMeta(n.book)?.name || n.book;
      const key = `${n.book.toUpperCase()}:${n.chapter}:${n.verse}`;
      list.push({
        id: `note-${n.id}`,
        type: 'note',
        book: n.book.toUpperCase(),
        chapter: n.chapter,
        verse: n.verse,
        refLabel: `${bookName} ${n.chapter}:${n.verse}`,
        verseText: hydratedTexts[key],
        noteTitle: n.title,
        noteContent: n.content,
        dateIso: n.created_at,
      });
    }

    for (const b of bookmarks) {
      const bookName = getBookMeta(b.book)?.name || b.book;
      const key = `${b.book.toUpperCase()}:${b.chapter}:${b.verse}`;
      list.push({
        id: `bm-${key}`,
        type: 'bookmark',
        book: b.book.toUpperCase(),
        chapter: b.chapter,
        verse: b.verse,
        refLabel: `${bookName} ${b.chapter}:${b.verse}`,
        verseText: b.text || hydratedTexts[key],
        dateIso: b.created_at || new Date().toISOString(),
      });
    }

    return list.sort((a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime());
  }, [highlights, notes, bookmarks, hydratedTexts]);

  const filteredActivity = useMemo(() => {
    if (activityFilter === 'all') return activityItems;
    if (activityFilter === 'highlights') return activityItems.filter((i) => i.type === 'highlight');
    if (activityFilter === 'notes') return activityItems.filter((i) => i.type === 'note');
    return activityItems.filter((i) => i.type === 'bookmark');
  }, [activityItems, activityFilter]);

  const resolvedDisplayName =
    profileName.trim() ||
    (sessionUser?.email ? sessionUser.email.split('@')[0] : '') ||
    'Mi Perfil';

  const initials = resolvedDisplayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() || '')
    .join('') || 'B';

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = editingName.trim();
    setDisplayName(cleaned);
    setProfileName(cleaned);
    await saveProfileNameCloud(cleaned);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 1800);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    clearUserSessionLocalData();
    setSessionUser(null);
    setProfileName('');
    setEditingName('');
    setStreak(0);
    setHighlights([]);
    setBookmarks([]);
    setNotes([]);
    setView('main');
  };

  const handleShareApp = async () => {
    const outcome = await shareBibleApp();
    if (outcome === 'copied') {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2400);
    }
  };

  const formatShortDate = (iso: string) => {
    try {
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
      }).format(new Date(iso));
    } catch {
      return '';
    }
  };

  return (
    <div className="min-h-screen">
      <TopHeader
        title="Perfil"
        onOpenInfo={() => setShowTransModal(true)}
        onSearchClick={() => setShowSearchModal(true)}
      />

      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-24">
        {/* ====================================================
            VISTA 1: PRINCIPAL (TÚ / ACTIVIDAD)
        ==================================================== */}
        {view === 'main' && (
          <div className="space-y-6 animate-fade-in">
            {/* Cabecera del perfil + botones Liquid Glass de Configuración y Más */}
            <section className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {(sessionUser?.user_metadata?.avatar_url || sessionUser?.user_metadata?.picture) ? (
                  <img
                    src={sessionUser.user_metadata.avatar_url || sessionUser.user_metadata.picture}
                    alt={resolvedDisplayName}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-primary/25 flex-shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/15 border border-primary/25 text-primary font-serif text-lg font-bold flex items-center justify-center flex-shrink-0">
                    {initials}
                  </div>
                )}
                <div className="min-w-0">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-on-surface tracking-tight truncate">
                    {resolvedDisplayName}
                  </h1>
                  <p className="text-xs text-on-surface-variant truncate">
                    {sessionUser?.email
                      ? `Conectado con Google · ${sessionUser.email}`
                      : 'Guardado localmente en este dispositivo'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {sessionUser && (
                  <button
                    type="button"
                    onClick={handleSignOut}
                    aria-label="Cerrar sesión"
                    title="Cerrar sesión"
                    className="h-10 px-3 rounded-full liquid-glass inline-flex items-center gap-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Salir</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setView('settings')}
                  aria-label="Configuración"
                  title="Configuración"
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all"
                >
                  <Settings className="w-[18px] h-[18px]" />
                </button>
                <button
                  type="button"
                  onClick={() => setView('more')}
                  aria-label="Más opciones"
                  title="Más opciones"
                  className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center text-on-surface hover:text-primary active:scale-95 transition-all"
                >
                  <Menu className="w-[18px] h-[18px]" />
                </button>
              </div>
            </section>

            {/* Tarjeta compacta de cuenta / respaldo si no ha iniciado sesión */}
            {!sessionUser && (
              <section className="rounded-3xl bg-surface-container-lowest p-4 sm:p-5 border border-outline-variant/40 shadow-warm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                    <Cloud className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h2 className="text-sm font-bold text-on-surface">Respalda tu estudio</h2>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      Sincroniza notas, resaltados y tu racha entre teléfono y computadora.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2.5 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-all flex-shrink-0 self-start sm:self-center"
                >
                  Continuar con Google
                </button>
              </section>
            )}

            {/* Estadísticas lado a lado (Racha y Actividad) */}
            <section className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl bg-surface-container-lowest p-4 border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <Flame className="w-4 h-4" strokeWidth={2.2} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Racha
                  </span>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-on-surface">
                    {streak} {streak === 1 ? 'día' : 'días'}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">Lectura diaria activa</p>
                </div>
              </div>

              <div className="rounded-3xl bg-surface-container-lowest p-4 border border-outline-variant/40 shadow-warm space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-4 h-4" strokeWidth={2.2} />
                  <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                    Actividad
                  </span>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-on-surface">
                    {activityItems.length}
                  </p>
                  <p className="text-[11px] text-on-surface-variant">
                    {highlights.length} resaltados · {notes.length} notas
                  </p>
                </div>
              </div>
            </section>

            {/* Feed Unificado de Actividad */}
            <section className="space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-serif text-lg font-bold text-on-surface">Tu actividad</h2>
                <Link
                  href="/notas"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>Gestionar</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Píldoras de filtro */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                {(
                  [
                    { key: 'all', label: `Todos (${activityItems.length})` },
                    { key: 'highlights', label: `Resaltados (${highlights.length})` },
                    { key: 'notes', label: `Notas (${notes.length})` },
                    { key: 'bookmarks', label: `Guardados (${bookmarks.length})` },
                  ] as const
                ).map((pill) => {
                  const active = activityFilter === pill.key;
                  return (
                    <button
                      key={pill.key}
                      type="button"
                      onClick={() => setActivityFilter(pill.key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                        active
                          ? 'bg-on-surface text-surface shadow-xs'
                          : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      {pill.label}
                    </button>
                  );
                })}
              </div>

              {/* Lista de tarjetas del feed */}
              {filteredActivity.length === 0 ? (
                <div className="rounded-3xl bg-surface-container-low p-8 text-center space-y-2.5 border border-outline-variant/30">
                  <BookOpen className="w-7 h-7 text-primary mx-auto" />
                  <h3 className="font-serif text-base font-bold text-on-surface">
                    Aún no hay actividad aquí
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                    Cuando resaltes un versículo, escribas una nota o guardes un pasaje favorito, aparecerá en este historial.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/lector"
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold active:scale-95 transition-all"
                    >
                      <span>Ir a la Biblia</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredActivity.slice(0, 30).map((item) => (
                    <Link
                      key={item.id}
                      href={`/lector/${item.book}/${item.chapter}#verse-${item.verse}`}
                      className="block rounded-3xl bg-surface-container-lowest p-4 border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          {item.type === 'highlight' && (
                            <span
                              className="w-2.5 h-2.5 rounded-full border border-black/15 flex-shrink-0"
                              style={{ backgroundColor: getHighlightSwatch(item.color, theme) }}
                              aria-hidden="true"
                            />
                          )}
                          {item.type === 'note' && (
                            <Edit3 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          )}
                          {item.type === 'bookmark' && (
                            <Bookmark className="w-3.5 h-3.5 text-primary fill-primary flex-shrink-0" />
                          )}
                          <span className="text-xs font-semibold text-primary truncate">
                            {item.refLabel}
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            ·{' '}
                            {item.type === 'highlight'
                              ? 'Resaltado'
                              : item.type === 'note'
                              ? 'Nota'
                              : 'Guardado'}
                          </span>
                        </div>
                        <span className="text-[11px] text-outline flex-shrink-0">
                          {formatShortDate(item.dateIso)}
                        </span>
                      </div>

                      {item.noteTitle && (
                        <h3 className="text-sm font-bold text-on-surface">{item.noteTitle}</h3>
                      )}

                      {item.noteContent && (
                        <p className="text-xs sm:text-sm text-on-surface leading-relaxed line-clamp-3">
                          {item.noteContent}
                        </p>
                      )}

                      {item.verseText && (
                        <p className="font-serif text-xs sm:text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                          «{item.verseText}»
                        </p>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* ====================================================
            VISTA 2: CONFIGURACIÓN (Cuenta, Apariencia, Lectura)
        ==================================================== */}
        {view === 'settings' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setView('main')}
                className="inline-flex items-center gap-1 px-3 py-1.5 -ml-2 rounded-full text-sm font-semibold text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <h1 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                Configuración
              </h1>

              {sessionUser ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-500 hover:bg-rose-500/10 active:scale-95 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Salir</span>
                </button>
              ) : (
                <div className="w-16" aria-hidden="true" />
              )}
            </header>

            {/* Grupo 1: Cuenta */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-2">
                Cuenta
              </h2>
              <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm divide-y divide-outline-variant/25 overflow-hidden">
                <form onSubmit={handleSaveName} className="p-4 space-y-2.5">
                  <label
                    htmlFor="profile-display-name"
                    className="block text-xs font-semibold text-on-surface"
                  >
                    Nombre para mostrar
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="profile-display-name"
                      type="text"
                      maxLength={120}
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      placeholder="Tu nombre"
                      className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-sm text-on-surface outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-all"
                    >
                      {nameSaved ? 'Guardado' : 'Guardar'}
                    </button>
                  </div>
                </form>

                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface">
                      {sessionUser ? 'Conectado con Google' : 'Respaldo en la nube'}
                    </p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {sessionUser
                        ? sessionUser.email
                        : 'Conecta tu cuenta de Google para respaldar notas y marcadores.'}
                    </p>
                  </div>
                  {sessionUser ? (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-xs font-semibold text-rose-500 active:scale-95 transition-all flex-shrink-0"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar sesión</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowAuthModal(true)}
                      className="px-4 py-2 rounded-full bg-primary hover:bg-tertiary text-xs font-semibold text-on-primary active:scale-95 transition-all flex-shrink-0"
                    >
                      Conectar Google
                    </button>
                  )}
                </div>
              </div>
            </section>

            {/* Grupo 2: Apariencia (Solo Claro y Oscuro) */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-2">
                Apariencia
              </h2>
              <div className="rounded-3xl bg-surface-container-lowest p-4 border border-outline-variant/40 shadow-warm space-y-3">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setTheme('light');
                      setReadingTheme('light');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                      theme === 'light'
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <Sun className="w-4 h-4" />
                    <span>Claro</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTheme('dark');
                      setReadingTheme('dark');
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-2xl border text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                      theme === 'dark'
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
                    }`}
                  >
                    <Moon className="w-4 h-4" />
                    <span>Oscuro</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Grupo 3: Lectura bíblica */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-2">
                Lectura bíblica
              </h2>
              <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm divide-y divide-outline-variant/25 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowTransModal(true)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Versión de lectura</p>
                    <p className="text-xs text-on-surface-variant">
                      Traducción Directa Original (TDO)
                    </p>
                  </div>
                  <span className="text-xs font-bold text-primary">TDO</span>
                </button>

                <div className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-on-surface">Tamaño de letra</p>
                    <span className="text-xs font-semibold text-primary uppercase">{fontSize}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((s, idx) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setFontSizeState(s);
                          setFontSize(s);
                        }}
                        className={`py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          fontSize === s
                            ? 'bg-primary text-on-primary shadow-xs'
                            : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        }`}
                      >
                        {idx === 0 && 'S'}
                        {idx === 1 && 'M'}
                        {idx === 2 && 'L'}
                        {idx === 3 && 'XL'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interruptor accesible WAI-ARIA */}
                <div className="p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Indicadores de notas</p>
                    <p className="text-xs text-on-surface-variant">
                      Mostrar un icono junto al número de cada versículo con nota.
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={noteIndicators}
                    aria-label="Mostrar indicadores de notas en versículos"
                    onClick={() => {
                      const next = !noteIndicators;
                      setNoteIndicators(next);
                      setShowNoteIndicators(next);
                    }}
                    className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                      noteIndicators ? 'bg-primary' : 'bg-outline-variant'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full shadow-sm transition-transform duration-200 ${
                        noteIndicators ? 'translate-x-5 bg-on-primary' : 'translate-x-0 bg-white'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ====================================================
            VISTA 3: MÁS
        ==================================================== */}
        {view === 'more' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setView('main')}
                className="inline-flex items-center gap-1 px-3 py-1.5 -ml-2 rounded-full text-sm font-semibold text-on-surface hover:bg-surface-container active:scale-95 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Atrás</span>
              </button>

              <h1 className="font-serif text-lg sm:text-xl font-bold text-on-surface">Más</h1>

              <div className="w-16" aria-hidden="true" />
            </header>

            <section className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm divide-y divide-outline-variant/25 overflow-hidden">
              <Link
                href="/"
                className="p-4 flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Flame className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-on-surface">Versículo del día</span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </Link>

              <Link
                href="/estudio"
                className="p-4 flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-on-surface">
                    Planes y Devocionales
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </Link>

              <Link
                href="/notas"
                className="p-4 flex items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Highlighter className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold text-on-surface">
                    Notas y Resaltados
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </Link>
            </section>

            <section className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm divide-y divide-outline-variant/25 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTransModal(true)}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-on-surface">
                      Acerca de esta traducción (TDO)
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Criterios de traducción directa del texto original
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-outline" />
              </button>

              <button
                type="button"
                onClick={handleShareApp}
                className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {copiedShare ? (
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <Share2 className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-on-surface">
                      {copiedShare ? 'Invitación copiada · Pégala en WhatsApp' : 'Compartir Biblia TDO'}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      Comparte el enlace con su tarjeta del logo y explicación
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
              </button>

              <InstallAppPrompt variant="row" />

              <div>
                <button
                  type="button"
                  onClick={() => setShowGesturesInfo((v) => !v)}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-on-surface">Gestos y atajos</span>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 text-outline transition-transform ${
                      showGesturesInfo ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {showGesturesInfo && (
                  <div className="px-4 pb-4 pt-1 space-y-2 text-xs text-on-surface-variant">
                    <p>
                      <strong className="text-on-surface">Cambiar de capítulo:</strong> desliza horizontalmente hacia la izquierda o derecha dentro de cualquier libro.
                    </p>
                    <p>
                      <strong className="text-on-surface">Leer el griego y notas:</strong> activa el Modo Estudio en el lector y toca el punto dorado, o selecciona un versículo y desliza hacia arriba la barra flotante.
                    </p>
                    <p>
                      <strong className="text-on-surface">Resaltado rápido:</strong> elige varios versículos y toca un color; la barra se cierra automáticamente para continuar leyendo.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Legal y privacidad */}
            <section className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-2">
                Privacidad y términos
              </h2>
              <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm divide-y divide-outline-variant/25 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setLegalModalSection('privacy')}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">Política de Privacidad</p>
                      <p className="text-xs text-on-surface-variant">
                        Cómo protegemos tus notas y tu cuenta de Google
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => setLegalModalSection('terms')}
                  className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-on-surface">Términos de Uso</p>
                      <p className="text-xs text-on-surface-variant">
                        Uso de la app y derechos de la Traducción Directa (TDO)
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
                </button>
              </div>
            </section>
          </div>
        )}
      </div>

      <TranslationModal isOpen={showTransModal} onClose={() => setShowTransModal(false)} />
      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={loadAllUserData}
      />
      <LegalInfoModal
        isOpen={legalModalSection !== null}
        onClose={() => setLegalModalSection(null)}
        section={legalModalSection || 'privacy'}
      />
    </div>
  );
}
