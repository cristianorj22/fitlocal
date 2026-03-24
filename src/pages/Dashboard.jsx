import { useState } from 'react';
import { getProfile, getWeightLog, addWeightEntry, getTodayCheckedIn, addCheckIn } from '../lib/storage';
import { bmiCategory } from '../lib/fitness';
import WeightChart from '../components/WeightChart';
import { CheckCircle, Plus, Flame, Beef, Wheat, Droplets } from 'lucide-react';
import { motion } from 'framer-motion';

const GOAL_LABELS = { fat_loss: 'Fat Loss', hypertrophy: 'Hypertrophy', endurance: 'Endurance', maintenance: 'Maintenance' };

export default function Dashboard() {
  const profile = getProfile();
  const [weightLog, setWeightLog] = useState(getWeightLog());
  const [checkedIn, setCheckedIn] = useState(getTodayCheckedIn());
  const [newWeight, setNewWeight] = useState('');
  const [showAddWeight, setShowAddWeight] = useState(false);

  if (!profile) return null;

  const { bmi, macros, name, targetWeight, goal } = profile;
  const bmiInfo = bmiCategory(bmi);

  const handleCheckIn = () => {
    addCheckIn();
    setCheckedIn(true);
  };

  const handleAddWeight = () => {
    if (!newWeight) return;
    addWeightEntry(parseFloat(newWeight));
    setWeightLog(getWeightLog());
    setNewWeight('');
    setShowAddWeight(false);
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const progressPct = (() => {
    if (!targetWeight || !weightLog.length) return 0;
    const start = parseFloat(profile.weight);
    const target = parseFloat(targetWeight);
    const current = weightLog[weightLog.length - 1]?.kg || start;
    const total = Math.abs(target - start);
    const done = Math.abs(current - start);
    return Math.min(100, Math.round((done / total) * 100));
  })();

  return (
    <div className="max-w-lg mx-auto p-5 space-y-5">
      {/* Header */}
      <div className="pt-4">
        <p className="text-gray-500 text-sm">{today}</p>
        <h1 className="text-2xl font-bold mt-1">Hey, {name} 👋</h1>
      </div>

      {/* Check-in */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-5 flex items-center gap-4 ${checkedIn ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-gray-900 border border-gray-800'}`}
      >
        <CheckCircle className={`w-8 h-8 flex-shrink-0 ${checkedIn ? 'text-emerald-400' : 'text-gray-700'}`} />
        <div className="flex-1">
          <div className="font-semibold">{checkedIn ? "Today's check-in done!" : "Check in for today"}</div>
          <div className="text-sm text-gray-400">{checkedIn ? 'Keep up the streak 🔥' : 'Log your presence'}</div>
        </div>
        {!checkedIn && (
          <button onClick={handleCheckIn} className="px-4 py-2 bg-emerald-500 rounded-xl text-sm font-semibold">
            Check In
          </button>
        )}
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="text-xs text-gray-500 mb-1">BMI</div>
          <div className="text-2xl font-bold">{bmi.toFixed(1)}</div>
          <div className={`text-xs mt-1 ${bmiInfo.color}`}>{bmiInfo.label}</div>
        </div>
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="text-xs text-gray-500 mb-1">Daily Calories</div>
          <div className="text-2xl font-bold">{macros.calories}</div>
          <div className="text-xs text-gray-500 mt-1">{GOAL_LABELS[goal]}</div>
        </div>
      </div>

      {/* Macros */}
      <div className="bg-gray-900 rounded-2xl p-4">
        <div className="text-sm font-medium text-gray-400 mb-3">Daily Macros</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Beef, label: 'Protein', val: macros.protein, unit: 'g', color: 'text-red-400' },
            { icon: Wheat, label: 'Carbs', val: macros.carbs, unit: 'g', color: 'text-yellow-400' },
            { icon: Droplets, label: 'Fat', val: macros.fat, unit: 'g', color: 'text-blue-400' },
          ].map(({ icon: Icon, label, val, unit, color }) => (
            <div key={label} className="text-center">
              <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
              <div className="text-lg font-bold">{val}<span className="text-xs text-gray-500">{unit}</span></div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Goal progress */}
      {targetWeight && (
        <div className="bg-gray-900 rounded-2xl p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Goal Progress</span>
            <span className="font-semibold">{progressPct}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-2">
            <span>Current: {weightLog[weightLog.length - 1]?.kg || profile.weight} kg</span>
            <span>Target: {targetWeight} kg</span>
          </div>
        </div>
      )}

      {/* Weight Chart */}
      <WeightChart log={weightLog} targetWeight={targetWeight} />

      {/* Add weight */}
      <div className="bg-gray-900 rounded-2xl p-4">
        {showAddWeight ? (
          <div className="flex gap-3">
            <input
              type="number"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-emerald-500"
              placeholder="Weight in kg"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              autoFocus
            />
            <button onClick={handleAddWeight} className="px-4 py-3 bg-emerald-500 rounded-xl text-sm font-semibold">Save</button>
            <button onClick={() => setShowAddWeight(false)} className="px-4 py-3 bg-gray-800 rounded-xl text-sm text-gray-400">Cancel</button>
          </div>
        ) : (
          <button onClick={() => setShowAddWeight(true)} className="w-full flex items-center justify-center gap-2 text-sm text-gray-400">
            <Plus className="w-5 h-5" /> Log Today's Weight
          </button>
        )}
      </div>
    </div>
  );
}