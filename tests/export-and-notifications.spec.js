import { test, expect } from '@playwright/test';
import { resetAppState } from './helpers/resetAppState.js';
import { completeOnboardingInEnglish } from './helpers/onboardingEn.js';

async function ensureWeightAndCheckIn(page) {
  await page.getByRole('button', { name: /Check In/i }).click();
  await page.waitForTimeout(300);

  await page.getByRole('button', { name: /Log Today's Weight/i }).click();
  await page.getByPlaceholder(/Weight in kg/i).fill('70');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();
}

test('export CSV should succeed with real data', async ({ page }) => {
  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);
  await ensureWeightAndCheckIn(page);

  await page.goto('/progress');

  await page.getByRole('button', { name: /Export CSV/i }).click();
  await expect(page.getByText(/CSV exported successfully!/i)).toBeVisible();
});

test('NotificationSettings toggle + time + test notification (mocked)', async ({ page }) => {
  // Mock Web Notifications so permission prompts never block the test.
  await page.addInitScript(() => {
    const MockNotification = function MockNotification(_title, _options) {};
    MockNotification.permission = 'granted';
    MockNotification.requestPermission = async () => 'granted';
    globalThis.Notification = MockNotification;

    // Ensure we don't depend on real service workers.
    if ('serviceWorker' in navigator) {
      try {
        Object.defineProperty(navigator, 'serviceWorker', {
          configurable: true,
          value: { ready: Promise.reject(new Error('mocked')) },
        });
      } catch {
        // ignore
      }
    }
  });

  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  await page.goto('/profile');

  // The Profile screen has multiple switches (sound/haptics + notifications).
  const notifCard = page.locator('xpath=//*[contains(normalize-space(.),"Workout reminders")]/ancestor::div[contains(@class,"bg-card")][1]').first();
  const toggle = notifCard.locator('button[role="switch"]').first();
  await toggle.click();

  // Time select should appear when enabled.
  const timeSelect = notifCard.locator('select');
  await expect(timeSelect).toBeVisible();

  // Change time and verify the value.
  await timeSelect.selectOption({ label: '09:30' });
  await expect(timeSelect).toHaveValue('09:30');

  // Click "Send test notification"
  await page.getByRole('button', { name: /Send test notification/i }).click();
  await expect(page.getByRole('button', { name: /Sent!/i })).toBeVisible();
});

