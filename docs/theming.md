# Theming System

## Table of Contents
- [Theming System](#theming-system)
  - [Table of Contents](#table-of-contents)
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
    - [Component Level](#component-level)
    - [Global Level](#global-level)
  - [Special Theme Variants](#special-theme-variants)
    - [Colorful Themes](#colorful-themes)
    - [High Contrast Themes](#high-contrast-themes)
  - [Best Practices](#best-practices)

The application implements a robust theming system with multiple built-in themes (light, dark, gray, strawberry, peanut, high-contrast-black, high-contrast-inverse) that affect not just colors but also animations, visual effects, and component-specific behaviors. Each theme provides custom scrollbar styling, keyboard shortcut visual indicators, and consistent contrast ratios for accessibility. Theme changes are persisted across sessions and can be toggled via keyboard shortcuts or the theme switcher in the settings panel.

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

## State Management

The application implements state management through multiple complementary approaches. At the global level, the App Context defined in `/src/contexts/app.tsx` handles application-wide settings and user preferences. For more focused functionality, components maintain their own local state using SolidJS primitives to manage feature-specific data and UI states. Additionally, certain application states are preserved in the URL through route parameters and query strings, enabling shareable and bookmarkable states across sessions.

## Theme Implementation

Theme management is centralized through the app context defined in `/src/contexts/app.tsx`. This context provides comprehensive theme handling by persisting the user's theme selection in localStorage to maintain preferences across sessions. When themes change, it automatically updates the document's data-theme attribute to apply the new styles. The context also provides built-in support for RTL (right-to-left) layouts when using locales that require it, ensuring proper text and layout direction. Beyond basic theme switching, it manages animation preferences to respect user settings for reduced motion and other accessibility considerations.

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

### Component Level

When building components, proper theme integration is essential. All colors and animations should utilize the theme variables rather than hard-coded values to maintain consistency across the application. Components need to implement both dark and light mode variants to ensure a cohesive experience regardless of the user's theme preference. Right-to-left (RTL) layout support should be incorporated when necessary to accommodate languages that read from right to left.

sFinally, components must handle theme transitions smoothly to avoid jarring visual changes when the theme is switched.

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

### Global Level

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

### Colorful Themes
The Banana theme utilizes cheerful yellow accents throughout the interface. The Strawberry theme employs vibrant red accents for a bold look. The Peanut theme incorporates warm brown accents for an earthy feel.

### High Contrast Themes
High contrast themes prioritize accessibility with enhanced contrast ratios. These themes feature simplified animations to reduce visual noise and clear focus indicators to aid navigation.

## Best Practices

The color usage system relies on semantic color variables to maintain consistency. All colors must meet sufficient contrast ratios and support both dark and light modes. Color choices take into account color blindness considerations to ensure accessibility for all users.

Animation consistency is maintained through standard timing variables across the application. Motion patterns follow established conventions while respecting user preferences for reduced motion. All animations are kept subtle to avoid distraction.

Theme switching is implemented with smooth transitions between states. The system persists user theme preferences and respects system-level preferences. Clear theme controls are provided to users for easy customization.

Proper maintenance requires thorough documentation of color usage patterns and organized theme variables. All changes must be tested across the full range of themes. Theme documentation should be kept up to date as the system evolves.

When making theme changes, thoroughly test across all themes and consider the accessibility implications. Document any significant changes made to the system. Keep theme documentation current and evaluate the performance impact of changes.
