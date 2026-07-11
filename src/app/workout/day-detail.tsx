import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { DualModeDay, SingleModeDay } from "./data";
import { dayColorClasses } from "./colors";
import { ExerciseTable } from "./exercise-table";
import { SessionTable } from "./session-table";

export function DayDetail({ day }: { day: DualModeDay | SingleModeDay }) {
  const colors = dayColorClasses[day.color];

  return (
    <Card className={cn("border", colors.border)}>
      <CardHeader className="flex-row items-center gap-3 border-b pb-4">
        <span className={cn("size-2.5 shrink-0 rounded-full", colors.dot)} />
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold tracking-tight text-foreground">
              {day.title}
            </span>
            {day.kind === "dual" && day.aclAware && (
              <Badge variant="outline" className="border-warning/40 text-warning">
                ACL Aware
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{day.subtitle}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {day.kind === "dual" ? (
          <Tabs defaultValue="gym">
            <TabsList>
              <TabsTrigger value="gym">🏢 ฟิตเนสคอนโด</TabsTrigger>
              <TabsTrigger value="home">🏠 ที่ห้อง</TabsTrigger>
            </TabsList>
            <TabsContent value="gym" className="mt-4">
              <ExerciseTable exercises={day.gym} />
            </TabsContent>
            <TabsContent value="home" className="mt-4">
              <ExerciseTable exercises={day.home} />
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-4">
            <SessionTable columns={day.columns} rows={day.rows} />
            {day.tip && (
              <div className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
                {day.tip}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
