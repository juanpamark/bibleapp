'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Compass, BookmarkCheck, User } from 'lucide-react';

export default function GlobalNav() {
  const pathname = usePathname();
  const [navVisible, setNavVisible] = useState(true);
  const forcedHiddenRef = useRef(false);

  const navItems = [
    { label: 'Inicio', href: '/', icon: Home, exact: true },
    { label: 'Biblia', href: '/lector', icon: BookOpen, startsWith: '/lector' },
    { label: 'Estudio', href: '/estudio', icon: Compass, startsWith: '/estudio' },
    { label: 'Notas', href: '/notas', icon: BookmarkCheck, startsWith: '/notas' },
    { label: 'Perfil', href: '/perfil', icon: User, startsWith: '/perfil' },
  ];

  const isActive = (item: (typeof navItems)[0]) => {
    if (item.exact) return pathname === item.href;
    if (item.startsWith) return pathname.startsWith(item.startsWith);
    return pathname === item.href;
  };

  useEffect(() => {
    // Al cambiar de pestaña o capítulo, mostrar navegación y reiniciar tracking
    forcedHiddenRef.current = false;
    setNavVisible(true);

    const clampScroll = () => {
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(window.scrollY, maxScroll));
    };

    let lastY = clampScroll();

    const handleScroll = () => {
      if (forcedHiddenRef.current) return;

      const y = clampScroll();
      const delta = y - lastY;

      if (y <= 18) {
        setNavVisible(true);
        lastY = y;
        return;
      }

      if (Math.abs(delta) > 6) {
        if (delta > 0 && y > 48) {
          setNavVisible(false);
        } else if (delta < 0) {
          setNavVisible(true);
        }
        lastY = y;
      }
    };

    const handleToggleNav = (e: CustomEvent<{ visible?: boolean }>) => {
      if (e?.detail?.visible !== undefined) {
        forcedHiddenRef.current = !e.detail.visible;
        setNavVisible(e.detail.visible);
        if (e.detail.visible) {
          lastY = clampScroll();
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('biblia-toggle-nav', handleToggleNav as EventListener);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('biblia-toggle-nav', handleToggleNav as EventListener);
    };
  }, [pathname]);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('biblia-chrome-visibility', { detail: { visible: navVisible } }));
  }, [navVisible]);

  return (
    <>
      {/* DESKTOP: Cápsula Flotante Liquid Glass centrada arriba */}
      <div
        className={`hidden md:flex fixed top-3 inset-x-0 z-40 justify-center px-4 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          navVisible ? 'translate-y-0 opacity-100' : '-translate-y-24 opacity-0'
        }`}
      >
        <nav
          aria-label="Navegación principal"
          className={`liquid-glass rounded-full px-2.5 py-1.5 flex items-center gap-1 focus-within:translate-y-0 focus-within:opacity-100 ${
            navVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          <Link
            href="/"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full text-on-surface hover:text-primary transition-colors active:scale-97"
          >
            <img
              src="/icon-192.png"
              alt="Originals Bible"
              className="w-6 h-6 rounded-lg object-cover shadow-xs"
            />
            <span className="font-serif text-sm font-bold tracking-tight">Biblia</span>
          </Link>

          <div className="w-px h-5 bg-outline-variant/50 mx-1" aria-hidden="true" />

          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] transition-all duration-150 active:scale-[0.97] ${
                  active
                    ? 'bg-[var(--glass-pill-active)] text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5 font-medium'
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={active ? 2.2 : 1.75} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* MOBILE: Cápsula Flotante Liquid Glass inferior */}
      <div
        className={`md:hidden fixed bottom-4 inset-x-0 z-40 flex justify-center px-4 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          navVisible ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0'
        }`}
      >
        <nav
          aria-label="Navegación principal"
          className={`liquid-glass w-full max-w-[360px] rounded-full px-1.5 py-1.5 flex items-center justify-between ${
            navVisible ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
        >
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex-1 flex flex-col items-center justify-center py-1.5 rounded-full transition-all duration-150 active:scale-95 ${
                  active
                    ? 'bg-[var(--glass-pill-active)] text-primary'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.25 : 1.75} />
                <span
                  className={`text-[10px] mt-0.5 leading-none tracking-tight ${
                    active ? 'font-semibold text-primary' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
