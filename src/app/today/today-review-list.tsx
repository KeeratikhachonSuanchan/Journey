"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InlineReflectionForm } from "@/components/inline-reflection-form";
import type { Goal, Habit, Reflection } from "@/db/schema";
import { useT } from "@/lib/i18n/context";

export function TodayReviewList({
  dayGoals,
  activeHabits,
  existingReflections,
  todayStr,
  goalTitleMap,
}: {
  dayGoals: Goal[];
  activeHabits: Habit[];
  existingReflections: Reflection[];
  todayStr: string;
  goalTitleMap: Record<string, string>;
}) {
  const t = useT();
  const goalReflectionMap = new Map<string, Reflection>();
  const habitReflectionMap = new Map<string, Reflection>();

  for (const r of existingReflections) {
    if (r.goalId) goalReflectionMap.set(r.goalId, r);
    if (r.habitId) habitReflectionMap.set(r.habitId, r);
  }

  const hasItems = dayGoals.length > 0 || activeHabits.length > 0;

  const pendingGoals = dayGoals.filter((g) => !goalReflectionMap.has(g.id));
  const completedGoals = dayGoals.filter((g) => goalReflectionMap.has(g.id));
  const pendingHabits = activeHabits.filter((h) => !habitReflectionMap.has(h.id));
  const completedHabits = activeHabits.filter((h) => habitReflectionMap.has(h.id));

  if (!hasItems) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          {t.today.noItemsToday}
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="todo">
      <TabsList>
        <TabsTrigger value="todo">
          {t.today.toDoTab(pendingGoals.length + pendingHabits.length)}
        </TabsTrigger>
        <TabsTrigger value="completed">
          {t.today.completedTab(completedGoals.length + completedHabits.length)}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="todo">
        <div className="space-y-4 mt-4">
          {pendingGoals.length === 0 && pendingHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t.today.noPendingItems}
              </CardContent>
            </Card>
          ) : (
            <>
              {pendingGoals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.today.todaysGoals}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingGoals.map((goal) => (
                      <div key={goal.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{goal.title}</span>
                        </div>
                        {goal.parentId && goalTitleMap[goal.parentId] && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {t.goals.forGoal(goalTitleMap[goal.parentId])}
                          </p>
                        )}
                        <InlineReflectionForm goalId={goal.id} occurredOn={todayStr} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {pendingHabits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.today.habits}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingHabits.map((habit) => (
                      <div key={habit.id} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="font-medium">{habit.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {t.enums.cadence[habit.cadence]}
                            {habit.goalId &&
                              goalTitleMap[habit.goalId] &&
                              ` · ${t.goals.forGoal(goalTitleMap[habit.goalId])}`}
                          </span>
                        </div>
                        <InlineReflectionForm habitId={habit.id} occurredOn={todayStr} />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </TabsContent>

      <TabsContent value="completed">
        <div className="space-y-4 mt-4">
          {completedGoals.length === 0 && completedHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t.today.noCompletedItems}
              </CardContent>
            </Card>
          ) : (
            <>
              {completedGoals.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.today.todaysGoals}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedGoals.map((goal) => {
                      const existing = goalReflectionMap.get(goal.id)!;
                      return (
                        <div key={goal.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{goal.title}</span>
                            <Badge
                              variant={
                                existing.outcome === "achieved"
                                  ? "default"
                                  : existing.outcome === "partial"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {t.enums.outcome[existing.outcome]}
                            </Badge>
                          </div>
                          {goal.parentId && goalTitleMap[goal.parentId] && (
                            <p className="text-xs text-muted-foreground mb-2">
                              {t.goals.forGoal(goalTitleMap[goal.parentId])}
                            </p>
                          )}
                          <p className="text-sm text-muted-foreground">
                            {existing.reason && `"${existing.reason}"`}
                            {existing.reasonTag &&
                              ` (${t.enums.reasonTag[existing.reasonTag]})`}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {completedHabits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>{t.today.habits}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {completedHabits.map((habit) => {
                      const existing = habitReflectionMap.get(habit.id)!;
                      return (
                        <div key={habit.id} className="border-b pb-4 last:border-0 last:pb-0">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className="font-medium">{habit.title}</span>
                            <Badge
                              variant={
                                existing.outcome === "achieved"
                                  ? "default"
                                  : existing.outcome === "partial"
                                    ? "secondary"
                                    : "destructive"
                              }
                            >
                              {t.enums.outcome[existing.outcome]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {t.enums.cadence[habit.cadence]}
                              {habit.goalId &&
                                goalTitleMap[habit.goalId] &&
                                ` · ${t.goals.forGoal(goalTitleMap[habit.goalId])}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {existing.reason && `"${existing.reason}"`}
                            {existing.reasonTag &&
                              ` (${t.enums.reasonTag[existing.reasonTag]})`}
                          </p>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
