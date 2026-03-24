import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useI18n } from '../contexts/LocaleContext.jsx';

const MAX_SECONDS = 600;

export default function RestTimer({ defaultSeconds = 90 }) {
  const { t } = useI18n();
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [totalDuration, setTotalDuration] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setSeconds(defaultSeconds);
    setTotalDuration(defaultSeconds);
  }, [defaultSeconds]);

  const playBeep = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            playBeep();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setSeconds(defaultSeconds);
    setTotalDuration(defaultSeconds);
  };

  const addTime = (n) => {
    setSeconds((s) => Math.min(s + n, MAX_SECONDS));
    setTotalDuration((t) => Math.min(t + n, MAX_SECONDS));
  };

  const pct = totalDuration > 0 ? (seconds / totalDuration) * 100 : 0;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90 text-muted" viewBox="0 0 64 64" aria-hidden="true">
          <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="5" className="opacity-40" />
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="text-emerald-500"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm text-muted-foreground mb-2">{t('restTimer.title')}</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-label={running ? t('restTimer.pause') : t('restTimer.start')}
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-emerald-500 rounded-xl text-sm font-medium text-white"
          >
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? t('restTimer.pause') : t('restTimer.start')}
          </button>
          <button
            type="button"
            aria-label={t('restTimer.reset')}
            onClick={reset}
            className="p-3 min-w-[44px] min-h-[44px] bg-muted border border-border rounded-xl flex items-center justify-center text-muted-foreground"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label={t('restTimer.add15')}
            onClick={() => addTime(15)}
            className="px-3 py-2 min-h-[44px] bg-muted border border-border rounded-xl text-xs font-medium text-foreground"
          >
            +15s
          </button>
          <button
            type="button"
            aria-label={t('restTimer.add30')}
            onClick={() => addTime(30)}
            className="px-3 py-2 min-h-[44px] bg-muted border border-border rounded-xl text-xs font-medium text-foreground"
          >
            +30s
          </button>
        </div>
      </div>
    </div>
  );
}
