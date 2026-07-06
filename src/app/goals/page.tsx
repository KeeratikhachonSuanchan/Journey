export const dynamic = "force-dynamic";

import { getGoalsList, getLinkableGoals } from "./actions";
import { GoalsList } from "./goals-list";
import { CreateGoalForm } from "./create-goal-form";
import { CreateHabitForm } from "./create-habit-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";
import { formatDate, today } from "@/lib/dates";

export default async function GoalsPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [data, linkableGoals] = await Promise.all([
    getGoalsList(),
    getLinkableGoals(),
  ]);
  const todayStr = formatDate(today());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{dict.goals.title}</h1>
        <Link href="/goals/review">
          <Button variant="outline">{dict.goalsReview.title}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CreateGoalForm linkableGoals={linkableGoals} />
        <CreateHabitForm linkableGoals={linkableGoals} />
      </div>

      <GoalsList
        goals={data.goals}
        habits={data.habits}
        goalTitleMap={data.goalTitleMap}
        linkableGoals={linkableGoals}
        todayStr={todayStr}
      />
    </div>
  );
}
