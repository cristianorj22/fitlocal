import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useI18n } from '../contexts/LocaleContext.jsx';

// Semantic color tokens — no hardcoded rgb/hex in chart props
const C = {
  grid:    '#1f2937', // gray-800
  axis:    '#6b7280', // gray-500
  line:    '#34d399', // emerald-400
  dot:     '#34d399',
  target:  '#fbbf24', // amber-400
  tipBg:   '#1f2937',
  tipBorder:'#374151',
  tipVal:  '#34d399',
  tipDate: '#9ca3af',
};

export default function WeightChart({ log, targetWeight }) {
  const { t } = useI18n();

  // #region agent log
  fetch('http://127.0.0.1:7492/ingest/b62ba8d1-46e5-416f-b1b6-80561aba873c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e3a121'},body:JSON.stringify({sessionId:'e3a121',location:'WeightChart.jsx:entry',message:'WeightChart render',data:{logLen:log?.length,typeofT:typeof t,firstDate:log?.[0]?.date},timestamp:Date.now(),hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  if (!log || log.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-48 text-muted-foreground text-sm">
        No weight entries yet
      </div>
    );
  }

  const target = Number.isFinite(parseFloat(targetWeight)) ? parseFloat(targetWeight) : null;

  // Guard against corrupt/invalid entries (prevents React/recharts from crashing).
  const data = log
    .slice(-30)
    .map((e) => {
      const date = typeof e?.date === 'string' ? e.date : '';
      const kgNum = typeof e?.kg === 'string' ? parseFloat(e.kg) : e?.kg;
      return { date: date.slice(5), kg: kgNum };
    })
    .filter((e) => e.date.length > 0 && Number.isFinite(e.kg));

  if (data.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-48 text-muted-foreground text-sm">
        No weight entries yet
      </div>
    );
  }
  // #region agent log
  fetch('http://127.0.0.1:7492/ingest/b62ba8d1-46e5-416f-b1b6-80561aba873c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e3a121'},body:JSON.stringify({sessionId:'e3a121',location:'WeightChart.jsx:afterMap',message:'chart data mapped',data:{dataLen:data?.length,sampleKg:data?.[data.length-1]?.kg},timestamp:Date.now(),hypothesisId:'B'})}).catch(()=>{});
  // #endregion

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-xl px-3 py-2 text-sm shadow-sm">
          <span className="text-emerald-400 font-bold">{payload[0].value} kg</span>
          <div className="text-muted-foreground text-xs">{payload[0].payload.date}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{t('dashboard.weightProgress')}</h3>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
          <XAxis dataKey="date" tick={{ fontSize: 10, fill: C.axis }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: C.axis }} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
          <Tooltip content={<CustomTooltip />} />
          {target !== null && (
            <ReferenceLine
              y={target}
              stroke={C.target}
              strokeDasharray="4 4"
              label={{ value: t('dashboard.targetLine'), fill: C.target, fontSize: 10 }}
            />
          )}
          <Line type="monotone" dataKey="kg" stroke={C.line} strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: C.dot }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}