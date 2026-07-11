import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { SessionRow } from "./data";

export function SessionTable({
  columns,
  rows,
}: {
  columns: [string, string, string];
  rows: SessionRow[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{columns[0]}</TableHead>
          <TableHead>{columns[1]}</TableHead>
          <TableHead>{columns[2]}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.label}>
            <TableCell className="align-top font-medium">{row.label}</TableCell>
            <TableCell className="align-top font-semibold text-primary whitespace-nowrap">
              {row.duration}
            </TableCell>
            <TableCell className="max-w-sm min-w-48 align-top whitespace-normal text-xs text-muted-foreground">
              {row.note}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
