"use client";

import { useState } from "react";
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
import { updateHabit } from "./actions";
import { HabitFormFields } from "./habit-form-fields";
import { useT } from "@/lib/i18n/context";
import type { Goal, Habit } from "@/db/schema";

export function EditHabitDialog({
  habit,
  linkableGoals,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: {
  habit: Habit;
  linkableGoals: Goal[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    await updateHabit(habit.id, formData);
    setSaving(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={() => setOpen(true)}
        >
          <PencilIcon />
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.goals.editHabit}</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="space-y-3"
          id={`edit-habit-${habit.id}`}
        >
          <HabitFormFields defaultValues={habit} linkableGoals={linkableGoals} />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.common.cancel}
          </DialogClose>
          <Button
            type="submit"
            form={`edit-habit-${habit.id}`}
            disabled={saving}
          >
            {t.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
