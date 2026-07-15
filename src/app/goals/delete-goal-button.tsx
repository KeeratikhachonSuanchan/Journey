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
import { deleteGoal, getGoalDeletePreview } from "./actions";
import { useT } from "@/lib/i18n/context";

type Preview = {
  childTitles: string[];
  habitCount: number;
  reflectionCount: number;
};

export function DeleteGoalButton({
  goalId,
  goalTitle,
  redirectTo,
  size = "sm",
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}: {
  goalId: string;
  goalTitle: string;
  redirectTo?: string;
  size?: "sm" | "icon-sm";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  hideTrigger?: boolean;
}) {
  const t = useT();
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [preview, setPreview] = useState<Preview | null>(null);
  const [deleting, setDeleting] = useState(false);
  const loading = open && preview === null;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getGoalDeletePreview(goalId).then((result) => {
      if (!cancelled) setPreview(result);
    });
    return () => {
      cancelled = true;
    };
  }, [open, goalId]);

  async function handleConfirm() {
    setDeleting(true);
    await deleteGoal(goalId);
    setDeleting(false);
    setOpen(false);
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <Button
          type="button"
          variant="destructive"
          size={size}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Trash2Icon />
          {size === "sm" && t.goals.delete}
        </Button>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.goals.deleteGoalTitle}</DialogTitle>
          <DialogDescription>
            {loading
              ? t.goals.loadingDeletePreview
              : t.goals.deleteGoalWarning({
                  title: goalTitle,
                  children: preview?.childTitles.length ?? 0,
                  habits: preview?.habitCount ?? 0,
                  reflections: preview?.reflectionCount ?? 0,
                })}
          </DialogDescription>
        </DialogHeader>
        {!loading && preview && preview.childTitles.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              {t.goals.willDeleteChildren}
            </p>
            <ul className="text-sm list-disc pl-4 space-y-0.5">
              {preview.childTitles.map((title, i) => (
                <li key={i}>{title}</li>
              ))}
            </ul>
          </div>
        )}
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
