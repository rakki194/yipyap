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

### 1. Translation Keys
- Use consistent naming patterns
- Group related translations
- Keep keys descriptive but concise
- Use dot notation for hierarchy

### 2. Translation Content
- Keep messages clear and concise
- Use sentence case consistently
- Avoid technical jargon
- Include context comments when needed

### 3. Interpolation
- Use named parameters
- Document required parameters
- Consider word order differences
- Handle plural forms appropriately

### 4. Maintenance
- Keep translations in sync
- Document missing translations
- Update type definitions
- Test with different languages

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

Remember to:
- Keep translations synchronized across languages
- Test with various language contexts
- Consider word order differences
- Handle pluralization rules correctly
- Support RTL languages properly
- Document translation requirements 