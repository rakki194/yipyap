# Writing Tests

## Table of Contents
- [Writing Tests](#writing-tests)
  - [Table of Contents](#table-of-contents)
  - [Test Organization](#test-organization)
  - [Test Environment Setup](#test-environment-setup)
  - [Test Utilities](#test-utilities)
    - [Configuration](#configuration)
  - [Component Testing](#component-testing)
  - [Testing Patterns](#testing-patterns)
  - [Mocking](#mocking)
  - [Test Documentation](#test-documentation)
  - [Common Testing Errors and Solutions](#common-testing-errors-and-solutions)
    - [Timer-Based Test Failures](#timer-based-test-failures)
    - [Hover State Test Failures](#hover-state-test-failures)
    - [Translation Mock Issues](#translation-mock-issues)
    - [Event Timing Issues](#event-timing-issues)
    - [Component State Timing](#component-state-timing)
    - [Theme System Testing Challenges](#theme-system-testing-challenges)
      - [Best Practices for Theme Testing](#best-practices-for-theme-testing)
      - [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
  - [Best Practices](#best-practices)
  - [Case Study: UploadOverlay Component Testing](#case-study-uploadoverlay-component-testing)
    - [Initial Approach and Challenges](#initial-approach-and-challenges)
    - [Key Lessons Learned](#key-lessons-learned)
    - [Best Practices Derived](#best-practices-derived)
    - [Common Pitfalls to Avoid](#common-pitfalls-to-avoid-1)
    - [Recommendations for Similar Components](#recommendations-for-similar-components)

The project uses Vitest with SolidJS testing utilities. All tests are centralized in the `/src/test/__tests__/` directory and organized by functionality:

## Test Organization

1. **Component Tests**:
   Tests for UI components and their behavior
   - `ImageView.test.tsx`: Image viewer component tests
   - `TagBubble.test.tsx`: Tag component tests
   - `CaptionInput.test.tsx`: Caption input component tests
   - `ImageInfo.test.tsx`: Image information display tests
   - `Notification.test.tsx`: Notification system tests
   - `Settings.test.tsx`: Settings panel tests
   - `DeleteConfirmDialog.test.tsx`: Delete confirmation dialog tests
   - `UploadOverlay.test.tsx`: Upload overlay tests

2. **Context and State Tests**:
   Tests for application state management and context providers
   - `app.test.tsx`: App context and global state tests
   - `contexts.test.ts`: Other context providers tests
   - `gallery.test.ts`: Gallery state management tests
   - `selection.test.ts`: Selection management tests

3. **Utility Tests**:
   Tests for utility functions and helpers
   - `reactive-utils.test.tsx`: Reactive utility functions tests
   - `theme.test.ts`: Theme management tests

4. **Internationalization Tests**:
   Tests for translation and localization features
   - `translations.test.ts`: Core translation system tests
   - Language-specific plural tests:
     - `arabic-plural.test.ts`
     - `czech-plural.test.ts`
     - `hungarian-article.test.ts`
     - `polish-plural.test.ts`
     - `portuguese-plural.test.ts`
     - `russian-plural.test.ts`
     - `spanish-plural.test.ts`
     - `turkish-plural.test.ts`

When writing component tests, your test file should be added to the `/src/test/__tests__/` directory and follow the naming pattern `ComponentName.test.tsx`. You should make use of the provided test utilities from `/src/test/test-utils.ts` to maintain consistency across tests. It's important to follow the established patterns for test setup and teardown to ensure proper isolation between tests.

## Test Environment Setup

The test environment is configured in `/src/test/setup.ts`. This configuration provides a DOM environment powered by jsdom for simulating browser behavior. Global mocks are included for various browser APIs to enable testing of browser-dependent functionality. The environment is set up to automatically clean up after each test to prevent state leakage between test cases. Additionally, it includes the necessary SolidJS testing utilities setup to enable proper testing of SolidJS components and reactivity.

## Test Utilities

The project provides comprehensive test utilities in three files:

1. `/src/test/test-utils.ts`: Core test utilities and helper functions
2. `/src/test/test-hooks.ts`: Custom hooks for test setup and teardown
3. `/src/test/setup.ts`: Global test environment configuration

### Configuration

A dedicated `tsconfig.json` in the `/src/test` directory ensures proper TypeScript configuration for the test environment.

## Component Testing

When writing component tests, there are several important guidelines to follow. First, your test file should be added to the `/src/test/__tests__/` directory and follow the naming pattern `ComponentName.test.tsx`. You should make use of the provided test utilities from `/src/test/test-utils.ts` to maintain consistency across tests. It's important to follow the established patterns for test setup and teardown to ensure proper isolation between tests. Finally, related tests should be grouped together in the same file for better organization and maintainability.

Example component test structure:

```typescript
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@solidjs/testing-library";
import { useTestSetup } from "~/test/test-hooks";
import { createTestWrapper } from "~/test/test-utils";
import { ComponentName } from "~/components/ComponentName";

describe("ComponentName", () => {
  useTestSetup();

  it("should render correctly", () => {
    const { container } = render(() => <ComponentName />);
    expect(container).toMatchSnapshot();
  });

  // Group related tests
  describe("interactions", () => {
    it("should handle user input", async () => {
      const { getByRole } = render(() => <ComponentName />);
      // Test implementation...
    });
  });
});
```

## Testing Patterns

1. Context Testing:

```typescript
describe("Context Creation", () => {
  test("Context should be defined", () => {
    expect(AppContext).toBeDefined();
    expect(AppContext.id).toBeDefined();
    expect(typeof AppContext.id).toBe("symbol");
  });
});
```

2. Utility Function Testing:

```typescript
describe("Utility Function", () => {
  it("should handle normal input", () => {
    expect(utilityFunction(input)).toBe(expectedOutput);
  });

  it("should handle edge cases", () => {
    expect(utilityFunction(edgeCase)).toBe(expectedOutput);
  });

  it("should throw on invalid input", () => {
    expect(() => utilityFunction(invalidInput)).toThrow();
  });
});
```

3. i18n Testing:

```typescript
describe("Translation System", () => {
  it("should handle pluralization correctly", () => {
    const forms = {
      one: "item",
      few: "items",
      many: "items"
    };
    expect(getPlural(1, forms)).toBe("item");
    expect(getPlural(2, forms)).toBe("items");
  });
});
```

## Mocking

1. API Calls:

```typescript
vi.mock("~/resources/browse", () => ({
  fetchData: vi.fn().mockResolvedValue({ data: "mocked" }),
  saveCaptionToBackend: vi.fn().mockResolvedValue({ success: true })
}));
```

2. Browser APIs:

```typescript
beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn()
    }))
  });
});
```

3. Router:

```typescript
vi.mock("@solidjs/router", () => ({
  useParams: () => ({ path: "test/path" }),
  useSearchParams: () => [{ page: "1" }, vi.fn()],
  useNavigate: () => vi.fn()
}));
```

## Test Documentation

Each test suite should be thoroughly documented with JSDoc comments. The documentation should provide a clear description of the test suite's purpose and what functionality it aims to verify. The key areas and scenarios being tested should be outlined to give other developers context about the test coverage. Important details about the test environment setup should be included, such as any mocked dependencies or special configuration required. Additionally, any special considerations, rules, or assumptions that other developers should be aware of when maintaining or extending the tests should be documented.

Example:

```typescript
/**
 * Test suite for the Gallery State Management system.
 * 
 * These tests cover:
 * - Basic state operations
 * - Caption management
 * - Image operations
 * - Navigation and selection
 * 
 * Test Environment Setup:
 * - Mocks router functionality
 * - Mocks backend resources
 * - Mocks window resize observer
 */
```

## Common Testing Errors and Solutions

### Timer-Based Test Failures

Location: `src/components/Notification/__tests__/Notification.test.tsx`

```typescript
// Error: Timer-based test failing due to race conditions
test("auto-dismisses after timeout", () => {
  const onClose = vi.fn();
  render(() => <Notification message="Test" type="info" onClose={onClose} />);
  vi.advanceTimersByTime(3000);
  expect(onClose).toHaveBeenCalled(); // Fails intermittently
});

// Solution: Account for animation duration and ensure proper timing
test("auto-dismisses after timeout", () => {
  const onClose = vi.fn();
  render(() => <Notification message="Test" type="info" onClose={onClose} />);
  vi.advanceTimersByTime(3000); // Wait for dismiss timeout
  vi.advanceTimersByTime(300);  // Wait for animation
  expect(onClose).toHaveBeenCalled();
});
```

This error occurred because we weren't accounting for the animation duration in our timer-based tests.

### Hover State Test Failures

Location: `src/components/Notification/__tests__/Notification.test.tsx`

```typescript
// Error: Hover test failing because timer started before hover
test("pauses on hover", async () => {
  const onClose = vi.fn();
  const { container } = render(() => <Notification />);
  vi.advanceTimersByTime(100);
  await fireEvent.mouseEnter(container);
  expect(onClose).not.toHaveBeenCalled(); // Fails
});

// Solution: Hover immediately after render
test("pauses on hover", async () => {
  const onClose = vi.fn();
  const { container } = render(() => <Notification />);
  await fireEvent.mouseEnter(container);
  vi.advanceTimersByTime(3000);
  expect(onClose).not.toHaveBeenCalled();
});
```

This error occurred because the auto-dismiss timer was starting before we could establish the hover state.

### Translation Mock Issues

Location: `src/contexts/__tests__/app.test.tsx`

```typescript
// Error: Translation mock not working consistently
test("notification translates message", () => {
  const app = useAppContext();
  app.t = vi.fn(); // Don't mock at component level
});

// Solution: Mock at module level
vi.mock("~/i18n", () => ({
  getTranslationValue: (key: string) => `translated:${key}`,
}));
```

This error occurred because we were trying to mock translations at the component level instead of the module level.

### Event Timing Issues

Location: `src/components/Notification/__tests__/Notification.test.tsx`

```typescript
// Error: Event timing causing flaky tests
test("handles multiple events", async () => {
  fireEvent.mouseEnter(element);
  fireEvent.mouseLeave(element); // Events too close together
});

// Solution: Use await for events
test("handles multiple events", async () => {
  await fireEvent.mouseEnter(element);
  await fireEvent.mouseLeave(element);
});
```

This error occurred because we weren't properly awaiting event handlers.

### Component State Timing

Location: Various test files

```typescript
// Error: Testing state changes too quickly
test("updates state", () => {
  setSignal("new value");
  expect(element).toHaveText("new value"); // Fails
});

// Solution: Wait for next tick
test("updates state", async () => {
  setSignal("new value");
  await Promise.resolve();
  expect(element).toHaveText("new value");
});
```

This error occurred because we weren't waiting for SolidJS's reactive system to update.

### Theme System Testing Challenges

Location: `src/test/__tests__/theme.test.tsx`

```typescript
// Error 1: Module initialization order with vi.mock
// Problem: Using variables in mock factory that haven't been initialized
vi.mock('../../contexts/theme', () => {
  const mockImportMeta = { env: { DEV: false } }; // Error: Cannot access before initialization
  return {
    isSeasonalThemeAvailable: () => mockImportMeta.env.DEV
  };
});

// Solution: Use module-level variable for state that needs to be modified
let isDev = false; // Declare before mock
vi.mock('../../contexts/theme', () => ({
  isSeasonalThemeAvailable: () => isDev
}));
```

```typescript
// Error 2: Trying to modify import.meta.env directly
// Problem: import.meta.env is read-only in the actual module
it("should work in dev mode", () => {
  import.meta.env.DEV = true; // Error: Cannot assign to read-only property
});

// Solution: Use a separate variable for controlling dev mode
it("should work in dev mode", () => {
  isDev = true;
});
```

```typescript
// Error 3: Inconsistent localStorage mocking
// Problem: Trying to restore original localStorage causes errors
afterEach(() => {
  window.localStorage = originalLocalStorage; // Error: Cannot assign to read-only property
});

// Solution: Use a mutable object for mock storage
let mockStorage: Record<string, string> = {};
beforeEach(() => {
  mockStorage = {}; // Reset the storage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: (key: string) => mockStorage[key] || null,
      setItem: (key: string, value: string) => { mockStorage[key] = value; }
    },
    writable: true
  });
});
```

```typescript
// Error 4: Type issues with theme objects
// Problem: Missing type definitions for seasonal themes
const baseThemes = {
  light: "sun",
  dark: "moon"
}; // Error: Property 'christmas' does not exist

// Solution: Define proper types with optional seasonal themes
type ThemeIconMap = {
  light: string;
  dark: string;
  christmas?: string;
  halloween?: string;
};
```

#### Best Practices for Theme Testing

Theme testing requires careful consideration of module mocking patterns. State variables should always be declared before any `vi.mock` calls, and module-level variables should be used for state that needs modification during tests. Mock implementations should remain simple and focused, with their behavior clearly documented in test descriptions.

When dealing with environment variables, direct modification of import.meta.env should be avoided. Instead, separate variables should be used to control environment-dependent behavior. Environment variables should be mocked at the module level and their state reset in beforeEach blocks to maintain test isolation.

Storage mocking presents its own challenges that require specific patterns. A mutable object should be used for mock storage, with its state reset in beforeEach blocks. Attempting to restore the original localStorage should be avoided. Instead, Object.defineProperty should be used for window object mocks to ensure proper behavior.

Type safety is crucial for maintaining reliable tests. Theme objects need proper type definitions with optional properties for seasonal themes. TypeScript should be leveraged to catch potential issues early, and types must be kept in sync with the implementation to prevent runtime errors.

Date mocking requires special attention when testing seasonal themes. A proper Date mock should be used, with the mock being reset in afterEach blocks. Tests should account for timezone implications and include edge cases around season boundaries to ensure robust coverage.

#### Common Pitfalls to Avoid

Module initialization requires careful attention to avoid common issues. Variables used in mock factories must be initialized before use, and import order should not be relied upon for mock behavior. Dynamic and static mock data should not be mixed, and mocked modules should remain unmodified after initialization.

State management demands careful consideration to maintain test isolation. State should not be shared between tests without explicit reset mechanisms. Initial state should never be assumed, and state changes must not leak between tests. Direct modification of global objects should be avoided to prevent unexpected side effects.

Environment handling requires careful consideration of system constraints. Read-only properties should not be modified, and development mode should not be assumed. Environment and feature flags should remain separate concerns. Environment values should be configurable rather than hardcoded.

Type definitions must be handled with precision. Incomplete types should be avoided, and TypeScript errors should not be ignored. Theme type definitions should remain consistent throughout the codebase, and type casting should only be done with proper validation.

Testing should maintain isolation and independence between test cases. All mocked state should be reset between tests to prevent interference. Proper TypeScript types should be used consistently. Complex mock setups require clear documentation. Both development and production modes need testing coverage. Seasonal theme logic should account for edge cases. A consistent mocking approach should be maintained across the test suite.

## Best Practices

Timer management in tests requires careful attention to timing details. Animation durations must be accounted for in test timing. Separate `vi.advanceTimersByTime()` calls should be used to maintain clarity. Long timeouts should be broken down into logical chunks for better test comprehension.

Event handling requires proper asynchronous patterns. All `fireEvent` calls should be awaited to ensure proper sequencing. Events should be handled in sequence rather than simultaneously. The natural timing of user interactions should be considered when structuring tests.

State changes need careful handling of timing and updates. Tests should wait for the next tick after state changes using `Promise.resolve()` or `queueMicrotask()`. Batched updates must be considered to ensure proper test behavior.

Mocking should be implemented at the module level rather than the component level. The `vi.mock()` function should be called before tests begin. Mock implementations should maintain consistency throughout the test suite.

Asynchronous testing requires proper handling of promises and timing. Tests should be made async when dealing with events. Proper async/await patterns should be used consistently. All promises must be handled appropriately to prevent test flakiness.

Component lifecycle testing requires attention to timing details. Mount and unmount timing must be considered. Cleanup effects should be properly tested. Both initial mount and subsequent update scenarios require test coverage.

Testing should begin before bug fixes are implemented. Edge cases and error conditions require thorough coverage. Tests should remain focused and isolated. Test descriptions should clearly convey their purpose. Complex test setups need proper documentation. Test updates should accompany functionality modifications.

## Case Study: UploadOverlay Component Testing

This case study demonstrates common testing challenges and their solutions through the implementation of the UploadOverlay component tests.

### Initial Approach and Challenges

1. **CSS Module Testing Issues**

```typescript
// Initial attempt: Testing CSS module classes directly
it("should have proper theme-aware styles", () => {
  const { container } = render(() => <UploadOverlay isVisible={true} />);
  const overlay = container.firstChild as HTMLElement;
  const styles = window.getComputedStyle(overlay);
  expect(styles.background).toContain("var(--card-bg)"); // Failed
});

// Problem: CSS modules generate unique class names, and styles aren't computed in jsdom
// Solution: Use data-testid attributes instead
it("should render correctly", () => {
  const { getByTestId } = render(() => <UploadOverlay isVisible={true} />);
  expect(getByTestId("upload-overlay")).toBeInTheDocument();
});
```

2. **Visibility State Changes**

```typescript
// Initial attempt: Using cleanup and re-render
it("should handle visibility changes", () => {
  const { container } = render(() => <UploadOverlay isVisible={false} />);
  cleanup();
  render(() => <UploadOverlay isVisible={true} />); // Lost component reference
});

// Solution: Use SolidJS createSignal for reactive state changes
it("should handle visibility changes correctly", () => {
  const [isVisible, setIsVisible] = createSignal(false);
  const TestWrapper = () => <UploadOverlay isVisible={isVisible()} />;
  const { queryByTestId } = render(TestWrapper);
  
  setIsVisible(true);
  expect(queryByTestId("upload-overlay")).toBeInTheDocument();
});
```

3. **Element Querying Strategy**

```typescript
// Initial attempt: Using querySelector with class names
const overlay = container.querySelector('.overlay'); // Unreliable with CSS modules

// Solution: Using data-testid attributes
const overlay = getByTestId("upload-overlay"); // Reliable and explicit
```

### Key Lessons Learned

When testing styling and themes, it's important to avoid testing computed styles in the jsdom environment, as these tests can be unreliable. Instead, focus on testing the structure and functionality of components. Use data attributes for element selection to ensure reliable test targeting. Consider implementing visual regression testing for comprehensive style verification.

Component state management requires careful consideration of SolidJS's reactive nature. Use SolidJS's reactive primitives like `createSignal` to properly handle state changes in tests. Maintain component references through state updates to prevent losing track of components. Test both the initial state and state transitions thoroughly to ensure components behave correctly through their lifecycle. Always keep in mind the reactive nature of the framework when writing tests.

For element selection strategy, prefer using `data-testid` attributes over class names since they provide more reliable and explicit targeting. Use `getByTestId` when testing for elements that should definitely exist in the DOM, and `queryByTestId` for elements that may or may not be present. Keep your selectors independent of the styling implementation to prevent brittle tests that break when styles change.

Test structure and organization should follow logical groupings that make the test suite easy to understand and maintain. Write tests for both positive and negative cases to ensure comprehensive coverage. Include accessibility checks to verify ARIA attributes and roles are correctly implemented. Keep component structure verification separate from behavior testing to maintain clear separation of concerns.

### Best Practices Derived

1. **Component Setup**:
   ```typescript
   // Add data-testid attributes to testable elements
   <div 
     class={styles.overlay} 
     data-testid="upload-overlay"
     role="dialog"
   >
   ```

2. **State Testing**:
   ```typescript
   // Use createSignal for reactive state changes
   const [isVisible, setIsVisible] = createSignal(false);
   const TestWrapper = () => <UploadOverlay isVisible={isVisible()} />;
   ```

3. **Element Queries**:
   ```typescript
   // Use appropriate query methods based on expectations
   expect(queryByTestId("upload-overlay")).not.toBeInTheDocument(); // For absent elements
   expect(getByTestId("upload-overlay")).toBeInTheDocument(); // For present elements
   ```

4. **Accessibility Testing**:
   ```typescript
   // Include ARIA attribute checks
   expect(overlay).toHaveAttribute('role', 'dialog');
   expect(overlay).toHaveAttribute('aria-label', 'Drop files to upload');
   ```

### Common Pitfalls to Avoid

When writing tests, there are several important pitfalls to avoid regarding style testing. Testing computed styles in jsdom should be avoided, as should relying on CSS module class names or testing implementation details of styling.

For state management, avoid using cleanup/re-render for state changes. Focus on testing observable behavior rather than internal state, and don't make assumptions about immediate state updates. The reactive nature of SolidJS requires careful consideration of state timing.

Element selection requires thoughtful approaches. Class names should not be used for element selection, and tests should not rely on DOM structure that might change. Keep styling and testing concerns separate to maintain test reliability.

Test isolation is critical for maintaining a robust test suite. State should not be shared between tests, and no assumptions should be made about test order. Each test should handle its own cleanup rather than relying on other tests.

### Recommendations for Similar Components

When testing overlay or modal-like components, visibility testing is a key consideration. Tests should verify both visible and hidden states, ensure proper cleanup occurs on hide, and check transition states where relevant.

Accessibility testing is essential for any component. This includes verifying ARIA attributes are correctly implemented, testing keyboard navigation functionality, and ensuring proper screen reader compatibility.

The component structure must be thoroughly validated. Tests should verify the proper component hierarchy is maintained, check that all required child elements are present, and validate that content renders as expected.

Integration testing verifies how components work together. This includes testing interactions between parent and child components, verifying event handling works correctly, and checking that state changes propagate appropriately through the component tree.

When writing tests, maintain focus and isolation between test cases. Use appropriate selectors and queries for reliable element targeting. Include both success and failure test cases to ensure comprehensive coverage. Accessibility checks should be a standard part of the test suite. Document any assumptions and requirements clearly to help future maintenance.

### JSX Transform Configuration Issues

Location: `vitest.config.ts` and test files

```typescript
// Error 1: JSX import source warning
// Problem: The JSX import source cannot be set without also enabling React's "automatic" JSX transform
/** @jsxImportSource solid-js */  // Warning: JSX import source cannot be set
import { render } from "@solidjs/testing-library";

// Solution: Configure JSX transform in vitest.config.ts instead
export default defineConfig({
  plugins: [solidPlugin()],
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'solid-js'
  }
});

// Then remove @jsxImportSource from test files
/// <reference types="vitest/globals" />
/// <reference types="@solidjs/testing-library" />
import { render } from "@solidjs/testing-library";
```

This error occurs when trying to configure the JSX transform at the file level using the `@jsxImportSource` pragma. The warning indicates that the JSX transform needs to be configured at the build tool level instead.

Key points about the solution:
- Move JSX configuration to `vitest.config.ts`
- Configure both `jsx: 'automatic'` and `jsxImportSource: 'solid-js'`
- Remove `@jsxImportSource` pragmas from individual test files
- Keep necessary type references for Vitest and testing library
- Update test dependencies to include `@solidjs/testing-library`

The configuration in `vitest.config.ts` ensures:
- Proper JSX transform for SolidJS
- Correct type checking
- Consistent behavior across all test files
- Integration with the testing library

Common mistakes to avoid:
- Don't mix file-level and config-level JSX settings
- Don't remove necessary type references
- Don't forget to include testing library in dependencies
- Don't assume JSX transform settings from `tsconfig.json` are sufficient for tests
