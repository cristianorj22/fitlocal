/**
 * Streak calculator — counts consecutive check-in days ending at today/yesterday.
 * Used by the widget bridge and could be surfaced in Dashboard.
 */

import { getCheckIns } from '../storage';

export function getStreakCount() {
  const checkins = getCheckIns();
  if (!checkins.length) return 0;

  // Sort descending
  const sorted = [...checkins].sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let expected = new Date(today);

  // Allow streak to start from today or yesterday
  const latest = new Date(sorted[0] + 'T00:00:00');
  const diffMs = today - latest;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays > 1) return 0; // streak broken
  if (diffDays === 1) {
    expected = new Date(today);
    expected.setDate(expected.getDate() - 1);
  }

  for (const dateStr of sorted) {
    const d = new Date(dateStr + 'T00:00:00');
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === expected.getTime()) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else if (d.getTime() < expected.getTime()) {
      break; // gap found
    }
    // skip duplicates (d > expected)
  }

  return streak;
}