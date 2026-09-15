import { subDays } from "date-fns";
import { formatDate } from "@/lib/dates";

/**
 * Counts consecutive days ending at (or the day before) `anchor` that appear
 * in `days`. One day of grace: if `anchor` itself isn't logged yet, the streak
 * is still measured from yesterday so a streak doesn't drop to 0 just because
 * today hasn't happened yet.
 *
 * `anchor` should come from src/lib/dates.ts `today()` (Bangkok-anchored),
 * matching how `days` were produced.
 */
export function computeStreak(days: Iterable<string>, anchor: Date): number {
  const set = new Set(days);
  let cursor = anchor;
  if (!set.has(formatDate(cursor))) {
    cursor = subDays(cursor, 1);
  }

  let streak = 0;
  while (set.has(formatDate(cursor))) {
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
}
