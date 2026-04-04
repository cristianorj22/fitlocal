import { useState, useEffect, useMemo } from 'react';
import { hapticMedium, hapticSuccess } from '../lib/haptics';
import { audioComplete, audioSuccess } from '../lib/audio';
import { getExercisesForGroup, MUSCLE_GROUPS, restTimeByGoal } from '../lib/exercises';
import { getExerciseMedia } from '../lib/exerciseMedia';
import PullToRefresh from '../components/PullToRefresh';
import RestTimer from '../components/RestTimer';
import ExerciseAlternatives from '../components/ExerciseAlternatives';
import { ChevronDown, ChevronUp, Zap, RefreshCw } from 'lucide-react';
import { useProfile } from '../lib/queries';
import { useI18n } from '../contexts/LocaleContext.jsx';
import { tFor } from '../lib/locale-messages.js';
import { normalizeLocale } from '../lib/i18n-utils.js';

const TYPE_COLORS = {
  compound: 'bg-emerald-500/20 text-emerald-400',
  isolation: 'bg-blue-500/20 text-blue-400',
  cardio: 'bg-orange-500/20 text-orange-400',
};

const LEVEL_COLORS = {
  Beginner: 'bg-emerald-500/20 text-emerald-400',
  Intermediate: 'bg-amber-500/20 text-amber-400',
  Advanced: 'bg-red-500/20 text-red-400',
};

function exerciseDisplayName(ex, locale) {
  const L = normalizeLocale(locale);
  const key = `exerciseNames.${ex.exerciseId}`;
  const translated = tFor(L, key);
  if (translated && translated !== key) return translated;
  return ex.name;
}

function exerciseDisplayDescription(ex, locale) {
  const L = normalizeLocale(locale);
  const key = `exerciseDescriptions.${ex.exerciseId}`;
  const translated = tFor(L, key);
  if (translated && translated !== key) return translated;
  return ex.desc;
}

function translateMuscleGroup(raw, locale) {
  const L = normalizeLocale(locale);
  const key = `muscleGroups.${raw.replace(/[/\s]+/g, '_')}`;
  const translated = tFor(L, key);
  if (translated && translated !== key) return translated;
  return raw;
}

export default function Workout() {
  const { data: profile } = useProfile();
  const { t, locale } = useI18n();
  const [selectedGroup, setSelectedGroup] = useState('Full Body');
  const [expandedEx, setExpandedEx] = useState(null);
  const [completed, setCompleted] = useState({});
  const [restTimerSeconds, setRestTimerSeconds] = useState(90);

  const exercises = useMemo(
    () => (profile ? getExercisesForGroup(selectedGroup, profile) : []),
    [profile, selectedGroup]
  );

  const restDefault = profile ? restTimeByGoal[profile.goal] || 90 : 90;
  const total = exercises.length;
  const completedCount = Object.values(completed).filter(Boolean).length;

  useEffect(() => {
    if (total > 0 && completedCount === total) {
      hapticSuccess();
      audioSuccess();
    }
  }, [completedCount, total]);

  if (!profile) return null;

  const switchGroup = (g) => {
    setSelectedGroup(g);
    setCompleted({});
    setExpandedEx(null);
  };

  const toggleComplete = (ex) => {
    setCompleted((c) => {
      const was = !!c[ex.name];
      const next = !was;
      if (next) {
        const r = ex.rest != null ? ex.rest : restDefault;
        setRestTimerSeconds(r);
        hapticMedium();
        audioComplete();
      }
      return { ...c, [ex.name]: next };
    });
  };

  const openExercise = (i, ex) => {
    const next = expandedEx === i ? null : i;
    setExpandedEx(next);
    if (next !== null) {
      const r = ex.rest != null ? ex.rest : restDefault;
      setRestTimerSeconds(r);
    }
  };

  const handleRefresh = () => new Promise((res) => setTimeout(res, 600));

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="max-w-lg mx-auto p-5 space-y-5">
        <div className="pt-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">{t('workout.todaysPlan')}</p>
            <h1 className="text-2xl font-bold">{t('workout.title')}</h1>
          </div>
          <button
            type="button"
            onClick={() => switchGroup(selectedGroup)}
            className="flex items-center gap-1.5 px-3 py-2 min-h-[44px] rounded-xl bg-card border border-border text-sm text-muted-foreground"
          >
            <RefreshCw className="w-4 h-4" /> {t('workout.newPlan')}
          </button>
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-2">{t('workout.chooseMuscle')}</p>
          <div className="flex gap-2 flex-wrap">
            {MUSCLE_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                aria-pressed={selectedGroup === g}
                onClick={() => switchGroup(g)}
                className={`px-3 py-2 min-h-[36px] rounded-xl text-sm font-medium transition-all ${
                  selectedGroup === g
                    ? 'bg-emerald-500 text-white'
                    : 'bg-card border border-border text-muted-foreground'
                }`}
              >
                {translateMuscleGroup(g, locale)}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">{t('workout.exercises')}</span>
              <span className="text-emerald-400 font-semibold">
                {completedCount}/{total}
              </span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${(completedCount / total) * 100}%` }}
              />
            </div>
          </div>
        )}

        {total === 0 && (
          <div className="bg-card border border-border rounded-2xl p-6 text-center text-muted-foreground">
            <p className="text-sm">{t('workout.noExercises')}</p>
          </div>
        )}

        <div className="space-y-3">
          {exercises.map((ex, i) => {
            const media = getExerciseMedia(ex.exerciseId, profile.gender || 'male');
            const showHint = media?.kind === 'image' && expandedEx !== i;
            const displayName = exerciseDisplayName(ex, locale);
            const descText = exerciseDisplayDescription(ex, locale);
            const typeLabel = t(`types.${ex.type}`);
            const levelLabel = ex.level || '';

            return (
              <div
                key={i}
                className={`bg-card rounded-2xl overflow-hidden border transition-all ${
                  completed[ex.name] ? 'border-emerald-500/30 opacity-60' : 'border-border'
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center gap-2 p-4 text-left"
                  aria-expanded={expandedEx === i}
                  onClick={() => openExercise(i, ex)}
                >
                  <span
                    role="checkbox"
                    aria-checked={!!completed[ex.name]}
                    aria-label={
                      completed[ex.name]
                        ? t('workout.markIncomplete', { name: displayName })
                        : t('workout.markComplete', { name: displayName })
                    }
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleComplete(ex);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleComplete(ex);
                    }}
                    className="flex-shrink-0 flex items-center justify-center w-11 h-11 -ml-2 cursor-pointer"
                  >
                    <span
                      className={`w-6 h-6 rounded-full border-2 block transition-all ${
                        completed[ex.name] ? 'bg-emerald-500 border-emerald-500' : 'border-muted-foreground'
                      }`}
                    />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{displayName}</span>
                      {levelLabel && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${LEVEL_COLORS[levelLabel] || TYPE_COLORS[ex.type]}`}>
                          {levelLabel}
                        </span>
                      )}
                    </div>
                    {showHint && (
                      <p className="text-xs text-muted-foreground/80 mt-1">{t('workout.tapForIllustration')}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {ex.sets}
                      </span>
                      <span>{translateMuscleGroup(ex.muscle, locale)}</span>
                    </div>
                  </div>
                  {expandedEx === i ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  )}
                </button>

                {expandedEx === i && (
                  <div id={`ex-detail-${i}`} role="region" aria-label={`${displayName} details`} className="px-4 pb-4 pt-0">
                    {(() => {
                      if (media?.kind !== 'image') return null;
                      return (
                        <div className="mt-3 rounded-xl border border-border bg-muted p-2 sm:p-3 flex items-center justify-center">
                          <img
                            src={media.src}
                            alt={media.alt || displayName}
                            loading="lazy"
                            decoding="async"
                            width={1376}
                            height={768}
                            className="block max-w-full max-h-[min(68vh,32rem)] w-auto h-auto object-contain"
                          />
                        </div>
                      );
                    })()}
                    <p className="text-sm text-muted-foreground border-t border-border pt-3 mt-3">{descText}</p>
                    <ExerciseAlternatives alternatives={ex.alternatives} locale={locale} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <RestTimer defaultSeconds={restTimerSeconds} />

        {completedCount === total && total > 0 && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <div className="font-bold text-emerald-400">{t('workout.completeTitle')}</div>
            <div className="text-sm text-muted-foreground mt-1">{t('workout.completeSub')}</div>
          </div>
        )}

        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
      </div>
    </PullToRefresh>
  );
}