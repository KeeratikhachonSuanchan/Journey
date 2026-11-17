export const dynamic = "force-dynamic";

import { getTodayData } from "../goals/actions";
import { TodayReviewList } from "./today-review-list";
import { DateNav } from "./date-nav";
import { todayStr } from "@/lib/dates";
import { TestLineReminderButton } from "./test-line-reminder-button";
import { ReminderTimeForm } from "./reminder-time-form";
import { getReminderTime } from "./actions";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { date } = await searchParams;
  const dateParam = Array.isArray(date) ? date[0] : date;
  const [data, reminderTime] = await Promise.all([
    getTodayData(dateParam),
    getReminderTime(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{dict.today.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <ReminderTimeForm initialTime={reminderTime} />
          <TestLineReminderButton />
        </div>
      </div>
      <DateNav dateStr={data.todayStr} realTodayStr={todayStr()} />
      <TodayReviewList
        key={data.todayStr}
        activeHabits={data.activeHabits}
        existingReflections={data.todayReflections}
        todayStr={data.todayStr}
        goalTitleMap={data.goalTitleMap}
      />
    </div>
  );
}
