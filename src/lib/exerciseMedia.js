// Optional visual assets per exercise (female / male variants).
// Filenames: public/exercises/{id}-{slug}-{female|male}.webp
// Fallback: if a variant were missing, we'd use the other; both should exist for production.

/** @type {Record<number, { slug: string; alt: string }>} */
const META = {
  1: { slug: 'chair-squat', alt: 'Chair squat: controlled sit-to-stand using a stable chair' },
  2: { slug: 'wall-push-up', alt: 'Wall push-up: hands on wall, straight body line' },
  3: { slug: 'glute-bridge', alt: 'Glute bridge: hips lifted, glutes squeezed' },
  4: { slug: 'resistance-band-row', alt: 'Resistance band seated row toward the abdomen' },
  5: { slug: 'barbell-squat', alt: 'Back squat with bar on upper back' },
  6: { slug: 'barbell-bench-press', alt: 'Barbell bench press, full range of motion' },
  7: { slug: 'romanian-deadlift', alt: 'Romanian deadlift: hip hinge with bar near thighs' },
  8: { slug: 'barbell-row', alt: 'Barbell bent-over row toward the navel' },
  9: { slug: 'dumbbell-overhead-press', alt: 'Dumbbell overhead press from shoulders' },
  10: { slug: 'deadlift', alt: 'Conventional deadlift: neutral spine, hip lockout' },
  11: { slug: 'pull-up', alt: 'Pull-up: full range lat engagement' },
  12: { slug: 'dips', alt: 'Parallel bar dips, controlled depth' },
  13: { slug: 'cable-fly', alt: 'Cable fly: wide arc, squeeze at center' },
  14: { slug: 'lateral-raise', alt: 'Dumbbell lateral raise with slight forward lean' },
  15: { slug: 'barbell-curl', alt: 'Barbell biceps curl, strict form' },
  16: { slug: 'tricep-pushdown', alt: 'Cable tricep pushdown' },
  17: { slug: 'leg-curl', alt: 'Lying or seated leg curl' },
  18: { slug: 'calf-raise', alt: 'Standing calf raise, full stretch and pause' },
  19: { slug: 'steady-state-run', alt: 'Easy conversational pace jogging' },
  20: { slug: 'hiit-sprints', alt: 'High intensity sprint intervals' },
  21: { slug: 'jump-rope', alt: 'Jump rope: steady rhythm' },
};

function buildRow(id) {
  const m = META[id];
  if (!m) return null;
  const base = `/exercises/${id}-${m.slug}`;
  return {
    kind: 'image',
    alt: m.alt,
    byGender: {
      female: `${base}-female.webp`,
      male: `${base}-male.webp`,
    },
  };
}

const EXERCISE_MEDIA = Object.fromEntries(
  Object.keys(META).map((k) => [Number(k), buildRow(Number(k))]),
);

/**
 * @param {number | undefined | null} exerciseId
 * @param {string | undefined} gender - 'male' | 'female' (from profile)
 * @returns {{ kind: 'image'; src: string; alt: string } | null}
 */
export function getExerciseMedia(exerciseId, gender) {
  if (exerciseId == null) return null;
  const row = EXERCISE_MEDIA[exerciseId];
  if (!row?.byGender) return null;

  const want = gender === 'male' ? 'male' : 'female';
  const other = want === 'male' ? 'female' : 'male';

  const primary = row.byGender[want];
  const fallback = row.byGender[other];

  return {
    kind: 'image',
    src: primary || fallback,
    alt: row.alt,
  };
}
