"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { deleteTransaction } from "./actions";
import type { Transaction, Category } from "@/db/schema";
import { useT, useLocale } from "@/lib/i18n/context";

export function TransactionList({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const t = useT();
  const locale = useLocale();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const sorted = [...transactions].sort(
    (a, b) =>
      new Date(b.occurredOn).getTime() - new Date(a.occurredOn).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t.finance.transactions(transactions.length)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.finance.noTransactionsThisMonth}
          </p>
        ) : (
          <div className="space-y-2">
            {sorted.map((tx) => {
              const cat = catMap.get(tx.categoryId);
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium font-mono tabular-nums text-sm">
                        {formatMoney(tx.amount, locale)}
                      </span>
                      {cat && (
                        <span className="text-xs text-muted-foreground">
                          {cat.name}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {tx.occurredOn}
                      {tx.note && ` — ${tx.note}`}
                    </div>
                  </div>
                  <form action={deleteTransaction.bind(null, tx.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      {t.common.delete}
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
