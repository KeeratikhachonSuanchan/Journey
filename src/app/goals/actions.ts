"use server";

import { db } from "@/db";
import { goals, habits, reflections } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { eq, and, gte, lt, desc, inArray, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { formatDate, weekStart, today as todayFn } from "@/lib/dates";
import { addDays, addWeeks } from "date-fns";

export async function createGoal(formData: FormData) {
  const userId = getCurrentUserId();
  const title = formData.get("title") as string;
  const domain = formData.get("domain") as "finance" | "dev";
  const periodType = formData.get("periodType") as
    | "day"
    | "week"
    | "month"
    | "year"
    | "aspiration";
  const periodStart =
    periodType === "aspiration"
      ? null
      : (formData.get("periodStart") as string);
  const rawParentId = formData.get("parentId") as string;
  const parentId = rawParentId && rawParentId !== "none" ? rawParentId : null;

  await db.insert(goals).values({
    userId,
    title,
    domain,
    periodType,
    periodStart,
    parentId,
  });

  revalidatePath("/goals");
  revalidatePath("/today");
}

export async function createHabit(formData: FormData) {
  const userId = getCurrentUserId();
  const title = formData.get("title") as string;
  const cadence = formData.get("cadence") as "daily" | "weekly";
  const rawGoalId = formData.get("goalId") as string;
  const goalId = rawGoalId && rawGoalId !== "none" ? rawGoalId : null;

  await db.insert(habits).values({ userId, title, cadence, goalId });

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

// Goals that can act as a parent link target — day-goals are excluded since
// they should be the "child" in a linkage, not the "parent".
export async function getLinkableGoals() {
  const userId = getCurrentUserId();

  return db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), ne(goals.periodType, "day")))
    .orderBy(desc(goals.createdAt));
}

export async function getTodayData() {
  const userId = getCurrentUserId();
  const todayDate = todayFn();
  const todayStr = formatDate(todayDate);

  const dayGoals = await db
    .select()
    .from(goals)
    .where(
      and(
        eq(goals.userId, userId),
        eq(goals.periodType, "day"),
        eq(goals.periodStart, todayStr)
      )
    );

  const activeHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.active, true)));

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

  const weekGoals = await db
    .select()
    .from(goals)
    .where(
      and(
        eq(goals.userId, userId),
        gte(goals.periodStart, weekStartStr),
        lt(goals.periodStart, weekEndStr)
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
