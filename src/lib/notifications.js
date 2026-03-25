/**
 * Web Notifications — Phase 3
 *
 * Strategy: use ServiceWorkerRegistration.showNotification() for reliable
 * display even when the page is backgrounded. Scheduling uses a lightweight
 * setTimeout approach persisted in localStorage so reminders survive
 * page reloads (as long as the tab stays open / PWA is in background).
 *
 * True background delivery (closed app) requires a push server — that is
 * a future phase. For now this covers open / backgrounded PWA perfectly.
 */

const PREF_KEY = 'fitlocal_notif_prefs';

export function getNotifPrefs() {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY)) || {};
  } catch {
    return {};
  }
}

export function saveNotifPrefs(prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
}

/** Returns 'granted' | 'denied' | 'default' | 'unsupported' */
export function notifPermission() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission;
}

/** Request permission. Returns the new permission string. */
export async function requestNotifPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  return Notification.requestPermission();
}

/**
 * Show a notification immediately via the active SW registration.
 * Falls back to the Notification constructor if no SW is available.
 */
async function showNotification(title, options = {}) {
  const icon = '/icons/icon-192.png';
  const badge = '/icons/icon-192-maskable.png';
  const base = { icon, badge, ...options };

  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready.catch(() => null);
    if (reg) {
      reg.showNotification(title, base);
      return;
    }
  }
  // Fallback
  if (Notification.permission === 'granted') {
    new Notification(title, base);
  }
}

// ── Scheduler ─────────────────────────────────────────────────────────────

const DAY_MAP = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 };
let _timers = [];

/**
 * Schedule daily workout reminders for the user's chosen training days.
 * @param {string[]} days  e.g. ['Mon', 'Wed', 'Fri']
 * @param {string}   time  e.g. '08:00'
 * @param {string}   name  user's first name
 * @param {string}   locale 'en' | 'pt-BR'
 */
export function scheduleWorkoutReminders(days, time, name, locale) {
  clearWorkoutReminders();
  if (!days?.length || Notification.permission !== 'granted') return;

  const [hh, mm] = (time || '08:00').split(':').map(Number);
  const isPt = locale?.startsWith('pt');

  days.forEach((day) => {
    const targetDow = DAY_MAP[day];
    if (targetDow === undefined) return;

    const msUntil = msUntilNextWeekday(targetDow, hh, mm);
    const title = isPt ? '💪 Hora de treinar!' : '💪 Time to train!';
    const body = isPt
      ? `Bom treino, ${name}! O teu plano de hoje está pronto.`
      : `Good workout, ${name}! Today's plan is ready.`;

    const timer = setTimeout(async () => {
      await showNotification(title, { body, data: { url: '/workout' } });
      // Reschedule for next week
      scheduleWorkoutReminders(days, time, name, locale);
    }, msUntil);

    _timers.push(timer);
  });
}

export function clearWorkoutReminders() {
  _timers.forEach(clearTimeout);
  _timers = [];
}

function msUntilNextWeekday(dow, hh, mm) {
  const now = new Date();
  const target = new Date();
  target.setHours(hh, mm, 0, 0);

  let daysAhead = (dow - now.getDay() + 7) % 7;
  // If today is the target day but the time has already passed, schedule for next week
  if (daysAhead === 0 && target <= now) daysAhead = 7;
  target.setDate(now.getDate() + daysAhead);

  return target - now;
}

/** Fire a test notification immediately — for settings preview */
export async function sendTestNotification(locale) {
  const isPt = locale?.startsWith('pt');
  await showNotification(
    isPt ? '✅ Notificações ativas!' : '✅ Notifications enabled!',
    {
      body: isPt
        ? 'Vais receber lembretes nos teus dias de treino.'
        : "You'll receive reminders on your training days.",
      data: { url: '/' },
    }
  );
}