# Writing Tests

## Table of Contents
- [Test Organization](#test-organization)
  - [Component Tests](#component-tests)
  - [Context and State Tests](#context-and-state-tests)
  - [Utility Tests](#utility-tests)
  - [i18n Tests](#i18n-tests)
  - [Hook Tests](#hook-tests)
- [Test Environment Setup](#test-environment-setup)
- [Test Utilities](#test-utilities)
  - [Configuration](#configuration)
- [Component Testing](#component-testing)
- [Testing Patterns](#testing-patterns)
- [Mocking](#mocking)
- [Test Documentation](#test-documentation)
- [Common Testing Errors and Solutions](#common-testing-errors-and-solutions)
  - [Timer-Based Test Failures](#1-timer-based-test-failures)
  - [Hover State Test Failures](#2-hover-state-test-failures)

The project uses Vitest with SolidJS testing utilities. All tests are centralized in the `/src/test/__tests__/` directory and organized by functionality:

## Test Organization

1. **Component Tests**:
   - `ImageView.test.tsx`: Image viewer component
   - `TagBubble.test.tsx`: Tag component
   - `CaptionInput.test.tsx`: Caption input component
   - `ImageInfo.test.tsx`: Image information display
   - `Notification.test.tsx`: Notification system
   - `Settings.test.tsx`: Settings panel
   - `DeleteConfirmDialog.test.tsx`: Delete confirmation dialog

2. **Context and State Tests**:
   - `app.test.tsx`: App context tests
   - `contexts.test.ts`: Other contexts
   - `gallery.test.ts`: Gallery state
   - `selection.test.ts`: Selection management

3. **Utility Tests**:
   - `reactive-utils.test.tsx`: Reactive utility functions
   - `theme.test.ts`: Theme management

4. **i18n Tests**:
   - `translations.test.ts`: Core translation system
   - Language-specific tests:
     - `arabic-plural.test.ts`
     - `czech-plural.test.ts`
     - `hungarian-article.test.ts`
     - `polish-plural.test.ts`
     - And more...

5. **Hook Tests**:
   - `useConnectionStatus.test.tsx`: Connection status hook

## Test Environment Setup

The test environment is configured in `/src/test/setup.ts` and includes:
- DOM environment with jsdom
- Global mocks for browser APIs
- Automatic cleanup after each test
- SolidJS testing utilities setup

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

Each test suite should include a JSDoc comment describing:
- Purpose of the test suite
- Key areas being tested
- Test environment setup
- Any special considerations or rules

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

### 1. Timer-Based Test Failures

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

### 2. Hover State Test Failures

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

### 3. Translation Mock Issues

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

### 4. Event Timing Issues

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

### 5. Component State Timing

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

## Best Practices

1. **Timer Management**:
   - Always account for animation durations
   - Use separate `vi.advanceTimersByTime()` calls for clarity
   - Consider breaking down long timeouts into logical chunks

2. **Event Handling**:
   - Always `await` fireEvent calls
   - Handle events in sequence, not simultaneously
   - Consider the natural timing of user interactions

3. **State Changes**:
   - Wait for the next tick after state changes
   - Use `Promise.resolve()` or `queueMicrotask()`
   - Consider batched updates

4. **Mocking**:
   - Mock at module level, not component level
   - Use `vi.mock()` before tests
   - Be consistent with mock implementations

5. **Async Testing**:
   - Make tests async when dealing with events
   - Use proper async/await patterns
   - Handle all promises appropriately

6. **Component Lifecycle**:
   - Consider mounting/unmounting timing
   - Account for cleanup effects
   - Test both mount and update scenarios

Remember to:
- Write tests before fixing bugs
- Test edge cases and error conditions
- Keep tests focused and isolated
- Use meaningful test descriptions
- Document complex test setups
- Update tests when modifying functionality 

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

1. **Testing Styling and Themes**:
   - Avoid testing computed styles in jsdom environment
   - Focus on testing structure and functionality instead
   - Use data attributes for element selection
   - Consider visual regression testing for style verification

2. **Component State Management**:
   - Use SolidJS's reactive primitives (`createSignal`) for state changes
   - Maintain component references through state updates
   - Test both initial state and state transitions
   - Consider the reactive nature of the framework

3. **Element Selection Strategy**:
   - Prefer `data-testid` attributes over class names
   - Use `getByTestId` for elements that should exist
   - Use `queryByTestId` for elements that might not exist
   - Keep selectors independent of styling implementation

4. **Test Structure and Organization**:
   - Group related tests logically
   - Test both positive and negative cases
   - Include accessibility checks
   - Verify component structure separately from behavior

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

1. **Style Testing**:
   - Don't test computed styles in jsdom
   - Don't rely on CSS module class names
   - Don't test implementation details of styling

2. **State Management**:
   - Don't use cleanup/re-render for state changes
   - Don't test internal state, test observable behavior
   - Don't assume immediate state updates

3. **Element Selection**:
   - Don't use class names for element selection
   - Don't rely on DOM structure that might change
   - Don't mix styling and testing concerns

4. **Test Isolation**:
   - Don't share state between tests
   - Don't assume test order
   - Don't leave cleanup to other tests

### Recommendations for Similar Components

When testing overlay or modal-like components:

1. **Visibility Testing**:
   - Test both visible and hidden states
   - Verify proper cleanup on hide
   - Check transition states if relevant

2. **Accessibility**:
   - Include ARIA attribute checks
   - Verify keyboard navigation
   - Test screen reader compatibility

3. **Structure**:
   - Verify proper component hierarchy
   - Check for required child elements
   - Validate content rendering

4. **Integration**:
   - Test interaction with parent components
   - Verify event handling
   - Check state propagation

Remember to:
- Keep tests focused and isolated
- Use appropriate selectors and queries
- Test both success and failure cases
- Include accessibility checks
- Document test assumptions and requirements 