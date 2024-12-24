# Translation System

## Table of Contents
- [Directory Structure](#directory-structure)
- [Type System](#type-system)
  - [Translation Interfaces](#translation-interfaces)
  - [Type-Safe Translation Access](#type-safe-translation-access)
- [Language Support](#language-support)
  - [Adding New Languages](#adding-new-languages)
  - [Pluralization Support](#pluralization-support)
- [RTL Support](#rtl-support)
- [Dynamic Loading](#dynamic-loading)
- [Best Practices](#best-practices)
  - [Translation Keys](#1-translation-keys)
  - [Translation Content](#2-translation-content)
  - [Interpolation](#3-interpolation)
  - [Maintenance](#4-maintenance)
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

The system supports complex pluralization rules through language-specific plural functions:

```typescript
// Russian pluralization example
export function getRussianPlural(count: number, forms: {
  one: string;
  few: string;
  many: string;
}): string {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
    return forms.many;
  }

  if (lastDigit === 1) {
    return forms.one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms.few;
  }

  return forms.many;
}
```

## RTL Support

The system includes RTL (right-to-left) support for languages like Arabic and Hebrew:

1. Automatic direction switching:
```typescript
export function getLanguageDirection(code: string): "ltr" | "rtl" {
  return ["ar", "he"].includes(code) ? "rtl" : "ltr";
}
```

2. Layout adjustments:
```css
[dir="rtl"] {
  .gallery-item {
    margin-left: 0;
    margin-right: var(--spacing);
  }
  
  .icon {
    transform: scaleX(-1);
  }
}
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

When creating translation keys, it's important to follow consistent naming patterns throughout the codebase. Related translations should be grouped together logically to maintain organization. Keys should be descriptive enough to understand their purpose while remaining concise and avoiding unnecessary verbosity. Using dot notation helps establish clear hierarchical relationships between translations.

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
