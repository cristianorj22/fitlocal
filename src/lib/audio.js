/**
 * Audio feedback utility — Web Audio API synth tones.
 * All functions are silent no-ops when AudioContext is unavailable.
 * Respects profile.soundEnabled preference (default: true).
 * Sounds are generated on-the-fly (no external files needed).
 */

import { getProfile } from './storage';

function isEnabled() {
  const profile = getProfile();
  return profile?.soundEnabled !== false; // default true
}

function getCtx() {
  try {
    return new (window.AudioContext || window.webkitAudioContext)();
  } catch {
    return null;
  }
}

function tone(frequency, durationSec, gainValue = 0.25, type = 'sine') {
  if (!isEnabled()) return;
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + durationSec);
}

/** Soft tick — button press / check-off */
export const audioTick = () => tone(1200, 0.06, 0.15, 'sine');

/** Upward chime — exercise completed */
export const audioComplete = () => {
  tone(523, 0.12, 0.2);
  setTimeout(() => tone(659, 0.12, 0.2), 100);
  setTimeout(() => tone(784, 0.2, 0.2), 200);
};

/** Success fanfare — all exercises done / onboarding finish */
export const audioSuccess = () => {
  tone(523, 0.1, 0.25);
  setTimeout(() => tone(659, 0.1, 0.25), 100);
  setTimeout(() => tone(784, 0.1, 0.25), 200);
  setTimeout(() => tone(1047, 0.3, 0.3), 300);
};

/** Rest-timer end beep (mirrors the existing RestTimer beep, centralised here) */
export const audioTimerEnd = () => tone(880, 0.5, 0.3);

/** Destructive confirmation — low thud */
export const audioError = () => tone(180, 0.25, 0.3, 'sawtooth');