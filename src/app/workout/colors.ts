import type { DayColor } from "./data";

export const dayColorClasses: Record<
  DayColor,
  { dot: string; text: string; border: string; ring: string }
> = {
  blue: {
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/40",
    ring: "ring-blue-500/60",
  },
  orange: {
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    border: "border-orange-500/40",
    ring: "ring-orange-500/60",
  },
  violet: {
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    border: "border-violet-500/40",
    ring: "ring-violet-500/60",
  },
  amber: {
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/40",
    ring: "ring-amber-500/60",
  },
  emerald: {
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/40",
    ring: "ring-emerald-500/60",
  },
};
