# Overlay Transitions

The overlay CSS property is used in yipyap to create smooth transitions for elements that appear in the top layer, such as modals, popovers, and dialogs. This document outlines best practices and implementation details for using overlay transitions in the application.

## Table of Contents

---

- [Overlay Transitions](#overlay-transitions)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Implementation](#implementation)
    - [Basic Structure](#basic-structure)
    - [Required Components](#required-components)
    - [Example Implementation](#example-implementation)
  - [Best Practices](#best-practices)
  - [Browser Support](#browser-support)
  - [Common Issues](#common-issues)
    - [Missing Entry Animation](#missing-entry-animation)
    - [Flickering During Exit](#flickering-during-exit)
  - [Related Documentation](#related-documentation)
  - [References](#references)

## Overview

---

The `overlay` property specifies whether an element appearing in the top layer is rendered in that layer. While this property cannot be directly set through CSS (it's controlled by the browser), it can be included in transition properties to create smooth animations when elements enter or exit the top layer.

## Implementation

---

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

---

When implementing overlay transitions, it's essential to include both `overlay` and `display` properties in transitions for top-layer elements, and utilize `@starting-style` rules to ensure smooth entry animations. The transitions should be kept under 400ms to maintain an optimal user experience that feels responsive and natural.

For modal elements specifically, consider implementing backdrop transitions to enhance the visual hierarchy, and always test transitions across different browsers since overlay support is still experimental. Proper testing across browsers will help ensure a consistent experience for all users regardless of their browser choice.

## Browser Support

---

The overlay property is currently experimental and supported in:

- Chrome 117+
- Edge 117+
- Opera 103+
- Chrome Android 117+
- Samsung Internet 24.0+

For browsers without support, ensure graceful fallbacks are in place.

## Common Issues

---

### Missing Entry Animation

If your entry animation isn't functioning properly, there are several key things to verify. Make sure you've included the `@starting-style` rule in your CSS, as this is essential for smooth entry animations. Additionally, check that you've added the `allow-discrete` keyword to your transition declaration, which enables proper handling of discrete property animations. Finally, confirm that both the `overlay` and `display` properties are included in your transition list, as these are required for proper top-layer animations.

### Flickering During Exit

Elements flickering during exit animations can be resolved by taking a few key steps. First, make sure that the `display` property is included in your transition declaration, as this is essential for smooth exit animations. Next, carefully check that all properties in the transition have matching durations to ensure synchronized timing. Finally, verify that the `allow-discrete` keyword is properly set in your transition, as this enables proper handling of discrete property animations.

## Related Documentation

---

- [Backdrop Filter Documentation](backdrop-filter.md)
- [Theming Documentation](theming.md)

## References

---

For more detailed information about overlay transitions, refer to:

- [MDN Web Docs - overlay](https://developer.mozilla.org/en-US/docs/Web/CSS/overlay)
- [Chrome Developers - Entry/Exit Animations](https://developer.chrome.com/blog/entry-exit-animations/)
