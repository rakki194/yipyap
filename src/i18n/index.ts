/* src/i18n/index.ts
 * 
 * This file contains the language configuration and helper functions for the app's internationalization.
 */

import type { Translations } from "./types";

// List of supported languages
export const languages = [
  { code: "en", name: "English" },
  { code: "ja", name: "日本語" },
  { code: "fr", name: "Français" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "简体中文" },
  { code: "sv", name: "Svenska" },
  { code: "pl", name: "Polski" },
  { code: "uk", name: "Українська" },
  { code: "fi", name: "Suomi" },
  { code: "de", name: "Deutsch" },
  { code: "es", name: "Español" },
  { code: "it", name: "Italiano" },
  { code: "pt", name: "Português" },
  { code: "pt-BR", name: "Português (Brasil)" },
  { code: "ko", name: "한국어" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "vi", name: "Tiếng Việt" },
  { code: "th", name: "ไทย" },
  { code: "ar", name: "العربية" },
  { code: "he", name: "עברית" },
  { code: "hi", name: "हिन्दी" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "cs", name: "Čeština" },
  { code: "el", name: "Ελληνικά" },
  { code: "hu", name: "Magyar" },
  { code: "ro", name: "Română" },
  { code: "bg", name: "Български" },
  { code: "da", name: "Dansk" },
  { code: "nb", name: "Norsk" },
] as const;

export type LanguageCode = typeof languages[number]["code"];
export type Locale = LanguageCode;

// Helper function to get the path separator based on locale and platform
export function getPathSeparator(locale: Locale) {
  if (locale === "ja") return "￥";
  return navigator.userAgent.toLowerCase().includes("win") ? " \\ " : " / ";
}

// Dynamic import of translation files
export const translations: Record<string, () => Promise<Translations>> = Object.fromEntries(
  Object.entries(import.meta.glob<Translations>("./*.ts", { import: "default" }))
    .map(([key, value]) => [
      key.replace(/^\.\/(.+)\.ts$/, "$1"),
      value
    ])
);

// Helper function to get nested translation values with type safety
export function getTranslationValue(
  obj: any, 
  path: string, 
  params?: { [key: string]: any }
): string {
  const value = path.split('.').reduce((acc, part) => acc?.[part], obj);
  if (typeof value === 'function') {
    return value(params || {});
  }
  if (typeof value === 'string' && params) {
    return Object.entries(params).reduce(
      (str, [key, val]) => str.replace(`{${key}}`, val.toString()),
      value
    );
  }
  return value;
}

export { getRussianPlural } from "./utils";
export { getArabicPlural } from "./utils";
