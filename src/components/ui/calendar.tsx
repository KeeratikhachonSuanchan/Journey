"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  format,
} from "date-fns";
import { enUS, th } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/context";

export function Calendar({
  selected,
  onSelect,
  month,
  onMonthChange,
}: {
  selected?: Date;
  onSelect: (date: Date) => void;
  month: Date;
  onMonthChange: (date: Date) => void;
}) {
  const locale = useLocale();
  const dfnsLocale = locale === "th" ? th : enUS;

  const gridStart = startOfWeek(startOfMonth(month));
  const gridEnd = endOfWeek(endOfMonth(month));
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
  const weekDayLabels = days
    .slice(0, 7)
    .map((d) => format(d, "EEEEEE", { locale: dfnsLocale }));

  return (
    <div className="w-64 p-3">
      <div className="mb-2 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onMonthChange(subMonths(month, 1))}
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-sm font-medium">
          {format(month, "MMMM yyyy", { locale: dfnsLocale })}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => onMonthChange(addMonths(month, 1))}
        >
          <ChevronRightIcon />
        </Button>
      </div>

      <div className="mb-1 grid grid-cols-7 gap-1">
        {weekDayLabels.map((label, i) => (
          <div
            key={i}
            className="flex h-8 items-center justify-center text-xs text-muted-foreground"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, month);
          const isSelected = selected && isSameDay(day, selected);

          if (!inMonth) {
            return <div key={day.toISOString()} className="size-8" />;
          }

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelect(day)}
              className={cn(
                "size-8 rounded-md text-sm transition-colors",
                !isSelected && "hover:bg-muted",
                isSelected && "bg-primary text-primary-foreground font-medium",
                !isSelected && isToday(day) && "ring-1 ring-primary/50"
              )}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>
    </div>
  );
}
