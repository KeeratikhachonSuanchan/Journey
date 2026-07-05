"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createGoal } from "./actions";
import { GoalFormFields } from "./goal-form-fields";
import { useRef } from "react";
import { useT } from "@/lib/i18n/context";
import type { Goal } from "@/db/schema";

export function CreateGoalForm({ linkableGoals }: { linkableGoals: Goal[] }) {
  const t = useT();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await createGoal(formData);
    formRef.current?.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.goals.newGoal}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={handleSubmit} className="space-y-3">
          <GoalFormFields linkableGoals={linkableGoals} />
          <Button type="submit" className="w-full">
            {t.goals.createGoal}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
