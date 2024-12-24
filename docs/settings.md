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

### 1. Type Safety
- Always define proper types for settings
- Use appropriate TypeScript types for values
- Keep interfaces up to date
- Document type constraints

### 2. State Management
- Use consistent naming patterns
- Follow the existing store structure
- Handle state updates atomically
- Consider side effects

### 3. Persistence
- Use localStorage appropriately
- Handle missing/invalid values
- Consider migration strategies
- Clean up old settings

### 4. UI/UX
- Group related settings
- Provide clear labels
- Add helpful tooltips
- Consider keyboard accessibility

### 5. Translations
- Add translations for all languages
- Use clear, descriptive keys
- Include tooltips when needed
- Consider RTL languages

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

Remember to:
- Update documentation when adding settings
- Test all aspects of new settings
- Consider backward compatibility
- Follow existing patterns
- Keep settings organized
- Consider performance implications 