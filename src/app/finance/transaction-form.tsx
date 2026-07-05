"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addTransaction } from "./actions";
import { formatDate } from "@/lib/dates";
import type { Category } from "@/db/schema";
import { useRef } from "react";
import { useT } from "@/lib/i18n/context";

export function TransactionForm({
  categories,
  defaultDate,
}: {
  categories: Category[];
  defaultDate: Date;
}) {
  const t = useT();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addTransaction(formData);
    formRef.current?.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.finance.addTransaction}</CardTitle>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t.finance.addCategoriesFirst}
          </p>
        ) : (
          <form ref={formRef} action={handleSubmit} className="space-y-3">
            <div>
              <Label htmlFor="amount">{t.finance.amount}</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="categoryId">{t.finance.category}</Label>
              <Select
                name="categoryId"
                required
                items={Object.fromEntries(
                  categories.map((cat) => [
                    cat.id,
                    `${cat.name} (${t.enums.bucket[cat.bucket]})`,
                  ])
                )}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t.finance.selectCategory} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({t.enums.bucket[cat.bucket]})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="occurredOn">{t.finance.date}</Label>
              <Input
                id="occurredOn"
                name="occurredOn"
                type="date"
                defaultValue={formatDate(defaultDate)}
                required
              />
            </div>
            <div>
              <Label htmlFor="note">
                {t.finance.note} ({t.common.optional})
              </Label>
              <Input id="note" name="note" placeholder={t.finance.whatWasThisFor} />
            </div>
            <Button type="submit" className="w-full">
              {t.finance.addTransaction}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
