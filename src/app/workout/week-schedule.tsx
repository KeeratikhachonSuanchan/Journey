"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { weekPlan } from "./data";
import { dayColorClasses } from "./colors";
import { DayDetail } from "./day-detail";

export function WeekSchedule() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const selectedDay = weekPlan.find(
    (day) => day.kind !== "rest" && day.key === selectedKey
  );

  return (
    <div>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
        {weekPlan.map((day, i) => {
          if (day.kind === "rest") {
            return (
              <div
                key={i}
                className="rounded-lg border border-border/60 px-2 py-3 text-center opacity-40"
              >
                <div className="mb-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                  {day.weekday}
                </div>
                <div className="mb-1.5 text-xs font-medium">พัก</div>
                <span className="inline-block rounded-full border border-muted-foreground/50 px-2 py-0.5 text-[9px] font-bold tracking-wide text-muted-foreground uppercase">
                  Rest
                </span>
              </div>
            );
          }

          const colors = dayColorClasses[day.color];
          const active = selectedKey === day.key;

          return (
            <button
              key={day.key}
              type="button"
              onClick={() => setSelectedKey(active ? null : day.key)}
              className={cn(
                "relative overflow-hidden rounded-lg border bg-card px-2 py-3 text-center transition-transform hover:-translate-y-0.5",
                active ? colors.border : "border-border/60"
              )}
            >
              <span
                className={cn("absolute inset-x-0 top-0 h-[3px]", colors.dot)}
              />
              <div className="mb-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                {day.weekday}
              </div>
              <div className="mb-1.5 text-xs leading-tight font-medium">
                {day.dayType}
              </div>
              <span
                className={cn(
                  "inline-block rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-wide uppercase",
                  colors.border,
                  colors.text
                )}
              >
                {day.badge}
              </span>
            </button>
          );
        })}
      </div>

      {selectedDay && selectedDay.kind !== "rest" && (
        <div className="mt-4">
          <DayDetail day={selectedDay} />
        </div>
      )}
    </div>
  );
}
