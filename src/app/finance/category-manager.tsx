"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addCategory, deleteCategory } from "./actions";
import type { Category } from "@/db/schema";
import { useT } from "@/lib/i18n/context";

const bucketDotColor: Record<string, string> = {
  needs: "#5b8af5",
  wants: "#b07cf5",
  savings: "#3dbb8f",
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const t = useT();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.finance.categories}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form action={addCategory} className="flex gap-2">
          <Input
            name="name"
            placeholder={t.finance.categoryName}
            required
            className="flex-1"
          />
          <Select
            name="bucket"
            required
            defaultValue="needs"
            items={{
              needs: t.enums.bucket.needs,
              wants: t.enums.bucket.wants,
              savings: t.enums.bucket.savings,
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="needs">{t.enums.bucket.needs}</SelectItem>
              <SelectItem value="wants">{t.enums.bucket.wants}</SelectItem>
              <SelectItem value="savings">{t.enums.bucket.savings}</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" size="sm">
            {t.common.add}
          </Button>
        </form>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {t.finance.noCategoriesYet}
            </p>
          )}
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 text-sm pl-1 pr-2 py-1 rounded-md bg-muted/50"
            >
              <span
                className="size-1.5 rounded-full shrink-0"
                style={{ backgroundColor: bucketDotColor[cat.bucket] }}
              />
              <span>{cat.name}</span>
              <form action={deleteCategory.bind(null, cat.id)}>
                <button
                  type="submit"
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  x
                </button>
              </form>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
