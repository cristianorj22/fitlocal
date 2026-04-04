// BMI
export function calcBMI(weightKg, heightCm) {
  const h = heightCm / 100;
  return weightKg / (h * h);
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Normal', color: 'text-green-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-yellow-400' };
  return { label: 'Obese', color: 'text-red-400' };
}

// Mifflin-St Jeor BMR
export function calcBMR(weightKg, heightCm, age, gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

// TDEE
const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calcTDEE(bmr, activityLevel = 'moderate') {
  return bmr * (activityMultipliers[activityLevel] || 1.55);
}

// Macros based on goal
export function calcMacros(tdee, goal, weightKg) {
  let calories = tdee;
  let proteinG, carbsG, fatG;

  if (goal === 'fat_loss') {
    calories = tdee - 500;
    proteinG = weightKg * 2.2;
    fatG = (calories * 0.25) / 9;
    carbsG = (calories - proteinG * 4 - fatG * 9) / 4;
  } else if (goal === 'hypertrophy') {
    calories = tdee + 300;
    proteinG = weightKg * 2.0;
    fatG = (calories * 0.25) / 9;
    carbsG = (calories - proteinG * 4 - fatG * 9) / 4;
  } else if (goal === 'endurance') {
    calories = tdee + 100;
    proteinG = weightKg * 1.6;
    fatG = (calories * 0.2) / 9;
    carbsG = (calories - proteinG * 4 - fatG * 9) / 4;
  } else {
    // maintenance
    proteinG = weightKg * 1.8;
    fatG = (calories * 0.3) / 9;
    carbsG = (calories - proteinG * 4 - fatG * 9) / 4;
  }

  return {
    calories: Math.round(calories),
    protein: Math.round(proteinG),
    carbs: Math.round(Math.max(carbsG, 0)),
    fat: Math.round(fatG),
  };
}

// VO2 Max — Rockport Walk Test
export function calcVO2Max(weightKg, age, gender, timeMin, heartRate) {
  const weightLbs = weightKg * 2.205;
  const genderFactor = gender === 'male' ? 1 : 0;
  return (
    132.853 -
    0.0769 * weightLbs -
    0.3877 * age +
    6.315 * genderFactor -
    3.2649 * timeMin -
    0.1565 * heartRate
  );
}

export function vo2Category(vo2, age, gender) {
  const tables = {
    male: [
      { max: 35, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [33.0, 36.4, 42.4, 46.4] },
      { max: 45, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [31.5, 35.4, 40.9, 44.9] },
      { max: 55, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [29.0, 32.9, 36.4, 40.9] },
      { max: 65, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [26.0, 30.9, 34.9, 38.9] },
      { max: 999, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [20.5, 24.4, 28.9, 33.0] },
    ],
    female: [
      { max: 35, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [23.5, 27.9, 33.9, 38.9] },
      { max: 45, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [21.0, 24.4, 29.4, 34.4] },
      { max: 55, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [18.5, 22.9, 26.9, 31.9] },
      { max: 65, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [16.0, 19.9, 23.9, 27.9] },
      { max: 999, labels: ['Poor', 'Fair', 'Average', 'Good', 'Excellent'], cuts: [13.0, 16.4, 19.9, 23.9] },
    ],
  };
  const row = (tables[gender] || tables.male).find((r) => age <= r.max);
  if (!row) return 'Unknown';
  for (let i = 0; i < row.cuts.length; i++) {
    if (vo2 <= row.cuts[i]) return row.labels[i];
  }
  return row.labels[row.labels.length - 1];
}

/**
 * Daily water intake: 30–40 ml/kg/day (uses 35 ml/kg midpoint).
 * Returns liters. Handles both kg and lbs (converts lbs→kg if unit provided).
 */
export function calcDailyWater(weight, unit = 'kg') {
  const kg = unit === 'lbs' ? weight / 2.205 : weight;
  return Math.round((kg * 35) / 100) / 10; // liters, 1 decimal
}

/**
 * Recommended sleep hours based on age + activity.
 * Sources: NSF, ACSM guidelines.
 */
export function calcSleepHours(age, activityLevel = 'moderate', goal = 'maintenance') {
  let base;
  if (age < 18) base = 9;
  else if (age < 26) base = 8;
  else if (age < 65) base = 7.5;
  else base = 7;

  // Active people and hypertrophy/endurance goals need more recovery
  const activeBonus = ['active', 'very_active'].includes(activityLevel) ? 0.5 : 0;
  const goalBonus = ['hypertrophy', 'endurance'].includes(goal) ? 0.5 : 0;

  return Math.min(10, Math.round((base + activeBonus + goalBonus) * 2) / 2);
}