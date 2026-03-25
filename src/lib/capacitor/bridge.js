/**
 * Capacitor Data Bridge — Phase 5
 *
 * Exports a summary JSON object that native widgets (Android Glance / iOS WidgetKit)
 * can consume. In a full Capacitor setup, this data is written to:
 *   - Android: SharedPreferences via @capacitor/preferences
 *   - iOS: App Group UserDefaults via @capacitor/preferences
 *
 * The widget reads from that shared storage on its own refresh cycle.
 *
 * SETUP (when Capacitor is added to the project):
 * 1. npx cap init FitLocal com.fitlocal.app --web-dir dist
 * 2. npm install @capacitor/core @capacitor/preferences @capacitor/local-notifications
 * 3. npx cap add android && npx cap add ios
 * 4. Call `syncWidgetData(profile)` after every profile/weight mutation
 * 5. Build native widget that reads from Preferences key "fitlocal_widget_data"
 */

import { getProfile } from '../storage';
import { getStreakCount } from './streak';

const WIDGET_KEY = 'fitlocal_widget_data';

/**
 * Build the lightweight summary object that widgets display.
 * Kept intentionally small — widgets have tight memory/render budgets.
 */
export function buildWidgetPayload(profile, weightLog = []) {
  if (!profile) return null;

  const latest = weightLog[weightLog.length - 1];
  const streak = getStreakCount();
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const todayName = dayNames[today.getDay()];
  const isTrainingDay = (profile.days || []).includes(todayName);

  // Find next training day
  let nextTrainingDay = null;
  if (profile.days?.length) {
    const dayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const todayIdx = today.getDay();
    for (let offset = 1; offset <= 7; offset++) {
      const checkIdx = (todayIdx + offset) % 7;
      const checkName = dayNames[checkIdx];
      if (profile.days.includes(checkName)) {
        nextTrainingDay = checkName;
        break;
      }
    }
  }

  return {
    name: profile.name?.split(' ')[0] || '',
    currentWeight: latest?.kg ?? parseFloat(profile.weight) ?? null,
    targetWeight: profile.targetWeight ? parseFloat(profile.targetWeight) : null,
    goal: profile.goal || 'maintenance',
    streak,
    isTrainingDay,
    nextTrainingDay,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Sync widget data to native storage.
 * In pure Web mode this is a no-op (data stays in memory / localStorage fallback).
 * With Capacitor installed, it writes to SharedPreferences / UserDefaults.
 */
export async function syncWidgetData(profile, weightLog) {
  const payload = buildWidgetPayload(profile, weightLog);
  if (!payload) return;

  // Capacitor Preferences available?
  try {
    const { Preferences } = await import('@capacitor/preferences');
    await Preferences.set({ key: WIDGET_KEY, value: JSON.stringify(payload) });
    return;
  } catch {
    // Capacitor not installed — fallback to localStorage for dev/testing
  }

  // Fallback: localStorage (useful for debugging widget payload)
  try {
    localStorage.setItem(WIDGET_KEY, JSON.stringify(payload));
  } catch { /* non-fatal */ }
}

/**
 * Read the last synced widget payload (for debugging / preview).
 */
export function getWidgetData() {
  try {
    const raw = localStorage.getItem(WIDGET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}