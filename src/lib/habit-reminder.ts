import { db } from "@/db";
import { goals, habits, reflections } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { formatDate, today } from "@/lib/dates";
import { broadcastLineMessages, buildHabitReminderFlex } from "@/lib/line";
import { and, eq, inArray } from "drizzle-orm";

export async function sendHabitReminder(): Promise<{
  sent: boolean;
  pending: number;
}> {
  const userId = getCurrentUserId();
  const todayStr = formatDate(today());

  const activeHabits = await db
    .select()
    .from(habits)
    .where(and(eq(habits.userId, userId), eq(habits.active, true)));

  const todayReflections = await db
    .select()
    .from(reflections)
    .where(and(eq(reflections.userId, userId), eq(reflections.occurredOn, todayStr)));

  const reflectedHabitIds = new Set(
    todayReflections.map((r) => r.habitId).filter((id): id is string => !!id)
  );
  const pendingHabits = activeHabits.filter((h) => !reflectedHabitIds.has(h.id));

  if (pendingHabits.length === 0) {
    return { sent: false, pending: 0 };
  }

  const goalIds = Array.from(
    new Set(pendingHabits.map((h) => h.goalId).filter((id): id is string => !!id))
  );
  const goalTitleMap: Record<string, string> = {};
  if (goalIds.length > 0) {
    const linkedGoals = await db.select().from(goals).where(inArray(goals.id, goalIds));
    for (const g of linkedGoals) goalTitleMap[g.id] = g.title;
  }

  const appUrl = process.env.APP_URL ?? "https://journey-beta-three.vercel.app";
  const flexMessage = buildHabitReminderFlex(
    pendingHabits.map((h) => ({
      title: h.title,
      goalTitle: h.goalId ? goalTitleMap[h.goalId] : undefined,
    })),
    `${appUrl}/today`
  );

  await broadcastLineMessages([flexMessage]);

  return { sent: true, pending: pendingHabits.length };
}
