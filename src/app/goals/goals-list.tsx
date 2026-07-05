"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleHabit } from "./actions";
import { DeleteGoalButton } from "./delete-goal-button";
import { DeleteHabitButton } from "./delete-habit-button";
import { EditGoalDialog } from "./edit-goal-dialog";
import { EditHabitDialog } from "./edit-habit-dialog";
import { formatPeriodRange } from "./format-period";
import type { Goal, Habit } from "@/db/schema";
import Link from "next/link";
import { useT } from "@/lib/i18n/context";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "outline",
  achieved: "default",
  partial: "secondary",
  missed: "destructive",
};

export function GoalsList({
  goals,
  habits,
  goalTitleMap,
  linkableGoals,
}: {
  goals: Goal[];
  habits: Habit[];
  goalTitleMap: Record<string, string>;
  linkableGoals: Goal[];
}) {
  const t = useT();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {t.goals.goalsCount(goals.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {goals.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.goals.noGoalsYet}</p>
          ) : (
            <div className="space-y-2">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between gap-2 py-2 border-b last:border-0 px-2 -mx-2 rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Link
                    href={`/goals/${goal.id}`}
                    className="flex items-baseline gap-2 flex-wrap min-w-0 flex-1"
                  >
                    <span className="font-medium text-sm">{goal.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatPeriodRange(goal.periodStart, goal.periodEnd)} · {t.enums.domain[goal.domain]}
                      {goal.parentId &&
                        goalTitleMap[goal.parentId] &&
                        ` · ${t.goals.forGoal(goalTitleMap[goal.parentId])}`}
                    </span>
                  </Link>
                  <Badge variant={statusVariant[goal.status]} className="shrink-0">
                    {t.enums.status[goal.status]}
                  </Badge>
                  <EditGoalDialog goal={goal} linkableGoals={linkableGoals} />
                  <DeleteGoalButton
                    goalId={goal.id}
                    goalTitle={goal.title}
                    size="icon-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {t.goals.habitsCount(habits.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {habits.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.goals.noHabitsYet}</p>
          ) : (
            <div className="space-y-2">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center justify-between gap-2 py-2 border-b last:border-0"
                >
                  <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                    <span className="font-medium text-sm">{habit.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {t.enums.cadence[habit.cadence]}
                      {habit.goalId &&
                        goalTitleMap[habit.goalId] &&
                        ` · ${t.goals.forGoal(goalTitleMap[habit.goalId])}`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <form
                      action={toggleHabit.bind(null, habit.id, !habit.active)}
                    >
                      <Button
                        type="submit"
                        variant={habit.active ? "default" : "secondary"}
                        size="sm"
                      >
                        {habit.active ? t.goals.active : t.goals.paused}
                      </Button>
                    </form>
                    <EditHabitDialog habit={habit} linkableGoals={linkableGoals} />
                    <DeleteHabitButton habitId={habit.id} habitTitle={habit.title} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
