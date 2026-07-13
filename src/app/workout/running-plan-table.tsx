import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RunTagBadge } from "./run-tag-badge";
import type { RunSession, RunWeek } from "./running-data";

function SessionCell({ session }: { session: RunSession }) {
  return (
    <TableCell className="align-top whitespace-nowrap">
      <div className="flex items-center gap-2">
        <RunTagBadge variant={session.variant} label={session.label} />
        <span className="font-semibold">{session.dist}</span>
      </div>
    </TableCell>
  );
}

export function RunningPlanTable({ weeks }: { weeks: RunWeek[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>สัปดาห์</TableHead>
          <TableHead>อังคาร</TableHead>
          <TableHead>ศุกร์</TableHead>
          <TableHead>อาทิตย์ (Long Run)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {weeks.map((w) => (
          <TableRow key={w.week}>
            <TableCell className="align-top font-semibold">{w.week}</TableCell>
            <SessionCell session={w.tue} />
            <SessionCell session={w.fri} />
            <SessionCell session={w.sun} />
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
