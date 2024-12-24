# Tooltip System: Troubleshooting and Best Practices

This document covers common issues, solutions, and best practices for working with the Tooltip system in yipyap.

## Common Issues and Solutions

### 1. Timing Issues

#### Problem: Tooltip appears too quickly/slowly
```typescript
// Default behavior is 1.5s delay
const showTooltip = () => {
  timeoutId = setTimeout(() => setIsVisible(true), 1500);
};
```

**Solution:**
- The 1.5s delay is intentional for user experience
- Ensure no conflicting timeouts
- Clear timeouts properly on cleanup

#### Problem: Animation feels abrupt
```css
.tooltip-content {
  transition: opacity 0.2s ease-out;  /* Too short */
}
```

**Solution:**
- Use 0.4s for fade-in
- Use 0.2s for fade-out
- Include transform in transitions
- Use ease-out timing function

### 2. Visibility Issues

#### Problem: Tooltip doesn't fade smoothly
```typescript
// Incorrect: Using Show component
<Show when={isVisible()}>
  <div class="tooltip-content">...</div>
</Show>
```

**Solution:**
- Use CSS visibility and opacity
- Keep element mounted
- Use aria-hidden for accessibility
```typescript
// Correct approach
<div 
  class="tooltip-content"
  aria-hidden={!isVisible()}
>
  ...
</div>
```

#### Problem: Blur effect not working
```css
.tooltip-content {
  background: rgba(0, 0, 0, 0.5);  /* Missing blur */
}
```

**Solution:**
- Add backdrop-filter
- Provide fallback for older browsers
```css
.tooltip-content {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  /* Fallback for browsers without backdrop-filter */
  @supports not (backdrop-filter: blur(4px)) {
    background: rgba(0, 0, 0, 0.8);
  }
}
```

### 3. Accessibility Issues

#### Problem: Screen reader announces tooltip too early
```typescript
<div role="tooltip">  /* Missing aria-hidden */
  {content}
</div>
```

**Solution:**
- Use proper aria-hidden state
- Ensure role="tooltip"
- Manage focus appropriately

### 4. Performance Issues

#### Problem: Janky animations
```css
.tooltip-content {
  transition: all 0.3s;  /* Too generic */
}
```

**Solution:**
- Specify exact properties to animate
- Use transform and opacity
- Enable hardware acceleration
```css
.tooltip-content {
  transform: scale(0.98);
  opacity: 0;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  will-change: transform, opacity;
}
```

## Best Practices

### 1. Content Guidelines

```typescript
// Good
<Tooltip content="Brief, helpful description">
  <button>Action</button>
</Tooltip>

// Bad
<Tooltip content="Very long explanation that doesn't fit the fixed-position style">
  <button>Action</button>
</Tooltip>
```

- Keep content concise
- Consider fixed positioning constraints
- Use clear, actionable text
- Support internationalization

### 2. Interaction Guidelines

```typescript
// Good: Clear hover target
<Tooltip content="Help text">
  <button class="interactive-element">Action</button>
</Tooltip>

// Bad: Unclear hover target
<Tooltip content="Help text">
  <div>Non-interactive content</div>
</Tooltip>
```

- Use on interactive elements
- Consider the 1.5s delay in UX design
- Test with keyboard navigation
- Ensure proper focus states

### 3. Performance Guidelines

```typescript
// Good: Static content
<Tooltip content={staticText}>
  <button>Action</button>
</Tooltip>

// Avoid: Dynamic content that changes frequently
<Tooltip content={computeExpensiveValue()}>
  <button>Action</button>
</Tooltip>
```

- Use static content when possible
- Clean up timeouts properly
- Minimize DOM updates
- Use hardware acceleration

### 4. Accessibility Guidelines

```typescript
// Good
<Tooltip content="Additional information">
  <button aria-label="Primary action">
    <span class="visually-hidden">Action</span>
    <span aria-hidden="true">→</span>
  </button>
</Tooltip>
```

- Maintain proper ARIA attributes
- Test with screen readers
- Ensure keyboard accessibility
- Consider focus indicators

## Testing Guidelines

### Unit Tests

```typescript
describe("Tooltip", () => {
  it("should show after delay", async () => {
    const { getByText } = render(() => (
      <Tooltip content="Test">
        <button>Hover</button>
      </Tooltip>
    ));
    
    const trigger = getByText("Hover");
    fireEvent.mouseEnter(trigger);
    
    // Wait for the 1.5s delay
    await new Promise(r => setTimeout(r, 1500));
    
    expect(screen.getByRole("tooltip")).not.toHaveAttribute("aria-hidden", "true");
  });
});
```

### Visual Tests

```typescript
// Test transition timing
test("tooltip transitions properly", async () => {
  const { getByText } = render(() => (
    <Tooltip content="Test">
      <button>Hover</button>
    </Tooltip>
  ));
  
  const trigger = getByText("Hover");
  fireEvent.mouseEnter(trigger);
  
  // Check initial state
  let tooltip = screen.getByRole("tooltip");
  expect(tooltip).toHaveStyle({ opacity: "0" });
  
  // Wait for delay and transition
  await new Promise(r => setTimeout(r, 1900)); // 1.5s delay + 0.4s transition
  expect(tooltip).toHaveStyle({ opacity: "1" });
});
```

## Future Considerations

1. **Enhanced Interaction**
   - Optional delay configuration
   - Click to pin functionality
   - Touch-specific behaviors

2. **Visual Enhancements**
   - Dynamic backdrop blur strength
   - Transition variations
   - Theme-specific styling

3. **Accessibility**
   - Enhanced screen reader support
   - Focus management improvements
   - High contrast support 