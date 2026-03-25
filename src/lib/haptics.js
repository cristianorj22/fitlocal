/**
 * Haptic feedback utility — wraps navigator.vibrate with named patterns.
 * Silent no-op on devices/browsers that don't support the Vibration API.
 * Respects profile.hapticsEnabled preference (default: true).
 */

import { getProfile } from './storage';

const canVibrate = () =>
  typeof navigator !== 'undefined' && 'vibrate' in navigator;

function isEnabled() {
  const profile = getProfile();
  return profile?.hapticsEnabled !== false; // default true
}

/** Short confirmation tap (button press, check-in, save) */
export const hapticLight = () => isEnabled() && canVibrate() && navigator.vibrate(10);

/** Medium confirmation (exercise complete) */
export const hapticMedium = () => isEnabled() && canVibrate() && navigator.vibrate(30);

/** Success celebration (all exercises done, onboarding finish) */
export const hapticSuccess = () =>
  isEnabled() && canVibrate() && navigator.vibrate([20, 60, 20, 60, 60]);

/** Error / destructive action warning */
export const hapticError = () =>
  isEnabled() && canVibrate() && navigator.vibrate([60, 40, 60]);

/** Rest-timer end — three short pulses */
export const hapticTimerEnd = () =>
  isEnabled() && canVibrate() && navigator.vibrate([50, 80, 50, 80, 50]);