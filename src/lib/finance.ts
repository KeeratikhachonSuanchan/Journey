import type { Budget, Category, Transaction } from "@/db/schema";

export type BucketName = "needs" | "wants" | "savings";

export interface BucketSummary {
  bucket: BucketName;
  target: number;
  spent: number;
  remaining: number;
  ratio: number;
  overBudget: boolean;
}

export function computeBucketSummary(
  transactions: Transaction[],
  categories: Category[],
  budget: Budget | null
): BucketSummary[] {
  const income = budget ? parseFloat(budget.income) : 0;
  const ratios: Record<BucketName, number> = {
    needs: budget?.needsRatio ?? 50,
    wants: budget?.wantsRatio ?? 30,
    savings: budget?.savingsRatio ?? 20,
  };

  const categoryBucketMap = new Map<string, BucketName>();
  for (const cat of categories) {
    categoryBucketMap.set(cat.id, cat.bucket as BucketName);
  }

  const spent: Record<BucketName, number> = { needs: 0, wants: 0, savings: 0 };
  for (const tx of transactions) {
    const bucket = categoryBucketMap.get(tx.categoryId);
    if (bucket) {
      spent[bucket] += parseFloat(tx.amount);
    }
  }

  return (["needs", "wants", "savings"] as BucketName[]).map((bucket) => {
    const target = (ratios[bucket] / 100) * income;
    const s = spent[bucket];
    return {
      bucket,
      target,
      spent: s,
      remaining: target - s,
      ratio: ratios[bucket],
      overBudget: s > target,
    };
  });
}

export interface CategorySpend {
  categoryId: string;
  categoryName: string;
  bucket: BucketName;
  total: number;
}

export function computeCategorySpend(
  transactions: Transaction[],
  categories: Category[]
): CategorySpend[] {
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    totals.set(tx.categoryId, (totals.get(tx.categoryId) ?? 0) + parseFloat(tx.amount));
  }

  return Array.from(totals.entries())
    .map(([catId, total]) => {
      const cat = catMap.get(catId);
      return {
        categoryId: catId,
        categoryName: cat?.name ?? "Unknown",
        bucket: (cat?.bucket ?? "needs") as BucketName,
        total,
      };
    })
    .sort((a, b) => b.total - a.total);
}
