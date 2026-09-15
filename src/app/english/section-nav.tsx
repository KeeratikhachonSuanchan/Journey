import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const LINKS = [
  { key: "overview", href: "/english" },
  { key: "review", href: "/english/review" },
  { key: "vocab", href: "/english/vocab" },
] as const;

// Server-rendered — each page already has `dict` and knows which tab it's on,
// so this needs neither "use client" nor usePathname.
export function SectionNav({
  active,
  t,
}: {
  active: (typeof LINKS)[number]["key"];
  t: Dictionary["english"];
}) {
  const labels: Record<(typeof LINKS)[number]["key"], string> = {
    overview: t.tabOverview,
    review: t.tabReview,
    vocab: t.tabVocab,
  };

  return (
    <nav className="flex w-fit gap-1 rounded-lg bg-muted p-1">
      {LINKS.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            active === link.key
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {labels[link.key]}
        </Link>
      ))}
    </nav>
  );
}
