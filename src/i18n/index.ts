export type Locale = "en" | "ja" | "fr" | "ru" | "zh" | "sv" | "pl" | "uk" | "fi" | "de" | "es" | "it" | 
  "pt" | "ko" | "nl" | "tr" | "vi" | "th" | "ar" | "he" | "hi" | "id" | "cs" | "el" | "hu" | "ro";

export function getPathSeparator(locale: Locale) {
  if (locale === "ja") return "￥";
  return navigator.userAgent.toLowerCase().includes("win") ? " \\ " : " / ";
}

export const translations: Record<string, () => Promise<Record<string, any>>> = Object.fromEntries(
  Object.entries(import.meta.glob<Record<string, any>>("./*.ts", { import: "default" }))
    .map(([key, value]) => [
      key.replace(/^\.\/(.+)\.ts$/, "$1"),
      value
    ])
);
