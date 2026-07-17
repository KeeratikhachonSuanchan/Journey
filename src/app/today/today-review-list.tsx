"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { InlineReflectionForm } from "@/components/inline-reflection-form";
import type { Habit, Reflection } from "@/db/schema";
import { useT } from "@/lib/i18n/context";
import { summarizeDaysOfWeek } from "@/app/goals/format-days";

export function TodayReviewList({
  activeHabits,
  existingReflections,
  todayStr,
  goalTitleMap,
}: {
  activeHabits: Habit[];
  existingReflections: Reflection[];
  todayStr: string;
  goalTitleMap: Record<string, string>;
}) {
  const t = useT();
  const habitReflectionMap = new Map<string, Reflection>();

  for (const r of existingReflections) {
    if (r.habitId) habitReflectionMap.set(r.habitId, r);
  }

  const hasItems = activeHabits.length > 0;

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
          {t.today.toDoTab(pendingHabits.length)}
        </TabsTrigger>
        <TabsTrigger value="completed">
          {t.today.completedTab(completedHabits.length)}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="todo">
        <div className="space-y-4 mt-4">
          {pendingHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t.today.noPendingItems}
              </CardContent>
            </Card>
          ) : (
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
                        {habit.durationMinutes != null &&
                          ` · ${t.goals.durationMinutes(habit.durationMinutes)}`}
                        {summarizeDaysOfWeek(habit.daysOfWeek, t) &&
                          ` · ${summarizeDaysOfWeek(habit.daysOfWeek, t)}`}
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
        </div>
      </TabsContent>

      <TabsContent value="completed">
        <div className="space-y-4 mt-4">
          {completedHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {t.today.noCompletedItems}
              </CardContent>
            </Card>
          ) : (
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
                          {habit.durationMinutes != null &&
                            ` · ${t.goals.durationMinutes(habit.durationMinutes)}`}
                          {summarizeDaysOfWeek(habit.daysOfWeek, t) &&
                            ` · ${summarizeDaysOfWeek(habit.daysOfWeek, t)}`}
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
        </div>
      </TabsContent>
    </Tabs>
  );
}
