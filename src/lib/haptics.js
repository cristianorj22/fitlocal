/**
 * Haptic feedback utility — wraps navigator.vibrate with named patterns.
 * Silent no-op on devices/browsers that don't support the Vibration API.
 */

const canVibrate = () =>
  typeof navigator !== 'undefined' && 'vibrate' in navigator;

/** Short confirmation tap (button press, check-in, save) */
export const hapticLight = () => canVibrate() && navigator.vibrate(10);

/** Medium confirmation (exercise complete) */
export const hapticMedium = () => canVibrate() && navigator.vibrate(30);

/** Success celebration (all exercises done, onboarding finish) */
export const hapticSuccess = () =>
  canVibrate() && navigator.vibrate([20, 60, 20, 60, 60]);

/** Error / destructive action warning */
export const hapticError = () =>
  canVibrate() && navigator.vibrate([60, 40, 60]);

/** Rest-timer end — three short pulses */
export const hapticTimerEnd = () =>
  canVibrate() && navigator.vibrate([50, 80, 50, 80, 50]);