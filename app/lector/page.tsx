'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getLastRead } from '@/lib/storage';
import { BookOpen } from 'lucide-react';

export default function LectorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const last = getLastRead();
    const book = last.book || 'MAT';
    const chapter = last.chapter !== undefined ? last.chapter : 1;
    router.replace(`/lector/${book}/${chapter}`);
  }, [router]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-surface-container text-primary flex items-center justify-center animate-pulse">
        <BookOpen className="w-6 h-6" />
      </div>
      <p className="text-sm text-on-surface-variant">Abriendo lectura...</p>
    </div>
  );
}
