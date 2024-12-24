# Breadcrumb Component Documentation

The Breadcrumb component is a crucial navigation element in the yipyap gallery interface. It provides path-based navigation, folder management, and quick actions for the current directory.

## Component Overview

The Breadcrumb component is located at `src/components/Gallery/Breadcrumb.tsx` and consists of several key sections:

### Navigation Section

The navigation section features root navigation through the yipyap logo, providing quick access to the gallery root with a dimensions icon. It displays dynamic path segments that show the current directory hierarchy, with each segment being clickable to enable quick navigation to any point in the path.

### Statistics Section

The statistics section provides an overview of the current directory contents. It displays the total folder count accompanied by a folder icon, as well as the total image count with a dimensions icon. This section utilizes Suspense for handling loading states smoothly.

### Action Buttons Section

The action buttons section contains several important controls. Users can create new folders using the folderAdd icon button, upload files via the upload button, and delete the current folder using the trash icon button (which only appears in subfolders). This section also includes multi-select action controls, a theme toggle, and a settings button for accessing application preferences.

## Context Integration

### AppContext

The Breadcrumb component integrates with the AppContext (`src/contexts/app.tsx`) to access global application state and functionality:

- **Theme Management**: 
  ```typescript
  const app = useAppContext();
  // Access current theme
  const currentTheme = app.theme;
  // Toggle theme
  app.setTheme(nextTheme());
  ```

- **Translations**: 
  ```typescript
  const t = app.t;
  // Usage in component
  title={t('gallery.deleteCurrentFolder')}
  ```

- **Notifications**: 
  ```typescript
  // Success notification
  app.notify(
    t('notifications.folderDeleted'),
    "success"
  );
  // Error notification
  app.notify(
    t('notifications.folderDeleteError'),
    "error"
  );
  ```

The AppContext provides several core application features. It handles theme management with persistence across sessions, enabling consistent theming throughout the application. The context also manages internationalization (i18n) support for multiple languages and locales. A comprehensive notification system is included for displaying alerts and messages to users. User preferences are stored and managed through the context to maintain application settings. Error boundaries are provided to gracefully handle and display errors. The context also tracks routing information to manage navigation state.

### GalleryContext

The component integrates with the GalleryContext to access gallery-specific functionality. This includes managing the current path data for navigation, handling selection state for multi-select operations, and providing methods for data invalidation and refetching when gallery contents change.

## Key Features

### File Upload

The file upload system supports handling multiple files simultaneously. It performs validation on file sizes, enforcing a maximum limit of 100MB per file. Users can monitor upload progress through visual indicators, and the system provides clear error notifications if files exceed the size limit.

### Folder Management

Folder management capabilities include creating new folders through an intuitive modal dialog interface. Users can delete the current folder with a confirmation step to prevent accidental deletions. The system enables smooth navigation through the folder hierarchy.

### Theme Integration

The theming system includes special decorative elements for the "strawberry" theme variant. All components feature theme-aware styling that responds to the current theme selection. Users can easily switch between themes using the dynamic theme toggle.

## Implementation Journey: Delete Folder Feature

### Initial Implementation

1. Added delete button in breadcrumb trail
   ```tsx
   <Show when={isLastCrumb && isInSubfolder()}>
     <button class="icon-button delete-folder">
       {getIcon("trash")}
     </button>
   </Show>
   ```

### UX Improvements
1. Moved button to action section for consistency
   ```tsx
   <div class="breadcrumb-actions">
     {/* ... other actions ... */}
     <Show when={isInSubfolder()}>
       <button class="icon delete-button">
         {getIcon("trash")}
       </button>
     </Show>
   </div>
   ```

### API Integration

1. Initially used incorrect endpoint:
   ```tsx
   fetch(`/api/folder/${currentPath}`, {
     method: "DELETE"
   });
   ```

2. Fixed to use correct endpoint with required parameters:
   ```tsx
   const params = new URLSearchParams();
   params.append("confirm", "true");
   
   fetch(`/api/browse/${currentPath}?${params.toString()}`, {
     method: "DELETE"
   });
   ```

### Error Handling

The error handling system was enhanced with comprehensive error notifications to provide clear feedback to users. A proper error message display system ensures users understand any issues that occur during folder operations. Console logging was also added to assist with debugging and troubleshooting.

### Navigation 

After successful folder deletion, the system automatically navigates to the parent folder to maintain a smooth user experience. The URL construction was carefully implemented to ensure proper routing throughout the application. When deleting a top-level folder, the system includes a fallback mechanism to return users to the gallery root.

## Styling

The component uses CSS modules for styling (`Breadcrumb.css`):

### Layout
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
  align-items: center;
  /* ... */
}
```

### Action Buttons
```css
.breadcrumb .delete-button {
  /* Matches other action buttons */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* ... */
}
```

## Best Practices

Error handling is a critical aspect of the Breadcrumb component. The system should always display user-friendly error messages that clearly communicate any issues to users. Errors should be logged to the console to assist with debugging, and network errors need to be handled gracefully to maintain a smooth user experience.

Proper state management is essential for reliable operation. The component should use signals for managing local state, leverage context providers for global state management, and ensure state is properly cleared after operations complete to prevent stale data.

User feedback helps create an intuitive interface. The component should display appropriate loading states during operations, provide clear success and error messages to communicate outcomes, and maintain consistent notification patterns that align with the rest of the application.

Accessibility cannot be overlooked. The component must include proper ARIA labels to support screen readers, implement complete keyboard navigation support, and use semantic HTML elements to maintain an accessible structure.

## Future Improvements

Performance optimizations could enhance the component's responsiveness. This includes implementing debouncing for rapid operations, optimizing component re-renders to reduce unnecessary updates, and caching frequently accessed data to improve load times.

Additional features could expand functionality. Adding drag and drop file upload support would streamline the user experience. Implementing keyboard shortcuts would improve power user efficiency. Supporting batch operations would allow users to work with multiple items simultaneously.

The user experience could be further refined. Adding the ability to copy the current path would help users share locations. Implementing proper breadcrumb overflow handling would improve navigation on smaller screens. Making the interface more mobile-friendly would ensure a better experience across all devices.