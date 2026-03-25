import { useState, useEffect } from 'react';
import { Bell, BellOff, Send } from 'lucide-react';
import {
  notifPermission,
  requestNotifPermission,
  getNotifPrefs,
  saveNotifPrefs,
  scheduleWorkoutReminders,
  clearWorkoutReminders,
  sendTestNotification,
} from '../lib/notifications';
import { useI18n } from '../contexts/LocaleContext.jsx';

const TIME_OPTIONS = [
  '06:00', '06:30', '07:00', '07:30', '08:00', '08:30',
  '09:00', '09:30', '10:00', '12:00', '17:00', '18:00', '19:00', '20:00',
];

export default function NotificationSettings({ profile }) {
  const { t } = useI18n();
  const locale = profile?.locale || 'en';
  const isPt = locale.startsWith('pt');

  const [permission, setPermission] = useState(notifPermission());
  const [enabled, setEnabled] = useState(false);
  const [time, setTime] = useState('08:00');
  const [testSent, setTestSent] = useState(false);

  // Load saved prefs
  useEffect(() => {
    const prefs = getNotifPrefs();
    if (prefs.enabled) setEnabled(true);
    if (prefs.time) setTime(prefs.time);
  }, []);

  // Re-schedule whenever prefs change
  useEffect(() => {
    if (enabled && permission === 'granted' && profile?.days?.length) {
      scheduleWorkoutReminders(profile.days, time, profile.name?.split(' ')[0] || '', locale);
    } else {
      clearWorkoutReminders();
    }
  }, [enabled, time, permission, profile?.days, locale]);

  const handleToggle = async () => {
    if (!enabled) {
      // Turning on — request permission first
      const perm = await requestNotifPermission();
      setPermission(perm);
      if (perm !== 'granted') return;
      setEnabled(true);
      saveNotifPrefs({ enabled: true, time });
    } else {
      setEnabled(false);
      saveNotifPrefs({ enabled: false, time });
    }
  };

  const handleTimeChange = (e) => {
    setTime(e.target.value);
    saveNotifPrefs({ enabled, time: e.target.value });
  };

  const handleTest = async () => {
    await sendTestNotification(locale);
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  if (permission === 'unsupported') return null;

  const denied = permission === 'denied';

  return (
    <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
      <h2 className="text-sm font-medium text-muted-foreground">
        {isPt ? 'Notificações de treino' : 'Workout reminders'}
      </h2>

      {denied ? (
        <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-sm text-amber-300">
          <BellOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {isPt
              ? 'Notificações bloqueadas. Permite-as nas definições do browser.'
              : 'Notifications are blocked. Enable them in your browser settings.'}
          </span>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${enabled ? 'bg-emerald-500/20' : 'bg-muted'}`}>
                {enabled ? (
                  <Bell className="w-4 h-4 text-emerald-400" />
                ) : (
                  <BellOff className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isPt ? 'Lembretes de treino' : 'Training reminders'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {enabled
                    ? (isPt ? 'Ativo nos teus dias de treino' : 'Active on your training days')
                    : (isPt ? 'Desativado' : 'Disabled')}
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={handleToggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-emerald-500' : 'bg-muted border border-border'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {enabled && (
            <>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  {isPt ? 'Hora do lembrete' : 'Reminder time'}
                </label>
                <select
                  value={time}
                  onChange={handleTimeChange}
                  className="w-full min-h-[44px] bg-muted border border-border rounded-xl px-4 py-3 text-foreground text-sm outline-none focus:border-emerald-400 transition-colors"
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={handleTest}
                disabled={testSent}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-sm text-muted-foreground hover:bg-muted transition-colors disabled:opacity-60"
              >
                <Send className="w-4 h-4" />
                {testSent
                  ? (isPt ? 'Enviado!' : 'Sent!')
                  : (isPt ? 'Enviar notificação de teste' : 'Send test notification')}
              </button>

              <p className="text-xs text-muted-foreground">
                {isPt
                  ? `Lembretes agendados para: ${(profile?.days || []).join(', ') || '—'}`
                  : `Reminders scheduled for: ${(profile?.days || []).join(', ') || '—'}`}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}