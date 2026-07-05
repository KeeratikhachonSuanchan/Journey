"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteHabit, getHabitDeletePreview } from "./actions";
import { useT } from "@/lib/i18n/context";

export function DeleteHabitButton({
  habitId,
  habitTitle,
}: {
  habitId: string;
  habitTitle: string;
}) {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reflectionCount, setReflectionCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setLoading(true);
      const preview = await getHabitDeletePreview(habitId);
      setReflectionCount(preview.reflectionCount);
      setLoading(false);
    }
  }

  async function handleConfirm() {
    setDeleting(true);
    await deleteHabit(habitId);
    setDeleting(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="destructive"
        size="icon-sm"
        onClick={() => handleOpenChange(true)}
      >
        <Trash2Icon />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.goals.deleteHabitTitle}</DialogTitle>
          <DialogDescription>
            {loading
              ? t.goals.loadingDeletePreview
              : t.goals.deleteHabitWarning({
                  title: habitTitle,
                  reflections: reflectionCount ?? 0,
                })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            {t.goals.cancel}
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            disabled={loading || deleting}
            onClick={handleConfirm}
          >
            {t.goals.delete}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
