"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createHabit } from "./actions";
import { HabitFormFields } from "./habit-form-fields";
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
          <HabitFormFields linkableGoals={linkableGoals} />
          <Button type="submit" className="w-full">
            {t.goals.createHabit}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
