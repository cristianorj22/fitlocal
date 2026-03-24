import { useState } from 'react';
import { getProfile } from '../lib/storage';
import { getWorkoutPlan, restTimeByGoal } from '../lib/exercises';
import PullToRefresh from '../components/PullToRefresh';
import RestTimer from '../components/RestTimer';
import { ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react';

const GOAL_LABELS = { fat_loss: 'Fat Loss', hypertrophy: 'Hypertrophy', endurance: 'Endurance', maintenance: 'Maintenance' };
const TYPE_COLORS = { compound: 'bg-emerald-500/20 text-emerald-400', isolation: 'bg-blue-500/20 text-blue-400', cardio: 'bg-orange-500/20 text-orange-400' };

export default function Workout() {
  const profile = getProfile();
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedEx, setExpandedEx] = useState(null);
  const [completed, setCompleted] = useState({});

  if (!profile) return null;

  const plan = getWorkoutPlan(profile);
  const dayData = plan[selectedDay];
  const restDefault = restTimeByGoal[profile.goal] || 90;

  const toggleComplete = (name) => {
    setCompleted((c) => ({ ...c, [name]: !c[name] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const total = dayData?.exercises?.length || 0;

  const handleRefresh = () => new Promise((res) => setTimeout(res, 600));

  return (
    <PullToRefresh onRefresh={handleRefresh}>
    <div className="max-w-lg mx-auto p-5 space-y-5">
      <div className="pt-4">
        <h1 className="text-2xl font-bold">Workout</h1>
        <p className="text-sm text-gray-500 mt-1">{GOAL_LABELS[profile.goal]} • {profile.sessionLength} session</p>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {plan.map((d, i) => (
          <button
            key={i}
            onClick={() => { setSelectedDay(i); setCompleted({}); setExpandedEx(null); }}
            className={`flex-shrink-0 px-4 py-3 min-h-[44px] rounded-xl text-sm font-medium transition-all ${selectedDay === i ? 'bg-emerald-500 text-white' : 'bg-gray-900 text-gray-400'}`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Muscle groups */}
      <div className="flex flex-wrap gap-2">
        {dayData?.muscles?.map((m) => (
          <span key={m} className="px-3 py-1 bg-gray-800 rounded-lg text-xs text-gray-300">{m}</span>
        ))}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">Exercises</span>
            <span className="text-emerald-400 font-semibold">{completedCount}/{total}</span>
          </div>
          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(completedCount / total) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Exercise list */}
      <div className="space-y-3">
        {dayData?.exercises?.map((ex, i) => (
          <div key={i} className={`bg-gray-900 rounded-2xl overflow-hidden border transition-all ${completed[ex.name] ? 'border-emerald-500/30 opacity-60' : 'border-gray-800'}`}>
            <button
              className="w-full flex items-center gap-2 p-4 text-left"
              onClick={() => setExpandedEx(expandedEx === i ? null : i)}
            >
              <span
                role="checkbox"
                aria-checked={!!completed[ex.name]}
                onClick={(e) => { e.stopPropagation(); toggleComplete(ex.name); }}
                className="flex-shrink-0 flex items-center justify-center w-11 h-11 -ml-2 cursor-pointer"
              >
                <span className={`w-6 h-6 rounded-full border-2 block transition-all ${completed[ex.name] ? 'bg-emerald-500 border-emerald-500' : 'border-gray-600'}`} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{ex.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${TYPE_COLORS[ex.type]}`}>{ex.type}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Zap className="w-3 h-3" />{ex.sets}</span>
                  <span>{ex.muscle}</span>
                </div>
              </div>
              {expandedEx === i ? <ChevronUp className="w-4 h-4 text-gray-600" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
            </button>

            {expandedEx === i && (
              <div className="px-4 pb-4 pt-0">
                <p className="text-sm text-gray-400 border-t border-gray-800 pt-3">{ex.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Rest Timer */}
      <RestTimer defaultSeconds={restDefault} />

      {completedCount === total && total > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <div className="font-bold text-emerald-400">Workout Complete!</div>
          <div className="text-sm text-gray-400 mt-1">Great job. Rest & recover.</div>
        </div>
      )}

      <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
    </div>
    </PullToRefresh>
  );
}