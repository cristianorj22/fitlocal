/** @param {Record<string, unknown>} obj @param {string} path dot-separated */
export function getByPath(obj, path) {
  if (!path || !obj) return undefined;
  return path.split('.').reduce((o, k) => (o != null && typeof o === 'object' && k in o ? o[k] : undefined), obj);
}

export const SUPPORTED_LOCALES = /** @type {const} */ (['en', 'pt-BR']);

/** @param {string | undefined} raw */
export function normalizeLocale(raw) {
  if (raw === 'pt-BR') return 'pt-BR';
  return 'en';
}

/** Default for legacy profiles (plan: English until user chooses). */
export function defaultStoredLocale() {
  return 'en';
}
