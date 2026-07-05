"use client";

import { createContext, useContext, useState } from "react";
import type { Theme } from "./server";

const ThemeContext = createContext<{
  theme: Theme;
  setThemeLocal: (theme: Theme) => void;
} | null>(null);

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: Theme;
  children: React.ReactNode;
}) {
  const [theme, setThemeLocal] = useState<Theme>(initialTheme);

  return (
    <ThemeContext.Provider value={{ theme, setThemeLocal }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
