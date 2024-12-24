# Common TypeScript Linting Errors and Solutions

## Table of Contents
- [Object Literal Type Mismatch in Notifications](#1-object-literal-type-mismatch-in-notifications)
- [Context Type Errors in Tests](#2-context-type-errors-in-tests)
- [Missing Required Properties in Context Mocks](#3-missing-required-properties-in-context-mocks)
- [Translation Parameter Type Mismatches](#4-translation-parameter-type-mismatches)
- [Import Resolution and Module Not Found Errors](#5-import-resolution-and-module-not-found-errors)
- [Icon Name Resolution Errors](#6-icon-name-resolution-errors)
  - [Incorrect Icon Names](#1-incorrect-icon-names)
  - [Icon Name Constants](#2-icon-name-constants)
  - [Icon Type Safety](#3-icon-type-safety)
  - [Best Practices for Icon Usage](#best-practices-for-icon-usage)

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

This error occurs when trying to pass properties to a function that aren't defined in its type signature. To avoid this, it's important to follow a structured approach to type definitions and updates.

The first step is to always define the complete interface before implementing any features. This ensures type safety from the start and prevents issues down the line. When updating types, follow a specific order starting with base interfaces and types like `NotificationItem`, then moving to component props such as `NotificationProps`, followed by context interfaces like `AppContext`, and finally the implementation code itself.

When adding new properties to existing types, several considerations must be taken into account. Properties should be made optional using the `?` modifier if they aren't strictly required. All related interfaces need to be updated consistently to maintain type safety across the codebase. Appropriate JSDoc comments should be added to explain the purpose and usage of the property. It's also important to carefully consider the impact on existing code that may be affected by the changes.

For notification-specific changes in particular, updates need to be made systematically across several files. This includes updating the `NotificationItem` interface in `NotificationContainer.tsx`, the `NotificationProps` interface in `Notification.tsx`, the app context interface in `app.tsx`, and any related test files to ensure complete test coverage of the new functionality.

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

When making changes to types and interfaces, it's important to maintain synchronization across all related files. Any new properties should be made optional whenever possible to minimize breaking changes. All interfaces that reference the modified types need to be updated together to maintain consistency. Proper documentation should be added to explain the purpose and usage of any new properties. Finally, test coverage should be expanded to verify the behavior of the new properties and ensure type safety is maintained.

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

This error occurs because Context objects in SolidJS are values, not types. When working with contexts in TypeScript, you'll need to use utility types to extract the correct type information. Context objects themselves are values that contain a Provider property, so we can't use them directly as types. Instead, we can use the TypeScript Parameters utility type to get the type of the Provider's props, and then access the value property type from those props. This gives us the proper type information for the context value while maintaining type safety.

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

This error occurs when mocking contexts with required properties. When mocking a context, it's important to first check the context interface to identify all required properties that need to be included. Every required property must be mocked, even if it won't be directly used in the test, to satisfy TypeScript's type checking. For function properties, use `vi.fn()` to create mock functions that can be tracked for calls and responses.

The mock values should be kept simple while still being valid according to the type definitions. To make context mocking more maintainable, consider creating a dedicated helper function that generates properly typed mock contexts with all required properties.

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

This error occurs when translation functions don't properly type their parameters. When implementing translation functions, it's important to specify parameter types explicitly to maintain type safety throughout the application. Optional parameters should be marked with the `?` operator when they aren't required for every translation. For generic object parameters, using `Record<string, unknown>` provides good type safety while maintaining flexibility.

Creating dedicated type definitions for translation parameters helps enforce consistency and makes the code more maintainable. Additionally, documenting the expected parameter shapes in comments helps other developers understand how to properly use the translation functions.

## 5. Import Resolution and Module Not Found Errors

Location: `src/components/Gallery/Gallery.tsx`

```typescript
// Error: Cannot find module './Controls' or its corresponding type declarations
import { Controls } from './Controls';  // Error: Module not found

// Solution 1: Remove unused imports
// Simply remove the import if the module is not used

// Solution 2: If the module is needed but missing
// Create the module in the correct location:
// src/components/Gallery/Controls.tsx

// Solution 3: If the import path is wrong
import { Controls } from '../Controls';  // Fix the import path
```

This error occurs when TypeScript cannot resolve an imported module. Common causes and solutions:

### 1. Unused or Commented Out Imports
- **Problem**: Leaving imports for components that are no longer used or are commented out
- **Solution**: 
  Unused imports should be removed completely from the codebase rather than being left in place. Commented-out imports have no place in production code and should be deleted. Instead of keeping old imports around as comments, developers should rely on version control systems to track historical changes to the codebase. This keeps the code clean and maintainable while still preserving the history of changes.

### 2. Incorrect Import Paths
- **Problem**: Import paths don't match the actual file structure
- **Solution**:
  When working with imports, it's important to carefully verify that file paths are correct relative to the importing file's location. Path aliases like `~` should be used consistently throughout the codebase to maintain a standard import style. For improved maintainability, consider using absolute imports rather than complex relative paths, as this makes the code more resilient to file moves and refactoring.

### 3. Missing Files
- **Problem**: Trying to import from files that don't exist
- **Solution**:
When encountering missing files, first check if the file needs to be created based on the component requirements. If the component is still needed, create the missing file in the appropriate location with the necessary code. For files that exist but have incorrect import paths, update the paths to correctly point to the existing file locations. During this process, take the opportunity to remove any imports for components that are no longer used or needed in the codebase. This helps maintain a clean and efficient import structure.

### Best Practices to Avoid Import Errors

1. **Clean Up During Refactoring**:
   - Remove unused imports immediately
   - Update import paths when moving files
   - Don't leave commented-out code in production

2. **Use Path Aliases**:
   ```typescript
   // Bad
   import { Something } from '../../../components/Something';
   
   // Good
   import { Something } from '~/components/Something';
   ```

3. **Organize Imports**:
   ```typescript
   // External imports first
   import { Component, Show } from 'solid-js';
   
   // Internal aliases/paths next
   import { useAppContext } from '~/contexts/app';
   
   // Relative imports last
   import { Controls } from './Controls';
   ```

4. **Import Type Checking**

Import type checking is an essential part of maintaining code quality. TypeScript's `--noUnusedLocals` flag helps catch unused imports during compilation. Additionally, enabling ESLint rules specifically for import checking provides another layer of validation. Regular type checking of the entire project helps catch import-related issues early in development.

It's important to maintain clean and organized imports throughout the codebase. Unused imports should be removed promptly when they are no longer needed. Following consistent import patterns makes the code more maintainable and easier to understand. TypeScript and ESLint are valuable tools for early detection of import issues. The project configuration should include clear documentation of path aliases to help developers use them correctly.

## 6. Icon Name Resolution Errors

Location: `src/components/Settings/TransformationSettings.tsx`

```typescript
// Error: Icon name not found
{getIcon("close")}  // Error: Icon close not found

// Solution: Use the correct icon name from the available set
{getIcon("dismiss")}  // "dismiss" is the correct icon name for close/cancel actions
```

This error occurs when using an icon name that doesn't exist in the icon set. Common causes and solutions:

### Incorrect Icon Names

- **Problem**: Using icon names that don't match the available icons in the system
- **Solution**: 
When encountering icon name issues, first verify that the icon exists in the available icon set. It's important to maintain consistency in icon naming across the entire application to avoid confusion and errors. The available icon names should be documented in a central location that all developers can easily reference.

### Icon Name Constants

- **Problem**: Hardcoding icon names as strings can lead to typos
- **Solution**:
  ```typescript
  // Bad
  getIcon("textAlignDistributed")
  
  // Good
  const ICON_NAMES = {
    TRANSFORM: "textAlignDistributed",
    CLOSE: "dismiss",
    CHECK: "check"
  } as const;
  
  getIcon(ICON_NAMES.TRANSFORM)
  ```

### Icon Type Safety

- **Problem**: TypeScript doesn't catch invalid icon names at compile time
- **Solution**:
  ```typescript
  // Define a type for valid icon names
  type IconName = "dismiss" | "check" | "textAlignDistributed" | /* other valid names */;
  
  // Type the getIcon function
  function getIcon(name: IconName): JSX.Element;
  ```

### Best Practices for Icon Usage

1. **Centralize Icon Names**:
   ```typescript
   // src/icons/constants.ts
   export const IconNames = {
     CLOSE: "dismiss",
     APPLY: "check",
     TRANSFORM: "textAlignDistributed",
     // ... other icon names
   } as const;
   
   export type IconName = typeof IconNames[keyof typeof IconNames];
   ```

2. **Use Type-Safe Icon Components**:
   ```typescript
   // src/components/Icon.tsx
   interface IconProps {
     name: IconName;
     size?: "small" | "medium" | "large";
     className?: string;
   }
   
   export const Icon: Component<IconProps> = (props) => {
     return <span class={`icon ${props.className || ""}`}>{getIcon(props.name)}</span>;
   };
   ```

3. **Document Icon Usage**:
   ```typescript
   /**
    * Gets an icon component by name
    * @param name - The name of the icon to retrieve
    * @throws {Error} If the icon name is not found
    * @returns JSX.Element The icon component
    */
   function getIcon(name: IconName): JSX.Element
   ```

4. **Handle Missing Icons Gracefully**:
   ```typescript
   function getIcon(name: IconName): JSX.Element {
     const icon = icons[name];
     if (!icon) {
       console.warn(`Icon "${name}" not found`);
       return icons.placeholder || null;
     }
     return icon;
   }
   ```

When working with icons in the application, there are several important practices to follow. First, maintain a centralized list of icon names to ensure consistency across the codebase. TypeScript should be used to enforce valid icon names through proper type checking. All available icons and their intended usage should be thoroughly documented to help other developers use them correctly. The system should handle missing icons gracefully by providing appropriate fallbacks or warnings. 

Finally, consider implementing a type-safe Icon component to encapsulate all icon-related logic and provide a clean interface for icon usage throughout the application.

### Common Icon-Related Errors

1. **Runtime Icon Not Found**:
   ```typescript
   // Error: Icon "close" not found at runtime
   getIcon("close")
   
   // Solution: Use correct icon name
   getIcon("dismiss")
   ```

2. **Type Mismatch in Icon Props**:
   ```typescript
   // Error: Type '"huge"' is not assignable to type '"small" | "medium" | "large"'
   <Icon name="dismiss" size="huge" />
   
   // Solution: Use correct size value
   <Icon name="dismiss" size="large" />
   ```

3. **Missing Icon Import**:
   ```typescript
   // Error: Cannot find module '~/icons'
   import getIcon from './icons';
   
   // Solution: Use correct import path
   import getIcon from '~/icons';
   ```

4. **Invalid Icon Type**:
   ```typescript
   // Error: Argument of type 'string' is not assignable to parameter of type 'IconName'
   const iconName = "someIcon";
   getIcon(iconName);
   
   // Solution: Use type assertion or ensure string is valid icon name
   getIcon(iconName as IconName);
   // Or better:
   const iconName: IconName = "dismiss";
   getIcon(iconName);
   ```

These patterns help maintain consistency and type safety when working with icons throughout the application.

## Best Practices

### Context Typing

When working with context objects, it's important to avoid using them directly as types. Instead, leverage TypeScript utility types to extract proper type definitions. Type definitions should be kept separate from their implementations to maintain clean separation of concerns. All type structures should be thoroughly documented in comments to help other developers understand their purpose and usage.

### Mock Completeness

Interface definitions must be carefully checked to ensure all required properties are properly defined. Helper functions should be created to generate complete mocks that satisfy the full interface requirements. TypeScript should be used to enforce mock completeness through strict type checking. While mocks should be kept minimal, they must still represent valid implementations of the interfaces they mock.

### Translation Types 

Translation parameters require explicit type definitions to ensure type safety. TypeScript template literal types should be used when they provide additional type safety for translation strings. The shapes and requirements of translation parameters must be clearly documented. Common translation patterns should have dedicated type definitions to promote consistency and reusability.

When implementing these practices, thorough interface definition checking is essential. TypeScript utility types should be used appropriately to maintain type safety. Mocks should be kept minimal while still being complete. Type structures and requirements need clear documentation. Translation functions must be properly typed to catch errors early in development.
