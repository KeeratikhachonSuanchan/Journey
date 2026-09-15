// Bridges the vendored src/lib/srs/srs-logic.ts (pure, UTC-ISO, in-memory)
// with this app's DB rows (Bangkok-anchored "YYYY-MM-DD" date columns).
//
// Fate of each srs-logic export in this app:
//   reviewCard          -> used, via applyReview() below (box/streak math only —
//                           the returned dueDate/lastReviewed are NOT trusted, see below)
//   initReviewState      -> mirrored by newStateFields() (date-only, Bangkok-anchored,
//                            instead of new Date().toISOString())
//   BOX_INTERVALS_DAYS   -> re-read directly, so interval tuning stays in one file
//   getDueCards          -> replaced by a SQL `due_date <= today` query
//                           (src/app/english/actions.ts) — the same predicate at
//                           day granularity, since every date here is date-only
//   getProgressSummary   -> replaced by a SQL aggregate query (same file)
//   ensureReviewStates   -> intentionally UNUSED. Eagerly creating a state for
//                           every card (all ~3,000) would make everything due on
//                           day one. States are created lazily, on first answer —
//                           see submitReview() in src/app/english/actions.ts.
//
// Why dueDate can't be trusted from reviewCard(): it derives the next due date
// from `new Date()` in the *server process's* timezone and returns a UTC ISO
// timestamp. This app anchors "today" to Bangkok time (src/lib/dates.ts) — on a
// UTC host, 20:00 UTC is already tomorrow in Bangkok, which would silently shift
// every due date by a day. So applyReview() takes only the algorithm's outputs
// (box, correctStreak, totalReviews) and computes the stored date itself from
// today() + BOX_INTERVALS_DAYS.

import { addDays } from "date-fns";
import { today, formatDate } from "@/lib/dates";
import {
  reviewCard,
  BOX_INTERVALS_DAYS,
  type ReviewState as SrsReviewState,
  type ReviewResult as SrsReviewResult,
} from "./srs-logic";
import type { VocabReviewState } from "@/db/schema";

/** DB row -> the shape srs-logic expects. "YYYY-MM-DD" parses fine as an ISO date. */
export function toSrsState(row: VocabReviewState): SrsReviewState {
  return {
    cardId: row.cardId,
    box: row.box,
    dueDate: row.dueDate,
    lastReviewed: row.lastReviewedOn,
    totalReviews: row.totalReviews,
    correctStreak: row.correctStreak,
  };
}

export type NewReviewStateFields = {
  cardId: string;
  box: number;
  dueDate: string;
  lastReviewedOn: string | null;
  introducedOn: string;
  totalReviews: number;
  correctStreak: number;
};

/** Fields for a brand-new state, introduced right now. Mirrors initReviewState()
 * but date-only and Bangkok-anchored instead of new Date().toISOString(). */
export function newStateFields(cardId: string): NewReviewStateFields {
  const todayStr = formatDate(today());
  return {
    cardId,
    box: 1,
    dueDate: todayStr,
    lastReviewedOn: null,
    introducedOn: todayStr,
    totalReviews: 0,
    correctStreak: 0,
  };
}

export type AppliedReview = {
  box: number;
  dueDate: string;
  lastReviewedOn: string;
  totalReviews: number;
  correctStreak: number;
};

/** Runs the vendored reviewCard() for the box/streak/count math, then derives
 * the stored due date from this app's Bangkok "today" instead of trusting
 * srs-logic's UTC-derived ISO timestamp. */
export function applyReview(
  row: VocabReviewState | NewReviewStateFields,
  result: SrsReviewResult
): AppliedReview {
  const before: SrsReviewState = {
    cardId: row.cardId,
    box: row.box,
    dueDate: row.dueDate,
    lastReviewed: row.lastReviewedOn,
    totalReviews: row.totalReviews,
    correctStreak: row.correctStreak,
  };

  const next = reviewCard(before, result);
  const intervalDays = BOX_INTERVALS_DAYS[next.box] ?? BOX_INTERVALS_DAYS[6];
  const dueDate = formatDate(addDays(today(), intervalDays));
  const lastReviewedOn = formatDate(today());

  return {
    box: next.box,
    dueDate,
    lastReviewedOn,
    totalReviews: next.totalReviews,
    correctStreak: next.correctStreak,
  };
}
