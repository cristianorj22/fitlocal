import { createContext, useContext, useMemo, useEffect } from 'react';
import { useProfile } from '../lib/queries';
import { normalizeLocale, defaultStoredLocale } from '../lib/i18n-utils.js';
import { tFor } from '../lib/locale-messages.js';

const LocaleContext = createContext(null);

/** @returns {{ locale: 'en' | 'pt-BR', t: (key: string, vars?: Record<string, string | number>) => string, formatDate: (d: Date | string | number) => string, formatDateShort: (d: Date | string | number) => string }} */
export function useI18n() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    return {
      locale: defaultStoredLocale(),
      t: (key, vars) => String(tFor(defaultStoredLocale(), key, vars)),
      formatDate: (d) => {
        const date = d instanceof Date ? d : new Date(d);
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      },
      formatDateShort: (d) => {
        const date = d instanceof Date ? d : new Date(d);
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      },
    };
  }
  return ctx;
}

export function LocaleProvider({ children }) {
  const { data: profile } = useProfile();

  const locale = useMemo(() => {
    if (profile?.locale === 'pt-BR' || profile?.locale === 'en') return profile.locale;
    return defaultStoredLocale();
  }, [profile?.locale]);

  useEffect(() => {
    document.documentElement.lang = locale === 'pt-BR' ? 'pt-BR' : 'en';
  }, [locale]);

  const value = useMemo(() => {
    const t = (key, vars) => {
      const out = tFor(locale, key, vars);
      return typeof out === 'string' ? out : String(out);
    };
    const formatDate = (d) => {
      const date = d instanceof Date ? d : new Date(d);
      const loc = locale === 'pt-BR' ? 'pt-BR' : 'en-US';
      return date.toLocaleDateString(loc, { weekday: 'long', month: 'long', day: 'numeric' });
    };
    const formatDateShort = (d) => {
      const date = d instanceof Date ? d : new Date(d);
      const loc = locale === 'pt-BR' ? 'pt-BR' : 'en-US';
      return date.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' });
    };
    return { locale, t, formatDate, formatDateShort };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}
