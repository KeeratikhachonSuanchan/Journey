"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/lib/i18n/context";
import { BANGKOK_TZ } from "@/lib/dates";

export function LiveClock() {
  const locale = useLocale();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Live clock synced to the real clock — must update from an effect/timer,
    // there is no other source of truth to render from.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <div className="hidden sm:block w-[170px]" />;
  }

  const intlLocale = locale === "th" ? "th-TH" : "en-US";

  const dateStr = new Intl.DateTimeFormat(intlLocale, {
    timeZone: BANGKOK_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(now);

  const timeStr = new Intl.DateTimeFormat(intlLocale, {
    timeZone: BANGKOK_TZ,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground tabular-nums">
      <span className="hidden sm:inline">{dateStr}</span>
      <span className="hidden sm:inline opacity-50">·</span>
      <span>{timeStr}</span>
    </div>
  );
}
