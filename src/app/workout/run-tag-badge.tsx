import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RunVariant } from "./running-data";

const runVariantClasses: Record<RunVariant, string> = {
  easy: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  tempo: "border-primary/40 bg-primary/10 text-primary",
  long: "border-transparent bg-foreground text-background",
  rest: "border-border text-muted-foreground",
  race: "border-transparent bg-destructive text-white",
};

export function RunTagBadge({
  variant,
  label,
}: {
  variant: RunVariant;
  label: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn("uppercase", runVariantClasses[variant])}
    >
      {label}
    </Badge>
  );
}
