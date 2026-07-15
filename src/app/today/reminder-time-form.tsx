"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateReminderTime } from "./actions";
import { useT } from "@/lib/i18n/context";

export function ReminderTimeForm({ initialTime }: { initialTime: string | null }) {
  const t = useT();
  const [time, setTime] = useState(initialTime ?? "20:00");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  function handleSave() {
    setStatus("idle");
    const formData = new FormData();
    formData.set("reminderTime", time);
    startTransition(async () => {
      try {
        await updateReminderTime(formData);
        setStatus("saved");
      } catch {
        setStatus("error");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="reminder-time" className="text-sm text-muted-foreground">
        {t.today.reminderTimeLabel}
      </label>
      <Input
        id="reminder-time"
        type="time"
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
          setStatus("idle");
        }}
        className="w-28"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isPending}
      >
        {t.common.save}
      </Button>
      {status === "saved" && (
        <span className="text-xs text-muted-foreground">{t.today.reminderTimeSaved}</span>
      )}
      {status === "error" && (
        <span className="text-xs text-destructive">{t.today.reminderTimeFailed}</span>
      )}
    </div>
  );
}
