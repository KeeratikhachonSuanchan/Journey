export const dynamic = "force-dynamic";

import { getTodayData } from "../goals/actions";
import { TodayReviewList } from "./today-review-list";
import { TestLineReminderButton } from "./test-line-reminder-button";
import { ReminderTimeForm } from "./reminder-time-form";
import { getReminderTime } from "./actions";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function TodayPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [data, reminderTime] = await Promise.all([getTodayData(), getReminderTime()]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{dict.today.title}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <ReminderTimeForm initialTime={reminderTime} />
          <TestLineReminderButton />
        </div>
      </div>
      <TodayReviewList
        activeHabits={data.activeHabits}
        existingReflections={data.todayReflections}
        todayStr={data.todayStr}
        goalTitleMap={data.goalTitleMap}
      />
    </div>
  );
}
