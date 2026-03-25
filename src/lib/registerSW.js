/**
 * Service Worker registration helper.
 *
 * Call once at app startup (main.jsx). Safe to call multiple times — the
 * browser deduplicates registrations. Only runs on HTTPS or localhost.
 */

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  // Defer registration until after the page is interactive.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.info('[SW] Registered, scope:', registration.scope);

        // Notify the user when a new SW has taken over (optional UX).
        registration.addEventListener('updatefound', () => {
          const installing = registration.installing;
          if (!installing) return;
          installing.addEventListener('statechange', () => {
            if (
              installing.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // A new version is waiting — could show an "Update available" toast here.
              console.info('[SW] New version available — refresh to update.');
            }
          });
        });
      })
      .catch((err) => {
        // Non-fatal: app still works without SW (no offline, no caching).
        console.warn('[SW] Registration failed:', err);
      });
  });
}