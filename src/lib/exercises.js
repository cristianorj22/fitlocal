// Normalized exercise database
export const EXERCISE_DB = [
  // Beginners / Stay Active / Seniors
  { id: 1, name: 'Chair Squat', category: 'Legs', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-15', rest: 90, instructions: 'Sit down and stand up from a stable chair, focusing on control and balance. Keep your knees aligned.' },
  { id: 2, name: 'Wall Push-up', category: 'Chest', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+', '18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '10-15', rest: 60, instructions: 'Place your hands on the wall at shoulder height. Lower your body in a straight line and push back up.' },
  { id: 3, name: 'Glute Bridge', category: 'Legs/Core', focus: 'Compound', goals: ['Stay Active', 'Endurance', 'Hypertrophy'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12-15', rest: 60, instructions: 'Lying on your back, lift your hips until your thighs and torso are aligned. Contract your glutes.' },
  { id: 4, name: 'Resistance Band Row', category: 'Back', focus: 'Compound', goals: ['Stay Active', 'Endurance'], ageRange: ['60+', '18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12-15', rest: 60, instructions: 'Sit with your legs straight, band attached to your feet. Pull the band towards your abdomen.' },
  // Hypertrophy / Strength
  { id: 5, name: 'Barbell Squat', category: 'Legs', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '8-12', rest: 90, instructions: 'Barbell on trapezius muscles. Squat keeping your back straight and knees out until thighs are parallel.' },
  { id: 6, name: 'Barbell Bench Press', category: 'Chest', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '4', reps: '8-12', rest: 90, instructions: 'Lying on the bench, hold the bar at shoulder width. Lower it to your chest and push.' },
  { id: 7, name: 'Romanian Deadlift', category: 'Legs/Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Advanced', duration: 'Medium', sets: '3', reps: '10-12', rest: 90, instructions: 'Legs almost straight. Lower the bar close to the thigh, pushing the hip back until you feel the stretch.' },
  { id: 8, name: 'Barbell Row', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '10-12', rest: 90, instructions: 'Lean your torso forward ~45°. Pull the bar towards your navel, contracting your back.' },
  { id: 9, name: 'Dumbbell Overhead Press', category: 'Shoulders', focus: 'Compound', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '4', reps: '10-12', rest: 90, instructions: 'Press dumbbells overhead from shoulder height. Lock out at the top, control on the way down.' },
  { id: 10, name: 'Deadlift', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '5', rest: 120, instructions: 'Hip hinge, neutral spine. Drive through the floor and lock hips at the top.' },
  { id: 11, name: 'Pull-Up', category: 'Back', focus: 'Compound', goals: ['Hypertrophy', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '8', rest: 90, instructions: 'Full ROM, chest to bar. Engage lats from the bottom.' },
  { id: 12, name: 'Dips', category: 'Chest/Triceps', focus: 'Compound', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '10', rest: 90, instructions: 'Lean forward for chest focus. Full depth, control the descent.' },
  // Isolation
  { id: 13, name: 'Cable Fly', category: 'Chest', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Medium', sets: '3', reps: '12', rest: 60, instructions: 'Wide arc, squeeze at centre of movement.' },
  { id: 14, name: 'Lateral Raise', category: 'Shoulders', focus: 'Isolation', goals: ['Hypertrophy', 'Maintenance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '4', reps: '15', rest: 60, instructions: 'Slight forward lean, lead with elbow. Control the eccentric.' },
  { id: 15, name: 'Barbell Curl', category: 'Biceps', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12', rest: 60, instructions: 'Strict form, no swing. Full range of motion.' },
  { id: 16, name: 'Tricep Pushdown', category: 'Triceps', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '15', rest: 60, instructions: 'Lock out at bottom, control on the way up.' },
  { id: 17, name: 'Leg Curl', category: 'Hamstrings', focus: 'Isolation', goals: ['Hypertrophy'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '12', rest: 60, instructions: 'Slow eccentric, full stretch at bottom.' },
  { id: 18, name: 'Calf Raise', category: 'Calves', focus: 'Isolation', goals: ['Hypertrophy', 'Endurance', 'Maintenance'], ageRange: ['18-60', '60+'], level: 'Beginner', duration: 'Short', sets: '4', reps: '15', rest: 45, instructions: 'Full ROM, pause and stretch at the bottom.' },
  // Cardio
  { id: 19, name: 'Steady-State Run', category: 'Cardio', focus: 'Cardio', goals: ['Endurance', 'fat_loss'], ageRange: ['18-60'], level: 'Beginner', duration: 'Medium', sets: '1', reps: '20-30 min', rest: 0, instructions: '65-75% max HR. Maintain a conversational pace.' },
  { id: 20, name: 'HIIT Sprints', category: 'Cardio', focus: 'Cardio', goals: ['fat_loss', 'Endurance'], ageRange: ['18-60'], level: 'Intermediate', duration: 'Short', sets: '8', reps: '30s on / 60s off', rest: 60, instructions: 'Max effort sprints. 30s all-out, 60s active recovery.' },
  { id: 21, name: 'Jump Rope', category: 'Cardio', focus: 'Cardio', goals: ['fat_loss', 'Endurance'], ageRange: ['18-60'], level: 'Beginner', duration: 'Short', sets: '3', reps: '5 min', rest: 60, instructions: 'Maintain a steady rhythm. Great for coordination and warm-up.' },
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
      return goalMatch && ageMatch && durationMatch && (muscleMatch || muscles.includes('Full Body'));
    });

    const maxEx = sessionLength === 'short' ? 4 : sessionLength === 'medium' ? 6 : 9;

    return {
      day: i + 1,
      muscles,
      exercises: filtered.slice(0, maxEx).map((ex) => ({
        name: ex.name,
        muscle: ex.category,
        type: ex.focus.toLowerCase(),
        sets: `${ex.sets}x${ex.reps}`,
        desc: ex.instructions,
        rest: ex.rest,
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