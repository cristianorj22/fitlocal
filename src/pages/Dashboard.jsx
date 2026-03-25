import { useState } from 'react';
import { hapticLight, hapticSuccess } from '../lib/haptics';
import { audioTick, audioSuccess } from '../lib/audio';
import { bmiCategory } from '../lib/fitness';
import WeightChart from '../components/WeightChart';
import { CheckCircle, Plus, Beef, Wheat, Droplets } from 'lucide-react';
import InfoTooltip from '../components/InfoTooltip';
import PullToRefresh from '../components/PullToRefresh';
import { motion } from 'framer-motion';
import { useProfile, useWeightLog, useCheckedIn, useCheckIn, useAddWeight } from '../lib/queries';
import { useQueryClient } from '@tanstack/react-query';
import { KEYS } from '../lib/queries';
import { useI18n } from '../contexts/LocaleContext.jsx';

function bmiCatKey(bmi) {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
}

export default function Dashboard() {
  const qc = useQueryClient();
  const { t, formatDate } = useI18n();
  const { data: profile } = useProfile();
  const { data: weightLog = [] } = useWeightLog();
  const { data: checkedIn = false } = useCheckedIn();
  const checkIn = useCheckIn();
  const addWeight = useAddWeight();
  const [newWeight, setNewWeight] = useState('');
  const [showAddWeight, setShowAddWeight] = useState(false);

  if (!profile) return null;

  const { bmi, macros, name, targetWeight, goal } = profile;
  const bmiInfo = bmiCategory(bmi);
  const bmiLabel = t(`bmiCats.${bmiCatKey(bmi)}`);

  const handleAddWeight = () => {
    if (!newWeight) return;
    hapticLight();
    audioTick();
    addWeight.mutate(parseFloat(newWeight));
    setNewWeight('');
    setShowAddWeight(false);
  };

  const today = formatDate(new Date());

  const progressPct = (() => {
    if (!targetWeight || !weightLog.length) return 0;
    const start = parseFloat(profile.weight);
    const target = parseFloat(targetWeight);
    const current = weightLog[weightLog.length - 1]?.kg || start;
    const total = Math.abs(target - start);
    const done = Math.abs(current - start);
    return Math.min(100, Math.round((done / total) * 100));
  })();

  const handleRefresh = async () => {
    await qc.invalidateQueries({ queryKey: KEYS.profile });
    await qc.invalidateQueries({ queryKey: KEYS.weightLog });
    await qc.invalidateQueries({ queryKey: KEYS.checkedIn });
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="max-w-lg mx-auto p-5 space-y-5">
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">{today}</p>
          <h1 className="text-2xl font-bold mt-1">{t('dashboard.hey', { name })} 👋</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl p-5 flex items-center gap-4 ${
            checkedIn ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-card border border-border'
          }`}
        >
          <CheckCircle className={`w-8 h-8 flex-shrink-0 ${checkedIn ? 'text-emerald-400' : 'text-muted-foreground'}`} />
          <div className="flex-1">
            <div className="font-semibold">
              {checkedIn ? t('dashboard.checkInDone') : t('dashboard.checkInPrompt')}
            </div>
            <div className="text-sm text-muted-foreground">
              {checkedIn ? t('dashboard.checkInSubDone') : t('dashboard.checkInSub')}
            </div>
          </div>
          {!checkedIn && (
            <button
              type="button"
              aria-label={t('dashboard.checkIn')}
              onClick={() => { hapticSuccess(); audioSuccess(); checkIn.mutate(); }}
              disabled={checkIn.isPending}
              className="px-4 py-2 bg-emerald-500 rounded-xl text-sm font-semibold disabled:opacity-60"
            >
              {checkIn.isPending ? '...' : t('dashboard.checkIn')}
            </button>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs text-muted-foreground mb-1 flex items-center">
              {t('dashboard.bmi')} <InfoTooltip text={t('tooltips.bmi')} />
            </div>
            <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
            <div className={`text-xs mt-1 ${bmiInfo.color}`}>{bmiLabel}</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs text-muted-foreground mb-1 flex items-center">
              {t('dashboard.dailyCalories')} <InfoTooltip text={t('tooltips.tdeeDash')} />
            </div>
            <div className="text-2xl font-bold">{macros.calories}</div>
            <div className="text-xs text-muted-foreground mt-1">{t(`goals.${goal}`)}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            {t('dashboard.dailyMacros')} <InfoTooltip text={t('tooltips.macros')} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Beef, labelKey: 'dashboard.protein', val: macros.protein, unit: 'g', color: 'text-red-400' },
              { icon: Wheat, labelKey: 'dashboard.carbs', val: macros.carbs, unit: 'g', color: 'text-yellow-400' },
              { icon: Droplets, labelKey: 'dashboard.fat', val: macros.fat, unit: 'g', color: 'text-blue-400' },
            ].map(({ icon: Icon, labelKey, val, unit, color }) => (
              <div key={labelKey} className="text-center">
                <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                <div className="text-lg font-bold">
                  {val}
                  <span className="text-xs text-muted-foreground">{unit}</span>
                </div>
                <div className="text-xs text-muted-foreground">{t(labelKey)}</div>
              </div>
            ))}
          </div>
        </div>

        {targetWeight && (
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t('dashboard.goalProgress')}</span>
              <span className="font-semibold">{progressPct}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-emerald-500 rounded-full"
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>
                {t('dashboard.current')}: {weightLog[weightLog.length - 1]?.kg || profile.weight} kg
              </span>
              <span>
                {t('dashboard.target')}: {targetWeight} kg
              </span>
            </div>
          </div>
        )}

        <WeightChart log={weightLog} targetWeight={targetWeight} />

        <div className="bg-card border border-border rounded-2xl p-4">
          {showAddWeight ? (
            <div className="flex gap-3">
              <input
                inputMode="decimal"
                pattern="[0-9]*"
                className="flex-1 min-h-[44px] bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30 transition-colors"
                placeholder={t('dashboard.weightPlaceholder')}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                autoFocus
              />
              <button
                type="button"
                onClick={handleAddWeight}
                disabled={addWeight.isPending}
                className="px-4 py-3 bg-emerald-500 rounded-xl text-sm font-semibold disabled:opacity-60"
              >
                {t('dashboard.save')}
              </button>
              <button
                type="button"
                onClick={() => setShowAddWeight(false)}
                className="px-4 py-3 bg-muted rounded-xl text-sm text-muted-foreground"
              >
                {t('dashboard.cancel')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={t('dashboard.logWeight')}
              onClick={() => setShowAddWeight(true)}
              className="w-full flex items-center justify-center gap-2 min-h-[44px] text-sm text-muted-foreground"
            >
              <Plus className="w-5 h-5" /> {t('dashboard.logWeight')}
            </button>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
}