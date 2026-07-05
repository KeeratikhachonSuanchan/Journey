"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { upsertBudget } from "./actions";
import { formatDate } from "@/lib/dates";
import type { Budget } from "@/db/schema";
import { useT } from "@/lib/i18n/context";

export function BudgetForm({
  budget,
  month,
}: {
  budget: Budget | null;
  month: Date;
}) {
  const t = useT();
  const monthStr = formatDate(month);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.finance.monthlyBudget}</CardTitle>
      </CardHeader>
      <CardContent>
        <form key={budget?.id ?? "new"} action={upsertBudget} className="space-y-4">
          <input type="hidden" name="month" value={monthStr} />
          <div>
            <Label htmlFor="income">{t.finance.monthlyIncome}</Label>
            <Input
              id="income"
              name="income"
              type="number"
              step="0.01"
              min="0"
              defaultValue={budget?.income ?? ""}
              placeholder="5000.00"
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="needsRatio">{t.finance.needsPercent}</Label>
              <Input
                id="needsRatio"
                name="needsRatio"
                type="number"
                min="0"
                max="100"
                defaultValue={budget?.needsRatio ?? 50}
                required
              />
            </div>
            <div>
              <Label htmlFor="wantsRatio">{t.finance.wantsPercent}</Label>
              <Input
                id="wantsRatio"
                name="wantsRatio"
                type="number"
                min="0"
                max="100"
                defaultValue={budget?.wantsRatio ?? 30}
                required
              />
            </div>
            <div>
              <Label htmlFor="savingsRatio">{t.finance.savingsPercent}</Label>
              <Input
                id="savingsRatio"
                name="savingsRatio"
                type="number"
                min="0"
                max="100"
                defaultValue={budget?.savingsRatio ?? 20}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            {t.finance.saveBudget}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
