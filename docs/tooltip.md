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

The tooltip system implements several accessibility features:

1. **ARIA Attributes**
   - `role="tooltip"` for screen reader identification
   - `aria-hidden` for visibility state management

2. **Keyboard Navigation**
   - Focus events trigger tooltips
   - Proper focus management
   - Same delay and animation behavior as mouse interaction

3. **Screen Reader Support**
   - Semantic HTML structure
   - Clear text content
   - Proper ARIA states

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

1. **Efficient Updates**
   - Uses CSS transitions instead of JavaScript animations
   - Hardware-accelerated transforms
   - Minimal DOM updates

2. **Memory Management**
   - Proper cleanup of timeouts
   - Single tooltip instance for all triggers
   - Efficient event listener management

3. **Visual Performance**
   - Smooth transitions with proper timing
   - Backdrop blur for readability
   - Optimized opacity changes

## Browser Support

The tooltip system is compatible with all modern browsers and degrades gracefully:

- CSS transforms and transitions
- CSS backdrop-filter (with fallback)
- Modern JavaScript features
- Fixed positioning

## Future Improvements

1. **Enhanced Functionality**
   - Optional positioning modes (fixed vs relative)
   - Custom delay configuration
   - Rich content support

2. **Additional Features**
   - Mobile-specific behaviors
   - Click-to-pin functionality
   - Custom animation patterns

3. **Performance Optimizations**
   - Conditional backdrop-filter
   - Dynamic content updates
   - Touch event optimizations 