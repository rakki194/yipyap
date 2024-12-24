# Theming System

## Table of Contents
- [Project Structure](#project-structure)
  - [Core Files](#core-files)
  - [Directory Organization](#directory-organization)
  - [State Management](#state-management)
- [Theme Implementation](#theme-implementation)
- [Making Style Changes](#making-style-changes)
- [Theme Variables](#theme-variables)
  - [Core Colors](#core-colors)
  - [Component-Specific Variables](#component-specific-variables)
  - [Animation Variables](#animation-variables)
- [Example Usage](#example-usage)
  - [Basic Theme-Aware Styling](#basic-theme-aware-styling)
  - [Advanced Color Mixing](#advanced-color-mixing)
- [Theme Integration](#theme-integration)
  - [Component Level](#1-component-level)
  - [Global Level](#2-global-level)
- [Special Theme Variants](#special-theme-variants)
  - [Holiday Themes](#1-holiday-themes)
  - [Brand Themes](#2-brand-themes)
  - [High Contrast Themes](#3-high-contrast-themes)
- [Best Practices](#best-practices)

The application implements a robust theming system with multiple built-in themes (light, dark, gray, strawberry, peanut, christmas, halloween, etc.) that affect not just colors but also animations, visual effects, and component-specific behaviors. Each theme provides custom scrollbar styling, keyboard shortcut visual indicators, and consistent contrast ratios for accessibility. Theme changes are persisted across sessions and can be toggled via keyboard shortcuts or the theme switcher in the settings panel.

## Project Structure

The frontend of yipyap is built with SolidJS and follows this structure:

### Core Files
- `/src/main.tsx`: Application entry point, sets up routing and error boundaries
- `/src/contexts/app.tsx`: Global state management for app settings and preferences
- `/src/router.ts`: Route definitions and navigation logic
- `/src/styles.css`: Global styles and CSS reset
- `/src/themes.css`: Theme-specific styles and variables

### Directory Organization
- `/src/components/`: Feature-based components
  - `Gallery/`: Image gallery and related components
  - `ImageViewer/`: Image viewing and manipulation
  - `Notification/`: Toast notifications system
  - `Settings/`: Application settings UI
  - `UploadOverlay/`: File upload interface
  - Shared components: `FadeIn`, `reactive-utils`
- `/src/contexts/`: State management and context providers
- `/src/hooks/`: Reusable custom hooks
- `/src/i18n/`: Internationalization support
- `/src/icons/`: SVG icons and related components
- `/src/pages/`: Route-specific page components
- `/src/resources/`: Static resources and assets
- `/src/theme/`: Theme-related utilities
- `/src/utils/`: Shared utility functions

### State Management
The application uses a combination of:
- App Context (`/src/contexts/app.tsx`): Global settings and preferences
- Component-local state: Feature-specific state using SolidJS primitives
- URL state: Route parameters and query strings for shareable state

## Theme Implementation

Themes are managed through the app context (`/src/contexts/app.tsx`) which:
- Persists theme selection in localStorage
- Updates the document's data-theme attribute
- Handles RTL support for specific locales
- Manages animation preferences

## Making Style Changes

To make style changes to the application, follow these steps:

1. **Identify the Component and CSS File**:
   - Components are in `/src/components/`
   - Each component has its own CSS file (e.g., `/src/components/Gallery/Gallery.css`)
   - Global styles are in `/src/styles.css`
   - Theme-specific styles are in `/src/themes.css`

2. **Check for Theme Variables**:
   - Look for CSS variables in `/src/themes.css` that might be relevant
   - Use theme variables (e.g., `var(--accent)`, `var(--text-primary)`) when possible
   - This ensures consistency across all themes

3. **Consider the Cascading Effects**:
   - Check if the style affects other components
   - Look for related styles in parent/child components
   - Consider responsive design implications
   - Test the changes across different screen sizes

4. **Follow CSS Best Practices**:
   - Use CSS variables for reusable values
   - Keep specificity as low as possible
   - Group related properties together
   - Add comments for complex selectors or calculations
   - Use modern CSS features like `color-mix()` when appropriate
   - Ensure sufficient contrast in all themes
   - Check that animations and transitions work smoothly
   - Verify that the changes respect theme-specific customizations

## Theme Variables

### Core Colors
- `--accent`: Primary accent color
- `--text-primary`: Main text color
- `--text-secondary`: Secondary text color
- `--card-bg`: Card/container background
- `--error-bg`: Error state background
- `--error-text`: Error state text
- `--success-bg`: Success state background
- `--success-text`: Success state text

### Component-Specific Variables
- `--notification-bg`: Notification background
- `--tooltip-bg`: Tooltip background
- `--modal-overlay`: Modal overlay background
- `--scrollbar-thumb`: Scrollbar thumb color
- `--scrollbar-track`: Scrollbar track color

### Animation Variables
- `--transition-speed`: Base transition duration
- `--animation-curve`: Default easing function
- `--hover-lift`: Hover elevation amount
- `--press-depth`: Press animation depth

## Example Usage

### Basic Theme-Aware Styling

```css
.component {
  background-color: var(--card-bg);
  color: var(--text-primary);
  transition: all var(--transition-speed) var(--animation-curve);
}

.component:hover {
  transform: translateY(calc(-1 * var(--hover-lift)));
  box-shadow: 0 var(--hover-lift) calc(var(--hover-lift) * 2) rgba(0, 0, 0, 0.1);
}
```

### Advanced Color Mixing

```css
/* Before: Basic selected state */
&.selected {
  background-color: color-mix(in srgb, var(--card-bg) 95%, black);
  backdrop-filter: blur(2px);
}

/* After: Enhanced selected state with theme awareness */
&.selected {
  background-color: color-mix(in srgb, var(--card-bg), var(--text-primary) 80%);
  backdrop-filter: blur(10px);
  box-shadow: 4px 8px 8px rgba(0, 0, 0, 0.4);
  
  & > img {
    filter: brightness(1.1);
  }
}
```

## Theme Integration

### 1. Component Level

Components should:
- Use theme variables for all colors and animations
- Implement dark/light mode variants
- Support RTL layout when necessary
- Handle theme transitions smoothly

Example:
```css
.button {
  background: var(--accent);
  color: var(--text-on-accent);
  transition: background var(--transition-speed);

  [data-theme="dark"] & {
    --text-on-accent: var(--text-primary-dark);
  }

  [dir="rtl"] & {
    margin-left: 0;
    margin-right: var(--spacing);
  }
}
```

### 2. Global Level

Global styles should:
- Define theme-specific root variables
- Handle system preference detection
- Manage theme transitions
- Set up base component styles

Example:
```css
:root {
  /* Light theme defaults */
  --accent: #007bff;
  --text-primary: #2c3e50;
  
  @media (prefers-color-scheme: dark) {
    --accent: #3498db;
    --text-primary: #ecf0f1;
  }
}

[data-theme="dark"] {
  --accent: #3498db;
  --text-primary: #ecf0f1;
}
```

## Special Theme Variants

### 1. Holiday Themes
- Christmas theme with festive colors and snow effects
- Halloween theme with spooky colors and animations
- Special event themes with unique visual effects

### 2. Brand Themes
- Banana theme with yellow accents
- Strawberry theme with red accents
- Peanut theme with brown accents

### 3. High Contrast Themes
- Enhanced contrast for accessibility
- Simplified animations
- Clear focus indicators

## Best Practices

1. **Color Usage**:
   - Use semantic color variables
   - Ensure sufficient contrast ratios
   - Support dark and light modes
   - Consider color blindness

2. **Animation Consistency**:
   - Use standard timing variables
   - Maintain consistent motion patterns
   - Respect reduced-motion preferences
   - Keep animations subtle

3. **Theme Switching**:
   - Handle transitions smoothly
   - Persist theme preferences
   - Support system preferences
   - Provide clear theme controls

4. **Maintenance**:
   - Document color usage patterns
   - Keep theme variables organized
   - Test across all themes
   - Update theme documentation

Remember to:
- Test changes in all themes
- Consider accessibility implications
- Document significant changes
- Update theme documentation
- Consider performance impact 