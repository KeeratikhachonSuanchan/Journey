import type { Dictionary } from "@/lib/i18n";

const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

function sameDays(a: number[], b: number[]) {
  return a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);
}

export function summarizeDaysOfWeek(
  days: number[] | null,
  t: Dictionary
): string | null {
  if (!days || days.length === 0 || days.length === 7) return null;
  if (sameDays(days, WEEKDAYS)) return t.goals.weekdays;
  if (sameDays(days, WEEKENDS)) return t.goals.weekends;

  return DISPLAY_ORDER.filter((d) => days.includes(d))
    .map((d) => t.enums.dayOfWeek[d as keyof typeof t.enums.dayOfWeek])
    .join(", ");
}
