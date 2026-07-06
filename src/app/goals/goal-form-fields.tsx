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
import { DatePicker } from "@/components/ui/date-picker";
import { formatDate, today } from "@/lib/dates";
import { useT } from "@/lib/i18n/context";
import type { Goal } from "@/db/schema";

export function GoalFormFields({
  defaultValues,
  linkableGoals,
}: {
  defaultValues?: Pick<
    Goal,
    "title" | "domain" | "periodStart" | "periodEnd" | "parentId"
  >;
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
          placeholder={t.goals.goalTitlePlaceholder}
          defaultValue={defaultValues?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="domain">{t.goals.domain}</Label>
        <Select
          name="domain"
          required
          defaultValue={defaultValues?.domain ?? "dev"}
          items={{
            dev: t.enums.domain.dev,
            finance: t.enums.domain.finance,
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dev">{t.enums.domain.dev}</SelectItem>
            <SelectItem value="finance">{t.enums.domain.finance}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label htmlFor={`${id}-periodStart`}>{t.goals.periodStart}</Label>
          <DatePicker
            id={`${id}-periodStart`}
            name="periodStart"
            defaultValue={defaultValues?.periodStart ?? formatDate(today())}
            required
          />
        </div>
        <div>
          <Label htmlFor={`${id}-periodEnd`}>
            {t.goals.periodEnd}{" "}
            <span className="text-muted-foreground">({t.common.optional})</span>
          </Label>
          <DatePicker
            id={`${id}-periodEnd`}
            name="periodEnd"
            defaultValue={defaultValues?.periodEnd}
          />
        </div>
      </div>
      {linkableGoals.length > 0 && (
        <div>
          <Label htmlFor="parentId">{t.goals.linkToGoal}</Label>
          <Select
            name="parentId"
            defaultValue={defaultValues?.parentId ?? "none"}
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
