// Normalized exercise database
export const EXERCISE_DB = [
  // Beginners / Stay Active / Seniors
  { id: 1, name: 'Chair Squat', category: 'Legs', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-15', rest: 90, instructions: 'Sit down and stand up from a stable chair, focusing on control and balance. Keep your knees aligned.', highImpact: false, alternatives: [3] },
  { id: 2, name: 'Wall Push-up', category: 'Chest', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+', '18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-15', rest: 60, instructions: 'Place your hands on the wall at shoulder height. Lower your body in a straight line and push back up.', highImpact: false, alternatives: [6, 13] },
  { id: 3, name: 'Glute Bridge', category: 'Legs/Core', focus: 'Compound', goals: ['Stay Active', 'Endurance', 'Hypertrophy'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12-15', rest: 60, instructions: 'Lying on your back, lift your hips until your thighs and torso are aligned. Contract your glutes.', highImpact: false, alternatives: [1, 5] },
  { id: 4, name: 'Resistance Band Row', category: 'Back', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+', '18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12-15', rest: 60, instructions: 'Sit with your legs straight, band attached to your feet. Pull the band towards your abdomen.', highImpact: false, alternatives: [8, 11] },
  // Hypertrophy / Strength
  { id: 5, name: 'Barbell Squat', category: 'Legs', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '8-12', rest: 90, instructions: 'Barbell on trapezius muscles. Squat keeping your back straight and knees out until thighs are parallel.', highImpact: true, alternatives: [22, 1] },
  { id: 6, name: 'Barbell Bench Press', category: 'Chest', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '4', reps: '8-12', rest: 90, instructions: 'Lying on the bench, hold the bar at shoulder width. Lower it to your chest and push.', highImpact: false, alternatives: [23, 24] },
  { id: 7, name: 'Romanian Deadlift', category: 'Legs/Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Advanced', duration: 'Medium', sets: '3', reps: '10-12', rest: 90, instructions: 'Legs almost straight. Lower the bar close to the thigh, pushing the hip back until you feel the stretch.', highImpact: true, alternatives: [17, 3] },
  { id: 8, name: 'Barbell Row', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '10-12', rest: 90, instructions: 'Lean your torso forward ~45°. Pull the bar towards your navel, contracting your back.', highImpact: false, alternatives: [4, 25] },
  { id: 9, name: 'Dumbbell Overhead Press', category: 'Shoulders', focus: 'Compound', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '10-12', rest: 90, instructions: 'Press dumbbells overhead from shoulder height. Lock out at the top, control on the way down.', highImpact: false, alternatives: [14, 26] },
  { id: 10, name: 'Deadlift', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '5', rest: 120, instructions: 'Hip hinge, neutral spine. Drive through the floor and lock hips at the top.', highImpact: true, alternatives: [7, 8] },
  { id: 11, name: 'Pull-Up', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '8', rest: 90, instructions: 'Full ROM, chest to bar. Engage lats from the bottom.', highImpact: false, alternatives: [25, 4] },
  { id: 12, name: 'Dips', category: 'Chest/Triceps', focus: 'Compound', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '10', rest: 90, instructions: 'Lean forward for chest focus. Full depth, control the descent.', highImpact: false, alternatives: [16, 24] },
  // Isolation
  { id: 13, name: 'Cable Fly', category: 'Chest', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '12', rest: 60, instructions: 'Wide arc, squeeze at centre of movement.', highImpact: false, alternatives: [24, 2] },
  { id: 14, name: 'Lateral Raise', category: 'Shoulders', focus: 'Isolation', goals: ['Hypertrophy', 'Maintenance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '4', reps: '15', rest: 60, instructions: 'Slight forward lean, lead with elbow. Control the eccentric.', highImpact: false, alternatives: [9, 26] },
  { id: 15, name: 'Barbell Curl', category: 'Biceps', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12', rest: 60, instructions: 'Strict form, no swing. Full range of motion.', highImpact: false, alternatives: [27] },
  { id: 16, name: 'Tricep Pushdown', category: 'Triceps', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '15', rest: 60, instructions: 'Lock out at bottom, control on the way up.', highImpact: false, alternatives: [12] },
  { id: 17, name: 'Leg Curl', category: 'Hamstrings', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12', rest: 60, instructions: 'Slow eccentric, full stretch at bottom.', highImpact: false, alternatives: [7, 3] },
  { id: 18, name: 'Calf Raise', category: 'Calves', focus: 'Isolation', goals: ['Hypertrophy', 'Endurance', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '4', reps: '15', rest: 45, instructions: 'Full ROM, pause and stretch at the bottom.', highImpact: false, alternatives: [] },
  // Cardio
  { id: 19, name: 'Steady-State Run', category: 'Cardio', focus: 'Cardio', goals: ['Endurance', 'fat_loss'], ageRange: ['18-60'], level: 'Beginner', duration: 'Medium', sets: '1', reps: '20-30 min', rest: 0, instructions: '65-75% max HR. Maintain a conversational pace.', highImpact: true, alternatives: [28] },
  { id: 20, name: 'HIIT Sprints', category: 'Cardio', focus: 'Cardio', goals: ['fat_loss', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Short', sets: '8', reps: '30s on / 60s off', rest: 60, instructions: 'Max effort sprints. 30s all-out, 60s active recovery.', highImpact: true, alternatives: [21, 28] },
  { id: 21, name: 'Jump Rope', category: 'Cardio', focus: 'Cardio', goals: ['fat_loss', 'Endurance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '5 min', rest: 60, instructions: 'Maintain a steady rhythm. Great for coordination and warm-up.', highImpact: true, alternatives: [28] },
  // New exercises for alternatives
  { id: 22, name: 'Leg Press', category: 'Legs', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Medium', sets: '4', reps: '10-12', rest: 90, instructions: 'Feet shoulder-width on the platform. Push until legs are almost straight. Control the descent.', highImpact: false, alternatives: [5, 1] },
  { id: 23, name: 'Dumbbell Bench Press', category: 'Chest', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '4', reps: '8-12', rest: 90, instructions: 'Lying on the bench, press dumbbells from chest level. Greater range of motion than barbell.', highImpact: false, alternatives: [6, 24] },
  { id: 24, name: 'Machine Chest Press', category: 'Chest', focus: 'Compound', goals: ['Hypertrophy', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-12', rest: 60, instructions: 'Sit with back firmly against pad. Push handles forward until arms are extended. Control the return.', highImpact: false, alternatives: [6, 23] },
  { id: 25, name: 'Lat Pulldown', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-12', rest: 60, instructions: 'Wide grip, pull bar to upper chest. Squeeze shoulder blades. Control the return.', highImpact: false, alternatives: [11, 4] },
  { id: 26, name: 'Machine Shoulder Press', category: 'Shoulders', focus: 'Compound', goals: ['Hypertrophy', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-12', rest: 60, instructions: 'Sit with back supported. Press handles overhead until arms are almost straight.', highImpact: false, alternatives: [9, 14] },
  { id: 27, name: 'Dumbbell Curl', category: 'Biceps', focus: 'Isolation', goals: ['Hypertrophy', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12', rest: 60, instructions: 'Alternating arms, curl with control. Keep elbows at your sides.', highImpact: false, alternatives: [15] },
  { id: 28, name: 'Brisk Walking', category: 'Cardio', focus: 'Cardio', goals: ['fat_loss', 'Endurance', 'Maintenance', 'Stay Active'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Medium', sets: '1', reps: '20-30 min', rest: 0, instructions: 'Walk at a brisk pace where breathing is elevated but you can still talk. Great low-impact cardio.', highImpact: false, alternatives: [19] },
];

const GOAL_MAP = {
  fat_loss: ['fat_loss', 'Fat Loss', 'Endurance'],
  hypertrophy: ['Hypertrophy', 'hypertrophy'],
  endurance: ['Endurance', 'endurance', 'Stay Active'],
  maintenance: ['Maintenance', 'maintenance', 'Stay Active'],
};

const DAY_SPLITS = {
  2: [['Legs', 'Core'], ['Chest', 'Back', 'Shoulders']],
  3: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs', 'Shoulders']],
  4: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs'], ['Shoulders']],
  5: [['Chest'], ['Back'], ['Legs'], ['Shoulders'], ['Full Body']],
  6: [['Chest', 'Triceps'], ['Back', 'Biceps'], ['Legs'], ['Chest', 'Shoulders'], ['Back'], ['Legs']],
};

/** All unique muscle group categories in the DB */
export const MUSCLE_GROUPS = [
  'Full Body', 'Legs', 'Chest', 'Back', 'Shoulders',
  'Arms', 'Core', 'Cardio',
];

/** Map display groups → exercise category matches */
const GROUP_CATEGORIES = {
  'Full Body': null, // matches all
  'Legs': ['Legs', 'Legs/Core', 'Legs/Back', 'Hamstrings', 'Calves'],
  'Chest': ['Chest', 'Chest/Triceps'],
  'Back': ['Back', 'Legs/Back'],
  'Shoulders': ['Shoulders'],
  'Arms': ['Biceps', 'Triceps', 'Chest/Triceps'],
  'Core': ['Legs/Core', 'Core'],
  'Cardio': ['Cardio'],
};

/** Get exercises filtered by muscle group, goal, age, session length */
export function getExercisesForGroup(group, profile) {
  const { goal, sessionLength = 'medium', age = 30 } = profile;
  const goalKeys = GOAL_MAP[goal] || [goal];
  const ageKey = age >= 60 ? '60+' : '18-60';
  const durationMap = { short: 'Short', medium: 'Medium', long: 'Long' };
  const maxDuration = durationMap[sessionLength] || 'Medium';
  const durationPriority = { Short: 1, Medium: 2, Long: 3 };
  const maxPriority = durationPriority[maxDuration];
  const cats = GROUP_CATEGORIES[group];

  let filtered = EXERCISE_DB.filter((ex) => {
    const goalMatch = ex.goals.some((g) => goalKeys.includes(g));
    const ageMatch = ex.ageRange.includes(ageKey);
    const durationMatch = durationPriority[ex.duration] <= maxPriority;
    const muscleMatch = cats === null || cats.some((c) => ex.category.includes(c));
    // Filter high-impact for 60+
    const impactOk = age < 60 || !ex.highImpact;
    return goalMatch && ageMatch && durationMatch && muscleMatch && impactOk;
  });

  const maxEx = sessionLength === 'short' ? 4 : sessionLength === 'medium' ? 6 : 9;
  return filtered.slice(0, maxEx).map((ex) => ({
    exerciseId: ex.id,
    name: ex.name,
    muscle: ex.category,
    type: ex.focus.toLowerCase(),
    sets: `${ex.sets}x${ex.reps}`,
    desc: ex.instructions,
    rest: ex.rest,
    level: ex.level,
    alternatives: (ex.alternatives || []).map((altId) => {
      const alt = EXERCISE_DB.find((e) => e.id === altId);
      return alt ? { id: alt.id, name: alt.name, category: alt.category } : null;
    }).filter(Boolean),
  }));
}

/** Legacy function — kept for compatibility */
export function getWorkoutPlan(profile) {
  const { goal, days = [], sessionLength = 'medium', age = 30 } = profile;
  const daysCount = Math.min(Math.max((days.length || 3), 2), 6);
  const splits = DAY_SPLITS[daysCount];
  const goalKeys = GOAL_MAP[goal] || [goal];
  const ageKey = age >= 60 ? '60+' : '18-60';
  const durationMap = { short: 'Short', medium: 'Medium', long: 'Long' };
  const maxDuration = durationMap[sessionLength] || 'Medium';
  const durationPriority = { Short: 1, Medium: 2, Long: 3 };
  const maxPriority = durationPriority[maxDuration];

  return splits.map((muscles, i) => {
    const filtered = EXERCISE_DB.filter((ex) => {
      const goalMatch = ex.goals.some((g) => goalKeys.includes(g));
      const ageMatch = ex.ageRange.includes(ageKey) || ex.ageRange.includes('18-60');
      const durationMatch = durationPriority[ex.duration] <= maxPriority;
      const muscleMatch = muscles.some((m) => ex.category.includes(m)) || muscles.includes('Full Body');
      const impactOk = age < 60 || !ex.highImpact;
      return goalMatch && ageMatch && durationMatch && (muscleMatch || muscles.includes('Full Body')) && impactOk;
    });

    const maxEx = sessionLength === 'short' ? 4 : sessionLength === 'medium' ? 6 : 9;

    return {
      day: i + 1,
      muscles,
      exercises: filtered.slice(0, maxEx).map((ex) => ({
        exerciseId: ex.id,
        name: ex.name,
        muscle: ex.category,
        type: ex.focus.toLowerCase(),
        sets: `${ex.sets}x${ex.reps}`,
        desc: ex.instructions,
        rest: ex.rest,
        level: ex.level,
        alternatives: (ex.alternatives || []).map((altId) => {
          const alt = EXERCISE_DB.find((e) => e.id === altId);
          return alt ? { id: alt.id, name: alt.name, category: alt.category } : null;
        }).filter(Boolean),
      })),
    };
  });
}

export const restTimeByGoal = {
  fat_loss: 45,
  endurance: 60,
  hypertrophy: 90,
  maintenance: 75,
};