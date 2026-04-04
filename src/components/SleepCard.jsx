import { Moon } from 'lucide-react';
import { calcSleepHours } from '../lib/fitness';

export default function SleepCard({ profile, t }) {
  const hours = calcSleepHours(
    parseInt(profile.age) || 30,
    profile.activityLevel || 'moderate',
    profile.goal || 'maintenance'
  );

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        <Moon className="w-3.5 h-3.5 text-indigo-400" />
        {t('dashboard.sleep')}
      </div>
      <div className="text-2xl font-bold">{hours}</div>
      <div className="text-xs text-muted-foreground mt-1">{t('dashboard.hrsNight')}</div>
    </div>
  );
}