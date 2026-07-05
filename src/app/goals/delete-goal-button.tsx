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
}: {
  goalId: string;
  goalTitle: string;
  redirectTo?: string;
  size?: "sm" | "icon-sm";
}) {
  const t = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<Preview | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next) {
      setLoading(true);
      setPreview(await getGoalDeletePreview(goalId));
      setLoading(false);
    }
  }

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
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="destructive"
        size={size}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleOpenChange(true);
        }}
      >
        <Trash2Icon />
        {size === "sm" && t.goals.delete}
      </Button>
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
