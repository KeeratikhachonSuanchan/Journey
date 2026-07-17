"use server";

import { db } from "@/db";
import { goals, habits, reflections } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { eq, and, or, gte, lte, lt, isNull, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatDate, weekStart, today as todayFn, dayOfWeek } from "@/lib/dates";
import { addDays, addWeeks } from "date-fns";

function parseGoalFields(formData: FormData) {
  const title = formData.get("title") as string;
  const domain = formData.get("domain") as "finance" | "dev";
  const periodStart = formData.get("periodStart") as string;
  const rawPeriodEnd = formData.get("periodEnd") as string;
  const periodEnd = rawPeriodEnd || null;
  const rawParentId = formData.get("parentId") as string;
  const parentId = rawParentId && rawParentId !== "none" ? rawParentId : null;

  return { title, domain, periodStart, periodEnd, parentId };
}

export async function createGoal(formData: FormData) {
  const userId = getCurrentUserId();
  const fields = parseGoalFields(formData);

  await db.insert(goals).values({ userId, ...fields });

  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function updateGoal(goalId: string, formData: FormData) {
  const userId = getCurrentUserId();
  const fields = parseGoalFields(formData);

  await db
    .update(goals)
    .set(fields)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)));

  revalidatePath("/goals");
  revalidatePath("/today");
  revalidatePath("/goals/review");
}

type Cadence = "daily" | "weekly" | "monthly" | "quarterly";

function parseHabitFields(formData: FormData) {
  const title = formData.get("title") as string;
  const cadence = formData.get("cadence") as Cadence;
  const rawGoalId = formData.get("goalId") as string;
  const goalId = rawGoalId && rawGoalId !== "none" ? rawGoalId : null;
  const rawDurationMinutes = formData.get("durationMinutes") as string;
  const durationMinutes = rawDurationMinutes ? parseInt(rawDurationMinutes, 10) : null;
  const rawDaysOfWeek = formData.getAll("daysOfWeek").map((v) => parseInt(v as string, 10));
  const daysOfWeek =
    rawDaysOfWeek.length === 0 || rawDaysOfWeek.length === 7 ? null : rawDaysOfWeek;

  return { title, cadence, goalId, durationMinutes, daysOfWeek };
}

export async function createHabit(formData: FormData) {
  const userId = getCurrentUserId();
  const fields = parseHabitFields(formData);

  await db.insert(habits).values({ userId, ...fields });

  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function updateHabit(habitId: string, formData: FormData) {
  const userId = getCurrentUserId();
  const fields = parseHabitFields(formData);

  await db
    .update(habits)
    .set(fields)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function toggleHabit(habitId: string, active: boolean) {
  await db.update(habits).set({ active }).where(eq(habits.id, habitId));
  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function getHabitDeletePreview(habitId: string) {
  const reflectionCount = (
    await db
      .select({ id: reflections.id })
      .from(reflections)
      .where(eq(reflections.habitId, habitId))
  ).length;

  return { reflectionCount };
}

export async function deleteHabit(habitId: string) {
  const userId = getCurrentUserId();

  await db.delete(reflections).where(eq(reflections.habitId, habitId));
  await db
    .delete(habits)
    .where(and(eq(habits.id, habitId), eq(habits.userId, userId)));

  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function createReflection(formData: FormData) {
  const userId = getCurrentUserId();
  const goalId = (formData.get("goalId") as string) || null;
  const habitId = (formData.get("habitId") as string) || null;
  const occurredOn = formData.get("occurredOn") as string;
  const outcome = formData.get("outcome") as "achieved" | "partial" | "missed";
  const reason = (formData.get("reason") as string) || null;
  const reasonTag =
    (formData.get("reasonTag") as
      | "time"
      | "scope"
      | "motivation"
      | "external"
      | "other") || null;

  await db.insert(reflections).values({
    userId,
    goalId,
    habitId,
    occurredOn,
    outcome,
    reason,
    reasonTag,
  });

  if (goalId) {
    await db
      .update(goals)
      .set({ status: outcome })
      .where(eq(goals.id, goalId));
  }

  revalidatePath("/today");
  revalidatePath("/goals");
  revalidatePath("/goals/review");
}

// Goals that can act as a parent link target. Optionally excludes one goal
// (itself, when editing) to avoid a self-referencing parent loop.
export async function getLinkableGoals(excludeGoalId?: string) {
  const userId = getCurrentUserId();

  const allGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));

  return excludeGoalId
    ? allGoals.filter((g) => g.id !== excludeGoalId)
    : allGoals;
}

export async function getTodayData() {
  const userId = getCurrentUserId();
  const todayDate = todayFn();
  const todayStr = formatDate(todayDate);

  // "Today's goals" are those whose period range covers today (an open
  // start/end means unbounded on that side).
  const dayGoals = await db
    .select()
    .from(goals)
    .where(
      and(
        eq(goals.userId, userId),
        or(isNull(goals.periodStart), lte(goals.periodStart, todayStr)),
        or(isNull(goals.periodEnd), gte(goals.periodEnd, todayStr))
      )
    );

  const todayDow = dayOfWeek(todayDate);
  const allActiveHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.active, true)));
  const activeHabits = allActiveHabits.filter(
    (h) => !h.daysOfWeek || h.daysOfWeek.length === 0 || h.daysOfWeek.includes(todayDow)
  );

  const todayReflections = await db
    .select()
    .from(reflections)
    .where(
      and(eq(reflections.userId, userId), eq(reflections.occurredOn, todayStr))
    );

  const linkedGoalIds = Array.from(
    new Set(
      [
        ...dayGoals.map((g) => g.parentId),
        ...activeHabits.map((h) => h.goalId),
      ].filter((id): id is string => !!id)
    )
  );

  const goalTitleMap: Record<string, string> = {};
  if (linkedGoalIds.length > 0) {
    const linkedGoals = await db
      .select()
      .from(goals)
      .where(inArray(goals.id, linkedGoalIds));
    for (const g of linkedGoals) {
      goalTitleMap[g.id] = g.title;
    }
  }

  return { dayGoals, activeHabits, todayReflections, todayStr, goalTitleMap };
}

export async function getGoalsList() {
  const userId = getCurrentUserId();

  const allGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));

  const allHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.userId, userId))
    .orderBy(desc(habits.createdAt));

  const goalTitleMap: Record<string, string> = {};
  for (const g of allGoals) {
    goalTitleMap[g.id] = g.title;
  }

  return { goals: allGoals, habits: allHabits, goalTitleMap };
}

export async function getGoalDetail(goalId: string) {
  const [goal] = await db
    .select()
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1);

  const goalReflections = await db
    .select()
    .from(reflections)
    .where(eq(reflections.goalId, goalId))
    .orderBy(desc(reflections.reflectedAt));

  const childGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.parentId, goalId))
    .orderBy(desc(goals.createdAt));

  const linkedHabits = await db
    .select()
    .from(habits)
    .where(eq(habits.goalId, goalId))
    .orderBy(desc(habits.createdAt));

  return {
    goal: goal ?? null,
    reflections: goalReflections,
    childGoals,
    linkedHabits,
  };
}

// Walks the parent -> child chain starting at rootId and returns
// [rootId, ...descendantIds] ordered shallow-to-deep, so reversing the
// list gives a safe deepest-first delete order.
async function collectGoalTree(rootId: string, userId: string) {
  const all = await db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId));

  const byParent = new Map<string | null, typeof all>();
  for (const g of all) {
    const key = g.parentId;
    byParent.set(key, [...(byParent.get(key) ?? []), g]);
  }

  const ordered: string[] = [];
  const queue = [rootId];
  while (queue.length) {
    const id = queue.shift()!;
    ordered.push(id);
    for (const child of byParent.get(id) ?? []) queue.push(child.id);
  }
  return ordered;
}

export async function getGoalDeletePreview(goalId: string) {
  const userId = getCurrentUserId();
  const goalIds = await collectGoalTree(goalId, userId);
  const childIds = goalIds.filter((id) => id !== goalId);

  const childTitles = childIds.length
    ? (
        await db
          .select({ title: goals.title })
          .from(goals)
          .where(inArray(goals.id, childIds))
      ).map((g) => g.title)
    : [];

  const affectedHabits = await db
    .select({ id: habits.id })
    .from(habits)
    .where(inArray(habits.goalId, goalIds));
  const habitIds = affectedHabits.map((h) => h.id);

  const goalReflectionCount = (
    await db
      .select({ id: reflections.id })
      .from(reflections)
      .where(inArray(reflections.goalId, goalIds))
  ).length;
  const habitReflectionCount = habitIds.length
    ? (
        await db
          .select({ id: reflections.id })
          .from(reflections)
          .where(inArray(reflections.habitId, habitIds))
      ).length
    : 0;

  return {
    childTitles,
    habitCount: habitIds.length,
    reflectionCount: goalReflectionCount + habitReflectionCount,
  };
}

export async function deleteGoal(goalId: string) {
  const userId = getCurrentUserId();
  const goalIds = await collectGoalTree(goalId, userId);

  const affectedHabits = await db
    .select({ id: habits.id })
    .from(habits)
    .where(inArray(habits.goalId, goalIds));
  const habitIds = affectedHabits.map((h) => h.id);

  await db.delete(reflections).where(inArray(reflections.goalId, goalIds));
  if (habitIds.length) {
    await db.delete(reflections).where(inArray(reflections.habitId, habitIds));
    await db.delete(habits).where(inArray(habits.id, habitIds));
  }
  for (const id of [...goalIds].reverse()) {
    await db.delete(goals).where(and(eq(goals.id, id), eq(goals.userId, userId)));
  }

  revalidatePath("/goals");
  revalidatePath("/today");
  revalidatePath("/goals/review");
}

export async function getWeeklyReview() {
  const userId = getCurrentUserId();
  const todayDate = todayFn();
  const weekStartDate = weekStart(todayDate);
  const weekEndDate = addDays(addWeeks(weekStartDate, 1), 0);

  const weekStartStr = formatDate(weekStartDate);
  const weekEndStr = formatDate(weekEndDate);

  // Goals whose period range overlaps this week at all.
  const weekGoals = await db
    .select()
    .from(goals)
    .where(
      and(
        eq(goals.userId, userId),
        or(isNull(goals.periodStart), lt(goals.periodStart, weekEndStr)),
        or(isNull(goals.periodEnd), gte(goals.periodEnd, weekStartStr))
      )
    );

  const weekReflections = await db
    .select()
    .from(reflections)
    .where(
      and(
        eq(reflections.userId, userId),
        gte(reflections.occurredOn, weekStartStr),
        lt(reflections.occurredOn, weekEndStr)
      )
    );

  const activeHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.active, true)));

  return {
    goals: weekGoals,
    reflections: weekReflections,
    habits: activeHabits,
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
  };
}
