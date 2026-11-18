'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Star, CheckCircle2 } from 'lucide-react';
import { AVAILABLE_BOOKS } from '@/lib/constants';
import {
  DEVOTIONAL_THEMES,
  BIBLICAL_THEMES,
  STUDY_PLANS,
} from '@/lib/study-catalog';
import TopHeader from '@/components/TopHeader';
import GlobalSearchModal from '@/components/GlobalSearchModal';

export default function EstudioPage() {
  const [activeTab, setActiveTab] = useState<'tareas' | 'devocionales' | 'biblico'>('devocionales');
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);

  const devotionalThemes = DEVOTIONAL_THEMES;
  const biblicalThemes = BIBLICAL_THEMES;
  const challenges = STUDY_PLANS;

  const filteredChallenges = selectedTheme
    ? challenges.filter((c) => c.theme === selectedTheme)
    : challenges;

  return (
    <div className="min-h-screen">
      <TopHeader title="Estudio" onSearchClick={() => setShowSearchModal(true)} />

      <div className="max-w-screen-md mx-auto px-4 sm:px-6 pt-3 sm:pt-6 space-y-6 pb-24">
        <section className="space-y-4">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Planes y Estudio
          </h1>

          {/* Selector de sub-pestañas */}
          <div className="inline-flex p-1 rounded-full bg-surface-container text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('tareas')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'tareas'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Mis lecturas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('devocionales')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'devocionales'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Devocionales
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('biblico')}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'biblico'
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Por libro
            </button>
          </div>
        </section>

        {/* Sub-pestaña 1: Mis lecturas */}
        {activeTab === 'tareas' && (
          <div className="py-12 px-6 text-center rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm space-y-4">
            <div className="w-14 h-14 rounded-full bg-surface-container text-primary flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm mx-auto">
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Aún no tienes planes activos
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                Elige un plan devocional o comienza leyendo el contexto de un libro para seguir tu progreso diario aquí.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('devocionales')}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-all"
            >
              <span>Explorar planes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sub-pestaña 2: Devocionales */}
        {activeTab === 'devocionales' && (
          <div className="space-y-7">
            <div className="rounded-3xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm p-6 sm:p-7 flex flex-col justify-between gap-5">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-primary block">
                  Plan destacado · 30 días
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-on-surface tracking-tight leading-tight">
                  Palabra Viva en el día a día
                </h2>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-lg">
                  Un recorrido pausado por el Sermón del Monte (Mateo 5–7) con explicaciones claras del contexto histórico.
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-outline-variant/25">
                <span className="text-xs font-medium text-on-surface-variant">
                  Mateo 5–7 · TDO
                </span>
                <Link
                  href="/lector/MAT/5"
                  className="px-5 py-2 rounded-full bg-primary hover:bg-tertiary text-on-primary text-xs font-semibold active:scale-95 transition-all"
                >
                  Comenzar
                </Link>
              </div>
            </div>

            {/* Planes recomendados */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-on-surface">
                  Lecturas recomendadas
                </h3>
                {selectedTheme && (
                  <button
                    type="button"
                    onClick={() => setSelectedTheme(null)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    Ver todos
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {filteredChallenges.map((c) => (
                  <Link
                    key={c.id}
                    href={c.route}
                    className="bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-warm hover:border-primary/40 active:scale-[0.99] transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-surface-container text-primary flex items-center justify-center font-serif font-bold text-xs flex-shrink-0">
                        {c.days}d
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-on-surface truncate">
                          {c.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                          <span>{c.days} días</span>
                          <span className="inline-flex items-center gap-0.5 text-secondary">
                            <Star className="w-3 h-3 fill-secondary" />
                            <span>5.0</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-outline flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Temas sobrios */}
            <div className="space-y-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-on-surface">
                  Explorar por tema
                </h3>
                <p className="text-xs text-on-surface-variant">
                  Filtra lecturas según lo que estés viviendo hoy.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {devotionalThemes.map((t) => {
                  const isSelected = selectedTheme === t.name;
                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() => setSelectedTheme(isSelected ? null : t.name)}
                      className={`py-3 px-4 rounded-2xl border text-left transition-all active:scale-95 flex items-center justify-between ${
                        isSelected
                          ? 'bg-primary text-on-primary border-primary font-semibold shadow-xs'
                          : 'bg-surface-container-lowest border-outline-variant/40 text-on-surface hover:border-primary/40 font-medium'
                      }`}
                    >
                      <span className="flex items-center gap-2 text-xs tracking-wide">
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: isSelected ? '#ffffff' : t.dot }}
                        />
                        <span>{t.name}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Sub-pestaña 3: Por libro (Contexto y lectura) */}
        {activeTab === 'biblico' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-on-surface">
                Estudio por libro
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Comienza por el contexto histórico de cada libro antes de leer sus capítulos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {biblicalThemes.map((b) => (
                <Link
                  key={b.code + b.name}
                  href={`/lector/${b.code}/${b.chapter}`}
                  className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 shadow-warm hover:border-primary/40 transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <h3 className="font-serif text-base font-bold text-on-surface group-hover:text-primary transition-colors">
                      {b.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant leading-relaxed">{b.desc}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-outline-variant/25 flex items-center justify-between text-xs text-primary font-semibold">
                    <span>{b.chapter === 0 ? 'Ver contexto del libro' : `Ir al capítulo ${b.chapter}`}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="p-5 rounded-3xl bg-surface-container-low space-y-3">
              <div className="flex items-center gap-2 text-on-surface">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="font-serif text-sm font-bold">Libros ya disponibles</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Cada libro incluye su contexto introductorio (capítulo 0) y texto completo traducido con notas de estudio:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABLE_BOOKS.map((book) => (
                  <Link
                    key={book.code}
                    href={`/lector/${book.code}/0`}
                    className="px-3 py-1.5 rounded-full bg-surface-container-lowest text-xs font-semibold text-on-surface border border-outline-variant/40 hover:border-primary hover:text-primary transition-colors"
                  >
                    {book.name} ({book.chapters})
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <GlobalSearchModal isOpen={showSearchModal} onClose={() => setShowSearchModal(false)} />
    </div>
  );
}
