import type { Translations } from "./types";

export type Locale = "en" | "ja" | "fr" | "ru" | "zh" | "sv" | "pl" | "uk" | "fi" | "de" | "es" | "it" | 
  "pt" | "pt-BR" | "ko" | "nl" | "tr" | "vi" | "th" | "ar" | "he" | "hi" | "id" | "cs" | "el" | "hu" | "ro" | "bg";

export function getPathSeparator(locale: Locale) {
  if (locale === "ja") return "￥";
  return navigator.userAgent.toLowerCase().includes("win") ? " \\ " : " / ";
}

export const translations: Record<string, () => Promise<Translations>> = Object.fromEntries(
  Object.entries(import.meta.glob<Translations>("./*.ts", { import: "default" }))
    .map(([key, value]) => [
      key.replace(/^\.\/(.+)\.ts$/, "$1"),
      value
    ])
);

// Helper function to get nested translation values with type safety
export function getTranslationValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((acc, part) => acc?.[part], obj);
}
