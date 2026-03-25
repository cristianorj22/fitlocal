import { useState, useEffect } from 'react';
import { Flame } from 'lucide-react';
import { getStreakCount } from '../lib/capacitor/streak';
import { useI18n } from '../contexts/LocaleContext.jsx';

export default function StreakBadge() {
  const { locale } = useI18n();
  const isPt = locale?.startsWith('pt');
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getStreakCount());
  }, []);

  if (streak === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-xl px-3 py-2">
      <Flame className="w-5 h-5 text-orange-400" />
      <div>
        <span className="text-sm font-bold text-orange-400">{streak}</span>
        <span className="text-xs text-muted-foreground ml-1.5">
          {streak === 1
            ? (isPt ? 'dia seguido' : 'day streak')
            : (isPt ? 'dias seguidos' : 'day streak')}
        </span>
      </div>
    </div>
  );
}