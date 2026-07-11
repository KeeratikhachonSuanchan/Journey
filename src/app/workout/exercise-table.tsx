import { CirclePlayIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Exercise } from "./data";

const tagLabels: Record<NonNullable<Exercise["tags"]>[number], string> = {
  cable: "cable",
  acl: "ACL",
};

export function ExerciseTable({ exercises }: { exercises: Exercise[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ท่า</TableHead>
          <TableHead>เซต × รอบ</TableHead>
          <TableHead>วิดีโอ</TableHead>
          <TableHead>หมายเหตุ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {exercises.map((ex) => (
          <TableRow key={ex.name}>
            <TableCell className="whitespace-normal align-top font-medium">
              {ex.name}
              {ex.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className={cn(
                    "ml-1.5 align-middle",
                    tag === "acl"
                      ? "border-warning/40 text-warning"
                      : "border-primary/30 text-primary"
                  )}
                >
                  {tagLabels[tag]}
                </Badge>
              ))}
            </TableCell>
            <TableCell className="align-top font-semibold text-primary">
              {ex.sets}
            </TableCell>
            <TableCell className="align-top">
              {ex.videoUrl && (
                <a
                  href={ex.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 rounded-md border border-destructive/25 bg-destructive/10 px-2 py-1 text-xs font-semibold text-destructive hover:bg-destructive/20"
                >
                  <CirclePlayIcon className="size-3.5" />
                  ดูวิดีโอ
                </a>
              )}
            </TableCell>
            <TableCell className="max-w-xs min-w-48 align-top whitespace-normal text-xs text-muted-foreground">
              {ex.note}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
