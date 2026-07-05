"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/money";
import type { BucketSummary } from "@/lib/finance";
import { useT, useLocale } from "@/lib/i18n/context";

const bucketColorVar: Record<string, string> = {
  needs: "var(--chart-5)",
  wants: "var(--chart-4)",
  savings: "var(--chart-2)",
};

export function BucketSummaryCard({ summary }: { summary: BucketSummary }) {
  const t = useT();
  const locale = useLocale();
  const pct = summary.target > 0 ? (summary.spent / summary.target) * 100 : 0;
  const color = bucketColorVar[summary.bucket];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>
            {t.enums.bucket[summary.bucket]} ({summary.ratio}%)
          </CardTitle>
          {summary.overBudget && (
            <Badge variant="destructive">{t.finance.over}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold font-mono tabular-nums">
          {formatMoney(summary.spent, locale)}
        </div>
        <p className="text-xs text-muted-foreground">
          {t.finance.of} {formatMoney(summary.target, locale)} {t.finance.target}
        </p>
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${Math.min(pct, 100)}%`,
              backgroundColor: summary.overBudget
                ? "var(--destructive)"
                : color,
            }}
          />
        </div>
        <p className="text-xs mt-1.5 text-muted-foreground">
          {formatMoney(Math.abs(summary.remaining), locale)}{" "}
          {summary.remaining >= 0 ? t.finance.remaining : t.finance.over}
        </p>
      </CardContent>
    </Card>
  );
}
