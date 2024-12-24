# Tooltip System: Troubleshooting and Best Practices

This document covers common issues, solutions, and best practices for working with the Tooltip system in yipyap.

## Common Issues and Solutions

### Timing Issues

#### Problem: Tooltip appears too quickly/slowly
```typescript
// Default behavior is 0.5s delay
const showTooltip = () => {
  timeoutId = setTimeout(() => setIsVisible(true), 500);
};
```

**Solution:**
The 0.5 second delay is intentionally designed to provide an optimal user experience. When implementing tooltips, it's important to ensure there are no conflicting timeouts that could interfere with this delay. Additionally, proper cleanup of timeouts should be performed when components unmount to prevent memory leaks and unexpected behavior.

#### Problem: Animation feels abrupt
```css
.tooltip-content {
  transition: opacity 0.2s ease-out;  /* Too short */
}
```

**Solution:**
For optimal tooltip animations, use a 0.4 second duration for the fade-in transition to ensure a smooth appearance that doesn't feel rushed. The fade-out transition should be slightly faster at 0.2 seconds to provide quick visual feedback when the tooltip is dismissed. Always include transform properties in the transition to enable hardware acceleration and smoother animations. The ease-out timing function should be used to create natural-feeling motion that starts quickly and gently decelerates.

### Visibility Issues

#### Problem: Tooltip doesn't fade smoothly
```typescript
// Incorrect: Using Show component
<Show when={isVisible()}>
  <div class="tooltip-content">...</div>
</Show>
```

**Solution:**
To properly handle tooltip visibility, use CSS visibility and opacity properties together. The tooltip element should remain mounted in the DOM rather than being conditionally rendered. This allows for smooth transitions and animations. Additionally, use the aria-hidden attribute to ensure proper accessibility by hiding the tooltip from screen readers when it is not visible.

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
To implement proper blur effects, add a backdrop-filter property to create a frosted glass effect behind the tooltip content. For browsers that don't support backdrop-filter, provide a fallback by using a darker background color with higher opacity to maintain readability.

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

### Accessibility Issues

#### Problem: Screen reader announces tooltip too early
```typescript
<div role="tooltip">  /* Missing aria-hidden */
  {content}
</div>
```

**Solution:**
Proper accessibility requires setting the aria-hidden attribute to control when screen readers announce the tooltip content. The tooltip element should have role="tooltip" to indicate its purpose to assistive technologies. Focus management is also critical - the tooltip should only be announced when the triggering element receives focus, and focus should return to the trigger when the tooltip is dismissed.

### Performance Issues

#### Problem: Janky animations

```css
.tooltip-content {
  transition: all 0.3s;  /* Too generic */
}
```

**Solution:**
For optimal animation performance, it's important to be specific about which properties are being animated. Rather than using a catch-all transition, explicitly target transform and opacity properties which are optimized for smooth animations.

```css
.tooltip-content {
  transform: scale(0.98);
  opacity: 0;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
  will-change: transform, opacity;
}
```

## Best Practices

### Content Guidelines

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

### Interaction Guidelines

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

### Performance Guidelines

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

### Accessibility Guidelines

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
