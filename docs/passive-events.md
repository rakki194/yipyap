# Passive Event Listeners

Passive event listeners are a crucial performance optimization feature in yipyap, particularly important for smooth scrolling and touch interactions. This document outlines our implementation approach and best practices.

## Overview

Passive event listeners allow the browser to optimize event handling by indicating that a listener will not call `preventDefault()`. This enables the browser to immediately begin scrolling operations without waiting for JavaScript execution, significantly improving scroll performance.

## Implementation Guidelines

When adding event listeners in yipyap, follow these principles:

```typescript
// Preferred - explicitly declare passive for scroll/touch events
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('wheel', handler, { passive: true });

// Only use non-passive when preventDefault is required
element.addEventListener('touchstart', handler, { passive: false });
```

## When to Use Passive Listeners

Use passive listeners for:
- Scroll events (`wheel`, `touchstart`, `touchmove`)
- Touch events when not preventing default behavior
- Performance-critical event handlers
- Analytics and tracking code

Do not use passive listeners when:
- You need to call `preventDefault()`
- Implementing custom scroll behavior
- Building drag-and-drop interfaces
- Handling gesture interactions

## Performance Impact

Passive event listeners can improve scroll performance by:
- Reducing main thread blocking
- Enabling immediate scroll initiation
- Decreasing input latency
- Improving frames per second during scroll

## Browser Support

Yipyap supports passive event listeners across all modern browsers:
- Chrome/Edge: 51+
- Firefox: 49+
- Safari: 10+
- iOS Safari: 10+
- Android Browser: 51+

## Implementation Examples

```typescript
// Gallery scroll handling
const useGalleryScroll = () => {
  onMount(() => {
    const handler = (e: WheelEvent) => {
      // Scroll handling logic
    };
    
    // Use passive listener for better performance
    window.addEventListener('wheel', handler, { passive: true });
    
    onCleanup(() => {
      window.addEventListener('wheel', handler);
    });
  });
};

// Touch interaction handling
const useTouchInteraction = () => {
  onMount(() => {
    const touchHandler = (e: TouchEvent) => {
      // Touch handling logic that doesn't prevent default
    };
    
    element.addEventListener('touchstart', touchHandler, { passive: true });
    element.addEventListener('touchmove', touchHandler, { passive: true });
    
    onCleanup(() => {
      element.removeEventListener('touchstart', touchHandler);
      element.removeEventListener('touchmove', touchHandler);
    });
  });
};
```

## Best Practices

1. Always explicitly declare the `passive` option rather than relying on defaults
2. Use TypeScript's `EventListenerOptions` type for proper type checking
3. Consider performance implications when setting `passive: false`
4. Test scrolling performance with and without passive listeners
5. Monitor console for warnings about preventDefault calls in passive listeners

## Common Pitfalls

- Attempting to call `preventDefault()` in a passive listener (will be ignored)
- Forgetting to remove event listeners during cleanup
- Using non-passive listeners unnecessarily
- Not testing on touch devices

## Related Documentation

- [Performance Documentation](performance.md)
- [Event Handling Guide](event-handling.md)
- [Touch Interaction Guide](touch-interactions.md) 