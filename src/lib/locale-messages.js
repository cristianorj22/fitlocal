import en from '../locales/en.js';
import ptBR from '../locales/pt-BR.js';
import { getByPath, normalizeLocale } from './i18n-utils.js';

export const MESSAGES = { en, 'pt-BR': ptBR };

/** @param {string} str @param {Record<string, string | number> | undefined} vars */
export function interpolate(str, vars) {
  if (!vars || typeof str !== 'string') return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`));
}

/**
 * @param {string} locale
 * @param {string} key dot path
 * @param {Record<string, string | number> | undefined} [vars]
 */
export function tFor(locale, key, vars) {
  const L = normalizeLocale(locale);
  const raw = getByPath(MESSAGES[L], key) ?? getByPath(MESSAGES.en, key) ?? key;
  return typeof raw === 'string' ? interpolate(raw, vars) : raw;
}
