# Breadcrumb Component Documentation

The Breadcrumb component is a crucial navigation element in the yipyap gallery interface. It provides path-based navigation, folder management, and quick actions for the current directory.

## Component Overview

The Breadcrumb component is located at `src/components/Gallery/Breadcrumb.tsx` and consists of several key sections:

### 1. Navigation Section
- Root navigation with the yipyap logo
- Gallery root navigation with dimensions icon
- Dynamic path segments showing the current directory hierarchy
- Each segment is clickable for quick navigation

### 2. Statistics Section
- Shows total folder count with folder icon
- Shows total image count with dimensions icon
- Uses Suspense for loading state

### 3. Action Buttons Section
- Create folder button (`folderAdd` icon)
- Upload files button (`upload` icon)
- Delete current folder button (`trash` icon, only in subfolders)
- Multi-select actions
- Theme toggle
- Settings button

## Key Features

### File Upload
- Handles multiple file uploads
- Validates file sizes (max 100MB per file)
- Shows upload progress
- Provides error notifications for oversized files

### Folder Management
- Create new folders with a modal dialog
- Delete current folder with confirmation
- Navigate through folder hierarchy

### Theme Integration
- Special decoration for "strawberry" theme
- Theme-aware styling
- Dynamic theme toggle

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
- Added error notifications
- Proper error message display
- Console logging for debugging

### Navigation
- Automatic navigation to parent folder after deletion
- URL construction for proper routing
- Fallback to gallery root if in top-level folder

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

## Usage

The Breadcrumb component is automatically rendered at the top of the gallery view. It requires the following context:

- AppContext for:
  - Translations (`t`)
  - Theme management
  - Notifications
- GalleryContext for:
  - Current path data
  - Selection state
  - Data invalidation/refetch

## Best Practices

1. **Error Handling**
   - Always show user-friendly error messages
   - Log errors to console for debugging
   - Handle network errors gracefully

2. **State Management**
   - Use signals for local state
   - Leverage context for global state
   - Clear state after operations

3. **User Feedback**
   - Show loading states
   - Provide clear success/error messages
   - Use consistent notification patterns

4. **Accessibility**
   - Include ARIA labels
   - Provide keyboard navigation
   - Use semantic HTML

## Future Improvements

1. **Performance**
   - Consider debouncing rapid operations
   - Optimize re-renders
   - Cache frequently accessed data

2. **Features**
   - Drag and drop file upload
   - Keyboard shortcuts
   - Batch operations

3. **UX**
   - Path copy functionality
   - Breadcrumb overflow handling
   - Mobile-friendly improvements 