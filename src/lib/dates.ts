import { startOfWeek, startOfMonth, startOfYear, format } from "date-fns";

export const BANGKOK_TZ = "Asia/Bangkok";

// Returns a Date whose local getters (getFullYear/getMonth/getDate/getHours...)
// reflect Bangkok wall-clock time, regardless of the process's own timezone —
// date-fns reads those local getters, so this keeps "today" anchored to Bangkok.
export function nowInBangkok(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BANGKOK_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const hour = get("hour") === "24" ? 0 : Number(get("hour"));

  return new Date(
    Number(get("year")),
    Number(get("month")) - 1,
    Number(get("day")),
    hour,
    Number(get("minute")),
    Number(get("second"))
  );
}

export function weekStart(d: Date): Date {
  return startOfWeek(d, { weekStartsOn: 1 });
}

export function monthStart(d: Date): Date {
  return startOfMonth(d);
}

export function yearStart(d: Date): Date {
  return startOfYear(d);
}

export function formatDate(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function today(): Date {
  return nowInBangkok();
}

// 0=Sunday..6=Saturday, matching Date.getDay() — used to match against
// habits.daysOfWeek, which is stored in the same convention.
export function dayOfWeek(d: Date): number {
  return d.getDay();
}

export function todayStr(): string {
  return formatDate(today());
}
