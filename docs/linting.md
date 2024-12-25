# Common Linting Errors and Solutions

## Transformation Type Errors

### 1. Object Type Mismatch

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

### 2. Unknown Properties

**Error:**
```typescript
Object literal may only specify known properties, and 'pattern' does not exist in type 'Omit<Transformation, "id" | "enabled" | "isCustom">'
```

**Solution:**
Import and use specific transformation type interfaces:
```typescript
import { SearchReplaceTransformation } from "~/contexts/transformations";
```

### 3. Discriminated Union Type Issues

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

### 1. Hook Usage Error

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

1. **Type Imports**
   - Always import specific transformation types
   - Use type assertions consistently
   - Keep type definitions centralized

2. **Context Usage**
   - Ensure providers are properly nested
   - Check hook usage in component hierarchy
   - Use proper provider ordering

3. **Type Safety**
   - Use discriminated unions for transformation types
   - Leverage TypeScript's type system for validation
   - Keep transformation type definitions in sync

4. **Code Organization**
   - Centralize type definitions
   - Use consistent type assertions
   - Maintain clear type hierarchies
