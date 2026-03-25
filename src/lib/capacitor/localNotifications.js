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
  try {
    const mod = await import('@capacitor/local-notifications');
    const { LocalNotifications } = mod;
    // Check if the plugin is actually functional (not just imported)
    const result = await LocalNotifications.checkPermissions();
    _useNative = !!result;
    return _useNative;
  } catch {
    _useNative = false;
    return false;
  }
}

/**
 * Request notification permission — native or web.
 */
export async function requestLocalNotifPermission() {
  if (await hasNativePlugin()) {
    const { LocalNotifications } = await import('@capacitor/local-notifications');
    const result = await LocalNotifications.requestPermissions();
    return result.display === 'granted' ? 'granted' : 'denied';
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

  const { LocalNotifications } = await import('@capacitor/local-notifications');
  const isPt = locale?.startsWith('pt');
  const [hh, mm] = (time || '08:00').split(':').map(Number);

  const DAY_MAP = { Sun: 1, Mon: 2, Tue: 3, Wed: 4, Thu: 5, Fri: 6, Sat: 7 };

  // Cancel existing scheduled notifications first
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }

  const notifications = days
    .filter((d) => DAY_MAP[d] !== undefined)
    .map((day, i) => ({
      id: 5000 + i,
      title: isPt ? '💪 Hora de treinar!' : '💪 Time to train!',
      body: isPt
        ? `Bom treino, ${name}! O teu plano de hoje está pronto.`
        : `Good workout, ${name}! Today's plan is ready.`,
      schedule: {
        on: { weekday: DAY_MAP[day], hour: hh, minute: mm },
        allowWhileIdle: true,
        repeats: true,
      },
      smallIcon: 'ic_notification',
      iconColor: '#10b981',
    }));

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }

  return true;
}

/**
 * Cancel all scheduled native reminders.
 */
export async function cancelNativeReminders() {
  if (!(await hasNativePlugin())) return;
  const { LocalNotifications } = await import('@capacitor/local-notifications');
  const pending = await LocalNotifications.getPending();
  if (pending.notifications.length > 0) {
    await LocalNotifications.cancel({ notifications: pending.notifications });
  }
}

/**
 * Check if native notifications are available.
 */
export async function isNativeNotifAvailable() {
  return hasNativePlugin();
}