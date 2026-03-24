import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function RestTimer({ defaultSeconds = 90 }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);
  const audioCtx = useRef(null);

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
  };

  const pct = (seconds / defaultSeconds) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <div className="bg-gray-900 rounded-2xl p-5 flex items-center gap-4">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgb(31 41 55)" strokeWidth="5" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgb(52 211 153)" strokeWidth="5"
            strokeDasharray={`${2 * Math.PI * 28}`}
            strokeDashoffset={`${2 * Math.PI * 28 * (1 - pct / 100)}`}
            strokeLinecap="round" className="transition-all duration-1000" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold">
          {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>
      <div className="flex-1">
        <div className="text-sm text-gray-400 mb-2">Rest Timer</div>
        <div className="flex gap-2">
          <button
            aria-label={running ? 'Pause rest timer' : 'Start rest timer'}
            onClick={() => setRunning((r) => !r)}
            className="flex items-center gap-2 px-4 py-2 min-h-[44px] bg-emerald-500 rounded-xl text-sm font-medium">
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {running ? 'Pause' : 'Start'}
          </button>
          <button aria-label="Reset rest timer" onClick={reset} className="p-3 min-w-[44px] min-h-[44px] bg-gray-800 rounded-xl flex items-center justify-center">
            <RotateCcw className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}