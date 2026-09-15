"use client";

import { useTransition } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BoxBadge } from "../box-badge";
import { deleteUserWord, type BrowseRow } from "../actions";
import { useT } from "@/lib/i18n/context";

export function VocabTable({ rows }: { rows: BrowseRow[] }) {
  const dict = useT();
  const t = dict.english;
  const sourceLabels = dict.enums.vocabSource;
  const [, startTransition] = useTransition();

  function handleDelete(row: BrowseRow) {
    if (!window.confirm(t.deleteWordConfirm(row.word))) return;
    startTransition(async () => {
      await deleteUserWord(row.id);
    });
  }

  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">{t.noResults}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.wordLabel}</TableHead>
          <TableHead>{t.meaningLabel}</TableHead>
          <TableHead className="hidden sm:table-cell">{t.levelLabel}</TableHead>
          <TableHead className="hidden sm:table-cell">{t.allSources}</TableHead>
          <TableHead>{t.progress}</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            <TableCell className="font-medium">{row.word}</TableCell>
            <TableCell className="text-muted-foreground">{row.meaning}</TableCell>
            <TableCell className="hidden sm:table-cell">
              <Badge variant="outline">{row.level}</Badge>
            </TableCell>
            <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
              {row.source === "user" ? sourceLabels.user : sourceLabels.common}
            </TableCell>
            <TableCell>
              <BoxBadge box={row.box} t={t} />
            </TableCell>
            <TableCell>
              {row.source === "user" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(row)}
                >
                  {t.deleteWord}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
