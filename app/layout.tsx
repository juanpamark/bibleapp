import type { Metadata } from 'next';
import './globals.css';
import GlobalNav from '@/components/GlobalNav';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  metadataBase: new URL('https://biblia-tdo.vercel.app'),
  title: 'Biblia · TDO',
  description:
    '¿Alguna vez sentiste que un versículo dice aún más en su idioma original? Lee la Traducción Directa con notas claras para entender a fondo al autor, guía diaria de oración y agrégala a tu pantalla de inicio.',
  applicationName: 'Biblia',
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Biblia · TDO — Mucho se pierde al traducir',
    description:
      'Descubre lo que el autor realmente dijo desde el texto original, con notas claras por versículo y espacio diario de oración. Agrégala a tu pantalla de inicio.',
    url: 'https://biblia-tdo.vercel.app',
    siteName: 'Biblia · TDO',
    locale: 'es_LA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Biblia · TDO — Mucho se pierde al traducir',
    description:
      'Descubre lo que el autor realmente dijo desde el texto original, con notas claras y guía diaria de oración. Agrégala a tu inicio.',
  },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: '/favicon-32x32.png',
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: 'Biblia',
    statusBarStyle: 'default',
  },
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
        <meta name="theme-color" content="#FAF6F1" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0B0B0C" media="(prefers-color-scheme: dark)" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface antialiased min-h-screen pb-24 md:pt-20 md:pb-12 font-sans">
        <ServiceWorkerRegister />
        <GlobalNav />
        <main className="w-full">{children}</main>
      </body>
    </html>
  );
}
