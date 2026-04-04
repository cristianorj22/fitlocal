import { Droplets } from 'lucide-react';
import { calcDailyWater } from '../lib/fitness';

export default function WaterCard({ profile, t }) {
  const water = calcDailyWater(parseFloat(profile.weight) || 70);

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
        <Droplets className="w-3.5 h-3.5 text-sky-400" />
        {t('dashboard.water')}
      </div>
      <div className="text-2xl font-bold">{water}</div>
      <div className="text-xs text-muted-foreground mt-1">L / {t('dashboard.day')}</div>
    </div>
  );
}