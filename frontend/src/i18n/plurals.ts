import type { LanguageCode } from ".";
import type { TranslationParams } from "./types";
import { getArabicPlural, getCzechPlural, getPolishPlural, getRussianPlural, getSpanishPlural, getRomanianPlural } from "./utils";

// Define the plural forms that a language might have
export type PluralForms = {
  zero?: string;    // e.g. Arabic: "0 كتب"
  one: string;      // Singular: "1 book"
  two?: string;     // e.g. Arabic: "كتابان"
  few?: string;     // e.g. Polish: "2 książki"
  many?: string;    // e.g. Polish: "5 książek"
  other: string;    // Default plural: "books"
};

// Function type for determining plural category
type PluralRule = (n: number, forms: PluralForms) => string;

// Plural rules for different language families
export const pluralRules: Record<string, PluralRule> = {
  // English and similar (singular and plural only)
  default: (n: number, forms: PluralForms) =>
    n === 1 ? forms.one : forms.other,

  // Arabic (has singular, dual, and plural forms)
  ar: (n: number, forms: PluralForms) => {
    if (n === 0) return forms.zero || forms.other;
    if (!forms.two || !forms.few || !forms.many) return forms.other;
    return getArabicPlural(n, {
      singular: forms.one,
      dual: forms.two,
      plural: forms.few,
      pluralLarge: forms.many
    });
  },

  // Russian and similar Slavic languages
  ru: (n: number, forms: PluralForms) => {
    if (!forms.few || !forms.many) {
      const form = n === 1 ? forms.one : forms.other;
      return form.replace(/\${count}/g, String(n));
    }
    return getRussianPlural(n, [forms.one, forms.few, forms.many]);
  },

  // Polish has similar but slightly different rules to Russian
  pl: (n: number, forms: PluralForms) => {
    if (!forms.few || !forms.many) return forms.other;
    return getPolishPlural(n, {
      singular: forms.one,
      plural2_4: forms.few,
      plural5_: forms.many
    });
  },

  // Spanish (similar to default but using specific function)
  es: (n: number, forms: PluralForms) =>
    getSpanishPlural(n, { singular: forms.one, plural: forms.other }),

  // Japanese, Chinese, Korean, Vietnamese (no plurals)
  ja: (_n: number, forms: PluralForms) => forms.other,
  zh: (_n: number, forms: PluralForms) => forms.other,
  ko: (_n: number, forms: PluralForms) => forms.other,
  vi: (_n: number, forms: PluralForms) => forms.other,

  // Czech has its own pluralization rules
  cs: (n: number, forms: PluralForms) => {
    if (!forms.few || !forms.many) return forms.other;
    return getCzechPlural(n, {
      singular: forms.one,
      plural2_4: forms.few,
      plural5_: forms.many
    });
  },

  ro: (count, forms) => {
    if (!forms || typeof forms !== "object") return "";
    return getRomanianPlural(count, {
      one: forms.one || "",
      few: forms.few || "",
      many: forms.many || "",
    });
  },
};

// Map language codes to their plural rules
const languageToRule: Record<LanguageCode, PluralRule> = {
  en: pluralRules.default,
  ar: pluralRules.ar,
  bg: pluralRules.ru,
  cs: pluralRules.cs,
  da: pluralRules.default,
  de: pluralRules.default,
  el: pluralRules.default,
  es: pluralRules.es,
  fi: pluralRules.default,
  fr: pluralRules.default,
  he: pluralRules.default,
  hi: pluralRules.default,
  hu: pluralRules.default,
  id: pluralRules.default,
  it: pluralRules.default,
  ja: pluralRules.ja,
  ko: pluralRules.ko,
  nb: pluralRules.default,
  nl: pluralRules.default,
  pl: pluralRules.pl,
  pt: pluralRules.default,
  "pt-BR": pluralRules.default,
  ro: pluralRules.ro,
  ru: pluralRules.ru,
  sv: pluralRules.default,
  th: pluralRules.default,
  tr: pluralRules.default,
  uk: pluralRules.ru,
  vi: pluralRules.vi,
  zh: pluralRules.zh,
};

function interpolate(template: string, params: TranslationParams | null | undefined): string {
  if (!params || typeof params !== 'object') {
    return template.replace(/\${count}/g, 'some');
  }
  return template.replace(/\${(\w+)}/g, (_, key) => {
    const value = params[key];
    if (typeof value === 'undefined' || value === null) return 'some';
    return String(value);
  });
}

/**
 * Get the plural form for a number in a specific language
 * @param count The number to get the plural form for
 * @param forms The plural forms available for the string
 * @param lang The language code
 * @returns The appropriate plural form string
 */
export function getPlural(count: number, forms: PluralForms, lang: LanguageCode): string {
  const rule = languageToRule[lang] || pluralRules.default;
  return rule(count, forms);
}

/**
 * Helper function to create a plural-aware translation function
 * @param forms The plural forms for the translation
 * @param lang The language code
 * @returns A function that takes a count and returns the appropriate plural form
 */
export function createPluralTranslation(forms: PluralForms, lang: LanguageCode) {
  return (params: TranslationParams | null | undefined = {}) => {
    if (!params || typeof params !== 'object') {
      return interpolate(forms.other, null);
    }
    if (typeof params.count !== 'number') {
      return interpolate(forms.other, null);
    }
    const text = getPlural(params.count, forms, lang);
    return interpolate(text, params);
  };
} 