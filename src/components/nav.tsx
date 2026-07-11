"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { LocaleToggle } from "./locale-toggle";
import { LiveClock } from "./live-clock";
import { MobileNav } from "./mobile-nav";
import { useT } from "@/lib/i18n/context";

export function Nav() {
  const pathname = usePathname();
  const t = useT();

  const links = [
    { href: "/dashboard", label: t.nav.dashboard },
    { href: "/finance", label: t.nav.finance },
    { href: "/today", label: t.nav.today },
    { href: "/goals", label: t.nav.goals },
    { href: "/workout", label: t.nav.workout },
  ];

  return (
    <header className="border-b border-border/60 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-6">
        <Link
          href="/dashboard"
          className="font-bold text-lg tracking-tight text-primary"
        >
          Journey
        </Link>
        <nav className="hidden flex-1 gap-1 md:flex">
          {links.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-1 -bottom-[calc(0.5rem+1px)] h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>
        <div className="hidden items-center gap-1 md:flex">
          <LiveClock />
          <LocaleToggle />
          <ThemeToggle />
        </div>
        <div className="flex flex-1 justify-end md:hidden">
          <MobileNav links={links} />
        </div>
      </div>
    </header>
  );
}
