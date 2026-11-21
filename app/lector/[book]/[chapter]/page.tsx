import { NT_BOOKS } from '@/lib/constants';
import LectorChapterClient from './LectorChapterClient';

export const dynamicParams = true;

export function generateStaticParams() {
  const params: Array<{ book: string; chapter: string }> = [];
  for (const book of NT_BOOKS) {
    for (let ch = 0; ch <= book.chapters; ch++) {
      params.push({ book: book.code, chapter: String(ch) });
    }
  }
  return params;
}

interface LectorPageProps {
  params: Promise<{
    book: string;
    chapter: string;
  }>;
}

export default async function LectorChapterPage({ params }: LectorPageProps) {
  const resolvedParams = await params;
  return <LectorChapterClient params={resolvedParams} />;
}
