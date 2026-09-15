export const dynamic = "force-dynamic";

import Link from "next/link";
import { getVocabList } from "../actions";
import { SectionNav } from "../section-nav";
import { VocabFilters } from "./vocab-filters";
import { VocabTable } from "./vocab-table";
import { Button } from "@/components/ui/button";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";
import type { VocabLevel, VocabSource } from "@/db/schema";

type SearchParams = {
  level?: string;
  source?: string;
  state?: string;
  q?: string;
  page?: string;
};

const LEVELS: VocabLevel[] = ["A1", "A2", "B1", "B2"];
const SOURCES: VocabSource[] = ["user", "common"];
const STATES = ["new", "learning", "mastered"] as const;

export default async function VocabPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const level = LEVELS.includes(sp.level as VocabLevel) ? (sp.level as VocabLevel) : undefined;
  const source = SOURCES.includes(sp.source as VocabSource) ? (sp.source as VocabSource) : undefined;
  const state = STATES.includes(sp.state as (typeof STATES)[number])
    ? (sp.state as (typeof STATES)[number])
    : undefined;
  const q = sp.q?.trim() || undefined;
  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);

  const { rows, total, pageSize } = await getVocabList({ level, source, state, q, page });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (level) params.set("level", level);
    if (source) params.set("source", source);
    if (state) params.set("state", state);
    if (q) params.set("q", q);
    params.set("page", String(target));
    return `/english/vocab?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{dict.english.tabVocab}</h1>
        <SectionNav active="vocab" t={dict.english} />
      </div>

      <div className="flex items-center justify-between gap-2 flex-wrap">
        <VocabFilters initial={{ level, source, state, q }} />
        <Link href="/english/vocab/new">
          <Button variant="outline">{dict.english.addWord}</Button>
        </Link>
      </div>

      <div className="text-xs text-muted-foreground">{dict.english.resultCount(total)}</div>

      <VocabTable rows={rows} />

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Link href={pageHref(Math.max(1, page - 1))}>
            <Button variant="outline" size="sm" disabled={page <= 1}>
              {dict.english.prev}
            </Button>
          </Link>
          <span className="text-xs text-muted-foreground">{dict.english.pageOf(page, totalPages)}</span>
          <Link href={pageHref(Math.min(totalPages, page + 1))}>
            <Button variant="outline" size="sm" disabled={page >= totalPages}>
              {dict.english.next}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
