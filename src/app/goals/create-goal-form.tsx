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
import { createGoal } from "./actions";
import { formatDate, today } from "@/lib/dates";
import { useRef, useState } from "react";
import { useT } from "@/lib/i18n/context";
import type { Goal } from "@/db/schema";

export function CreateGoalForm({ linkableGoals }: { linkableGoals: Goal[] }) {
  const t = useT();
  const formRef = useRef<HTMLFormElement>(null);
  const [periodType, setPeriodType] = useState("day");

  async function handleSubmit(formData: FormData) {
    await createGoal(formData);
    formRef.current?.reset();
    setPeriodType("day");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.goals.newGoal}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="goalTitle">{t.goals.goalTitle}</Label>
            <Input
              id="goalTitle"
              name="title"
              placeholder={t.goals.goalTitlePlaceholder}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="domain">{t.goals.domain}</Label>
              <Select
                name="domain"
                required
                defaultValue="dev"
                items={{
                  dev: t.enums.domain.dev,
                  finance: t.enums.domain.finance,
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dev">{t.enums.domain.dev}</SelectItem>
                  <SelectItem value="finance">{t.enums.domain.finance}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="periodType">{t.goals.period}</Label>
              <Select
                name="periodType"
                required
                defaultValue="day"
                onValueChange={(v) => setPeriodType(v ?? "day")}
                items={{
                  day: t.enums.periodType.day,
                  week: t.enums.periodType.week,
                  month: t.enums.periodType.month,
                  year: t.enums.periodType.year,
                  aspiration: t.enums.periodType.aspiration,
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">{t.enums.periodType.day}</SelectItem>
                  <SelectItem value="week">{t.enums.periodType.week}</SelectItem>
                  <SelectItem value="month">{t.enums.periodType.month}</SelectItem>
                  <SelectItem value="year">{t.enums.periodType.year}</SelectItem>
                  <SelectItem value="aspiration">
                    {t.enums.periodType.aspiration}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {periodType !== "aspiration" && (
            <div>
              <Label htmlFor="periodStart">{t.goals.periodStart}</Label>
              <Input
                id="periodStart"
                name="periodStart"
                type="date"
                defaultValue={formatDate(today())}
                required
              />
            </div>
          )}
          {linkableGoals.length > 0 && (
            <div>
              <Label htmlFor="parentId">{t.goals.linkToGoal}</Label>
              <Select
                name="parentId"
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
            {t.goals.createGoal}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
