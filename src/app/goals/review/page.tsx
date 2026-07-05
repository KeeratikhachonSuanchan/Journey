export const dynamic = "force-dynamic";

import { getWeeklyReview } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function GoalsReviewPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const data = await getWeeklyReview();

  const goalReflections = data.reflections.filter((r) => r.goalId);
  const habitReflections = data.reflections.filter((r) => r.habitId);

  const goalAchieved = goalReflections.filter(
    (r) => r.outcome === "achieved"
  ).length;
  const habitAchieved = habitReflections.filter(
    (r) => r.outcome === "achieved"
  ).length;

  const totalGoals = data.goals.length;

  const goalPct =
    totalGoals > 0 ? Math.round((goalAchieved / totalGoals) * 100) : 0;
  const habitPct =
    habitReflections.length > 0
      ? Math.round((habitAchieved / habitReflections.length) * 100)
      : 0;

  const missReasons = data.reflections
    .filter((r) => r.outcome === "missed" && r.reason)
    .map((r) => ({
      reason: r.reason!,
      reasonTag: r.reasonTag,
      occurredOn: r.occurredOn,
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{dict.goalsReview.title}</h1>
        <Link href="/goals">
          <Button variant="outline">{dict.goals.backToGoals}</Button>
        </Link>
      </div>

      <p className="text-sm text-muted-foreground">
        {dict.goalsReview.weekOf(data.weekStart, data.weekEnd)}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              {dict.goalsReview.goalsAchievement}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono tabular-nums">{goalPct}%</div>
            <p className="text-xs text-muted-foreground">
              {dict.goalsReview.goalsAchieved(goalAchieved, totalGoals)}
            </p>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${goalPct}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>
              {dict.goalsReview.habitsAchievement}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold font-mono tabular-nums">{habitPct}%</div>
            <p className="text-xs text-muted-foreground">
              {dict.goalsReview.checkInsAchieved(
                habitAchieved,
                habitReflections.length
              )}
            </p>
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${habitPct}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {dict.goalsReview.reasonsForMisses(missReasons.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missReasons.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.goalsReview.noMissedReasons}
            </p>
          ) : (
            <div className="space-y-2">
              {missReasons.map((mr, i) => (
                <div key={i} className="flex items-start gap-2 py-1">
                  <span className="text-xs text-muted-foreground min-w-[80px]">
                    {mr.occurredOn}
                  </span>
                  <span className="text-sm">&ldquo;{mr.reason}&rdquo;</span>
                  {mr.reasonTag && (
                    <span className="text-xs text-muted-foreground">
                      {dict.enums.reasonTag[mr.reasonTag]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
