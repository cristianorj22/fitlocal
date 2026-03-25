import React from 'react'
import ReactDOM from 'react-dom/client'
import { registerServiceWorker } from '@/lib/registerSW'
import { getNotifPrefs, getProfile, scheduleWorkoutReminders } from '@/lib/notifications'
import { ThemeProvider } from 'next-themes'
import App from '@/App.jsx'
import '@/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
  </ThemeProvider>
)

registerServiceWorker()

// Re-bootstrap reminders on every app launch (SW doesn't persist timers)
try {
  const prefs = getNotifPrefs()
  if (prefs.enabled) {
    const raw = localStorage.getItem('fitlocal_profile')
    const profile = raw ? JSON.parse(raw) : null
    if (profile?.days?.length) {
      scheduleWorkoutReminders(profile.days, prefs.time || '08:00', profile.name?.split(' ')[0] || '', profile.locale || 'en')
    }
  }
} catch { /* non-fatal */ }