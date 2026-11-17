"use client";

import Link from "next/link";
import { addDays, format, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useT } from "@/lib/i18n/context";

export function DateNav({
  dateStr,
  realTodayStr,
}: {
  dateStr: string;
  realTodayStr: string;
}) {
  const t = useT();
  const isToday = dateStr === realTodayStr;
  const base = parseISO(dateStr);
  const prev = format(addDays(base, -1), "yyyy-MM-dd");
  const next = format(addDays(base, 1), "yyyy-MM-dd");
  const hrefFor = (d: string) => (d === realTodayStr ? "/today" : `/today?date=${d}`);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Link
          href={hrefFor(prev)}
          aria-label={t.today.prevDay}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <span className="text-sm font-medium tabular-nums min-w-24 text-center">{dateStr}</span>
        {isToday ? (
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </span>
        ) : (
          <Link
            href={hrefFor(next)}
            aria-label={t.today.nextDay}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
        <input
          type="date"
          value={dateStr}
          max={realTodayStr}
          onChange={(e) => {
            const v = e.target.value;
            if (v && v <= realTodayStr) window.location.href = hrefFor(v);
          }}
          className="h-8 rounded-md border bg-background px-2 text-sm"
        />
        {!isToday && (
          <Link href="/today" className="text-sm text-primary underline-offset-2 hover:underline">
            {t.today.backToToday}
          </Link>
        )}
      </div>
      {!isToday && (
        <p className="text-sm rounded-md bg-muted px-3 py-2">{t.today.pastBanner(dateStr)}</p>
      )}
    </div>
  );
}
