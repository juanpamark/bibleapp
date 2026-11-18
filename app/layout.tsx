import type { Metadata } from 'next';
import './globals.css';
import GlobalNav from '@/components/GlobalNav';

export const metadata: Metadata = {
  title: 'Biblia',
  description: 'Lectura diaria directa de los textos originales con notas de estudio y cuaderno personal.',
};

const themeInitScript = `
(function() {
  try {
    var t = localStorage.getItem('biblia_reading_theme');
    if (t === 'sepia') {
      t = 'light';
      localStorage.setItem('biblia_reading_theme', 'light');
    }
    if (t === 'dark' || t === 'light') {
      document.documentElement.setAttribute('data-theme', t);
    } else {
      var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased min-h-screen pb-24 md:pt-20 md:pb-12 font-sans">
        <GlobalNav />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
