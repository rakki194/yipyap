/* src/i18n/languages.ts
 * 
 * This file contains the list of languages supported by the app.
 * It is used to populate the language dropdown in the settings page.
 * 
 * The languages are defined as an array of objects, where each object has a code and a name.
 * The code is the language code, and the name is the name of the language in English.
 * 
 * The code is used to identify the language in the app, and the name is used to display the language in the dropdown.
 */
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
] as const;

export type LanguageCode = typeof languages[number]["code"]; 