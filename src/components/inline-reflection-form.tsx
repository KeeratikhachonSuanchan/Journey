"use client";

import { Button } from "@/components/ui/button";
import { createReflection } from "@/app/goals/actions";
import { ReflectionFields } from "@/components/reflection-fields";
import { useT } from "@/lib/i18n/context";

export function InlineReflectionForm({
  goalId,
  habitId,
  occurredOn,
}: {
  goalId?: string;
  habitId?: string;
  occurredOn: string;
}) {
  const t = useT();

  return (
    <form action={createReflection} className="flex flex-wrap items-end gap-2">
      {goalId && <input type="hidden" name="goalId" value={goalId} />}
      {habitId && <input type="hidden" name="habitId" value={habitId} />}
      <input type="hidden" name="occurredOn" value={occurredOn} />

      <ReflectionFields />

      <Button type="submit" size="sm">
        {t.common.save}
      </Button>
    </form>
  );
}
