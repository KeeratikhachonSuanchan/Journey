import { Client } from "@upstash/qstash";

function getClient(): Client {
  const token = process.env.QSTASH_TOKEN;
  if (!token) throw new Error("QSTASH_TOKEN is not set");
  return new Client({ token });
}

// time is "HH:mm" in Bangkok local time. Passing an existing scheduleId
// updates that schedule in place instead of creating a new one.
export async function upsertReminderSchedule(
  time: string,
  existingScheduleId: string | null
): Promise<string> {
  const [hour, minute] = time.split(":").map(Number);
  const appUrl = process.env.APP_URL ?? "https://journey-beta-three.vercel.app";
  const client = getClient();

  const { scheduleId } = await client.schedules.create({
    destination: `${appUrl}/api/cron/habit-reminder`,
    cron: `CRON_TZ=Asia/Bangkok ${minute} ${hour} * * *`,
    ...(existingScheduleId ? { scheduleId: existingScheduleId } : {}),
  });

  return scheduleId;
}
