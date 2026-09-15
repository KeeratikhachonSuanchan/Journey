"use server";

import { db } from "@/db";
import {
  vocabCards,
  vocabReviewStates,
  vocabReviewLogs,
  englishPracticeLogs,
  type VocabLevel,
  type VocabSource,
  type ReviewResult,
  type EnglishPhase,
} from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { eq, and, isNull, isNotNull, lte, asc, ilike, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { today, formatDate } from "@/lib/dates";
import { subDays } from "date-fns";
import { visibleCards } from "@/lib/srs/queries";
import { newStateFields, applyReview } from "@/lib/srs/adapter";
import { NEW_CARDS_PER_DAY, SESSION_LIMIT, MASTERED_BOX, BROWSE_PAGE_SIZE } from "@/lib/srs/config";
import { computeStreak } from "@/lib/streak";
import { roadmapPhases } from "./roadmap-data";

// ---- types (erased at compile time — a "use server" file may export types) ----

export type QueueCard = {
  cardId: string;
  word: string;
  meaning: string;
  example: string;
  level: VocabLevel;
  pos: string | null;
  source: VocabSource;
  box: number;
  isNew: boolean;
};

export type ProgressSummary = {
  total: number;
  mastered: number;
  learning: number;
  notStarted: number;
  due: number;
};

export type BrowseRow = {
  id: string;
  word: string;
  meaning: string;
  example: string;
  level: VocabLevel;
  pos: string | null;
  source: VocabSource;
  box: number | null;
  dueDate: string | null;
};

export type BrowseFilters = {
  level?: VocabLevel;
  source?: VocabSource;
  state?: "new" | "learning" | "mastered";
  q?: string;
  page?: number;
};

// ---- reads ----

export async function getEnglishOverview() {
  const userId = getCurrentUserId();
  const todayStr = formatDate(today());
  const historyFloor = formatDate(subDays(today(), 400));

  const [totalVisible] = await db
    .select({ n: count() })
    .from(vocabCards)
    .where(visibleCards(userId));

  const stateCounts = await db
    .select({ box: vocabReviewStates.box, n: count() })
    .from(vocabReviewStates)
    .where(eq(vocabReviewStates.userId, userId))
    .groupBy(vocabReviewStates.box);

  let started = 0;
  let mastered = 0;
  for (const row of stateCounts) {
    started += row.n;
    if (row.box === MASTERED_BOX) mastered += row.n;
  }
  const learning = started - mastered;
  const notStarted = totalVisible.n - started;

  const [dueRow] = await db
    .select({ n: count() })
    .from(vocabReviewStates)
    .where(and(eq(vocabReviewStates.userId, userId), lte(vocabReviewStates.dueDate, todayStr)));

  const reviewDays = await db
    .selectDistinct({ d: vocabReviewLogs.occurredOn })
    .from(vocabReviewLogs)
    .where(and(eq(vocabReviewLogs.userId, userId), sql`${vocabReviewLogs.occurredOn} >= ${historyFloor}`));

  const practiceDays = await db
    .selectDistinct({ d: englishPracticeLogs.occurredOn })
    .from(englishPracticeLogs)
    .where(
      and(eq(englishPracticeLogs.userId, userId), sql`${englishPracticeLogs.occurredOn} >= ${historyFloor}`)
    );

  const allDays = new Set([...reviewDays.map((r) => r.d), ...practiceDays.map((r) => r.d)]);
  const streak = computeStreak(allDays, today());

  const phaseStreaks: Record<string, number> = {};
  for (const phase of roadmapPhases) {
    const days = await db
      .selectDistinct({ d: englishPracticeLogs.occurredOn })
      .from(englishPracticeLogs)
      .where(
        and(
          eq(englishPracticeLogs.userId, userId),
          eq(englishPracticeLogs.phase, phase.key),
          sql`${englishPracticeLogs.occurredOn} >= ${historyFloor}`
        )
      );
    phaseStreaks[phase.key] = computeStreak(
      days.map((d) => d.d),
      today()
    );
  }

  const checkedRows = await db
    .select({ phase: englishPracticeLogs.phase, itemKey: englishPracticeLogs.itemKey })
    .from(englishPracticeLogs)
    .where(and(eq(englishPracticeLogs.userId, userId), eq(englishPracticeLogs.occurredOn, todayStr)));
  const checkedToday = checkedRows.map((r) => `${r.phase}.${r.itemKey}`);

  // Last 30 days of review activity, zero-filled so the chart never has gaps.
  const activityStart = formatDate(subDays(today(), 29));
  const activityRows = await db
    .select({ day: vocabReviewLogs.occurredOn, n: count() })
    .from(vocabReviewLogs)
    .where(and(eq(vocabReviewLogs.userId, userId), sql`${vocabReviewLogs.occurredOn} >= ${activityStart}`))
    .groupBy(vocabReviewLogs.occurredOn);
  const activityByDay = new Map(activityRows.map((r) => [r.day, r.n]));
  const activity: { day: string; reviewed: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const day = formatDate(subDays(today(), i));
    activity.push({ day, reviewed: activityByDay.get(day) ?? 0 });
  }

  const progress: ProgressSummary = {
    total: totalVisible.n,
    mastered,
    learning,
    notStarted,
    due: dueRow.n,
  };

  return { progress, streak, phaseStreaks, checkedToday, activity, todayStr };
}

export async function getReviewQueue(): Promise<{
  cards: QueueCard[];
  dueTotal: number;
}> {
  const userId = getCurrentUserId();
  const todayStr = formatDate(today());

  const [dueTotalRow] = await db
    .select({ n: count() })
    .from(vocabReviewStates)
    .where(and(eq(vocabReviewStates.userId, userId), lte(vocabReviewStates.dueDate, todayStr)));

  const dueRows = await db
    .select({
      cardId: vocabCards.id,
      word: vocabCards.word,
      meaning: vocabCards.meaning,
      example: vocabCards.example,
      level: vocabCards.level,
      pos: vocabCards.pos,
      source: vocabCards.source,
      box: vocabReviewStates.box,
    })
    .from(vocabReviewStates)
    .innerJoin(vocabCards, eq(vocabReviewStates.cardId, vocabCards.id))
    .where(and(eq(vocabReviewStates.userId, userId), lte(vocabReviewStates.dueDate, todayStr)))
    .orderBy(asc(vocabReviewStates.dueDate), asc(vocabReviewStates.box))
    .limit(SESSION_LIMIT);

  const cards: QueueCard[] = dueRows.map((r) => ({ ...r, isNew: false }));

  const remainingSlots = SESSION_LIMIT - cards.length;
  if (remainingSlots > 0) {
    const [introducedTodayRow] = await db
      .select({ n: count() })
      .from(vocabReviewStates)
      .where(and(eq(vocabReviewStates.userId, userId), eq(vocabReviewStates.introducedOn, todayStr)));
    const newIntakeLeft = Math.max(0, NEW_CARDS_PER_DAY - introducedTodayRow.n);
    const newLimit = Math.min(newIntakeLeft, remainingSlots);

    if (newLimit > 0) {
      const newRows = await db
        .select({
          cardId: vocabCards.id,
          word: vocabCards.word,
          meaning: vocabCards.meaning,
          example: vocabCards.example,
          level: vocabCards.level,
          pos: vocabCards.pos,
          source: vocabCards.source,
        })
        .from(vocabCards)
        .leftJoin(
          vocabReviewStates,
          and(eq(vocabReviewStates.cardId, vocabCards.id), eq(vocabReviewStates.userId, userId))
        )
        .where(and(visibleCards(userId), isNull(vocabReviewStates.id)))
        // User-added words first (highest motivation), then easiest level first.
        .orderBy(
          sql`case when ${vocabCards.source} = 'user' then 0 else 1 end`,
          asc(vocabCards.level),
          asc(vocabCards.id)
        )
        .limit(newLimit);

      cards.push(...newRows.map((r) => ({ ...r, box: 1, isNew: true })));
    }
  }

  return { cards, dueTotal: dueTotalRow.n };
}

export async function getVocabList(
  filters: BrowseFilters
): Promise<{ rows: BrowseRow[]; total: number; page: number; pageSize: number }> {
  const userId = getCurrentUserId();
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = BROWSE_PAGE_SIZE;

  const conditions = [visibleCards(userId)];
  if (filters.level) conditions.push(eq(vocabCards.level, filters.level));
  if (filters.source) conditions.push(eq(vocabCards.source, filters.source));
  if (filters.q) conditions.push(ilike(vocabCards.word, `%${filters.q}%`));
  if (filters.state === "new") conditions.push(isNull(vocabReviewStates.id));
  if (filters.state === "mastered") conditions.push(eq(vocabReviewStates.box, MASTERED_BOX));
  if (filters.state === "learning") {
    conditions.push(isNotNull(vocabReviewStates.box));
    conditions.push(sql`${vocabReviewStates.box} < ${MASTERED_BOX}`);
  }

  const base = db
    .select({
      id: vocabCards.id,
      word: vocabCards.word,
      meaning: vocabCards.meaning,
      example: vocabCards.example,
      level: vocabCards.level,
      pos: vocabCards.pos,
      source: vocabCards.source,
      box: vocabReviewStates.box,
      dueDate: vocabReviewStates.dueDate,
    })
    .from(vocabCards)
    .leftJoin(
      vocabReviewStates,
      and(eq(vocabReviewStates.cardId, vocabCards.id), eq(vocabReviewStates.userId, userId))
    )
    .where(and(...conditions));

  const [rows, [totalRow]] = await Promise.all([
    base
      .orderBy(asc(vocabCards.level), asc(vocabCards.word))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db
      .select({ n: count() })
      .from(vocabCards)
      .leftJoin(
        vocabReviewStates,
        and(eq(vocabReviewStates.cardId, vocabCards.id), eq(vocabReviewStates.userId, userId))
      )
      .where(and(...conditions)),
  ]);

  return { rows, total: totalRow.n, page, pageSize };
}

// ---- mutations ----

export async function submitReview(
  cardId: string,
  result: ReviewResult
): Promise<{ box: number; dueDate: string }> {
  const userId = getCurrentUserId();

  const [existing] = await db
    .select()
    .from(vocabReviewStates)
    .where(and(eq(vocabReviewStates.userId, userId), eq(vocabReviewStates.cardId, cardId)))
    .limit(1);

  const base = existing ?? newStateFields(cardId);
  const next = applyReview(base, result);

  if (existing) {
    await db
      .update(vocabReviewStates)
      .set({
        box: next.box,
        dueDate: next.dueDate,
        lastReviewedOn: next.lastReviewedOn,
        totalReviews: next.totalReviews,
        correctStreak: next.correctStreak,
      })
      .where(eq(vocabReviewStates.id, existing.id));
  } else {
    // onConflictDoUpdate guards a double-tap on mobile from creating a second
    // state row for the same card, which would otherwise leave it due twice.
    await db
      .insert(vocabReviewStates)
      .values({
        userId,
        cardId,
        box: next.box,
        dueDate: next.dueDate,
        lastReviewedOn: next.lastReviewedOn,
        introducedOn: base.introducedOn,
        totalReviews: next.totalReviews,
        correctStreak: next.correctStreak,
      })
      .onConflictDoUpdate({
        target: [vocabReviewStates.userId, vocabReviewStates.cardId],
        set: {
          box: next.box,
          dueDate: next.dueDate,
          lastReviewedOn: next.lastReviewedOn,
          totalReviews: next.totalReviews,
          correctStreak: next.correctStreak,
        },
      });
  }

  await db.insert(vocabReviewLogs).values({
    userId,
    cardId,
    result,
    boxAfter: next.box,
    occurredOn: formatDate(today()),
  });

  revalidatePath("/english");
  revalidatePath("/english/vocab");
  // Deliberately NOT revalidating /english/review — that would refetch the
  // queue mid-session and shift cards out from under the user's thumb. The
  // session runs against the queue fetched at mount.

  return { box: next.box, dueDate: next.dueDate };
}

export async function togglePracticeItem(
  phase: EnglishPhase,
  itemKey: string,
  checked: boolean
): Promise<void> {
  const phaseConfig = roadmapPhases.find((p) => p.key === phase);
  const itemConfig = phaseConfig?.items.find((i) => i.key === itemKey);
  if (!itemConfig) return;

  const userId = getCurrentUserId();
  const todayStr = formatDate(today());

  await db
    .delete(englishPracticeLogs)
    .where(
      and(
        eq(englishPracticeLogs.userId, userId),
        eq(englishPracticeLogs.phase, phase),
        eq(englishPracticeLogs.itemKey, itemKey),
        eq(englishPracticeLogs.occurredOn, todayStr)
      )
    );

  if (checked) {
    await db.insert(englishPracticeLogs).values({ userId, phase, itemKey, occurredOn: todayStr });
  }

  revalidatePath("/english");
}

export async function addUserWord(
  formData: FormData
): Promise<{ ok: true; id: string } | { ok: false; reason: "duplicate" | "invalid" }> {
  const userId = getCurrentUserId();

  const word = ((formData.get("word") as string) || "").trim();
  const meaning = ((formData.get("meaning") as string) || "").trim();
  const example = ((formData.get("example") as string) || "").trim();
  const level = formData.get("level") as VocabLevel;
  const pos = ((formData.get("pos") as string) || "").trim() || null;

  const validLevels: VocabLevel[] = ["A1", "A2", "B1", "B2"];
  if (!word || !meaning || !example || !validLevels.includes(level)) {
    return { ok: false, reason: "invalid" };
  }

  const [dup] = await db
    .select({ id: vocabCards.id })
    .from(vocabCards)
    .where(and(visibleCards(userId), ilike(vocabCards.word, word)))
    .limit(1);
  if (dup) {
    return { ok: false, reason: "duplicate" };
  }

  const id = crypto.randomUUID();
  await db.insert(vocabCards).values({ id, userId, word, meaning, example, level, pos, source: "user" });

  revalidatePath("/english/vocab");
  revalidatePath("/english");

  return { ok: true, id };
}

export async function deleteUserWord(cardId: string): Promise<void> {
  const userId = getCurrentUserId();

  await db.delete(vocabReviewLogs).where(eq(vocabReviewLogs.cardId, cardId));
  await db.delete(vocabReviewStates).where(eq(vocabReviewStates.cardId, cardId));
  await db
    .delete(vocabCards)
    .where(and(eq(vocabCards.id, cardId), eq(vocabCards.userId, userId), eq(vocabCards.source, "user")));

  revalidatePath("/english/vocab");
  revalidatePath("/english");
}
