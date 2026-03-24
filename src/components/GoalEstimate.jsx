import { MESSAGES, tFor } from '../lib/locale-messages.js';
import { normalizeLocale } from '../lib/i18n-utils.js';
import { useI18n } from '../contexts/LocaleContext.jsx';

const GOAL_STYLES = {
  fat_loss: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30' },
  hypertrophy: { color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
  endurance: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' },
  maintenance: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
};

export default function GoalEstimate({ goal, locale: localeProp }) {
  const { locale: ctxLocale } = useI18n();
  const L = normalizeLocale(localeProp ?? ctxLocale);
  const t = (key, vars) => String(tFor(L, key, vars));
  const block = MESSAGES[L]?.goalEstimate?.[goal] ?? MESSAGES.en.goalEstimate?.[goal];
  const styles = GOAL_STYLES[goal];
  if (!block?.milestones || !styles) return null;

  const goalLabel = t(`goals.${goal}`);

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${styles.bg}`}>
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        {t('goalEstimate.header', { goal: goalLabel })}
      </div>
      <div className="space-y-2">
        {block.milestones.map((m) => (
          <div key={m.period} className="flex gap-3">
            <span className={`text-xs font-bold whitespace-nowrap mt-0.5 ${styles.color}`}>{m.period}</span>
            <span className="text-sm text-foreground/90">{m.result}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground border-t border-border pt-2">{block.tip}</p>
    </div>
  );
}
