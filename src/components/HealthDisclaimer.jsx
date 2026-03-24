import { tFor } from '../lib/locale-messages.js';
import { normalizeLocale } from '../lib/i18n-utils.js';
import { useI18n } from '../contexts/LocaleContext.jsx';

/**
 * Short legal/safety copy for fitness estimates — aligns with Play / App Store health disclosures.
 * @param {{ className?: string, locale?: 'en' | 'pt-BR' }} props
 */
export default function HealthDisclaimer({ className = '', locale: localeOverride }) {
  const { locale: ctxLocale } = useI18n();
  const L = normalizeLocale(localeOverride ?? ctxLocale);
  const text = String(tFor(L, 'healthDisclaimer.short'));

  return <p className={`text-xs text-muted-foreground leading-relaxed ${className}`}>{text}</p>;
}
