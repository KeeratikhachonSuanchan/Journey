export const dynamic = "force-dynamic";

import Link from "next/link";
import { AddWordForm } from "./add-word-form";
import { SectionNav } from "../../section-nav";
import { getLocale } from "@/lib/i18n/server";
import { getDictionary } from "@/lib/i18n";

export default async function AddWordPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-xl font-semibold tracking-tight">{dict.english.addWord}</h1>
        <SectionNav active="vocab" t={dict.english} />
      </div>

      <div className="max-w-md">
        <AddWordForm />
      </div>

      <Link href="/english/vocab" className="inline-block text-sm text-muted-foreground underline">
        {dict.english.tabVocab}
      </Link>
    </div>
  );
}
