'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Info } from 'lucide-react';

interface TopHeaderProps {
  title?: string;
  onOpenInfo?: () => void;
  onSearchClick?: () => void;
}

export default function TopHeader({
  title = 'Biblia',
  onOpenInfo,
  onSearchClick,
}: TopHeaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleChrome = (e: CustomEvent<{ visible?: boolean }>) => {
      if (e?.detail?.visible !== undefined) {
        setVisible(e.detail.visible);
      }
    };
    window.addEventListener('biblia-chrome-visibility', handleChrome as EventListener);
    return () => window.removeEventListener('biblia-chrome-visibility', handleChrome as EventListener);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 md:hidden scroll-edge-fade backdrop-blur-md transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="w-full flex items-center justify-between px-4 py-3 max-w-screen-md mx-auto">
        <Link href="/" className="flex items-center gap-2 text-on-surface active:scale-95 transition-transform">
          <img
            src="/icon-192.png"
            alt="Originals Bible"
            className="w-6 h-6 rounded-lg object-cover shadow-xs"
          />
          <span className="font-serif text-lg font-bold tracking-tight">{title}</span>
        </Link>

        <div className="flex items-center gap-1">
          {onOpenInfo && (
            <button
              type="button"
              onClick={onOpenInfo}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-on-surface/5 active:scale-95 transition-all"
              aria-label="Acerca de esta traducción"
              title="Acerca de esta traducción"
            >
              <Info className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </button>
          )}
          {onSearchClick && (
            <button
              type="button"
              onClick={onSearchClick}
              className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-on-surface/5 active:scale-95 transition-all"
              aria-label="Buscar"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.85} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
