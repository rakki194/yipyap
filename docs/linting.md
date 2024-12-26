# Common Linting Errors and Solutions

## Required Props Errors

### Missing Required Props

**Error:**
```typescript
Type '{}' is not assignable to type 'IntrinsicAttributes & { onClose: () => void; }'.
  Property 'onClose' is missing in type '{}' but required in type '{ onClose: () => void; }'.
```

**Solution:**
Always provide required props when rendering components in tests:
```typescript
// Incorrect
render(() => <Settings />);

// Correct
render(() => <Settings onClose={() => {}} />);
```

When working with components, always check the prop types before usage to ensure type safety. In test scenarios, provide mock functions for any event handler props that are required. For callback props where the specific implementation is not important for the test, you can use empty arrow functions to satisfy the type requirements.

## Transformation Type Errors

### Object Type Mismatch

**Error:**
```typescript
Argument of type '{ type: "searchReplace"; pattern: string; replacement: string; }' is not assignable to parameter of type 'Omit<Transformation, "id" | "enabled" | "isCustom">'.
```

**Solution:**
Use proper type assertions for specific transformation types:
```typescript
const transformation = {
  ...baseTransformation,
  type: "searchReplace",
  pattern: pattern(),
  replacement: replacement(),
} as Omit<SearchReplaceTransformation, "id" | "enabled" | "isCustom">;
```

### Unknown Properties

**Error:**
```typescript
Object literal may only specify known properties, and 'pattern' does not exist in type 'Omit<Transformation, "id" | "enabled" | "isCustom">'
```

**Solution:**
Import and use specific transformation type interfaces:
```typescript
import { SearchReplaceTransformation } from "~/contexts/transformations";
```

### Discriminated Union Type Issues

**Error:**
```typescript
Type '{ type: string; ... }' is not assignable to type 'Transformation'.
```

**Solution:**
Use const assertions or explicit type annotations:
```typescript
type: "searchReplace" as const
```

## Context Provider Errors

### Hook Usage Error

**Error:**
```typescript
Error: useTransformations must be used within a TransformationsProvider
```

**Solution:**
Wrap your app with the TransformationsProvider:
```typescript
<TransformationsProvider>
  <AppContext.Provider>
    {/* Your app content */}
  </AppContext.Provider>
</TransformationsProvider>
```
## Best Practices to Avoid Linting Errors

**Type Imports**
When working with transformations, it's important to always import specific transformation types from their source files. Type assertions should be used consistently throughout the codebase to maintain type safety. Type definitions should be kept centralized in dedicated type files to avoid duplication and make maintenance easier.

**Context Usage** 
Proper nesting of providers is crucial for context to work correctly. Always verify that hooks are used within the appropriate provider components in the component hierarchy. The order of providers matters, so maintain a consistent and logical provider ordering based on dependencies.

**Type Safety**
Discriminated unions should be used for transformation types to enable proper type narrowing. Take full advantage of TypeScript's type system for validation by defining strict types. Keep transformation type definitions synchronized across the codebase to prevent type mismatches.

**Code Organization**
Type definitions should be centralized in dedicated files rather than scattered throughout the codebase. Use type assertions consistently to maintain predictable typing behavior. Establish and maintain clear type hierarchies that reflect the logical structure of the data.
