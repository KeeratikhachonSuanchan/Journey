export const dynamic = "force-dynamic";

import { getTodayData } from "../goals/actions";
import { TodayReviewList } from "./today-review-list";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function TodayPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const data = await getTodayData();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold tracking-tight">{dict.today.title}</h1>
      <TodayReviewList
        activeHabits={data.activeHabits}
        existingReflections={data.todayReflections}
        todayStr={data.todayStr}
        goalTitleMap={data.goalTitleMap}
      />
    </div>
  );
}
