export async function completeOnboardingInEnglish(
  page,
  {
    name = 'Test User',
    weight = '70',
    height = '175',
    age = '25',
    targetWeight = '65',
  } = {},
) {
  // Step 0: intro -> Continue
  await page.getByRole('button', { name: /Continue/i }).click();

  // Step 1: profile
  await page.getByPlaceholder('Name').fill(name);
  await page.getByPlaceholder('70').fill(weight);
  await page.getByPlaceholder('175').fill(height);
  await page.getByPlaceholder('25').fill(age);
  await page.getByPlaceholder('65').fill(targetWeight);

  // Default in state is male, but keep the explicit click to stabilize.
  await page.getByRole('button', { name: /^Male$/ }).click();

  // Activity level (BottomSheetSelect on desktop)
  const activityLevelBtn = page.getByRole('button', { name: /Activity Level/i }).first();
  await activityLevelBtn.click();
  await page.getByRole('option', { name: /Moderate/i }).click();

  await page.getByRole('button', { name: /Continue/i }).click();

  // Step 2: goal
  await page.getByRole('button', { name: /Fat Loss/i }).click();
  await page.getByRole('button', { name: /Continue/i }).click();

  // Step 3: schedule + session (pick Mon)
  await page.getByRole('button', { name: /^Mon$/ }).click();
  await page.getByRole('button', { name: /Start Training/i }).click();
}

