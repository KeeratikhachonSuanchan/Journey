export const dynamic = "force-dynamic";

import { getGoalDetail } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  open: "outline",
  achieved: "default",
  partial: "secondary",
  missed: "destructive",
};

export default async function GoalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { id } = await params;
  const data = await getGoalDetail(id);

  if (!data.goal) {
    notFound();
  }

  const goal = data.goal;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">{goal.title}</h1>
          <Badge variant={statusVariant[goal.status]}>
            {dict.enums.status[goal.status]}
          </Badge>
        </div>
        <Link href="/goals">
          <Button variant="outline">{dict.goals.backToGoals}</Button>
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        {dict.enums.domain[goal.domain]} · {dict.enums.periodType[goal.periodType]}
        {goal.periodStart && ` · ${dict.goals.starting} ${goal.periodStart}`}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>
            {dict.goals.reflectionHistory(data.reflections.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.reflections.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.goals.noReflectionsYet}
            </p>
          ) : (
            <div className="space-y-3">
              {data.reflections.map((r) => (
                <div key={r.id} className="border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={
                        r.outcome === "achieved"
                          ? "default"
                          : r.outcome === "partial"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {dict.enums.outcome[r.outcome]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {r.occurredOn}
                      {r.reasonTag && ` · ${dict.enums.reasonTag[r.reasonTag]}`}
                    </span>
                  </div>
                  {r.reason && (
                    <p className="text-sm text-muted-foreground">
                      &ldquo;{r.reason}&rdquo;
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {dict.goals.linkedHabits(data.linkedHabits.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.linkedHabits.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.goals.noLinkedHabits}
            </p>
          ) : (
            <div className="space-y-2">
              {data.linkedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-baseline gap-2 py-1"
                >
                  <span className="text-sm font-medium">{habit.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {dict.enums.cadence[habit.cadence]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {dict.goals.childGoals(data.childGoals.length)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.childGoals.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.goals.noChildGoals}
            </p>
          ) : (
            <div className="space-y-2">
              {data.childGoals.map((child) => (
                <Link
                  key={child.id}
                  href={`/goals/${child.id}`}
                  className="flex items-center justify-between py-1 hover:bg-muted/50 px-2 rounded-md -mx-2 transition-colors"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">{child.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {dict.enums.periodType[child.periodType]}
                    </span>
                  </div>
                  <Badge variant={statusVariant[child.status]} className="shrink-0">
                    {dict.enums.status[child.status]}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
