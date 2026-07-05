export const dynamic = "force-dynamic";

import { getFinanceData } from "../actions";
import { monthStart, today } from "@/lib/dates";
import { computeBucketSummary, computeCategorySpend } from "@/lib/finance";
import { BucketSummaryCard } from "../bucket-summary";
import { ReviewCharts } from "./review-charts";
import { formatMoney } from "@/lib/money";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function FinanceReviewPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const month = monthStart(today());
  const data = await getFinanceData(month);
  const buckets = computeBucketSummary(
    data.transactions,
    data.categories,
    data.budget
  );
  const categorySpend = computeCategorySpend(data.transactions, data.categories);

  const totalSpent = buckets.reduce((sum, b) => sum + b.spent, 0);
  const totalTarget = buckets.reduce((sum, b) => sum + b.target, 0);
  const withinPlan = buckets.every((b) => !b.overBudget);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{dict.finance.monthlyReview}</h1>
        <Link href="/finance">
          <Button variant="outline">{dict.finance.backToFinance}</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{dict.review.overall}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div>
              <span className="text-2xl font-semibold font-mono tabular-nums">
                {formatMoney(totalSpent, locale)}
              </span>
              <span className="text-muted-foreground font-mono tabular-nums">
                {" "}
                / {formatMoney(totalTarget, locale)}
              </span>
            </div>
            <Badge variant={withinPlan ? "secondary" : "destructive"}>
              {withinPlan ? dict.review.withinPlan : dict.review.overBudget}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buckets.map((b) => (
          <BucketSummaryCard key={b.bucket} summary={b} />
        ))}
      </div>

      <ReviewCharts buckets={buckets} />

      <Card>
        <CardHeader>
          <CardTitle>{dict.review.topCategories}</CardTitle>
        </CardHeader>
        <CardContent>
          {categorySpend.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {dict.review.noSpendingData}
            </p>
          ) : (
            <div className="space-y-2">
              {categorySpend.slice(0, 10).map((cs) => (
                <div
                  key={cs.categoryId}
                  className="flex items-center justify-between py-1"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium">
                      {cs.categoryName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {dict.enums.bucket[cs.bucket]}
                    </span>
                  </div>
                  <span className="font-medium font-mono tabular-nums">
                    {formatMoney(cs.total, locale)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
