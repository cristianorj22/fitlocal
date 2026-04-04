import { TrendingUp } from 'lucide-react';
import { getCheckIns } from '../lib/storage';
import { useMemo } from 'react';

export default function MonthlyProjection({ profile, t }) {
  const { activeDays, message, tips } = useMemo(() => {
    const checkins = getCheckIns();
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthCheckins = checkins.filter((d) => d.startsWith(thisMonth));
    const count = monthCheckins.length;

    let msg, tipsList;
    const goal = profile.goal || 'maintenance';

    if (count === 0) {
      msg = t('projection.justStarting');
      tipsList = t(`projection.tips_${goal}`)?.split?.('|') || [];
    } else if (count < 8) {
      msg = t('projection.buildingHabit');
      tipsList = t(`projection.tips_${goal}`)?.split?.('|') || [];
    } else if (count < 16) {
      msg = t('projection.goodProgress');
      tipsList = t(`projection.tips_progress`)?.split?.('|') || [];
    } else {
      msg = t('projection.excellent');
      tipsList = t(`projection.tips_advanced`)?.split?.('|') || [];
    }

    return { activeDays: count, message: msg, tips: tipsList };
  }, [profile, t]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium">{t('projection.title')}</span>
      </div>
      <div className="font-bold text-lg">
        {activeDays} {t('projection.activeDays')}
      </div>
      <div className="text-sm text-emerald-400 mt-1">{message}</div>
      {tips.length > 0 && (
        <ul className="mt-3 space-y-1">
          {tips.map((tip, i) => (
            <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
              <span className="text-muted-foreground mt-0.5">›</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}