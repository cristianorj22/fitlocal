import { motion, AnimatePresence } from 'framer-motion';
import { hapticSuccess } from '../lib/haptics';
import { audioSuccess } from '../lib/audio';
import { calcBMI, calcBMR, calcTDEE, calcMacros } from '../lib/fitness';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Dumbbell } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AppInput, AppSelect } from '../components/AppInput';
import BottomSheetSelect from '../components/BottomSheetSelect';
import HealthDisclaimer from '../components/HealthDisclaimer';
import GoalEstimate from '../components/GoalEstimate';
import { useSaveProfile } from '../lib/queries';
import { useTranslationFor } from '../hooks/useTranslationFor.js';

const STEPS = ['intro', 'body', 'goal', 'schedule'];

const GOAL_IDS = ['fat_loss', 'hypertrophy', 'endurance', 'maintenance'];
const GOAL_EMOJI = { fat_loss: '🔥', hypertrophy: '💪', endurance: '🏃', maintenance: '⚖️' };

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SESSION_IDS = ['short', 'medium', 'long'];
const ACTIVITY_KEYS = ['sedentary', 'light', 'moderate', 'active', 'very_active'];

function defaultLocale() {
  if (typeof navigator === 'undefined') return 'en';
  return navigator.language?.toLowerCase().startsWith('pt') ? 'pt-BR' : 'en';
}

export default function Onboarding() {
  const navigate = useNavigate();
  const saveProfileMut = useSaveProfile();
  const [isAndroid, setIsAndroid] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    weight: '',
    height: '',
    age: '',
    gender: 'male',
    targetWeight: '',
    goal: '',
    days: [],
    sessionLength: 'medium',
    activityLevel: 'moderate',
    locale: defaultLocale(),
  });

  const t = useTranslationFor(form.locale);
  const activityOptions = ACTIVITY_KEYS.map((value) => ({
    value,
    label: t(`activity.${value}`),
  }));

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    setIsAndroid(typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent));
  }, []);

  const toggleDay = (d) => {
    set('days', form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d]);
  };

  const finish = () => {
    const w = parseFloat(form.weight);
    const h = parseFloat(form.height);
    const a = parseInt(form.age);
    const bmi = calcBMI(w, h);
    const bmr = calcBMR(w, h, a, form.gender);
    const tdee = calcTDEE(bmr, form.activityLevel);
    const macros = calcMacros(tdee, form.goal, w);
    hapticSuccess();
    audioSuccess();
    saveProfileMut.mutate(
      { ...form, bmi, bmr, tdee, macros, locale: form.locale || 'en', createdAt: Date.now() },
      { onSuccess: () => navigate('/') },
    );
  };

  const canNext = () => {
    if (step === 1) return form.name && form.weight && form.height && form.age;
    if (step === 2) return form.goal;
    if (step === 3) return form.days.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-muted'}`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/20 rounded-3xl flex items-center justify-center mx-auto">
                  <Dumbbell className="w-10 h-10 text-emerald-400" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-3">FitLocal</h1>
                  <p className="text-muted-foreground text-lg">
                    {t('onboarding.tagline')}
                    <br />
                    {t('onboarding.tagline2')}
                  </p>
                </div>
                <div className="bg-card rounded-2xl p-4 text-left space-y-3 border border-border">
                  {['feat1', 'feat2', 'feat3', 'feat4'].map((k) => (
                    <div key={k} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="text-emerald-400">✓</span> {t(`onboarding.${k}`)}
                    </div>
                  ))}
                </div>
                <HealthDisclaimer locale={form.locale} />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">{t('onboarding.yourProfile')}</h2>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">{t('onboarding.language')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['en', 'pt-BR']).map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => set('locale', loc)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all ${
                          form.locale === loc ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {loc === 'en' ? t('profile.langEn') : t('profile.langPt')}
                      </button>
                    ))}
                  </div>
                </div>
                <AppInput
                  placeholder={t('onboarding.namePh')}
                  autoComplete="given-name"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('profile.weightKg')}</label>
                    <AppInput
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder="70"
                      value={form.weight}
                      onChange={(e) => set('weight', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('profile.heightCm')}</label>
                    <AppInput
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder="175"
                      value={form.height}
                      onChange={(e) => set('height', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('profile.age')}</label>
                    <AppInput
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="25"
                      value={form.age}
                      onChange={(e) => set('age', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">{t('profile.targetKg')}</label>
                    <AppInput
                      inputMode="decimal"
                      pattern="[0-9]*"
                      placeholder="65"
                      value={form.targetWeight}
                      onChange={(e) => set('targetWeight', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">{t('onboarding.gender')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => set('gender', g)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all ${
                          form.gender === g ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {g === 'male' ? t('profile.male') : t('profile.female')}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">{t('onboarding.activityLevel')}</label>
                  {isAndroid ? (
                    <AppSelect
                      aria-label={t('onboarding.activityLevel')}
                      value={form.activityLevel}
                      onChange={(e) => set('activityLevel', e.target.value)}
                    >
                      {activityOptions.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </AppSelect>
                  ) : (
                    <BottomSheetSelect
                      label={t('onboarding.activityLevel')}
                      value={form.activityLevel}
                      onChange={(e) => set('activityLevel', e.target.value)}
                      options={activityOptions}
                    />
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">{t('onboarding.yourGoal')}</h2>
                <div className="space-y-3">
                  {GOAL_IDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('goal', id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        form.goal === id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-card'
                      }`}
                    >
                      <span className="text-3xl">{GOAL_EMOJI[id]}</span>
                      <div>
                        <div className="font-semibold">{t(`goalCards.${id}.label`)}</div>
                        <div className="text-sm text-muted-foreground">{t(`goalCards.${id}.desc`)}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {form.goal && <GoalEstimate goal={form.goal} locale={form.locale} />}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">{t('onboarding.yourSchedule')}</h2>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">{t('onboarding.trainingDays')}</label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`w-12 h-12 rounded-xl text-sm font-medium transition-all ${
                          form.days.includes(d) ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {t(`weekDays.${d}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">{t('onboarding.sessionLength')}</label>
                  <div className="space-y-2">
                    {SESSION_IDS.map((sid) => (
                      <button
                        key={sid}
                        type="button"
                        onClick={() => set('sessionLength', sid)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${
                          form.sessionLength === sid ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-card'
                        }`}
                      >
                        <span className="font-medium">{t(`sessionOpts.${sid}`)}</span>
                        <span className="text-sm text-muted-foreground">{t(`sessionOpts.${sid}Desc`)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-medium flex items-center justify-center gap-2"
            >
              <ChevronLeft className="w-5 h-5" /> {t('onboarding.back')}
            </button>
          )}
          <button
            type="button"
            onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : finish())}
            disabled={!canNext() || saveProfileMut.isPending}
            className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
              canNext() && !saveProfileMut.isPending
                ? 'bg-emerald-500 text-white'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            {step < STEPS.length - 1 ? t('onboarding.continue') : t('onboarding.startTraining')}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}