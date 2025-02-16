# Translation System

## Table of Contents

- [Translation System](#translation-system)
  - [Table of Contents](#table-of-contents)
  - [Directory Structure](#directory-structure)
  - [Type System](#type-system)
    - [Translation Interfaces](#translation-interfaces)
    - [Type-Safe Translation Access](#type-safe-translation-access)
  - [Language Support](#language-support)
    - [Adding New Languages](#adding-new-languages)
    - [Pluralization Support](#pluralization-support)
      - [Plural Forms](#plural-forms)
      - [Language-Specific Rules](#language-specific-rules)
      - [Usage in Translations](#usage-in-translations)
      - [Helper Functions](#helper-functions)
      - [Testing Pluralization](#testing-pluralization)
  - [RTL Support](#rtl-support)
    - [Best Practices for RTL Support](#best-practices-for-rtl-support)
    - [RTL-Aware Components](#rtl-aware-components)
  - [Dynamic Loading](#dynamic-loading)
  - [Best Practices](#best-practices)
    - [Translation Keys](#translation-keys)
    - [Translation Content](#translation-content)
    - [Interpolation](#interpolation)
    - [Maintenance](#maintenance)
  - [Testing](#testing)
    - [Translation Key Tests](#translation-key-tests)
    - [Pluralization Tests](#pluralization-tests)
    - [RTL Tests](#rtl-tests)

The translation system in yipyap provides comprehensive internationalization support with type-safe translations, pluralization rules, and RTL language support.

## Directory Structure

The translations are in the `/src/i18n` folder:

- Language files: `en.ts`, `ja.ts`, etc.
- Type definitions: `/src/i18n/types.ts`
- Core functionality: `/src/i18n/index.ts`

## Type System

### Translation Interfaces

All language files must follow the type definitions in `/src/i18n/types.ts`, which defines interfaces for different sections:

```typescript
export interface Translations {
  common: CommonTranslations;
  settings: SettingsTranslations;
  frontPage: FrontPageTranslations;
  gallery: GalleryTranslations;
  tools: ToolsTranslations;
  // ... other sections
}

export interface SettingsTranslations {
  title: string;
  theme: string;
  language: string;
  // ... other settings translations
}

// Example of nested translations
export interface GalleryTranslations {
  uploadProgress: string;
  deleteConfirm: string;
  multiSelect: {
    selected: string;
    clear: string;
    delete: string;
  };
}
```

### Type-Safe Translation Access

The system provides type-safe access to translation values:

```typescript
// In components
const message = t("gallery.uploadProgress", { progress: 75 });

// Helper function for nested values
const value = getTranslationValue(translations, "gallery.multiSelect.selected");
```

## Language Support

### Adding New Languages

1. Create a new language file in `/src/i18n/`:

    ```typescript
    // ja.ts
    export default {
      common: {
        ok: "OK",
        cancel: "キャンセル"
      },
      settings: {
        title: "設定",
        // ... other translations
      }
    } satisfies Translations;
    ```

2. Add the language to the supported languages array in `/src/i18n/index.ts`:

    ```typescript
    export const languages = [
      { code: "en", name: "English" },
      { code: "ja", name: "日本語" },
      // Add new language here
    ] as const;
    ```

### Pluralization Support

The system provides comprehensive pluralization support for different language families through a flexible rule-based system. Each language can define its own plural forms and rules for selecting the appropriate form based on the number.

#### Plural Forms

```typescript
type PluralForms = {
  zero?: string;    // Optional, for languages that have a special zero form (e.g., Arabic)
  one: string;      // Required, singular form (e.g., "1 book")
  two?: string;     // Optional, dual form (e.g., Arabic: "كتابان")
  few?: string;     // Optional, for languages with special few form (e.g., Polish: "2 książki")
  many?: string;    // Optional, for languages with special many form (e.g., Polish: "5 książek")
  other: string;    // Required, default plural form (e.g., "books")
};
```

#### Language-Specific Rules

The system includes specialized plural rules for different language families:

1. **Default (English-like)**:
   - Two forms: singular (one) and plural (other)
   - Example: "1 book" vs "2 books"

   ```typescript
   default: (n: number, forms: PluralForms) => 
     n === 1 ? forms.one : forms.other
   ```

2. **Slavic Languages (Russian, Ukrainian, Bulgarian)**:
   - Three forms based on the last digit(s)
   - Example (Russian):
     - 1: книга (one)
     - 2-4: книги (few)
     - 5-20: книг (many)

   ```typescript
   ru: (n: number, forms: PluralForms) => {
     const lastDigit = n % 10;
     const lastTwoDigits = n % 100;
     if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return forms.many;
     if (lastDigit === 1) return forms.one;
     if (lastDigit >= 2 && lastDigit <= 4) return forms.few;
     return forms.many;
   }
   ```

3. **Arabic**:
   - Complex system with singular, dual, and multiple plural forms
   - Example:
     - 0: كتب (zero/plural)
     - 1: كتاب (singular)
     - 2: كتابان (dual)
     - 3-10: كتب (plural)
     - 11+: كتابًا (plural large)

   ```typescript
   ar: (n: number, forms: PluralForms) => {
     if (n === 0) return forms.zero || forms.other;
     if (n === 1) return forms.one;
     if (n === 2) return forms.two;
     if (n >= 3 && n <= 10) return forms.few;
     return forms.many || forms.other;
   }
   ```

4. **East Asian Languages (Japanese, Chinese, Korean, Vietnamese)**:
   - No grammatical plurals, always use the base form

   ```typescript
   ja: (_n: number, forms: PluralForms) => forms.other
   ```

#### Usage in Translations

1. **Define Plural Forms**:

    ```typescript
    const bookTranslations = {
      en: {
        one: "${count} book",
        other: "${count} books"
      },
      ru: {
        one: "${count} книга",
        few: "${count} книги",
        many: "${count} книг"
      },
      ar: {
        zero: "لا كتب",
        one: "كتاب واحد",
        two: "كتابان",
        few: "${count} كتب",
        many: "${count} كتابًا"
      }
    };
    ```

2. **Use in Components**:

    ```typescript
    const message = t("books.count", { count: 5 });
    ```

#### Helper Functions

The system provides helper functions for creating plural-aware translations:

```typescript
const pluralTranslation = createPluralTranslation(forms, lang);
const message = pluralTranslation({ count: 5 });
```

#### Testing Pluralization

```typescript
describe("Pluralization", () => {
  it("should handle Russian plural forms", () => {
    const forms = {
      one: "${count} книга",
      few: "${count} книги",
      many: "${count} книг"
    };
    expect(getPlural(1, forms, "ru")).toBe("1 книга");
    expect(getPlural(2, forms, "ru")).toBe("2 книги");
    expect(getPlural(5, forms, "ru")).toBe("5 книг");
    expect(getPlural(11, forms, "ru")).toBe("11 книг");
    expect(getPlural(21, forms, "ru")).toBe("21 книга");
  });
});
```

## RTL Support

The system provides comprehensive RTL (right-to-left) support for languages like Arabic (ar), Hebrew (he), and Persian (fa). This is implemented through several layers:

1. Automatic Direction Setting:

    ```typescript
    // In app context
    createRenderEffect(() => {
      document.documentElement.lang = store.locale;
      document.documentElement.dir = ["ar", "he", "fa"].includes(store.locale) ? "rtl" : "ltr";
    });
    ```

2. CSS Logical Properties:

    ```css
    :root[dir="rtl"] {
      --start: right;
      --end: left;
      --font-family-base: "Noto Sans Arabic", -apple-system, BlinkMacSystemFont, 
        "Segoe UI", Roboto, sans-serif;
    }

    :root[dir="ltr"] {
      --start: left;
      --end: right;
    }
    ```

3. Language-Specific Font Support:

    ```css
    body:lang(he) {
      font-family: "Noto Sans Hebrew", var(--font-family-base);
      line-height: 1.7;
    }

    body:lang(ar) {
      font-family: "Noto Sans Arabic", var(--font-family-base);
      line-height: 1.8;
    }

    body:lang(fa) {
      font-family: "Noto Sans Arabic", var(--font-family-base);
      line-height: 1.8;
    }
    ```

4. Font Loading:

    ```css
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew&display=swap');
    ```

### Best Practices for RTL Support

When working with RTL languages, it's important to use CSS logical properties like `margin-inline-start` and `padding-inline-end` instead of directional properties like `margin-left` and `padding-right`. The `--start` and `--end` CSS variables should be used for positioning elements that need to flip in RTL layouts. Special attention must be paid to text alignment and icon direction in RTL layouts. All layouts should be thoroughly tested with both LTR and RTL content to ensure proper display. Different scripts require appropriate line heights - Hebrew text works best with 1.7 while Arabic and Persian scripts need 1.8 for optimal readability.

### RTL-Aware Components

Components should be designed to handle both LTR and RTL layouts:

```typescript
// Example of RTL-aware component styling
const Gallery = styled.div`
  display: grid;
  grid-auto-flow: row;
  gap: var(--spacing);
  padding-inline-start: var(--spacing);
  text-align: start;

  [dir="rtl"] & {
    .icon {
      transform: scaleX(-1);
    }
  }
`;
```

## Dynamic Loading

Translations are dynamically imported using Vite's glob imports:

```typescript
const modules = import.meta.glob("./languages/*.ts", { eager: true });
const translations = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => [
    path.match(/\.\/languages\/(.+)\.ts$/)[1],
    module.default
  ])
);
```

## Best Practices

### Translation Keys

When creating translation keys, it's important to follow consistent naming patterns throughout the codebase. Related translations should be grouped together logically to maintain organization. Keys should be descriptive enough to understand their purpose while remaining concise and avoiding unnecessary verbosity. Using dot notation helps establish clear hierarchical relationships between translations. Dot notation refers to using periods to separate hierarchical levels in translation keys, such as `settings.appearance.theme` or `gallery.images.count`. This creates a clear nested structure that makes it easy to organize and access translations.

### Translation Content

Translation content should be written in clear, concise language that users can easily understand. Maintain consistent sentence casing across all translations to provide a polished user experience. Technical jargon should be avoided unless absolutely necessary for the target audience. When the meaning or usage of a translation may not be immediately obvious, include context comments to help other developers and translators understand how the text is used.

### Interpolation

The interpolation system relies on named parameters to provide clarity and prevent errors from parameter order changes. All required parameters should be clearly documented so translators understand what values will be inserted. Special attention must be paid to how word order differences between languages affect interpolated values. The system needs to appropriately handle plural forms based on the grammatical rules of each target language.

### Maintenance

Regular maintenance is crucial for keeping translations synchronized across all supported languages. Missing translations should be documented to ensure they get addressed. Type definitions must be updated whenever new translations are added to maintain type safety. Testing translations with different languages helps catch issues early and ensures a consistent experience for all users.

## Testing

### Translation Key Tests

```typescript
describe("Translation Keys", () => {
  it("should have all required keys", () => {
    const required = ["common.ok", "common.cancel"];
    required.forEach(key => {
      expect(getTranslationValue(en, key)).toBeDefined();
      expect(getTranslationValue(ja, key)).toBeDefined();
    });
  });
});
```

### Pluralization Tests

```typescript
describe("Pluralization", () => {
  it("should handle Russian plural forms", () => {
    const forms = {
      one: "файл",
      few: "файла",
      many: "файлов"
    };
    expect(getRussianPlural(1, forms)).toBe("файл");
    expect(getRussianPlural(2, forms)).toBe("файла");
    expect(getRussianPlural(5, forms)).toBe("файлов");
  });
});
```

### RTL Tests

```typescript
describe("RTL Support", () => {
  it("should detect RTL languages", () => {
    expect(getLanguageDirection("ar")).toBe("rtl");
    expect(getLanguageDirection("en")).toBe("ltr");
  });
});
```

When working with translations, it's important to keep all translations synchronized across the supported languages to maintain consistency. Testing should be performed with various language contexts to ensure proper functionality in different locales. Special attention must be paid to word order differences between languages, as sentence structure can vary significantly. The system needs to properly handle pluralization rules according to each language's grammatical requirements. RTL language support should be maintained throughout the application to provide a seamless experience for users of those languages. Finally, translation requirements should be thoroughly documented to help translators understand the context and parameters needed for each string.
