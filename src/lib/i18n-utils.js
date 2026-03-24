/** @param {Record<string, unknown>} obj @param {string} path dot-separated */
export function getByPath(obj, path) {
  if (!path || !obj) return undefined;
  return path.split('.').reduce((o, k) => (o != null && typeof o === 'object' && k in o ? o[k] : undefined), obj);
}

export const SUPPORTED_LOCALES = /** @type {const} */ (['en', 'pt-BR']);

/** Default for legacy profiles (plan: English until user chooses). */
export function defaultStoredLocale() {
  return 'en';
}

/**
 * Canonical locale for i18n (en | pt-BR).
 * Accepts common variants (pt_br, pt-br, ptBR) so UI stays in sync after saves.
 * @param {string | undefined | null} raw
 */
export function normalizeLocale(raw) {
  if (raw == null || raw === '') return defaultStoredLocale();
  const s = String(raw).trim().toLowerCase().replace(/_/g, '-');
  if (s === 'pt-br' || s === 'ptbr') return 'pt-BR';
  if (s === 'en' || s.startsWith('en-')) return 'en';
  return defaultStoredLocale();
}
