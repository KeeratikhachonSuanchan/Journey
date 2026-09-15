"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { submitReview, type QueueCard } from "../actions";
import { useT } from "@/lib/i18n/context";
import type { ReviewResult } from "@/db/schema";

const RESULTS: { key: ReviewResult; shortcut: string }[] = [
  { key: "again", shortcut: "1" },
  { key: "hard", shortcut: "2" },
  { key: "good", shortcut: "3" },
  { key: "easy", shortcut: "4" },
];

export function ReviewSession({ cards, dueTotal }: { cards: QueueCard[]; dueTotal: number }) {
  const t = useT().english;
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [error, setError] = useState(false);
  const [, startTransition] = useTransition();
  // Guards against answering the same card twice — e.g. a fast double-tap or
  // a duplicate touch/click event firing before React re-renders and removes
  // these buttons — which would otherwise advance `index` by 2 and skip a
  // card the user never actually saw.
  const answeredIndexRef = useRef(-1);

  const current = cards[index];
  const done = index >= cards.length;

  function answer(result: ReviewResult) {
    if (!current) return;
    if (answeredIndexRef.current === index) return;
    answeredIndexRef.current = index;
    const cardId = current.cardId;
    // Advance immediately — the write happens in the background, so there's
    // no per-card network wait. submitReview does not revalidate this route,
    // so the queue array here stays stable for the rest of the session.
    startTransition(async () => {
      try {
        await submitReview(cardId, result);
      } catch {
        setError(true);
      }
    });
    setResults((prev) => [...prev, result]);
    setFlipped(false);
    setIndex((i) => i + 1);
  }

  useEffect(() => {
    if (done) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") {
        e.preventDefault();
        setFlipped((f) => !f);
        return;
      }
      if (!flipped) return;
      const match = RESULTS.find((r) => r.shortcut === e.key);
      if (match) answer(match.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, index, done]);

  if (done) {
    const summary = RESULTS.map((r) => ({
      key: r.key,
      count: results.filter((res) => res === r.key).length,
    }));

    return (
      <Card>
        <CardContent className="space-y-4 py-8 text-center">
          <div className="text-lg font-semibold">{t.sessionDone}</div>
          <div className="text-sm text-muted-foreground">{t.sessionSummary(results.length)}</div>
          <div className="flex justify-center gap-2 flex-wrap">
            {summary.map((s) => (
              <Badge key={s.key} variant="secondary">
                {t[s.key]}: {s.count}
              </Badge>
            ))}
          </div>
          <div className="flex justify-center gap-2 pt-2">
            {dueTotal > cards.length && (
              <Button variant="default" onClick={() => router.refresh()}>
                {t.reviewMore}
              </Button>
            )}
            <Link href="/english">
              <Button variant="outline">{t.backToOverview}</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const remaining = cards.length - index;
  const progressPct = (index / cards.length) * 100;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t.remaining(remaining)}</span>
          {error && <span className="text-destructive">{t.saveFailed}</span>}
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <Card
        role="button"
        tabIndex={0}
        onClick={() => setFlipped((f) => !f)}
        className="min-h-64 cursor-pointer select-none"
      >
        <CardContent className="flex min-h-64 flex-col items-center justify-center gap-4 py-8 text-center">
          <div className="flex items-center gap-2">
            <Badge variant="outline">{current.level}</Badge>
            {current.pos && <span className="text-xs text-muted-foreground">{current.pos}</span>}
          </div>
          <div className="text-3xl font-semibold tracking-tight">{current.word}</div>

          {!flipped ? (
            <div className="text-xs text-muted-foreground">{t.tapToFlip}</div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg text-foreground">{current.meaning}</div>
              <div className="text-sm text-muted-foreground italic">&ldquo;{current.example}&rdquo;</div>
            </div>
          )}
        </CardContent>
      </Card>

      {flipped && (
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="destructive"
            className="h-12 flex-col gap-0.5"
            onClick={() => answer("again")}
          >
            {t.again}
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-col gap-0.5 border-warning/40 text-warning hover:bg-warning/10"
            onClick={() => answer("hard")}
          >
            {t.hard}
          </Button>
          <Button variant="default" className="h-12 flex-col gap-0.5" onClick={() => answer("good")}>
            {t.good}
          </Button>
          <Button
            variant="outline"
            className={cn("h-12 flex-col gap-0.5 border-success/40 text-success hover:bg-success/10")}
            onClick={() => answer("easy")}
          >
            {t.easy}
          </Button>
        </div>
      )}
    </div>
  );
}
