# Writing Tests

The project uses Vitest with SolidJS testing utilities. Tests are placed in `__tests__` directories alongside the code they're testing. Each test file should follow the pattern `*.test.ts` or `*.test.tsx`.

## Test Environment Setup

The global test environment is configured in `src/test/setup.ts` and includes:
- DOM environment with jsdom
- Global mocks for browser APIs (matchMedia, ResizeObserver, etc.)
- Automatic cleanup after each test
- SolidJS testing utilities setup

```typescript
import "@testing-library/jest-dom";
import { vi } from "vitest";
import { cleanup } from "@solidjs/testing-library";

beforeAll(() => {
  setupGlobalMocks();
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
```

## Test Utilities

Common test utilities are provided in `src/test/test-utils.ts` and `src/test/test-hooks.ts`:

1. Standard test wrapper components:

```typescript
export const TestWrapper: Component<{ context: any; children: any }> = (props) => {
  return (
    <AppContext.Provider value={props.context}>
      {props.children}
    </AppContext.Provider>
  );
};
```

2. Test hooks for common setup patterns:

```typescript
export function useBasicTestSetup() {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });
}

export function useResourceTestSetup() {
  useBasicTestSetup();
  // Additional resource-specific setup...
}
```

## Component Testing

Component tests should use `@solidjs/testing-library` and follow these patterns:

1. Basic component testing:

```typescript
describe("Component Name", () => {
  it("should render correctly", () => {
    const { container } = render(() => <Component prop={value} />);
    expect(container).toMatchSnapshot();
  });

  it("should handle user interactions", async () => {
    const { getByRole } = render(() => <Component />);
    const button = getByRole("button");
    await fireEvent.click(button);
    expect(result).toBe(expectedValue);
  });
});
```

2. Testing with context:

```typescript
describe("Component with Context", () => {
  const mockContext = {
    // Mock context values...
  };

  it("should use context correctly", () => {
    const { container } = render(() => (
      <TestWrapper context={mockContext}>
        <Component />
      </TestWrapper>
    ));
    // Assertions...
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