import { Star } from 'lucide-react';
import { getCheckIns } from '../lib/storage';
import { useMemo } from 'react';

export default function PerformanceCard({ profile, t }) {
  const { count, message, tips } = useMemo(() => {
    const checkins = getCheckIns();
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthCheckins = checkins.filter((d) => d.startsWith(thisMonth));
    const c = monthCheckins.length;

    let msg;
    if (c === 0) {
      msg = t('performance.noCheckins');
    } else if (c < 5) {
      msg = t('performance.fewCheckins', { count: c });
    } else if (c < 12) {
      msg = t('performance.goodCheckins', { count: c });
    } else {
      msg = t('performance.greatCheckins', { count: c });
    }

    const gymTips = t('performance.gymTips')?.split?.('|') || [];

    return { count: c, message: msg, tips: gymTips };
  }, [profile, t]);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium">{t('performance.title')}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {count} {t('performance.checksThisMonth')}
        </span>
      </div>
      <p className="text-sm">{message}</p>
      {tips.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          <div className="text-xs text-emerald-400 font-medium mb-2">💡 {t('performance.gymTipsTitle')}</div>
          <ul className="space-y-1">
            {tips.map((tip, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}