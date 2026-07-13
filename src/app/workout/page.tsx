import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeekSchedule } from "./week-schedule";
import { RunningPlan } from "./running-plan";
import { heroStats, aclNote, nutrition, tips } from "./data";

export const metadata: Metadata = {
  title: "Workout Plan | Journey",
};

export default function WorkoutPage() {
  return (
    <Tabs defaultValue="gym">
      <TabsList>
        <TabsTrigger value="gym">🏋️ ยิม</TabsTrigger>
        <TabsTrigger value="running">🏃 วิ่งฮาล์ฟมาราธอน</TabsTrigger>
      </TabsList>

      <TabsContent value="gym" className="mt-6">
        <div className="space-y-8">
          <div>
            <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
              Personal Training Plan · v5 · Dual Mode
            </p>
            <h1 className="mb-4 text-2xl font-semibold tracking-tight">
              Dual Mode Plan
            </h1>
            <div className="flex flex-wrap gap-6">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div
                    className={`text-2xl font-semibold ${stat.className ?? ""}`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs tracking-wide text-muted-foreground uppercase">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-md border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning">
              {aclNote}
            </div>
          </div>

          <section>
            <h2 className="mb-3 text-lg font-semibold">
              ตารางสัปดาห์ — กดดูรายละเอียด
            </h2>
            <WeekSchedule />
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">โภชนาการ</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {nutrition.map((n) => (
                <Card key={n.label}>
                  <CardContent className="py-6 text-center">
                    <div className="text-2xl font-semibold text-primary">
                      {n.value}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {n.unit}
                    </div>
                    <div className="mt-2 text-xs">{n.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">หลักการสำคัญ</h2>
            <Card>
              <CardContent>
                <ul className="divide-y divide-border">
                  {tips.map((tip) => (
                    <li key={tip.lead} className="py-3 text-sm leading-relaxed">
                      <span className="mr-1">{tip.emoji}</span>
                      <strong className="font-semibold">{tip.lead}</strong>
                      {" — "}
                      {tip.rest}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </TabsContent>

      <TabsContent value="running" className="mt-6">
        <RunningPlan />
      </TabsContent>
    </Tabs>
  );
}
