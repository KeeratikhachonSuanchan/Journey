export const dynamic = "force-dynamic";

import Link from "next/link";
import { getEnglishOverview } from "./actions";
import { SectionNav } from "./section-nav";
import { ActivityChart } from "./activity-chart";
import { RoadmapSection } from "./roadmap-section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function EnglishPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.english;
  const { progress, streak, phaseStreaks, checkedToday, activity } = await getEnglishOverview();

  const statPct = (n: number) => (progress.total > 0 ? Math.round((n / progress.total) * 100) : 0);
  const stats = [
    { label: t.mastered, value: progress.mastered },
    { label: t.learning, value: progress.learning },
    { label: t.notStarted, value: progress.notStarted },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <SectionNav active="overview" t={t} />
      </div>

      {/* Hero: the one number that matters right now */}
      <Card className="border-primary/25 bg-primary/5">
        <CardContent className="flex items-center justify-between gap-4 py-5">
          {progress.due === 0 ? (
            <div>
              <p className="text-lg font-semibold">{t.allCaughtUp}</p>
              <p className="text-sm text-muted-foreground">{t.allCaughtUpSub}</p>
            </div>
          ) : (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-semibold font-mono tabular-nums text-primary">
                {progress.due}
              </span>
              <span className="text-sm text-muted-foreground">{t.heroDueSub}</span>
            </div>
          )}
          <Link href="/english/review">
            <Button size="sm">{t.startReview}</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Progress */}
      <section>
        <h2 className="text-lg font-semibold mb-3">{t.progress}</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card>
            <CardContent className="py-4">
              <div className="text-xs text-muted-foreground">{t.totalWords}</div>
              <div className="text-2xl font-semibold font-mono tabular-nums">{progress.total}</div>
            </CardContent>
          </Card>
          {stats.map((s) => (
            <Card key={s.label}>
              <CardContent className="py-4">
                <div className="text-xs text-muted-foreground">{s.label}</div>
                <div className="text-2xl font-semibold font-mono tabular-nums">{s.value}</div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${statPct(s.value)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {streak > 0 && (
          <p className="mt-2 text-xs font-mono tabular-nums text-primary">{t.streakDays(streak)}</p>
        )}
      </section>

      <ActivityChart activity={activity} />

      <RoadmapSection checkedToday={checkedToday} phaseStreaks={phaseStreaks} />
    </div>
  );
}
