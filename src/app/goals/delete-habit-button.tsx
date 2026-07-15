"use client";

import { useEffect, useState } from "react";
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
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: {
  habitId: string;
  habitTitle: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [reflectionCount, setReflectionCount] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const loading = open && reflectionCount === null;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getHabitDeletePreview(habitId).then((preview) => {
      if (!cancelled) setReflectionCount(preview.reflectionCount);
    });
    return () => {
      cancelled = true;
    };
  }, [open, habitId]);

  async function handleConfirm() {
    setDeleting(true);
    await deleteHabit(habitId);
    setDeleting(false);
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <Button
          type="button"
          variant="destructive"
          size="icon-sm"
          onClick={() => setOpen(true)}
        >
          <Trash2Icon />
        </Button>
      )}
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
