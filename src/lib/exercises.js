// Exercise database
const COMPOUND = [
  { name: 'Back Squat', muscle: 'Legs', type: 'compound', sets: '4x6', desc: 'Barbell on traps, squat to parallel' },
  { name: 'Bench Press', muscle: 'Chest', type: 'compound', sets: '4x6', desc: 'Flat bench, bar to chest' },
  { name: 'Deadlift', muscle: 'Back', type: 'compound', sets: '3x5', desc: 'Hip hinge, neutral spine' },
  { name: 'Overhead Press', muscle: 'Shoulders', type: 'compound', sets: '3x8', desc: 'Press bar overhead, lock out' },
  { name: 'Barbell Row', muscle: 'Back', type: 'compound', sets: '4x8', desc: 'Hinge forward, row to lower chest' },
  { name: 'Romanian Deadlift', muscle: 'Hamstrings', type: 'compound', sets: '3x10', desc: 'Hip hinge with slight knee bend' },
  { name: 'Pull-Up', muscle: 'Back', type: 'compound', sets: '3x8', desc: 'Full ROM, chest to bar' },
  { name: 'Dips', muscle: 'Chest/Triceps', type: 'compound', sets: '3x10', desc: 'Lean forward for chest focus' },
];

const ISOLATION = {
  Chest: [
    { name: 'Cable Fly', muscle: 'Chest', type: 'isolation', sets: '3x12', desc: 'Wide arc, squeeze at centre' },
    { name: 'Incline DB Press', muscle: 'Chest', type: 'isolation', sets: '3x12', desc: '30° incline, full ROM' },
    { name: 'Pec Deck', muscle: 'Chest', type: 'isolation', sets: '3x15', desc: 'Controlled movement, contract hard' },
  ],
  Back: [
    { name: 'Lat Pulldown', muscle: 'Back', type: 'isolation', sets: '3x12', desc: 'Pull to upper chest' },
    { name: 'Seated Cable Row', muscle: 'Back', type: 'isolation', sets: '3x12', desc: 'Elbows tight, full stretch' },
    { name: 'Face Pulls', muscle: 'Rear Delt', type: 'isolation', sets: '3x15', desc: 'Pull to face, external rotate' },
  ],
  Legs: [
    { name: 'Leg Curl', muscle: 'Hamstrings', type: 'isolation', sets: '3x12', desc: 'Slow eccentric' },
    { name: 'Leg Extension', muscle: 'Quads', type: 'isolation', sets: '3x12', desc: 'Pause at top' },
    { name: 'Calf Raise', muscle: 'Calves', type: 'isolation', sets: '4x15', desc: 'Full ROM, stretch at bottom' },
  ],
  Shoulders: [
    { name: 'Lateral Raise', muscle: 'Shoulders', type: 'isolation', sets: '4x15', desc: 'Slight forward lean, lead with elbow' },
    { name: 'DB Front Raise', muscle: 'Shoulders', type: 'isolation', sets: '3x12', desc: 'Alternate arms, controlled' },
  ],
  Arms: [
    { name: 'Barbell Curl', muscle: 'Biceps', type: 'isolation', sets: '3x12', desc: 'Strict form, no swing' },
    { name: 'Hammer Curl', muscle: 'Biceps', type: 'isolation', sets: '3x12', desc: 'Neutral grip' },
    { name: 'Tricep Pushdown', muscle: 'Triceps', type: 'isolation', sets: '3x15', desc: 'Lock out at bottom' },
    { name: 'Skull Crusher', muscle: 'Triceps', type: 'isolation', sets: '3x12', desc: 'Lower to forehead, extend up' },
  ],
};

const CARDIO = [
  { name: 'Steady-State Run', muscle: 'Cardio', type: 'cardio', sets: '20-30 min', desc: '65-75% max HR' },
  { name: 'Rowing Machine', muscle: 'Cardio', type: 'cardio', sets: '15-20 min', desc: 'Full body, 70% effort' },
  { name: 'Jump Rope', muscle: 'Cardio', type: 'cardio', sets: '3x5 min', desc: '1 min rest between sets' },
  { name: 'Cycling', muscle: 'Cardio', type: 'cardio', sets: '20-40 min', desc: 'Zone 2 effort' },
  { name: 'HIIT Sprints', muscle: 'Cardio', type: 'cardio', sets: '8x30s', desc: '30s on, 60s off' },
];

const DAY_SPLITS = {
  2: [['Chest', 'Back', 'Arms'], ['Legs', 'Shoulders']],
  3: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs', 'Shoulders']],
  4: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs'], ['Shoulders', 'Arms']],
  5: [['Chest'], ['Back'], ['Legs'], ['Shoulders', 'Arms'], ['Full Body']],
  6: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs'], ['Chest', 'Shoulders'], ['Back', 'Arms'], ['Legs']],
};

export function getWorkoutPlan(profile) {
  const { goal, days = 3, sessionLength = 'medium', age = 30 } = profile;
  const daysCount = days.length || 3;
  const splits = DAY_SPLITS[Math.min(Math.max(daysCount, 2), 6)];
  
  const isElder = age > 50;
  const compoundSets = isElder
    ? COMPOUND.map((e) => ({ ...e, sets: e.sets.replace(/x\d+/, 'x8') }))
    : COMPOUND;

  return splits.map((muscles, i) => {
    let exercises = [];

    // Always include some compound lifts
    const relevantCompounds = compoundSets.filter((e) =>
      muscles.includes(e.muscle) || muscles.includes('Full Body')
    );
    exercises.push(...relevantCompounds.slice(0, sessionLength === 'short' ? 2 : 3));

    // Add isolation based on session length
    if (sessionLength !== 'short') {
      muscles.forEach((m) => {
        const iso = ISOLATION[m] || [];
        const count = sessionLength === 'long' ? 2 : 1;
        exercises.push(...iso.slice(0, count));
      });
    }

    // Add cardio for fat_loss or endurance
    if ((goal === 'fat_loss' || goal === 'endurance') && sessionLength !== 'short') {
      exercises.push(CARDIO[goal === 'endurance' ? 0 : 4]);
    }

    return {
      day: i + 1,
      muscles,
      exercises: exercises.slice(0, sessionLength === 'short' ? 4 : sessionLength === 'medium' ? 7 : 10),
    };
  });
}

export const restTimeByGoal = {
  fat_loss: 45,
  endurance: 60,
  hypertrophy: 90,
  maintenance: 75,
};