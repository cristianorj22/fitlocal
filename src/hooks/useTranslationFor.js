import React, { useMemo } from 'react';
import { tFor } from '../lib/locale-messages.js';
import { normalizeLocale } from '../lib/i18n-utils.js';

/** For screens without profile (e.g. onboarding) — drive UI by explicit locale. */
export function useTranslationFor(locale) {
  return useMemo(
    () => (key, vars) => String(tFor(normalizeLocale(locale || 'en'), key, vars)),
    [locale],
  );
}