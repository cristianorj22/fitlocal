/**
 * PWA Install Prompt — Phase 4
 * Captures `beforeinstallprompt` so we can trigger it on demand.
 */

let _deferredPrompt = null;
const _listeners = new Set();

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    _deferredPrompt = e;
    _listeners.forEach((fn) => fn(true));
  });

  window.addEventListener('appinstalled', () => {
    _deferredPrompt = null;
    _listeners.forEach((fn) => fn(false));
  });
}

export function isInstallable() {
  return !!_deferredPrompt;
}

export function onInstallabilityChange(fn) {
  _listeners.add(fn);
  return () => _listeners.delete(fn);
}

export async function triggerInstall() {
  if (!_deferredPrompt) return false;
  _deferredPrompt.prompt();
  const { outcome } = await _deferredPrompt.userChoice;
  if (outcome === 'accepted') _deferredPrompt = null;
  return outcome === 'accepted';
}