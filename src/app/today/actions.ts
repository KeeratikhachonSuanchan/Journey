"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { getCurrentUserId } from "@/lib/currentUser";
import { sendHabitReminder } from "@/lib/habit-reminder";
import { upsertReminderSchedule } from "@/lib/qstash";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function testSendHabitReminder() {
  return sendHabitReminder();
}

export async function getReminderTime(): Promise<string | null> {
  const userId = getCurrentUserId();
  const [user] = await db
    .select({ reminderTime: users.reminderTime })
    .from(users)
    .where(eq(users.id, userId));

  return user?.reminderTime ?? null;
}

export async function updateReminderTime(formData: FormData) {
  const userId = getCurrentUserId();
  const time = formData.get("reminderTime") as string;

  const [user] = await db
    .select({ qstashScheduleId: users.qstashScheduleId })
    .from(users)
    .where(eq(users.id, userId));

  const scheduleId = await upsertReminderSchedule(time, user?.qstashScheduleId ?? null);

  await db
    .update(users)
    .set({ reminderTime: time, qstashScheduleId: scheduleId })
    .where(eq(users.id, userId));

  revalidatePath("/today");
}
