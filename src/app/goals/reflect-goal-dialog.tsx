"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReflectionFields } from "@/components/reflection-fields";
import { createReflection } from "./actions";
import { useT } from "@/lib/i18n/context";

export function ReflectGoalDialog({
  goalId,
  goalTitle,
  todayStr,
}: {
  goalId: string;
  goalTitle: string;
  todayStr: string;
}) {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSaving(true);
    await createReflection(formData);
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
        <CheckCircle2Icon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{goalTitle}</DialogTitle>
        </DialogHeader>
        <form
          action={handleSubmit}
          className="flex flex-wrap items-end gap-2"
          id={`reflect-goal-${goalId}`}
        >
          <input type="hidden" name="goalId" value={goalId} />
          <input type="hidden" name="occurredOn" value={todayStr} />
          <ReflectionFields />
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.common.cancel}
          </DialogClose>
          <Button
            type="submit"
            form={`reflect-goal-${goalId}`}
            disabled={saving}
          >
            {t.common.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
