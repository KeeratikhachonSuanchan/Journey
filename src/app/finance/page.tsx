export const dynamic = "force-dynamic";

import { getFinanceData } from "./actions";
import { monthStart, today } from "@/lib/dates";
import { computeBucketSummary } from "@/lib/finance";
import { BudgetForm } from "./budget-form";
import { CategoryManager } from "./category-manager";
import { TransactionForm } from "./transaction-form";
import { TransactionList } from "./transaction-list";
import { BucketSummaryCard } from "./bucket-summary";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function FinancePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const month = monthStart(today());
  const data = await getFinanceData(month);
  const buckets = computeBucketSummary(
    data.transactions,
    data.categories,
    data.budget
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">{dict.finance.title}</h1>
        <Link href="/finance/review">
          <Button variant="outline">{dict.finance.monthlyReview}</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {buckets.map((b) => (
          <BucketSummaryCard key={b.bucket} summary={b} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <BudgetForm budget={data.budget} month={month} />
          <CategoryManager categories={data.categories} />
        </div>
        <div className="space-y-6">
          <TransactionForm
            categories={data.categories}
            defaultDate={today()}
          />
          <TransactionList
            transactions={data.transactions}
            categories={data.categories}
          />
        </div>
      </div>
    </div>
  );
}
