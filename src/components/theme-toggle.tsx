"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { setTheme } from "@/lib/theme/actions";
import { useTheme } from "@/lib/theme/context";

export function ThemeToggle() {
  const { theme, setThemeLocal } = useTheme();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setThemeLocal(next);
    startTransition(async () => {
      await setTheme(next);
      router.refresh();
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      aria-label="Toggle theme"
      className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors disabled:opacity-50"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
