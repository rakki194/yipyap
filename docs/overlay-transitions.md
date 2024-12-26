# Overlay Transitions

The overlay CSS property is used in yipyap to create smooth transitions for elements that appear in the top layer, such as modals, popovers, and dialogs. This document outlines best practices and implementation details for using overlay transitions in the application.

## Overview

The `overlay` property specifies whether an element appearing in the top layer is rendered in that layer. While this property cannot be directly set through CSS (it's controlled by the browser), it can be included in transition properties to create smooth animations when elements enter or exit the top layer.

## Implementation

### Basic Structure

To implement an overlay transition, include both `overlay` and `display` in your transition properties with `allow-discrete`:

```css
.modal {
  transition:
    opacity 0.3s,
    transform 0.3s,
    overlay 0.3s allow-discrete,
    display 0.3s allow-discrete;
}
```

### Required Components

For a complete overlay transition, you need:

1. Initial state properties
2. Final state properties
3. Starting styles for entry animation
4. Transition properties with `allow-discrete`

### Example Implementation

```css
/* Initial state */
.modal {
  opacity: 0;
  transform: scale(0.9);
  transition:
    opacity 0.3s,
    transform 0.3s,
    overlay 0.3s allow-discrete,
    display 0.3s allow-discrete;
}

/* Final state */
.modal[data-show] {
  opacity: 1;
  transform: scale(1);
}

/* Starting styles for entry animation */
@starting-style {
  .modal[data-show] {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

## Best Practices

1. Always include both `overlay` and `display` in transitions for top-layer elements
2. Use `@starting-style` to ensure smooth entry animations
3. Keep transitions under 400ms for optimal user experience
4. Consider adding backdrop transitions for modal elements
5. Test transitions across different browsers due to experimental support

## Browser Support

The overlay property is currently experimental and supported in:
- Chrome 117+
- Edge 117+
- Opera 103+
- Chrome Android 117+
- Samsung Internet 24.0+

For browsers without support, ensure graceful fallbacks are in place.

## Common Issues

### Missing Entry Animation

If the entry animation isn't working, check that you've:
1. Included `@starting-style`
2. Added `allow-discrete` to the transition
3. Included both `overlay` and `display` in the transition

### Flickering During Exit

If elements flicker during exit animation:
1. Ensure `display` is included in the transition
2. Verify the transition duration matches for all properties
3. Check that `allow-discrete` is set correctly

## Related Documentation

- [Backdrop Filter Documentation](backdrop-filter.md)
- [Theming Documentation](theming.md)

## References

For more detailed information about overlay transitions, refer to:
- [MDN Web Docs - overlay](https://developer.mozilla.org/en-US/docs/Web/CSS/overlay)
- [Chrome Developers - Entry/Exit Animations](https://developer.chrome.com/blog/entry-exit-animations/) 
