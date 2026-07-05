"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/lib/i18n/actions";
import { useLocale } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n";

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next: Locale = locale === "en" ? "th" : "en";
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label="Toggle language"
      className="px-2 py-1.5 rounded-md text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
    >
      {locale === "en" ? "TH" : "EN"}
    </button>
  );
}
