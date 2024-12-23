# Common TypeScript Linting Errors and Solutions

This document outlines common TypeScript linting errors encountered in the yipyap project and their solutions.

## 1. Object Literal Type Mismatch in Notifications

Location: `src/components/Gallery/Gallery.tsx`

```typescript
// Error: Object literal may only specify known properties
appContext.createNotification({
  message: t("gallery.uploadProgressPercent", { progress }),
  type: "info",
  group: "file-upload",
  progress // Error: 'progress' does not exist in type
});

// Solution: Update the notification type in the app context first
// In src/contexts/app.tsx:
export interface AppContext {
  createNotification: (notification: {
    message: string;
    type: "error" | "success" | "info" | "warning";
    group?: string;
    icon?: "spinner" | "success" | "error" | "info" | "warning";
    progress?: number; // Add the progress property to the type
  }) => void;
}
```

This error occurs when trying to pass properties to a function that aren't defined in its type signature. To avoid this:

1. Always define the complete interface before implementing features
2. Update types in the following order:
   - Base interfaces/types (e.g., `NotificationItem`)
   - Component props (e.g., `NotificationProps`)
   - Context interfaces (e.g., `AppContext`)
   - Implementation code

3. When adding new properties:
   - Make them optional (`?`) if they're not required
   - Update all related interfaces consistently
   - Add appropriate JSDoc comments explaining the property
   - Consider the impact on existing code

4. For notification-specific changes:
   - Update `NotificationItem` in `NotificationContainer.tsx`
   - Update `NotificationProps` in `Notification.tsx`
   - Update the app context interface in `app.tsx`
   - Update any related test files

Example of proper type propagation:

```typescript
// 1. Base type in NotificationContainer.tsx
export interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "info" | "warning";
  group?: string;
  icon?: "spinner" | "success" | "error" | "info" | "warning";
  progress?: number;
}

// 2. Component props in Notification.tsx
export interface NotificationProps {
  message: string;
  type: "error" | "success" | "info" | "warning";
  group?: string;
  icon?: "spinner" | "success" | "error" | "info" | "warning";
  onClose?: () => void;
  progress?: number;
}

// 3. Context interface in app.tsx
export interface AppContext {
  createNotification: (notification: {
    message: string;
    type: "error" | "success" | "info" | "warning";
    group?: string;
    icon?: "spinner" | "success" | "error" | "info" | "warning";
    progress?: number;
  }) => void;
}
```

Remember to:
- Keep types synchronized across files
- Make new properties optional when possible
- Update all related interfaces at once
- Add appropriate documentation
- Update tests to cover new properties

## 2. Context Type Errors in Tests

Location: `src/components/Gallery/__tests__/DeleteConfirmDialog.test.tsx`

```typescript
// Error: Type error when using AppContext directly as a type
const mockAppContext: AppContext = {  // Error: 'AppContext' refers to a value, but is being used as a type
  // ... mock context properties
};

// Solution: Use Parameters utility type to extract the correct type
const mockAppContext: Parameters<typeof AppContext.Provider>[0]['value'] = {
  // ... mock context properties
};
```

This error occurs because Context objects in React/SolidJS are values, not types. To avoid this:
1. Use TypeScript utility types to extract the correct type
2. Remember that Context objects are values with a Provider property
3. Use `Parameters` to get the type of the Provider's props
4. Access the `value` property type from the Provider's props

## 3. Missing Required Properties in Context Mocks

Location: `src/components/Gallery/__tests__/DeleteConfirmDialog.test.tsx`

```typescript
// Error: Type is missing required properties
const mockAppContext = {  // Error: Type is missing properties 'setdisableNonsense', 'alwaysShowCaptionEditor'
  t: (key: string) => key,
  theme: "light" as Theme
  // ... other properties
};

// Solution: Add all required properties from the context
const mockAppContext = {
  t: (key: string) => key,
  theme: "light" as Theme,
  setdisableNonsense: vi.fn(),
  alwaysShowCaptionEditor: false,
  setAlwaysShowCaptionEditor: vi.fn(),
  // ... other properties
};
```

This error occurs when mocking contexts with required properties. To avoid this:
1. Check the context interface for all required properties
2. Mock all required properties, even if unused in the test
3. Use `vi.fn()` for function properties
4. Keep mock values simple but valid
5. Consider creating a helper function to generate mock contexts

## 4. Translation Parameter Type Mismatches

Location: `src/components/Gallery/__tests__/DeleteConfirmDialog.test.tsx`

```typescript
// Error: Parameter 'params' implicitly has 'any' type
const mockAppContext = {
  t: (key: string, params) => {  // Error: Parameter 'params' implicitly has an 'any' type
    return translations[key];
  }
};

// Solution: Properly type the translation function parameters
const mockAppContext = {
  t: (key: string, params?: Record<string, unknown>) => {
    const translations: Record<string, string> = {
      'gallery.confirmMultiDelete': `Delete ${params?.count} items (${params?.folders} folders, ${params?.images} images)?`
    };
    return translations[key] || key;
  }
};
```

This error occurs when translation functions don't properly type their parameters. To avoid this:
1. Always specify parameter types explicitly
2. Use optional parameters with `?` when appropriate
3. Use `Record<string, unknown>` for generic object parameters
4. Consider creating type definitions for translation parameters
5. Document expected parameter shapes in comments

## Best Practices

### 1. Context Typing
   - Never use Context objects directly as types
   - Use TypeScript utility types to extract proper types
   - Keep type definitions separate from implementations
   - Document type structures in comments

### 2. Mock Completeness
   - Always check interface definitions for required properties
   - Create helper functions for generating complete mocks
   - Use TypeScript to enforce mock completeness
   - Keep mock implementations minimal but valid

### 3. Translation Types
   - Define explicit types for translation parameters
   - Use TypeScript template literal types when applicable
   - Document parameter shapes and requirements
   - Consider creating type definitions for common translation patterns

Remember to:
- Check interface definitions thoroughly
- Use TypeScript utility types appropriately
- Keep mocks minimal but complete
- Document type structures and requirements
- Use proper typing for translation functions
