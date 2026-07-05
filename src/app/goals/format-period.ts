export function formatPeriodRange(
  periodStart: string | null,
  periodEnd: string | null
): string {
  if (!periodStart && !periodEnd) return "";
  if (!periodEnd) return `${periodStart} –`;
  return `${periodStart} – ${periodEnd}`;
}
