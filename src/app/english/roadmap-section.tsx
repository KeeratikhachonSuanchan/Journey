"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { togglePracticeItem } from "./actions";
import { roadmapPhases, pick } from "./roadmap-data";
import { useLocale, useT } from "@/lib/i18n/context";
import type { EnglishPhase } from "@/db/schema";

export function RoadmapSection({
  checkedToday,
  phaseStreaks,
}: {
  checkedToday: string[];
  phaseStreaks: Record<string, number>;
}) {
  const t = useT().english;
  const locale = useLocale();
  const [checked, setChecked] = useState(() => new Set(checkedToday));
  const [, startTransition] = useTransition();

  function toggle(phase: EnglishPhase, itemKey: string) {
    const id = `${phase}.${itemKey}`;
    const willCheck = !checked.has(id);
    setChecked((prev) => {
      const next = new Set(prev);
      if (willCheck) next.add(id);
      else next.delete(id);
      return next;
    });
    startTransition(async () => {
      await togglePracticeItem(phase, itemKey, willCheck);
    });
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{t.roadmap}</h2>
        <p className="text-sm text-muted-foreground">{t.roadmapSub}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmapPhases.map((phase) => {
          const streak = phaseStreaks[phase.key] ?? 0;
          return (
            <Card key={phase.key}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle>{pick(phase.title, locale)}</CardTitle>
                  <Badge variant="outline">{pick(phase.duration, locale)}</Badge>
                </div>
                <CardDescription>{pick(phase.description, locale)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {streak > 0 && (
                  <div className="text-xs font-mono tabular-nums text-primary">
                    {t.phaseStreak(streak)}
                  </div>
                )}
                <ul className="space-y-1.5">
                  {phase.items.map((item) => {
                    const id = `${phase.key}.${item.key}`;
                    return (
                      <li key={item.key}>
                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={checked.has(id)}
                            onChange={() => toggle(phase.key, item.key)}
                            className="size-4 rounded border-input accent-primary"
                          />
                          {pick(item.label, locale)}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
