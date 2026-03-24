import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { saveProfile } from '../lib/storage';
import { calcBMI, calcBMR, calcTDEE, calcMacros } from '../lib/fitness';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Dumbbell } from 'lucide-react';
import { AppInput } from '../components/AppInput';
import BottomSheetSelect from '../components/BottomSheetSelect';

const ACTIVITY_OPTIONS = [
  { value: 'sedentary', label: 'Sedentary (desk job)' },
  { value: 'light', label: 'Light (1–3x/week)' },
  { value: 'moderate', label: 'Moderate (3–5x/week)' },
  { value: 'active', label: 'Active (6–7x/week)' },
  { value: 'very_active', label: 'Very Active (athlete)' },
];
import GoalEstimate from '../components/GoalEstimate';

const STEPS = ['intro', 'body', 'goal', 'schedule'];

const GOALS = [
  { id: 'fat_loss', label: 'Fat Loss', emoji: '🔥', desc: 'Burn fat, preserve muscle' },
  { id: 'hypertrophy', label: 'Hypertrophy', emoji: '💪', desc: 'Build size and strength' },
  { id: 'endurance', label: 'Endurance', emoji: '🏃', desc: 'Improve cardio capacity' },
  { id: 'maintenance', label: 'Maintenance', emoji: '⚖️', desc: 'Stay fit and healthy' },
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const SESSIONS = [
  { id: 'short', label: '30 min', desc: 'Quick & effective' },
  { id: 'medium', label: '60 min', desc: 'Standard session' },
  { id: 'long', label: '90 min', desc: 'Full program' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', weight: '', height: '', age: '', gender: 'male', targetWeight: '',
    goal: '', days: [], sessionLength: 'medium', activityLevel: 'moderate',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

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
    saveProfile({ ...form, bmi, bmr, tdee, macros, createdAt: Date.now() });
    navigate('/');
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
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-emerald-500' : 'bg-muted'}`} />
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
                  <p className="text-muted-foreground text-lg">Your private fitness tracker.<br/>100% local. Zero cloud.</p>
                </div>
                <div className="bg-card rounded-2xl p-4 text-left space-y-3 border border-border">
                  {['BMI & TDEE calculations', 'Smart workout planner', 'Macro tracking', 'Progress photos & charts'].map((f) => (
                    <div key={f} className="flex items-center gap-3 text-sm text-foreground">
                      <span className="text-emerald-400">✓</span> {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Your Profile</h2>
                <AppInput placeholder="Name" autoComplete="given-name" value={form.name} onChange={(e) => set('name', e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Weight (kg)</label>
                    <AppInput inputMode="decimal" pattern="[0-9]*" placeholder="70" value={form.weight} onChange={(e) => set('weight', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Height (cm)</label>
                    <AppInput inputMode="decimal" pattern="[0-9]*" placeholder="175" value={form.height} onChange={(e) => set('height', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <AppInput inputMode="numeric" pattern="[0-9]*" placeholder="25" value={form.age} onChange={(e) => set('age', e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Target (kg)</label>
                    <AppInput inputMode="decimal" pattern="[0-9]*" placeholder="65" value={form.targetWeight} onChange={(e) => set('targetWeight', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Gender</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['male', 'female'].map((g) => (
                      <button key={g} onClick={() => set('gender', g)}
                        className={`py-3 rounded-xl capitalize text-sm font-medium transition-all ${form.gender === g ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Activity Level</label>
                  <BottomSheetSelect
                    label="Activity Level"
                    value={form.activityLevel}
                    onChange={(e) => set('activityLevel', e.target.value)}
                    options={ACTIVITY_OPTIONS}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Your Goal</h2>
                <div className="space-y-3">
                  {GOALS.map((g) => (
                    <button key={g.id} onClick={() => set('goal', g.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${form.goal === g.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-card'}`}>
                      <span className="text-3xl">{g.emoji}</span>
                      <div>
                        <div className="font-semibold">{g.label}</div>
                        <div className="text-sm text-muted-foreground">{g.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
                {form.goal && <GoalEstimate goal={form.goal} />}
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold">Your Schedule</h2>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Training Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {DAYS.map((d) => (
                      <button key={d} onClick={() => toggleDay(d)}
                        className={`w-12 h-12 rounded-xl text-sm font-medium transition-all ${form.days.includes(d) ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">Session Length</label>
                  <div className="space-y-2">
                    {SESSIONS.map((s) => (
                      <button key={s.id} onClick={() => set('sessionLength', s.id)}
                        className={`w-full flex justify-between items-center p-4 rounded-xl border transition-all ${form.sessionLength === s.id ? 'border-emerald-500 bg-emerald-500/10' : 'border-border bg-card'}`}>
                        <span className="font-medium">{s.label}</span>
                        <span className="text-sm text-muted-foreground">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="flex-1 py-4 rounded-2xl bg-muted text-foreground font-medium flex items-center justify-center gap-2">
              <ChevronLeft className="w-5 h-5" /> Back
            </button>
          )}
          <button
            onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : finish()}
            disabled={!canNext()}
            className={`flex-1 py-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all ${canNext() ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground cursor-not-allowed'}`}>
            {step < STEPS.length - 1 ? 'Continue' : 'Start Training'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>


    </div>
  );
}