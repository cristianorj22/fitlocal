/**
 * FitLocal Service Worker — Phase 1 PWA
 *
 * Strategy:
 *  - INSTALL: pre-cache the app shell (navigation skeleton).
 *  - FETCH (navigation): cache-first for offline shell, network fallback.
 *  - FETCH (assets): stale-while-revalidate for JS/CSS/images.
 *  - Dynamic data (localStorage / IndexedDB) is never cached here; it lives
 *    entirely in the client, so offline "data" just works from storage.
 *
 * Cache invalidation: bump CACHE_VERSION on every deploy that changes the shell.
 * The activate handler deletes old caches automatically.
 *
 * HTTPS requirement: browsers only register SWs on HTTPS (or localhost).
 * CSP suggestion for your hosting headers:
 *   Content-Security-Policy:
 *     default-src 'self';
 *     script-src  'self' 'wasm-unsafe-eval';
 *     style-src   'self' 'unsafe-inline' https://fonts.googleapis.com;
 *     font-src    'self' https://fonts.gstatic.com;
 *     img-src     'self' data: blob: https://images.unsplash.com;
 *     connect-src 'self';
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE   = `fitlocal-shell-${CACHE_VERSION}`;
const ASSET_CACHE   = `fitlocal-assets-${CACHE_VERSION}`;

// Minimal shell — the entry HTML + offline fallback page.
// Vite hashes JS/CSS filenames at build time so we can't enumerate them here;
// they are cached lazily on first visit via stale-while-revalidate below.
const SHELL_URLS = [
  '/',
  '/index.html',
  '/offline.html',
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS))
      .then(() => self.skipWaiting())
      .catch((err) => {
        // Non-fatal: some shell URLs may not exist (e.g., offline.html missing).
        console.warn('[SW] Shell pre-cache partial failure:', err);
        return self.skipWaiting();
      })
  );
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('fitlocal-') && k !== SHELL_CACHE && k !== ASSET_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignore non-GET, cross-origin, and browser-extension requests.
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // Navigation requests → cache-first (serve shell), fall back to network,
  // then offline.html if everything fails.
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/index.html', { cacheName: SHELL_CACHE })
        .then((cached) => cached || fetch(request))
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // Static assets (JS, CSS, fonts, images) → stale-while-revalidate.
  if (/\.(js|css|woff2?|png|jpg|jpeg|svg|ico|webp)(\?.*)?$/.test(url.pathname)) {
    event.respondWith(
      caches.open(ASSET_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          const networkFetch = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
          return cached || networkFetch;
        })
      )
    );
  }
});

// ── Push (stub — wired for Phase 3 VAPID if backend is added) ─────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'FitLocal', {
      body:  data.body  || '',
      icon:  data.icon  || '/icons/icon-192.png',
      badge: data.badge || '/icons/icon-192-maskable.png',
      data:  data.data  || {},
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      const existing = list.find((c) => c.url.includes(target) && 'focus' in c);
      return existing ? existing.focus() : clients.openWindow(target);
    })
  );
});
