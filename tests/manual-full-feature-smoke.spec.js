import { test, expect } from '@playwright/test';
import { resetAppState } from './helpers/resetAppState.js';
import { completeOnboardingInEnglish } from './helpers/onboardingEn.js';

test('smoke: full app flows (manual-full-feature-test)', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err));

  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  // Dashboard: check-in
  await page.getByRole('button', { name: /Check In/i }).click();
  await expect(page.getByText(/Today's check-in done!/i)).toBeVisible();

  // Dashboard: log weight
  await page.getByRole('button', { name: /Log Today's Weight/i }).click();
  await page.getByPlaceholder(/Weight in kg/i).fill('70.5');
  await page.getByRole('button', { name: /^Save$/i }).click();
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();

  // Reload: persist at least the existence of the chart header
  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();

  // Workout: rest timer + first exercise expand
  await page.goto('/workout');
  await expect(page.getByRole('button', { name: /^Start$/i })).toBeVisible();
  await page.getByRole('button', { name: /^Start$/i }).click();
  await expect(page.getByRole('button', { name: /^Pause$/i })).toBeVisible();

  await page.locator('button[aria-controls^="ex-detail-"]').first().click();
  await expect(page.locator('[id^="ex-detail-"]').first()).toBeVisible();

  // Progress: weight chart + export button + add photo
  await page.goto('/progress');
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /Add Photo/i })).toBeVisible();

  // Profile: recalc + VO2 + delete-all dialog
  await page.goto('/profile');
  await page.getByRole('button', { name: /Recalculate & Save/i }).click();
  await expect(page.getByText(/Recalculated & Saved!/i)).toBeVisible();

  await page.getByRole('button', { name: /Expand VO₂ calculator/i }).click();
  await page.getByPlaceholder(/e\.g\. 15\.5/i).fill('15.5');
  await page.getByPlaceholder(/e\.g\. 155/i).fill('155');
  await page.getByRole('button', { name: /Calculate VO₂ Max/i }).click();
  await expect(page.getByText(/ml\/kg\/min/i)).toBeVisible();

  // 404 (must run before delete-all clears profile data)
  await page.goto('/this-route-should-not-exist');
  await expect(page.getByText(/^404$/)).toBeVisible();
  await page.goto('/profile');

  await page.getByRole('button', { name: /Delete All Data/i }).click();
  const dialog = page.getByRole('alertdialog');
  await dialog.getByRole('button', { name: /Continue/i }).click();
  await dialog.getByRole('button', { name: /Continue/i }).click();
  await page.getByPlaceholder(/Type DELETE to confirm/i).fill('DELETE');
  await page.getByRole('button', { name: /Delete Everything/i }).click();
  await expect(page.getByRole('heading', { name: /^FitLocal$/ })).toBeVisible();

  // Privacy
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { name: /Privacy Policy/i })).toBeVisible();

  expect(pageErrors, `Unexpected runtime errors: ${pageErrors.map((e) => e.message).join(' | ')}`).toHaveLength(0);
});

