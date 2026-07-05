export const dynamic = "force-dynamic";

import { getFinanceData } from "../finance/actions";
import { getWeeklyReview, getTodayData } from "../goals/actions";
import { monthStart, today } from "@/lib/dates";
import { computeBucketSummary } from "@/lib/finance";
import { BucketSummaryCard } from "../finance/bucket-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function DashboardPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const month = monthStart(today());
  const [financeData, weekData, todayData] = await Promise.all([
    getFinanceData(month),
    getWeeklyReview(),
    getTodayData(),
  ]);

  const todayReflectedGoalIds = new Set(
    todayData.todayReflections.filter((r) => r.goalId).map((r) => r.goalId)
  );
  const todayReflectedHabitIds = new Set(
    todayData.todayReflections.filter((r) => r.habitId).map((r) => r.habitId)
  );
  const totalTodayItems = todayData.dayGoals.length + todayData.activeHabits.length;
  const pendingTodayCount =
    todayData.dayGoals.filter((g) => !todayReflectedGoalIds.has(g.id)).length +
    todayData.activeHabits.filter((h) => !todayReflectedHabitIds.has(h.id)).length;

  const buckets = computeBucketSummary(
    financeData.transactions,
    financeData.categories,
    financeData.budget
  );

  const goalReflections = weekData.reflections.filter((r) => r.goalId);
  const habitReflections = weekData.reflections.filter((r) => r.habitId);
  const goalAchieved = goalReflections.filter(
    (r) => r.outcome === "achieved"
  ).length;
  const habitAchieved = habitReflections.filter(
    (r) => r.outcome === "achieved"
  ).length;

  const goalPct =
    weekData.goals.length > 0
      ? Math.round((goalAchieved / weekData.goals.length) * 100)
      : 0;
  const habitPct =
    habitReflections.length > 0
      ? Math.round((habitAchieved / habitReflections.length) * 100)
      : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold tracking-tight">{dict.dashboard.title}</h1>

      {/* Hero: the one number that matters right now */}
      <Card className="border-primary/25 bg-primary/5">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          <div className="flex items-baseline gap-3">
            {totalTodayItems === 0 ? (
              <div>
                <p className="text-lg font-semibold">{dict.dashboard.heroNoItems}</p>
                <p className="text-sm text-muted-foreground">
                  {dict.dashboard.heroNoItemsSub}
                </p>
              </div>
            ) : pendingTodayCount === 0 ? (
              <div>
                <p className="text-lg font-semibold">{dict.dashboard.heroAllDone}</p>
                <p className="text-sm text-muted-foreground">
                  {dict.dashboard.heroAllDoneSub}
                </p>
              </div>
            ) : (
              <>
                <span className="text-4xl font-semibold font-mono tabular-nums text-primary">
                  {dict.dashboard.heroPending(pendingTodayCount)}
                </span>
                <span className="text-sm text-muted-foreground">
                  {dict.dashboard.heroPendingSub}
                </span>
              </>
            )}
          </div>
          <Link href="/today">
            <Button size="sm">{dict.dashboard.heroGoToToday}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Finance summary */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {dict.dashboard.thisMonthsBudget}
          </h2>
          <Link href="/finance">
            <Button variant="outline" size="sm">
              {dict.dashboard.viewFinance}
            </Button>
          </Link>
        </div>
        {financeData.budget ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buckets.map((b) => (
              <BucketSummaryCard key={b.bucket} summary={b} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              {dict.dashboard.noBudgetSet}{" "}
              <Link href="/finance" className="underline">
                {dict.dashboard.setUpBudget}
              </Link>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Goals & Habits summary */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {dict.dashboard.thisWeeksProgress}
          </h2>
          <div className="flex gap-2">
            <Link href="/today">
              <Button variant="outline" size="sm">
                {dict.nav.today}
              </Button>
            </Link>
            <Link href="/goals/review">
              <Button variant="outline" size="sm">
                {dict.dashboard.weeklyReview}
              </Button>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {dict.dashboard.goalsCard}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weekData.goals.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {dict.dashboard.noGoalsThisWeek}{" "}
                  <Link href="/goals" className="underline">
                    {dict.dashboard.createOne}
                  </Link>
                </p>
              ) : (
                <>
                  <div className="text-3xl font-semibold font-mono tabular-nums">{goalPct}%</div>
                  <p className="text-xs text-muted-foreground">
                    {dict.dashboard.goalsAchieved(
                      goalAchieved,
                      weekData.goals.length
                    )}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${goalPct}%` }}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>
                {dict.dashboard.habitsCard}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {weekData.habits.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {dict.dashboard.noActiveHabits}{" "}
                  <Link href="/goals" className="underline">
                    {dict.dashboard.createOne}
                  </Link>
                </p>
              ) : (
                <>
                  <div className="text-3xl font-semibold font-mono tabular-nums">{habitPct}%</div>
                  <p className="text-xs text-muted-foreground">
                    {dict.dashboard.checkInsAchieved(
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
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Active goals quick list */}
      {weekData.goals.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            {dict.dashboard.activeGoals}
          </h2>
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                {weekData.goals.slice(0, 8).map((goal) => (
                  <Link
                    key={goal.id}
                    href={`/goals/${goal.id}`}
                    className="flex items-center justify-between py-1 hover:bg-muted/50 px-2 rounded -mx-2"
                  >
                    <span className="text-sm">{goal.title}</span>
                    <Badge
                      variant={
                        goal.status === "achieved"
                          ? "default"
                          : goal.status === "open"
                            ? "outline"
                            : goal.status === "partial"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {dict.enums.status[goal.status]}
                    </Badge>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}
