import { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, Flame, Dumbbell, Target } from 'lucide-react';
import { buildWidgetPayload, syncWidgetData } from '../lib/capacitor/bridge';
import { useProfile, useWeightLog } from '../lib/queries';
import { useI18n } from '../contexts/LocaleContext.jsx';

/**
 * Preview of what the native widget would show.
 * Also triggers a sync to native storage when rendered.
 */
export default function WidgetPreview() {
  const { locale } = useI18n();
  const isPt = locale?.startsWith('pt');
  const { data: profile } = useProfile();
  const { data: weightLog = [] } = useWeightLog();
  const [data, setData] = useState(null);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!profile) return;
    const payload = buildWidgetPayload(profile, weightLog);
    setData(payload);
  }, [profile, weightLog]);

  const handleSync = async () => {
    await syncWidgetData(profile, weightLog);
    setSynced(true);
    setTimeout(() => setSynced(false), 2000);
  };

  if (!data) return null;

  const goalLabels = {
    en: { fat_loss: 'Fat Loss', hypertrophy: 'Muscle', endurance: 'Endurance', maintenance: 'Maintain' },
    pt: { fat_loss: 'Queima', hypertrophy: 'Músculo', endurance: 'Resistência', maintenance: 'Manter' },
  };
  const labels = isPt ? goalLabels.pt : goalLabels.en;

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground">
            {isPt ? 'Widget Preview' : 'Widget Preview'}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleSync}
          disabled={synced}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-muted border border-border text-muted-foreground disabled:opacity-60"
        >
          <RefreshCw className={`w-3 h-3 ${synced ? 'text-emerald-400' : ''}`} />
          {synced ? (isPt ? 'Sincronizado!' : 'Synced!') : (isPt ? 'Sincronizar' : 'Sync')}
        </button>
      </div>

      {/* Mini widget mockup */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 border border-gray-700 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase">FitLocal</span>
          <span className="text-xs text-gray-500">{data.isTrainingDay ? '🏋️' : '😴'}</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
            </div>
            <div className="text-lg font-bold text-white">{data.streak}</div>
            <div className="text-[10px] text-gray-400">
              {isPt ? 'Sequência' : 'Streak'}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-white">
              {data.currentWeight ?? '—'}
              <span className="text-[10px] text-gray-500 ml-0.5">kg</span>
            </div>
            <div className="text-[10px] text-gray-400">
              {data.targetWeight ? `→ ${data.targetWeight}` : (isPt ? 'Peso' : 'Weight')}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Dumbbell className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-sm font-bold text-white">
              {data.isTrainingDay
                ? (isPt ? 'Hoje!' : 'Today!')
                : data.nextTrainingDay || '—'}
            </div>
            <div className="text-[10px] text-gray-400">
              {labels[data.goal] || data.goal}
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {isPt
          ? 'Esta pré-visualização mostra o que o widget nativo exibiria. Requer Capacitor + build nativa para funcionar no ecrã inicial.'
          : 'This preview shows what the native widget would display. Requires Capacitor + native build to work on the home screen.'}
      </p>
    </div>
  );
}