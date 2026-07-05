"use client";

import { createContext, useContext } from "react";
import { getDictionary, type Dictionary, type Locale } from "./index";

const LocaleContext = createContext<{ locale: Locale; dict: Dictionary } | null>(
  null
);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  // Dictionaries are static data with function-valued entries, which can't
  // cross the server/client boundary as props — built here instead.
  const dict = getDictionary(locale);

  return (
    <LocaleContext.Provider value={{ locale, dict }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useT(): Dictionary {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useT must be used within a LocaleProvider");
  }
  return ctx.dict;
}

export function useLocale(): Locale {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx.locale;
}
