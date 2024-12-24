# Adding New Settings

## Table of Contents
- [Step-by-Step Guide](#step-by-step-guide)
  - [Update App Context](#1-update-app-context)
  - [Add to Store](#2-add-to-store)
  - [Add Persistence](#3-add-persistence)
  - [Add Getter and Setter](#4-add-getter-and-setter)
  - [Add Translation Types](#5-add-translation-types)
  - [Add UI Component](#6-add-ui-component)
  - [Add Translations](#7-add-translations)
- [Best Practices](#best-practices)
  - [Type Safety](#1-type-safety)
  - [State Management](#2-state-management)
  - [Persistence](#3-persistence)
  - [UI/UX](#4-uiux)
  - [Translations](#5-translations)
- [Testing](#testing)
  - [State Tests](#1-state-tests)
  - [UI Tests](#2-ui-tests)
  - [Translation Tests](#3-translation-tests)

This document outlines the process of adding new settings to the yipyap application.

## Step-by-Step Guide

### 1. Update App Context

Add the setting to the `AppContext` interface in `/src/contexts/app.tsx`:

```typescript
export interface AppContext {
  // ... existing settings ...
  newSetting: boolean; // or appropriate type
  setNewSetting: (value: boolean) => void;
}
```

### 2. Add to Store

Add the setting to the store type and initial state in `createAppContext`:

```typescript
const [store, setStore] = createStaticStore<{
  // ... existing store properties ...
  newSetting: boolean;
}>({
  // ... existing initial values ...
  newSetting: localStorage.getItem("newSetting") === "true",
});
```

### 3. Add Persistence

Add a persistence effect to save the setting to localStorage:

```typescript
createRenderEffect(() =>
  localStorage.setItem("newSetting", store.newSetting.toString())
);
```

### 4. Add Getter and Setter

Add the getter and setter to the returned app context:

```typescript
const appContext = {
  // ... existing context properties ...
  get newSetting() {
    return store.newSetting;
  },
  setNewSetting: (value: boolean) => setStore("newSetting", value),
};
```

### 5. Add Translation Types

Add the setting to the `SettingsTranslations` interface in `/src/i18n/types.ts`:

```typescript
export interface SettingsTranslations {
  // ... existing translations ...
  newSetting: string;
  newSettingTooltip?: string; // if tooltip is needed
}
```

### 6. Add UI Component

Add the setting UI to the Settings component in `/src/components/Settings/Settings.tsx`:

```typescript
<div class="setting-item">
  <label class="tooltip-container">
    <input
      type="checkbox"
      checked={app.newSetting}
      onChange={(e) => app.setNewSetting(e.currentTarget.checked)}
    />
    {t('settings.newSetting')}
    <span class="tooltip">{t('settings.newSettingTooltip')}</span>
  </label>
</div>
```

### 7. Add Translations

Add translations for the setting in each language file in `/src/i18n/`:

```typescript
settings: {
  // ... existing translations ...
  newSetting: "New Setting Name",
  newSettingTooltip: "Description of what the setting does",
}
```

## Best Practices

### Type Safety

Type safety is crucial when implementing settings. All settings should have properly defined TypeScript types that accurately represent their possible values and constraints. Interfaces need to be kept up to date as settings evolve, with any changes properly documented. Type constraints should be clearly documented to help other developers understand the valid ranges and formats for setting values.

### State Management

When managing settings state, use consistent naming patterns that align with the existing codebase. The store structure should be followed to maintain consistency and predictability. State updates should be handled atomically to prevent race conditions or invalid intermediate states. Consider any side effects that may occur when settings change and handle them appropriately.

### Persistence

Settings persistence requires careful handling of localStorage. Missing or invalid values should be gracefully handled with appropriate fallbacks. As settings evolve, consider migration strategies for handling outdated stored values. Regularly clean up old or deprecated settings to prevent localStorage bloat. The persistence layer should be robust and handle edge cases gracefully.

### UI/UX

The settings interface should be thoughtfully designed with related settings grouped together logically. Each setting needs a clear, descriptive label that helps users understand its purpose. Tooltips should be added to provide additional context and explanation where needed. Keyboard accessibility must be considered to ensure all users can effectively navigate and modify settings.

### Translations

All settings must include translations for every supported language in the application. Translation keys should be clear and descriptive to help maintain the codebase. Include tooltip translations when additional context is needed. Special consideration should be given to RTL languages to ensure proper display and functionality of the settings interface in those language contexts.

## Testing

### 1. State Tests

```typescript
describe("Settings State", () => {
  it("should persist setting value", () => {
    const app = useAppContext();
    app.setNewSetting(true);
    expect(localStorage.getItem("newSetting")).toBe("true");
  });
});
```

### 2. UI Tests

```typescript
describe("Settings UI", () => {
  it("should update on change", () => {
    const { getByLabelText } = render(() => <Settings />);
    const checkbox = getByLabelText("New Setting Name");
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });
});
```

### 3. Translation Tests

```typescript
describe("Settings Translations", () => {
  it("should have all required keys", () => {
    const keys = ["newSetting", "newSettingTooltip"];
    keys.forEach(key => {
      expect(translations.settings[key]).toBeDefined();
    });
  });
});
```

When adding new settings to the application, it's crucial to maintain comprehensive documentation that reflects all changes. Every aspect of new settings should be thoroughly tested to ensure reliability and proper functionality. Backward compatibility must be carefully considered to prevent disruption for existing users.

Always follow the established patterns in the codebase to maintain consistency and make the code easier to understand for other developers. Settings should be organized in a logical manner that makes sense to both developers and users. Finally, consider the performance implications of any new settings, especially those that might affect the application's responsiveness or resource usage.
