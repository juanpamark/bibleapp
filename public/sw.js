const DATA_CACHE = 'biblia-data-v3';
const STATIC_CACHE = 'biblia-static-v3';
const PAGES_CACHE = 'biblia-pages-v3';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(['/manifest.webmanifest', '/icon-192.png', '/icon-512.png']).catch(() => {})
    )
  );
});

self.addEventListener('activate', (event) => {
  const validCaches = new Set([DATA_CACHE, STATIC_CACHE, PAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !validCaches.has(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Nunca interceptar otros orígenes (Supabase Auth/REST, Google OAuth, Cloudinary)
  if (url.origin !== self.location.origin) return;

  // Nunca interceptar rutas sensibles o dinámicas no cacheables
  if (
    url.pathname.startsWith('/auth') ||
    url.pathname.startsWith('/opengraph-image') ||
    url.pathname.includes('webpack-hmr')
  ) {
    return;
  }

  // 1. Datos públicos bíblicos (/api/chapters/* y /api/daily-verse): Stale-While-Revalidate
  if (url.pathname.startsWith('/api/chapters/') || url.pathname.startsWith('/api/daily-verse')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const networkPromise = fetch(req)
          .then((res) => {
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          })
          .catch(() => null);

        return cached || (await networkPromise) || new Response('{"verses":[]}', {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      })
    );
    return;
  }

  // 2. Recursos estáticos inmutables de Next.js e íconos: Cache-First
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname === '/icon-192.png' ||
    url.pathname === '/icon-512.png' ||
    url.pathname === '/favicon-32x32.png'
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const res = await fetch(req);
        if (res && res.status === 200) {
          cache.put(req, res.clone());
        }
        return res;
      })
    );
    return;
  }

  // 3. Navegaciones de página HTML: Network-First con respaldo offline
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(async () => {
          const cache = await caches.open(PAGES_CACHE);
          return (await cache.match(req)) || (await cache.match('/')) || Response.error();
        })
    );
  }
});
