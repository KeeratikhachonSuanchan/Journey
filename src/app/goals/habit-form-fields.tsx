"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useT } from "@/lib/i18n/context";
import type { Goal, Habit } from "@/db/schema";

// Displayed Monday-first (matches the app's Monday-based week), stored as
// 0=Sunday..6=Saturday to match Date.getDay() (see habits.daysOfWeek).
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0];
const ALL_DAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAYS = [1, 2, 3, 4, 5];
const WEEKENDS = [0, 6];

function sameDays(a: number[], b: number[]) {
  return a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);
}

export function HabitFormFields({
  defaultValues,
  linkableGoals,
}: {
  defaultValues?: Pick<
    Habit,
    "title" | "cadence" | "goalId" | "durationMinutes" | "daysOfWeek"
  >;
  linkableGoals: Goal[];
}) {
  const t = useT();
  const id = useId();
  const [selectedDays, setSelectedDays] = useState<number[]>(
    defaultValues?.daysOfWeek?.length ? defaultValues.daysOfWeek : ALL_DAYS
  );

  function toggleDay(day: number) {
    setSelectedDays((prev) => {
      if (prev.includes(day)) {
        return prev.length > 1 ? prev.filter((d) => d !== day) : prev;
      }
      return [...prev, day];
    });
  }

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
      <div>
        <Label htmlFor={`${id}-durationMinutes`}>
          {t.goals.duration} <span className="text-muted-foreground">({t.common.optional})</span>
        </Label>
        <Input
          id={`${id}-durationMinutes`}
          name="durationMinutes"
          type="number"
          min={1}
          placeholder={t.goals.durationPlaceholder}
          defaultValue={defaultValues?.durationMinutes ?? undefined}
        />
      </div>
      <div>
        <Label>{t.goals.daysOfWeek}</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          <Button
            type="button"
            size="sm"
            variant={sameDays(selectedDays, ALL_DAYS) ? "default" : "outline"}
            onClick={() => setSelectedDays(ALL_DAYS)}
          >
            {t.goals.everyDay}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sameDays(selectedDays, WEEKDAYS) ? "default" : "outline"}
            onClick={() => setSelectedDays(WEEKDAYS)}
          >
            {t.goals.weekdays}
          </Button>
          <Button
            type="button"
            size="sm"
            variant={sameDays(selectedDays, WEEKENDS) ? "default" : "outline"}
            onClick={() => setSelectedDays(WEEKENDS)}
          >
            {t.goals.weekends}
          </Button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {DAY_ORDER.map((day) => (
            <Button
              key={day}
              type="button"
              size="sm"
              variant={selectedDays.includes(day) ? "default" : "outline"}
              onClick={() => toggleDay(day)}
            >
              {t.enums.dayOfWeek[day as keyof typeof t.enums.dayOfWeek]}
            </Button>
          ))}
        </div>
        {selectedDays.map((day) => (
          <input key={day} type="hidden" name="daysOfWeek" value={day} />
        ))}
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
