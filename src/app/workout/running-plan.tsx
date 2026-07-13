import { Card, CardContent } from "@/components/ui/card";
import {
  runHeroStats,
  runHeroSub,
  runLegend,
  runPhases,
  runRules,
} from "./running-data";
import { RunningPlanTable } from "./running-plan-table";
import { RunTagBadge } from "./run-tag-badge";

export function RunningPlan() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-xs tracking-widest text-muted-foreground uppercase">
          Race Prep · Nov 2026
        </p>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">
          จาก 10K pace 7&apos; สู่ Half Marathon
        </h1>
        <p className="max-w-xl text-sm text-muted-foreground">{runHeroSub}</p>
        <div className="mt-4 flex flex-wrap gap-6">
          {runHeroStats.map((stat) => (
            <div key={stat.label}>
              <div className={`text-2xl font-semibold ${stat.className ?? ""}`}>
                {stat.value}
              </div>
              <div className="text-xs tracking-wide text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {runPhases.map((phase) => (
        <section key={phase.num}>
          <div className="mb-1 flex items-baseline gap-3">
            <span className="rounded bg-primary px-2 py-0.5 text-xs font-bold tracking-wide text-primary-foreground uppercase">
              {phase.num}
            </span>
            <h2 className="text-lg font-semibold">{phase.title}</h2>
          </div>
          <p className="mb-4 max-w-xl border-l-2 border-primary py-0.5 pl-3 text-sm leading-relaxed text-muted-foreground">
            {phase.note}
          </p>
          <Card>
            <CardContent>
              <RunningPlanTable weeks={phase.weeks} />
            </CardContent>
          </Card>
        </section>
      ))}

      <section className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardContent>
            <h2 className="mb-3 text-lg font-semibold">กฎเหล็ก 4 ข้อ</h2>
            <ul className="divide-y divide-border">
              {runRules.map((rule) => (
                <li key={rule.lead} className="py-3 text-sm leading-relaxed">
                  <strong className="font-semibold text-primary">
                    {rule.lead}
                  </strong>
                  {" — "}
                  {rule.rest}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <h2 className="mb-3 text-lg font-semibold">สัญลักษณ์ในตาราง</h2>
            <ul className="space-y-3">
              {runLegend.map((item) => (
                <li key={item.variant} className="flex items-center gap-2 text-sm">
                  <RunTagBadge variant={item.variant} label={item.label} />
                  <span className="text-muted-foreground">{item.desc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
