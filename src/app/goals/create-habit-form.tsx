"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { createHabit } from "./actions";
import { useRef } from "react";
import { useT } from "@/lib/i18n/context";
import type { Goal } from "@/db/schema";

export function CreateHabitForm({ linkableGoals }: { linkableGoals: Goal[] }) {
  const t = useT();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createHabit(formData);
    formRef.current?.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.goals.newHabit}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="habitTitle">{t.goals.goalTitle}</Label>
            <Input
              id="habitTitle"
              name="title"
              placeholder={t.goals.habitTitlePlaceholder}
              required
            />
          </div>
          <div>
            <Label htmlFor="cadence">{t.goals.cadence}</Label>
            <Select
              name="cadence"
              required
              defaultValue="daily"
              items={{
                daily: t.enums.cadence.daily,
                weekly: t.enums.cadence.weekly,
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{t.enums.cadence.daily}</SelectItem>
                <SelectItem value="weekly">{t.enums.cadence.weekly}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {linkableGoals.length > 0 && (
            <div>
              <Label htmlFor="goalId">{t.goals.linkToGoal}</Label>
              <Select
                name="goalId"
                defaultValue="none"
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
          <Button type="submit" className="w-full">
            {t.goals.createHabit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
