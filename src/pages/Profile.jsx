import { useState, useEffect } from 'react';
import { calcBMI, calcBMR, calcTDEE, calcMacros, calcVO2Max, vo2Category } from '../lib/fitness';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import InfoTooltip from '../components/InfoTooltip';
import GoalEstimate from '../components/GoalEstimate';
import { useProfile, useSaveProfile } from '../lib/queries';
import { AppInput } from '../components/AppInput';
import { clearAppData } from '../lib/storage';
import HealthDisclaimer from '../components/HealthDisclaimer';
import NotificationSettings from '../components/NotificationSettings';
import WidgetPreview from '../components/WidgetPreview';
import SensoryPreferences from '../components/SensoryPreferences';
import { useI18n } from '../contexts/LocaleContext.jsx';
import { normalizeLocale } from '../lib/i18n-utils.js';
import { toast } from '@/components/ui/use-toast';

const GOAL_EMOJI = { fat_loss: '🔥', hypertrophy: '💪', endurance: '🏃', maintenance: '⚖️' };
const GOALS = ['fat_loss', 'hypertrophy', 'endurance', 'maintenance'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const LOCALES = [
  { value: 'en', labelKey: 'profile.langEn' },
  { value: 'pt-BR', labelKey: 'profile.langPt' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@fitlocal.app';
  const privacyPolicyUrl = import.meta.env.VITE_PRIVACY_POLICY_URL || '/privacy';
  const { data: savedProfile } = useProfile();
  const saveProfile = useSaveProfile();
  const [profile, setProfile] = useState(null);
  const [showVO2, setShowVO2] = useState(false);
  const [vo2Form, setVo2Form] = useState({ timeMin: '', heartRate: '' });
  const [vo2Result, setVo2Result] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    if (savedProfile) setProfile(savedProfile);
  }, [savedProfile]);

  if (!profile) return null;

  const set = (k, v) => setProfile((p) => ({ ...p, [k]: v }));

  const toggleDay = (d) => {
    const days = profile.days || [];
    set('days', days.includes(d) ? days.filter((x) => x !== d) : [...days, d]);
  };

  const recalcAndSave = () => {
    const w = parseFloat(profile.weight);
    const h = parseFloat(profile.height);
    const a = parseInt(profile.age);
    const bmi = calcBMI(w, h);
    const bmr = calcBMR(w, h, a, profile.gender);
    const tdee = calcTDEE(bmr, profile.activityLevel || 'moderate');
    const macros = calcMacros(tdee, profile.goal, w);
    const updated = { ...profile, bmi, bmr, tdee, macros };
    saveProfile.mutate(updated, {
      onSuccess: () => {
        setProfile(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      },
    });
  };

  const applyLocale = (loc) => {
    if (loc === profile.locale) return;
    const updated = { ...profile, locale: loc };
    saveProfile.mutate(updated, {
      onSuccess: () => {
        setProfile(updated);
        toast({ title: t('profile.savedPrefs') });
      },
    });
  };

  const applyGender = (g) => {
    if (g === profile.gender) return;
    const w = parseFloat(profile.weight);
    const h = parseFloat(profile.height);
    const a = parseInt(profile.age);
    const bmi = calcBMI(w, h);
    const bmr = calcBMR(w, h, a, g);
    const tdee = calcTDEE(bmr, profile.activityLevel || 'moderate');
    const macros = calcMacros(tdee, profile.goal, w);
    const updated = { ...profile, gender: g, bmi, bmr, tdee, macros };
    saveProfile.mutate(updated, {
      onSuccess: () => {
        setProfile(updated);
        toast({ title: t('profile.savedPrefs') });
      },
    });
  };

  const calcVo2 = () => {
    const time = parseFloat(vo2Form.timeMin);
    const hr = parseFloat(vo2Form.heartRate);
    if (!time || !hr) return;
    const vo2 = calcVO2Max(parseFloat(profile.weight), parseInt(profile.age), profile.gender, time, hr);
    const cat = vo2Category(vo2, parseInt(profile.age), profile.gender);
    setVo2Result({ vo2: vo2.toFixed(1), category: cat });
  };

  const resetAll = async () => {
    await clearAppData();
    navigate('/onboarding');
  };

  return (
    <div className="max-w-lg mx-auto p-5 space-y-5">
      <div className="pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-muted-foreground">{t('profile.subtitle')}</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-xl">
          {profile.name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      <SensoryPreferences profile={profile} setProfile={setProfile} />

      <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
        <h2 className="text-sm font-medium text-muted-foreground">{t('profile.preferences')}</h2>
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t('profile.language')}</p>
          <div className="grid grid-cols-2 gap-2">
            {LOCALES.map(({ value, labelKey }) => (
              <button
                key={value}
                type="button"
                onClick={() => applyLocale(value)}
                disabled={saveProfile.isPending}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  normalizeLocale(profile.locale) === value
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground border border-transparent'
                }`}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-2">{t('profile.gender')}</p>
          <div className="grid grid-cols-2 gap-2">
            {(['male', 'female']).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => applyGender(g)}
                disabled={saveProfile.isPending}
                className={`py-3 rounded-xl text-sm font-medium transition-all capitalize ${
                  profile.gender === g
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground border border-transparent'
                }`}
              >
                {g === 'male' ? t('profile.male') : t('profile.female')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t('profile.bodyMetrics')}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: t('profile.weightKg'), key: 'weight', inputMode: 'decimal' },
            { label: t('profile.heightCm'), key: 'height', inputMode: 'decimal' },
            { label: t('profile.age'), key: 'age', inputMode: 'numeric' },
            { label: t('profile.targetKg'), key: 'targetWeight', inputMode: 'decimal' },
          ].map(({ label, key, inputMode }) => (
            <div key={key}>
              <label className="text-xs text-muted-foreground mb-1 block">{label}</label>
              <AppInput
                inputMode={inputMode}
                pattern="[0-9]*"
                value={profile[key] || ''}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              {t('dashboard.bmi')} <InfoTooltip text={t('tooltips.bmiProfile')} />
            </div>
            <div className="text-lg font-bold">{profile.bmi?.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground flex items-center justify-center">
              TDEE <InfoTooltip text={t('tooltips.tdee')} />
            </div>
            <div className="text-lg font-bold">{Math.round(profile.tdee || 0)} kcal</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t('profile.changeFocus')}</h2>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => set('goal', g)}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-all text-left ${
                profile.goal === g
                  ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground border border-transparent'
              }`}
            >
              {t(`goals.${g}`)} {GOAL_EMOJI[g]}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t('profile.trainingDays')}</h2>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`w-11 h-11 rounded-xl text-sm font-medium transition-all ${
                (profile.days || []).includes(d) ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {t(`weekDays.${d}`)}
            </button>
          ))}
        </div>
      </div>

      {profile.goal && <GoalEstimate goal={profile.goal} />}

      <button
        type="button"
        aria-label={t('profile.recalcSave')}
        onClick={recalcAndSave}
        disabled={saveProfile.isPending}
        className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${
          saved ? 'bg-emerald-600' : 'bg-emerald-500'
        } disabled:opacity-60`}
      >
        <RefreshCw className={`w-5 h-5 ${saveProfile.isPending ? 'animate-spin' : ''}`} />
        {saved ? t('profile.recalcDone') : t('profile.recalcSave')}
      </button>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <button
          type="button"
          aria-label={showVO2 ? t('profile.vo2Collapse') : t('profile.vo2Expand')}
          aria-expanded={showVO2}
          className="w-full flex items-center justify-between p-4"
          onClick={() => setShowVO2(!showVO2)}
        >
          <span className="font-semibold">{t('profile.vo2Title')}</span>
          {showVO2 ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>

        {showVO2 && (
          <div className="px-4 pb-5 space-y-4 border-t border-border pt-4">
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{t('profile.vo2Protocol')}</p>
              <p>{t('profile.vo2Step1')}</p>
              <p>{t('profile.vo2Step2')}</p>
              <p>{t('profile.vo2Step3')}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('profile.timeMin')}</label>
                <AppInput
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="e.g. 15.5"
                  value={vo2Form.timeMin}
                  onChange={(e) => setVo2Form((f) => ({ ...f, timeMin: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">{t('profile.heartRate')}</label>
                <AppInput
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="e.g. 155"
                  value={vo2Form.heartRate}
                  onChange={(e) => setVo2Form((f) => ({ ...f, heartRate: e.target.value }))}
                />
              </div>
            </div>
            <button type="button" onClick={calcVo2} className="w-full py-3 bg-emerald-500 rounded-xl text-sm font-semibold">
              {t('profile.calcVo2')}
            </button>
            {vo2Result && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{vo2Result.vo2}</div>
                <div className="text-sm text-muted-foreground">
                  ml/kg/min —{' '}
                  <span className="text-foreground font-medium">
                    {t(`vo2Rating.${vo2Result.category}`)}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <NotificationSettings profile={profile} />

      <WidgetPreview />

      <button
        type="button"
        aria-label={t('profile.deleteAll')}
        onClick={() => setShowDeleteDialog(true)}
        className="w-full py-3 rounded-2xl border border-red-900/60 text-red-500 text-sm font-medium hover:bg-red-500/5 transition-colors"
      >
        {t('profile.deleteAll')}
      </button>

      {showDeleteDialog && (
        <DeleteAccountDialog onClose={() => setShowDeleteDialog(false)} onConfirm={resetAll} />
      )}

      <HealthDisclaimer className="px-1" />

      <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">{t('profile.privacySupport')}</h2>
        <details className="group">
          <summary className="cursor-pointer text-sm font-medium text-foreground list-none flex items-center justify-between">
            {t('profile.privacyPolicy')}
            <span className="text-muted-foreground group-open:rotate-180 transition-transform">⌄</span>
          </summary>
          <div className="mt-3 text-sm text-muted-foreground space-y-2">
            <p>{t('privacyInline.p1')}</p>
            <p>{t('privacyInline.p2')}</p>
            <p>{t('privacyInline.p3')}</p>
            <p>{t('privacyInline.p4')}</p>
            <p>{t('privacyInline.p5')}</p>
            <p>{t('privacyInline.p6')}</p>
          </div>
        </details>
        <div className="text-sm text-muted-foreground">
          {t('profile.support')}:{' '}
          <a className="text-emerald-500 hover:underline" href={`mailto:${supportEmail}`}>
            {supportEmail}
          </a>
        </div>
        <div className="text-sm text-muted-foreground">
          {t('profile.publicUrl')}:{' '}
          <a
            className="text-emerald-500 hover:underline"
            href={privacyPolicyUrl}
            target={privacyPolicyUrl.startsWith('http') ? '_blank' : undefined}
            rel={privacyPolicyUrl.startsWith('http') ? 'noreferrer' : undefined}
          >
            {privacyPolicyUrl}
          </a>
        </div>
      </div>
    </div>
  );
}