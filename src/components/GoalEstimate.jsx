const ESTIMATES = {
  fat_loss: {
    label: 'Fat Loss',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/30',
    milestones: [
      { period: '4 weeks', result: '~1–2 kg lost, reduced bloating, better energy' },
      { period: '8 weeks', result: '~3–4 kg lost, visible waist reduction' },
      { period: '12 weeks', result: '~5–7 kg lost, noticeable body recomposition' },
    ],
    tip: 'Based on a ~500 kcal daily deficit (WHO guideline: 0.5–1 kg/week).',
  },
  hypertrophy: {
    label: 'Hypertrophy',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    milestones: [
      { period: '4 weeks', result: 'Improved neuromuscular coordination, +5-10% strength' },
      { period: '8 weeks', result: 'Visible muscle fullness, +0.5–1 kg lean mass' },
      { period: '12 weeks', result: '+1–2 kg lean mass, measurable size increase (ACSM)' },
    ],
    tip: 'Natural muscle gain: ~0.5–1 kg/month for men, ~0.25–0.5 kg/month for women.',
  },
  endurance: {
    label: 'Endurance',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/30',
    milestones: [
      { period: '4 weeks', result: 'Resting heart rate drops 2–5 bpm, easier breathing' },
      { period: '8 weeks', result: 'VO₂ Max improves ~5–8%, longer comfortable runs' },
      { period: '12 weeks', result: 'Can sustain 20–30% longer effort without fatigue' },
    ],
    tip: 'WHO recommends 150–300 min/week of moderate aerobic activity.',
  },
  maintenance: {
    label: 'Maintenance',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    milestones: [
      { period: '4 weeks', result: 'Stable weight, improved mood and sleep quality' },
      { period: '8 weeks', result: 'Consistent strength baseline, better posture' },
      { period: '12 weeks', result: 'Long-term habit formation, reduced injury risk' },
    ],
    tip: 'Consistent training at maintenance prevents 3–5% annual muscle loss from inactivity.',
  },
};

export default function GoalEstimate({ goal }) {
  const data = ESTIMATES[goal];
  if (!data) return null;

  return (
    <div className={`rounded-2xl border p-4 space-y-3 ${data.bg}`}>
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expected Progress — {data.label}</div>
      <div className="space-y-2">
        {data.milestones.map((m) => (
          <div key={m.period} className="flex gap-3">
            <span className={`text-xs font-bold whitespace-nowrap mt-0.5 ${data.color}`}>{m.period}</span>
            <span className="text-sm text-gray-300">{m.result}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 border-t border-white/10 pt-2">{data.tip}</p>
    </div>
  );
}