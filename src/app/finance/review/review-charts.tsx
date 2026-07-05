"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BucketSummary } from "@/lib/finance";
import { useT, useLocale } from "@/lib/i18n/context";

const bucketColors: Record<string, { spent: string; target: string }> = {
  needs: { spent: "#5b8af5", target: "#5b8af533" },
  wants: { spent: "#b07cf5", target: "#b07cf533" },
  savings: { spent: "#3dbb8f", target: "#3dbb8f533" },
};

export function ReviewCharts({ buckets }: { buckets: BucketSummary[] }) {
  const t = useT();
  const locale = useLocale();
  const intlLocale = locale === "th" ? "th-TH" : "en-US";

  const chartData = buckets.map((b) => ({
    name: t.enums.bucket[b.bucket],
    spent: Math.round(b.spent * 100) / 100,
    target: Math.round(b.target * 100) / 100,
    bucket: b.bucket,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.review.spentVsTarget}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fill: "var(--muted-foreground)" }}
              axisLine={{ stroke: "var(--border)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                color: "var(--card-foreground)",
              }}
              formatter={(value) => {
                const num = typeof value === "number" ? value : Number(value);
                return num.toLocaleString(intlLocale, {
                  style: "currency",
                  currency: "THB",
                  minimumFractionDigits: 0,
                });
              }}
            />
            <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.bucket}
                  fill={bucketColors[entry.bucket].target}
                />
              ))}
            </Bar>
            <Bar dataKey="spent" name="Spent" radius={[4, 4, 0, 0]}>
              {chartData.map((entry) => (
                <Cell
                  key={entry.bucket}
                  fill={bucketColors[entry.bucket].spent}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
