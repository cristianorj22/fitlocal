import { test, expect } from '@playwright/test';
import { resetAppState } from './helpers/resetAppState.js';
import { completeOnboardingInEnglish } from './helpers/onboardingEn.js';

async function readWeightLog(page) {
  return page.evaluate(async () => {
    const DB_NAME = 'fitlocal_db';
    const STORE_NAME = 'kv';
    const KEY = 'weight_log';
    return await new Promise((resolve) => {
      try {
        const req = indexedDB.open(DB_NAME, 1);
        req.onerror = () => resolve([]);
        req.onupgradeneeded = () => {};
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(STORE_NAME, 'readonly');
          const store = tx.objectStore(STORE_NAME);
          const r = store.get(KEY);
          r.onsuccess = () => resolve(r.result ?? []);
          r.onerror = () => resolve([]);
        };
      } catch {
        resolve([]);
      }
    });
  });
}

test('logging weight should not crash (no "t is not defined")', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err));

  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  await expect(page.getByRole('button', { name: /Log Today's Weight/i })).toBeVisible();
  await page.getByRole('button', { name: /Log Today's Weight/i }).click();

  await page.getByPlaceholder(/Weight in kg/i).fill('70');
  await page.getByRole('button', { name: /^Save$/i }).click();

  // If React crashed, it should surface via pageerror. Fail fast with details.
  await page.waitForTimeout(1000);
  expect(pageErrors, `Unexpected runtime errors: ${pageErrors.map((e) => e.message).join(' | ')}`).toHaveLength(0);

  await expect(page.getByText(/Weight Progress/i)).toBeVisible();
});

test('invalid weight input does not persist NaN / does not crash', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (err) => pageErrors.push(err));

  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  await page.getByRole('button', { name: /Log Today's Weight/i }).click();
  await page.getByPlaceholder(/Weight in kg/i).fill('abc');
  await page.getByRole('button', { name: /^Save$/i }).click();

  const log = await readWeightLog(page);
  expect(log.length).toBe(0);
  expect(pageErrors, `Unexpected runtime errors: ${pageErrors.map((e) => e.message).join(' | ')}`).toHaveLength(0);
});

test('age input sanitizes to digits only', async ({ page }) => {
  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page, { age: 'a12b3' });

  const savedProfile = await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('fitlocal_profile');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  expect(savedProfile).toBeTruthy();
  expect(savedProfile.age).toMatch(/^\d+$/);
  expect(savedProfile.age).toBe('123');
});

test('age with only letters blocks onboarding "Continue"', async ({ page }) => {
  await resetAppState(page);
  await page.goto('/onboarding');

  // Step 0 -> Step 1
  await page.getByRole('button', { name: /Continue/i }).click();

  await page.getByPlaceholder('Name').fill('Test User');
  await page.getByPlaceholder('70').fill('70');
  await page.getByPlaceholder('175').fill('175');
  await page.getByPlaceholder('25').fill('abc');
  await page.getByPlaceholder('65').fill('65');

  await page.getByRole('button', { name: /^Male$/ }).click();
  const activityLevelBtn = page.getByRole('button', { name: /Activity Level/i }).first();
  await activityLevelBtn.click();
  await page.getByRole('option', { name: /Moderate/i }).click();

  const continueBtn = page.getByRole('button', { name: /^Continue$/ }).first();
  await expect(continueBtn).toBeDisabled();
});

test('weight persists after reload', async ({ page }) => {
  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  await page.getByRole('button', { name: /Log Today's Weight/i }).click();
  await page.getByPlaceholder(/Weight in kg/i).fill('70');
  await page.getByRole('button', { name: /^Save$/i }).click();

  // Wait for mutation + re-render (IndexedDB write + react-query invalidation).
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();
  const before = await readWeightLog(page);
  expect(before.length).toBe(1);
  expect(Number.isFinite(before[0].kg)).toBe(true);

  await page.reload();
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText(/Weight Progress/i)).toBeVisible();

  const after = await readWeightLog(page);
  expect(after.length).toBe(1);
  expect(Number.isFinite(after[0].kg)).toBe(true);
});

test('photos upload and delete (Progress page)', async ({ page }) => {
  await resetAppState(page);
  await page.goto('/onboarding');
  await completeOnboardingInEnglish(page);

  await page.goto('/progress');

  const base64Png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+kv7kAAAAASUVORK5CYII=';
  const buffer = Buffer.from(base64Png, 'base64');

  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer,
  });

  await expect(page.locator('button.aspect-square')).toHaveCount(1, { timeout: 20_000 });

  await page.locator('button.aspect-square').first().click();
  await expect(page.getByRole('button', { name: /Delete photo/i })).toBeVisible();
  await page.getByRole('button', { name: /Delete photo/i }).click();

  await expect(page.getByText(/No photos yet/i)).toBeVisible();
});

