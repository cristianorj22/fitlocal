import { useState } from 'react';
import { calcBMI, calcBMR, calcTDEE, calcMacros, calcVO2Max, vo2Category } from '../lib/fitness';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import DeleteAccountDialog from '../components/DeleteAccountDialog';
import InfoTooltip from '../components/InfoTooltip';
import GoalEstimate from '../components/GoalEstimate';
import { useProfile, useSaveProfile } from '../lib/queries';
import { AppInput } from '../components/AppInput';

const GOAL_LABELS = { fat_loss: 'Fat Loss 🔥', hypertrophy: 'Hypertrophy 💪', endurance: 'Endurance 🏃', maintenance: 'Maintenance ⚖️' };
const GOALS = ['fat_loss', 'hypertrophy', 'endurance', 'maintenance'];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function Profile() {
  const navigate = useNavigate();
  const { data: savedProfile } = useProfile();
  const saveProfile = useSaveProfile();
  const [profile, setProfile] = useState(savedProfile);
  const [showVO2, setShowVO2] = useState(false);
  const [vo2Form, setVo2Form] = useState({ timeMin: '', heartRate: '' });
  const [vo2Result, setVo2Result] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const calcVo2 = () => {
    const time = parseFloat(vo2Form.timeMin);
    const hr = parseFloat(vo2Form.heartRate);
    if (!time || !hr) return;
    const vo2 = calcVO2Max(parseFloat(profile.weight), parseInt(profile.age), profile.gender, time, hr);
    const cat = vo2Category(vo2, parseInt(profile.age), profile.gender);
    setVo2Result({ vo2: vo2.toFixed(1), category: cat });
  };

  const resetAll = () => {
    localStorage.clear();
    navigate('/onboarding');
  };

  return (
    <div className="max-w-lg mx-auto p-5 space-y-5">
      <div className="pt-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-sm text-gray-500">Your fitness profile</p>
        </div>
        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-xl">
          {profile.name?.[0]?.toUpperCase() || '?'}
        </div>
      </div>

      {/* Body metrics */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Body Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Weight (kg)', key: 'weight', inputMode: 'decimal' },
            { label: 'Height (cm)', key: 'height', inputMode: 'decimal' },
            { label: 'Age', key: 'age', inputMode: 'numeric' },
            { label: 'Target (kg)', key: 'targetWeight', inputMode: 'decimal' },
          ].map(({ label, key, inputMode }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <AppInput
                inputMode={inputMode}
                pattern="[0-9]*"
                value={profile[key] || ''}
                onChange={(e) => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-800">
          <div className="text-center">
            <div className="text-xs text-gray-500 flex items-center justify-center">BMI <InfoTooltip text="Body Mass Index. Healthy range: 18.5–24.9 (WHO)." /></div>
            <div className="text-lg font-bold">{profile.bmi?.toFixed(1)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 flex items-center justify-center">TDEE <InfoTooltip text="Total Daily Energy Expenditure — calories you burn per day including activity." /></div>
            <div className="text-lg font-bold">{Math.round(profile.tdee || 0)} kcal</div>
          </div>
        </div>
      </div>

      {/* Goal */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Change Focus</h2>
        <div className="grid grid-cols-2 gap-2">
          {GOALS.map((g) => (
            <button key={g} onClick={() => set('goal', g)}
              className={`py-3 px-3 rounded-xl text-sm font-medium transition-all text-left ${profile.goal === g ? 'bg-emerald-500/20 border border-emerald-500 text-emerald-300' : 'bg-gray-800 text-gray-400 border border-transparent'}`}>
              {GOAL_LABELS[g]}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-gray-900 rounded-2xl p-4 space-y-3">
        <h2 className="text-sm font-medium text-gray-400">Training Days</h2>
        <div className="flex gap-2 flex-wrap">
          {DAYS.map((d) => (
            <button key={d} onClick={() => toggleDay(d)}
              className={`w-11 h-11 rounded-xl text-sm font-medium transition-all ${(profile.days || []).includes(d) ? 'bg-emerald-500 text-white' : 'bg-gray-800 text-gray-400'}`}>
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Goal estimate */}
      {profile.goal && <GoalEstimate goal={profile.goal} />}

      {/* Save */}
      <button onClick={recalcAndSave} disabled={saveProfile.isPending}
        className={`w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${saved ? 'bg-emerald-600' : 'bg-emerald-500'} disabled:opacity-60`}>
        <RefreshCw className={`w-5 h-5 ${saveProfile.isPending ? 'animate-spin' : ''}`} />
        {saved ? 'Recalculated & Saved!' : 'Recalculate & Save'}
      </button>

      {/* VO2 Max */}
      <div className="bg-gray-900 rounded-2xl overflow-hidden">
        <button className="w-full flex items-center justify-between p-4" onClick={() => setShowVO2(!showVO2)}>
          <span className="font-semibold">VO₂ Max — Rockport Test</span>
          {showVO2 ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </button>

        {showVO2 && (
          <div className="px-4 pb-5 space-y-4 border-t border-gray-800 pt-4">
            <div className="text-sm text-gray-400 space-y-1">
              <p className="font-medium text-white">Test Protocol:</p>
              <p>1. Walk 1 mile (1.6 km) as fast as you can</p>
              <p>2. Record your finish time (in minutes, e.g. 15.5)</p>
              <p>3. Measure heart rate immediately after</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time (minutes)</label>
                <AppInput inputMode="decimal" pattern="[0-9]*"
                  placeholder="e.g. 15.5" value={vo2Form.timeMin} onChange={(e) => setVo2Form((f) => ({ ...f, timeMin: e.target.value }))} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Heart Rate (bpm)</label>
                <AppInput inputMode="numeric" pattern="[0-9]*"
                  placeholder="e.g. 155" value={vo2Form.heartRate} onChange={(e) => setVo2Form((f) => ({ ...f, heartRate: e.target.value }))} />
              </div>
            </div>
            <button onClick={calcVo2} className="w-full py-3 bg-emerald-500 rounded-xl text-sm font-semibold">Calculate VO₂ Max</button>
            {vo2Result && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-400">{vo2Result.vo2}</div>
                <div className="text-sm text-gray-400">ml/kg/min — <span className="text-white font-medium">{vo2Result.category}</span></div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Account */}
      <button
        onClick={() => setShowDeleteDialog(true)}
        className="w-full py-3 rounded-2xl border border-red-900/60 text-red-500 text-sm font-medium hover:bg-red-500/5 transition-colors">
        Delete All Data
      </button>

      {showDeleteDialog && (
        <DeleteAccountDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={resetAll}
        />
      )}
    </div>
  );
}