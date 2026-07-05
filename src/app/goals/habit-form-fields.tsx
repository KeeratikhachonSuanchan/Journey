"use client";

import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/context";
import type { Goal, Habit } from "@/db/schema";

export function HabitFormFields({
  defaultValues,
  linkableGoals,
}: {
  defaultValues?: Pick<Habit, "title" | "cadence" | "goalId">;
  linkableGoals: Goal[];
}) {
  const t = useT();
  const id = useId();

  return (
    <>
      <div>
        <Label htmlFor={`${id}-title`}>{t.goals.goalTitle}</Label>
        <Input
          id={`${id}-title`}
          name="title"
          placeholder={t.goals.habitTitlePlaceholder}
          defaultValue={defaultValues?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="cadence">{t.goals.cadence}</Label>
        <Select
          name="cadence"
          required
          defaultValue={defaultValues?.cadence ?? "daily"}
          items={{
            daily: t.enums.cadence.daily,
            weekly: t.enums.cadence.weekly,
            monthly: t.enums.cadence.monthly,
            quarterly: t.enums.cadence.quarterly,
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{t.enums.cadence.daily}</SelectItem>
            <SelectItem value="weekly">{t.enums.cadence.weekly}</SelectItem>
            <SelectItem value="monthly">{t.enums.cadence.monthly}</SelectItem>
            <SelectItem value="quarterly">{t.enums.cadence.quarterly}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {linkableGoals.length > 0 && (
        <div>
          <Label htmlFor="goalId">{t.goals.linkToGoal}</Label>
          <Select
            name="goalId"
            defaultValue={defaultValues?.goalId ?? "none"}
            items={{
              none: t.goals.none,
              ...Object.fromEntries(linkableGoals.map((g) => [g.id, g.title])),
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t.goals.none}</SelectItem>
              {linkableGoals.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
