"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateGoal } from "./actions";
import { GoalFormFields } from "./goal-form-fields";
import { useT } from "@/lib/i18n/context";
import type { Goal } from "@/db/schema";

export function EditGoalDialog({
  goal,
  linkableGoals,
}: {
  goal: Goal;
  linkableGoals: Goal[];
}) {
  const t = useT();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    await updateGoal(goal.id, formData);
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <PencilIcon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.goals.editGoal}</DialogTitle>
        </DialogHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="space-y-3"
          id={`edit-goal-${goal.id}`}
        >
          <GoalFormFields
            defaultValues={goal}
            linkableGoals={linkableGoals.filter((g) => g.id !== goal.id)}
          />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.common.cancel}
          </DialogClose>
          <Button
            type="submit"
            form={`edit-goal-${goal.id}`}
            disabled={saving}
          >
            {t.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
