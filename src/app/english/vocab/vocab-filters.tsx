"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/lib/i18n/context";
import type { VocabLevel, VocabSource } from "@/db/schema";

type StateFilter = "new" | "learning" | "mastered";

export function VocabFilters({
  initial,
}: {
  initial: { level?: VocabLevel; source?: VocabSource; state?: StateFilter; q?: string };
}) {
  const dict = useT();
  const t = dict.english;
  const sourceLabels = dict.enums.vocabSource;
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(initial.q ?? "");

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    params.delete("page"); // reset pagination whenever a filter changes
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  // Debounce the search box so we're not replacing the URL on every keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (q !== (initial.q ?? "")) updateParams({ q: q || undefined });
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const levelItems = { all: t.allLevels, A1: "A1", A2: "A2", B1: "B1", B2: "B2" };
  const sourceItems = { all: t.allSources, user: sourceLabels.user, common: sourceLabels.common };
  const stateItems = {
    all: t.allStates,
    new: t.notStartedLabel,
    learning: t.learning,
    mastered: t.mastered,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t.searchPlaceholder}
        className="w-full sm:w-48"
      />
      <Select
        items={levelItems}
        value={initial.level ?? "all"}
        onValueChange={(v) => updateParams({ level: v === "all" ? undefined : (v as string) })}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(levelItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={sourceItems}
        value={initial.source ?? "all"}
        onValueChange={(v) => updateParams({ source: v === "all" ? undefined : (v as string) })}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(sourceItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        items={stateItems}
        value={initial.state ?? "all"}
        onValueChange={(v) => updateParams({ state: v === "all" ? undefined : (v as string) })}
      >
        <SelectTrigger size="sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(stateItems).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
