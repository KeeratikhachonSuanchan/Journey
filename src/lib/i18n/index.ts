import { en, th, type Dictionary } from "./dictionaries";

export type Locale = "en" | "th";
export type { Dictionary };

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

const dictionaries: Record<Locale, Dictionary> = { en, th };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
}

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "th";
}
