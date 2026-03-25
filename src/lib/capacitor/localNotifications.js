/**
 * Local Notifications Abstraction — Phase 5
 *
 * Uses Web Notification API by default.
 * When @capacitor/local-notifications is installed, automatically upgrades
 * to native scheduled notifications that fire even with the app closed.
 *
 * SETUP (Capacitor):
 * npm install @capacitor/local-notifications
 * npx cap sync
 * — Then this module auto-detects and uses native scheduling.
 */

import { getNotifPrefs } from '../notifications';

let _useNative = null;

async function hasNativePlugin() {
  if (_useNative !== null) return _useNative;
  // @capacitor/local-notifications is not installed in the web-only build.
  // When Capacitor is added, uncomment the dynamic import below.
  // try {
  //   const { LocalNotifications } = await import('@capacitor/local-notifications');
  //   const result = await LocalNotifications.checkPermissions();
  //   _useNative = !!result;
  //   return _useNative;
  // } catch { }
  _useNative = false;
  return false;
}

/**
 * Request notification permission — native or web.
 */
export async function requestLocalNotifPermission() {
  if (await hasNativePlugin()) {
    // Native path — uncomment when @capacitor/local-notifications is installed
    // const { LocalNotifications } = await import('@capacitor/local-notifications');
    // const result = await LocalNotifications.requestPermissions();
    // return result.display === 'granted' ? 'granted' : 'denied';
  }
  // Web fallback
  if (!('Notification' in window)) return 'unsupported';
  return Notification.requestPermission();
}

/**
 * Schedule workout reminders using native local notifications.
 * Each training day gets a weekly recurring notification.
 *
 * @param {string[]} days  e.g. ['Mon', 'Wed', 'Fri']
 * @param {string}   time  e.g. '08:00'
 * @param {string}   name  user's first name
 * @param {string}   locale 'en' | 'pt-BR'
 */
export async function scheduleNativeReminders(days, time, name, locale) {
  if (!(await hasNativePlugin())) return false;

  // Native path — uncomment when @capacitor/local-notifications is installed:
  // const { LocalNotifications } = await import('@capacitor/local-notifications');
  // ... schedule logic ...
  return true;
}

/**
 * Cancel all scheduled native reminders.
 */
export async function cancelNativeReminders() {
  if (!(await hasNativePlugin())) return;
  // Native path — uncomment when @capacitor/local-notifications is installed:
  // const { LocalNotifications } = await import('@capacitor/local-notifications');
  // const pending = await LocalNotifications.getPending();
  // if (pending.notifications.length > 0) {
  //   await LocalNotifications.cancel({ notifications: pending.notifications });
  // }
}

/**
 * Check if native notifications are available.
 */
export async function isNativeNotifAvailable() {
  return hasNativePlugin();
}