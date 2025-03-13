# ARIA Labeling Guide for yipyap

This document outlines best practices for ARIA labeling in the yipyap project, focusing on our specific components and use cases.

## Table of Contents

---

- [ARIA Labeling Guide for yipyap](#aria-labeling-guide-for-yipyap)
  - [Table of Contents](#table-of-contents)
  - [Component-Specific Guidelines](#component-specific-guidelines)
    - [Gallery Components](#gallery-components)
    - [Image Viewer Components](#image-viewer-components)
    - [Settings Components](#settings-components)
    - [Upload Components](#upload-components)
  - [General Requirements](#general-requirements)
    - [Core Requirements](#core-requirements)
    - [Label Text Guidelines](#label-text-guidelines)
    - [ID Requirements](#id-requirements)
  - [Testing](#testing)
    - [Manual Testing](#manual-testing)
    - [Automated Testing](#automated-testing)
  - [Common Patterns](#common-patterns)
    - [Status Updates](#status-updates)
    - [Modal Dialogs](#modal-dialogs)
    - [Loading States](#loading-states)

## Component-Specific Guidelines

---

### Gallery Components

The Gallery is a core feature of yipyap that requires careful attention to accessibility. Key considerations include:

- Image Grid Items:

  ```tsx
  <div 
    role="gridcell"
    aria-label={`Image: ${title}`}
    aria-selected={isSelected}
  >
    <img alt={title} src={thumbnailUrl} />
  </div>
  ```

- Batch Selection Controls:

  ```tsx
  <button
    aria-label="Select all images"
    aria-pressed={allSelected}
  >
    Select All
  </button>
  ```

### Image Viewer Components

The Image Viewer needs clear labeling for its controls and interactive elements:

- Zoom Controls:

  ```tsx
  <button
    aria-label={`Zoom ${isZoomedIn ? 'out' : 'in'}`}
    aria-pressed={isZoomedIn}
  >
    <ZoomIcon />
  </button>
  ```

- Navigation Controls:

  ```tsx
  <button
    aria-label="Previous image"
    aria-disabled={isFirstImage}
  >
    <PrevIcon />
  </button>
  ```

### Settings Components

Settings panels require clear labeling to ensure users understand configuration options:

- Theme Selection:

  ```tsx
  <div role="radiogroup" aria-label="Theme selection">
    <label>
      <input
        type="radio"
        name="theme"
        value="light"
        aria-checked={currentTheme === 'light'}
      />
      Light Theme
    </label>
  </div>
  ```

- Feature Toggles:

  ```tsx
  <label class="toggle">
    <input
      type="checkbox"
      aria-label="Enable minimap"
      checked={minimapEnabled}
    />
    Show Minimap
  </label>
  ```

### Upload Components

The Upload Overlay needs clear status and instruction communication:

- Drop Zone:

  ```tsx
  <div
    role="region"
    aria-label="File upload area"
    aria-describedby="upload-instructions"
  >
    <p id="upload-instructions">
      Drop images here or click to select
    </p>
  </div>
  ```

## General Requirements

---

### Core Requirements

- Every interactive element must have an accessible name via one of:
  - Visible text label
  - `aria-label`
  - `aria-labelledby`
  - Meaningful `alt` text for images
- Status updates should use `aria-live` regions
- Modal dialogs must use proper ARIA roles and labels

### Label Text Guidelines

In yipyap, labels should:

- Be concise and action-oriented
- Describe the purpose or result of interaction
- Include state information when relevant (e.g., "selected", "expanded")
- Use consistent terminology across similar components

### ID Requirements

- Use semantic prefixes for different component types:
  - `gallery-item-{id}`
  - `viewer-control-{action}`
  - `settings-option-{name}`
- Ensure uniqueness across the entire application
- Keep IDs stable across renders for proper ARIA relationships

## Testing

---

### Manual Testing

Test the following scenarios:

1. Navigate the gallery using only keyboard
2. Verify screen reader announces:
   - Image titles and selection state
   - Current zoom level and navigation options
   - Upload status and progress
3. Check that all interactive elements are reachable
4. Verify modal focus management

### Automated Testing

Use these tools in the yipyap development workflow:

1. ESLint with jsx-a11y plugin
2. Automated accessibility tests in component test suites
3. Regular full-app scans with axe-core

## Common Patterns

---

### Status Updates

```tsx
<div 
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  {uploadProgress}% uploaded
</div>
```

### Modal Dialogs

```tsx
<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-desc">Are you sure you want to delete these items?</p>
</div>
```

### Loading States

```tsx
<div
  aria-busy={isLoading}
  aria-live="polite"
>
  {isLoading ? 'Loading images...' : 'Images loaded'}
</div>
```

When implementing ARIA labels in yipyap, always consider:

1. The component's role in the larger application flow
2. How the component's state affects the user experience
3. The most natural way to describe the component to a screen reader user
4. Consistency with similar components elsewhere in the application

Regular testing with screen readers and keyboard navigation is essential to verify that your labeling implementation works as intended. Maintain consistent patterns across similar components to provide a predictable experience.
