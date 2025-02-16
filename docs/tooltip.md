# Tooltip System Documentation

The Tooltip system in yipyap provides a reusable, accessible, and customizable way to display contextual information when users hover over or focus on elements. The system is built with SolidJS and follows modern accessibility guidelines.

## Features

- Fixed positioning in the bottom right corner for consistent placement
- Delayed appearance (1.5s) for intentional interactions
- Smooth fade in (0.4s) and out (0.2s) transitions
- Semi-transparent background with blur effect
- Accessible by default (ARIA attributes, keyboard navigation)
- Theme-aware styling with CSS variables
- Touch device support

## Technical Implementation

### Component Structure

```typescript
interface TooltipProps {
  content: string;          // The text content to display in the tooltip
  children: JSX.Element;    // The element that triggers the tooltip
  position?: "top" | "bottom" | "left" | "right";  // Position (currently fixed to bottom right)
  class?: string;          // Optional additional CSS classes
}
```

### Core Components

1. **Tooltip Wrapper (`tooltip-wrapper`)**
   - Container element that manages hover and focus events
   - Maintains relative positioning for child elements
   - Handles mouse and keyboard interactions

2. **Tooltip Content (`tooltip-content`)**
   - Fixed-position tooltip bubble in bottom right corner
   - Manages visibility state and transitions
   - Implements semi-transparent backdrop with blur

### State Management

The tooltip uses SolidJS signals to manage its visibility state with a delayed show:

```typescript
const [isVisible, setIsVisible] = createSignal(false);
let timeoutId: ReturnType<typeof setTimeout> | undefined;

const showTooltip = () => {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(() => setIsVisible(true), 1500);  // 1.5s delay
};

const hideTooltip = () => {
  if (timeoutId) clearTimeout(timeoutId);
  setIsVisible(false);
};
```

### CSS Architecture

The tooltip's styling uses a modern approach with CSS transitions:

1. **Base Styles**

   ```css
   .tooltip-content {
     position: fixed;
     bottom: var(--spacing);
     right: var(--spacing);
     background-color: var(--tooltip-bg, rgba(0, 0, 0, 0.5));
     backdrop-filter: blur(4px);
     /* ... other base styles ... */
   }
   ```

2. **Visibility and Transitions**

   ```css
   .tooltip-content {
     opacity: 0;
     visibility: hidden;
     transform: scale(0.98);
     transition: opacity 0.2s ease-out, transform 0.2s ease-out;
   }

   .tooltip-content[aria-hidden="false"] {
     opacity: 1;
     visibility: visible;
     transform: scale(1);
     transition: opacity 0.4s ease-out, transform 0.4s ease-out;
   }
   ```

## Usage Examples

### Basic Usage

```typescript
<Tooltip content="This is a tooltip">
  <button>Hover me for 1.5s</button>
</Tooltip>
```

### With Custom Class

```typescript
<Tooltip content="Custom styled tooltip" class="custom-tooltip">
  <span>Hover for info</span>
</Tooltip>
```

## Accessibility

The tooltip system implements several accessibility features to ensure a great experience for all users. The system uses proper ARIA attributes including the `role="tooltip"` attribute which helps screen readers identify the tooltip's purpose, and the `aria-hidden` attribute which manages visibility state for assistive technologies.

Keyboard navigation is fully supported, with focus events triggering tooltips in the same way as mouse interactions. The system implements proper focus management to maintain a logical tab order and provides the same smooth delay and animation behavior whether using keyboard or mouse input.

Screen reader support is implemented through semantic HTML structure that clearly conveys the tooltip's content and purpose. The system uses clear, descriptive text content and maintains proper ARIA states to ensure screen readers can accurately announce the tooltip's presence and content to users.

## Theme Integration

The tooltip system integrates with the application's theme system through CSS variables:

```css
.tooltip-content {
  background-color: var(--tooltip-bg, rgba(0, 0, 0, 0.5));
  color: var(--tooltip-text, #fff);
  /* ... other theme variables ... */
}
```

## Performance Considerations

The tooltip system prioritizes efficient updates through several key optimizations. It leverages CSS transitions rather than JavaScript animations for smooth performance. Hardware-accelerated transforms are used to ensure fluid motion, while DOM updates are kept to a minimum to reduce browser reflow.

Memory management is carefully implemented to prevent leaks and optimize resource usage. The system properly cleans up timeouts when components unmount. A single tooltip instance is shared across all trigger elements rather than creating multiple instances. Event listeners are efficiently managed to avoid memory bloat.

Visual performance is enhanced through carefully tuned transitions with proper timing curves. A backdrop blur effect improves text readability across different backgrounds. Opacity changes are optimized to maintain smooth animations.

## Browser Support

The tooltip system provides broad compatibility across modern browsers while gracefully degrading on older ones. It utilizes standard CSS transforms and transitions for animations. The backdrop-filter property adds a frosted glass effect with a solid color fallback for unsupported browsers. Modern JavaScript features power the core functionality while maintaining backwards compatibility. Fixed positioning ensures proper tooltip placement across different viewport sizes.

## Future Improvements

Several enhancements are planned for the tooltip system. The positioning system could be expanded to support both fixed and relative modes depending on the use case. Custom delay configuration would allow fine-tuning of tooltip timing. Rich content support would enable more complex tooltip contents beyond simple text.

Additional features under consideration include mobile-specific interaction patterns optimized for touch devices. A click-to-pin functionality would allow users to keep tooltips visible. Custom animation patterns could provide more variety in how tooltips appear and disappear.

The system could be enhanced to better handle dynamic content updates. Touch event handling could be further optimized for mobile devices.
