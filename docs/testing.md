# Writing Tests

The project uses Vitest with SolidJS testing utilities. All tests are centralized in the `/src/test/__tests__/` directory and organized by functionality:

## Test Organization

1. **Component Tests**:
   - `ImageView.test.tsx` (6.3KB): Image viewer component
   - `TagBubble.test.tsx` (7.6KB): Tag component
   - `CaptionInput.test.tsx` (8.9KB): Caption input component
   - `ImageInfo.test.tsx` (3.0KB): Image information display
   - `Notification.test.tsx` (4.8KB): Notification system
   - `Settings.test.tsx` (9.3KB): Settings panel
   - `DeleteConfirmDialog.test.tsx` (5.7KB): Delete confirmation dialog

2. **Context and State Tests**:
   - `app.test.tsx` (5.9KB): App context tests
   - `contexts.test.ts` (5.7KB): Other contexts
   - `gallery.test.ts` (9.1KB): Gallery state
   - `selection.test.ts` (9.6KB): Selection management

3. **Utility Tests**:
   - `reactive-utils.test.tsx` (5.0KB): Reactive utility functions
   - `theme.test.ts` (5.6KB): Theme management

4. **i18n Tests**:
   - `translations.test.ts` (4.9KB): Core translation system
   - Language-specific tests:
     - `arabic-plural.test.ts` (2.5KB)
     - `czech-plural.test.ts` (2.1KB)
     - `hungarian-article.test.ts` (3.6KB)
     - `polish-plural.test.ts` (2.0KB)
     - And more...

5. **Hook Tests**:
   - `useConnectionStatus.test.tsx` (4.2KB): Connection status hook

## Test Environment Setup

The test environment is configured in `/src/test/setup.ts` and includes:
- DOM environment with jsdom
- Global mocks for browser APIs
- Automatic cleanup after each test
- SolidJS testing utilities setup

## Test Utilities

The project provides comprehensive test utilities in three files:

1. `/src/test/test-utils.ts`: Core test utilities and helper functions (6.4KB)
2. `/src/test/test-hooks.ts`: Custom hooks for test setup and teardown (1.5KB)
3. `/src/test/setup.ts`: Global test environment configuration (1.7KB)

### Configuration

A dedicated `tsconfig.json` in the `/src/test` directory ensures proper TypeScript configuration for the test environment.

## Component Testing

When writing component tests, follow these guidelines:

1. Add your test file to `/src/test/__tests__/` with the naming pattern `ComponentName.test.tsx`
2. Use the provided test utilities from `/src/test/test-utils.ts`
3. Follow the established patterns for setup and teardown
4. Group related tests in the same file
5. Keep file sizes manageable (most component tests are 3-9KB)

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