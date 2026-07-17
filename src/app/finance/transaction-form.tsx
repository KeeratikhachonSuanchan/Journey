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
import { DatePicker } from "@/components/ui/date-picker";
import { addTransaction, type SlipExtraction } from "./actions";
import { ScanSlipDialog } from "./scan-slip-dialog";
import { formatDate } from "@/lib/dates";
import type { Category } from "@/db/schema";
import { useRef, useState } from "react";
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
  // Bumped whenever a slip scan lands, forcing the uncontrolled amount/date/note
  // fields below to remount with new defaultValues instead of turning this
  // form into fully controlled state.
  const [formKey, setFormKey] = useState(0);
  const [prefill, setPrefill] = useState<SlipExtraction | null>(null);

  async function handleSubmit(formData: FormData) {
    await addTransaction(formData);
    formRef.current?.reset();
    setPrefill(null);
  }

  function handleExtracted(data: SlipExtraction) {
    setPrefill(data);
    setFormKey((k) => k + 1);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle>{t.finance.addTransaction}</CardTitle>
        {categories.length > 0 && (
          <ScanSlipDialog onExtracted={handleExtracted} />
        )}
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
                key={`amount-${formKey}`}
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                defaultValue={prefill?.amount ?? undefined}
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
              <DatePicker
                key={`occurredOn-${formKey}`}
                id="occurredOn"
                name="occurredOn"
                defaultValue={prefill?.occurredOn ?? formatDate(defaultDate)}
                required
              />
            </div>
            <div>
              <Label htmlFor="note">
                {t.finance.note} ({t.common.optional})
              </Label>
              <Input
                key={`note-${formKey}`}
                id="note"
                name="note"
                placeholder={t.finance.whatWasThisFor}
                defaultValue={prefill?.note ?? undefined}
              />
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
