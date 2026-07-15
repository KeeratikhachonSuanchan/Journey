"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { testSendHabitReminder } from "./actions";
import { useT } from "@/lib/i18n/context";

export function TestLineReminderButton() {
  const t = useT();
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleClick() {
    setResult(null);
    startTransition(async () => {
      try {
        const { sent, pending } = await testSendHabitReminder();
        setResult(
          sent ? t.today.testReminderSent(pending) : t.today.testReminderNothingPending
        );
      } catch (err) {
        setResult(err instanceof Error ? err.message : t.today.testReminderFailed);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? t.today.testReminderSending : t.today.testReminderButton}
      </Button>
      {result && <span className="text-xs text-muted-foreground">{result}</span>}
    </div>
  );
}
