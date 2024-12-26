# Breadcrumb Component Documentation

The Breadcrumb component is a crucial navigation element in the yipyap gallery interface. It has been modularized into several focused components for better maintainability and reusability.

## Component Structure

The Breadcrumb system is organized into the following components:

### Main Component (`Breadcrumb.tsx`)

The main Breadcrumb component serves as a container and orchestrator for the sub-components. It provides the basic layout structure and manages the overall composition of the breadcrumb interface.

```tsx
<nav class="breadcrumb">
  <div class="breadcrumb-content">
    <BreadcrumbNavigation />
    <BreadcrumbStats />
    <BreadcrumbActions />
  </div>
</nav>
```

### Navigation Component (`BreadcrumbNavigation.tsx`)

Handles path-based navigation through:
- Root navigation via the yipyap logo
- Gallery root access with dimensions icon
- Dynamic path segments showing the current directory hierarchy
- Clickable segments for quick navigation

### Statistics Component (`BreadcrumbStats.tsx`)

Provides directory content overview:
- Total folder count with folder icon
- Total image count with dimensions icon
- Selection count when items are selected
- Suspense handling for loading states

### Actions Component (`BreadcrumbActions.tsx`)

Contains all interactive controls:
- Multi-select actions (select all, deselect all)
- New folder creation
- File upload functionality
- Current folder deletion (in subfolders)
- Theme toggle
- Settings access

### Supporting Components

#### FileUpload Component
- Handles file upload functionality
- Validates file sizes (max 100MB)
- Provides upload progress feedback
- Manages upload notifications

#### MultiSelectActions Component
- Manages selection state
- Provides bulk delete functionality
- Shows selection progress
- Handles both folder and image selections

#### NewFolderDialog Component
- Manages folder creation interface
- Handles folder name input
- Provides creation feedback
- Manages folder creation state

## Context Integration

### AppContext Usage
```typescript
const app = useAppContext();
// Theme management
app.setTheme(nextTheme());
// Translations
const message = t('gallery.deleteSuccess');
// Notifications
app.notify(message, "success");
```

### GalleryContext Usage
```typescript
const gallery = useGallery();
// Path management
const currentPath = gallery.data()?.path;
// Selection handling
gallery.selection.clearMultiSelect();
// Data invalidation
gallery.invalidate();
gallery.invalidateFolderCache();
```

## Styling System

Each component has its own CSS module for encapsulated styling:

### Core Layout (`Breadcrumb.css`)
```css
.breadcrumb {
  position: sticky;
  top: 0;
  z-index: 2;
  /* ... */
}

.breadcrumb-content {
  display: flex;
  justify-content: space-between;
  /* ... */
}
```

### Navigation Styles (`BreadcrumbNavigation.css`)
```css
.breadcrumb-links {
  display: flex;
  align-items: center;
  /* ... */
}
```

### Statistics Styles (`BreadcrumbStats.css`)
```css
.breadcrumb-stats {
  white-space: nowrap;
  overflow: hidden;
  /* ... */
}
```

### Actions Styles (`BreadcrumbActions.css`)
```css
.breadcrumb-actions {
  display: flex;
  gap: var(--spacing);
  /* ... */
}
```

## Theme Integration

Each component supports theme-specific styling:

```css
[data-theme="strawberry"] .breadcrumb {
  background-color: #e4ffeb;
}

[data-theme="banana"] .breadcrumb-actions .icon:hover {
  background-color: rgba(128, 62, 0, 0.1);
}
```

## Best Practices

1. **Component Responsibility**
   - Each component should have a single, well-defined responsibility
   - Keep state management close to where it's used
   - Use composition over inheritance

2. **Error Handling**
   - Implement proper error boundaries
   - Provide clear error messages
   - Log errors for debugging
   - Handle network errors gracefully

3. **State Management**
   - Use signals for local state
   - Leverage context providers for global state
   - Clear state after operations complete

4. **User Feedback**
   - Show appropriate loading states
   - Provide clear success/error messages
   - Maintain consistent notification patterns

5. **Accessibility**
   - Include proper ARIA labels
   - Support keyboard navigation
   - Use semantic HTML elements
