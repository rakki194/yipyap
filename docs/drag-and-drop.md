# Drag and Drop System

The drag and drop system in yipyap provides a powerful and flexible way to handle both external file uploads and internal gallery item movements. This document covers the implementation details, usage patterns, and best practices for working with the drag and drop functionality.

## Overview

The drag and drop system is implemented through the `useDragAndDrop` composable, which serves as a unified interface for managing drag and drop interactions in the application. This composable handles both external file uploads and internal gallery item movements, ensuring a consistent and intuitive user experience.

The system provides comprehensive functionality for uploading files via drag and drop, moving items between directories within the gallery, managing multi-item selections, and delivering visual feedback during drag operations. Through careful state management and event handling, it creates a seamless drag and drop experience that feels natural and responsive.

## Usage

### Basic Implementation

```tsx
import { useDragAndDrop } from '~/composables/useDragAndDrop';

const MyComponent = () => {
  const handleDragStateChange = (isDragging: boolean) => {
    // Update UI state based on drag status
    setShowDropOverlay(isDragging);
  };

  const { uploadFiles } = useDragAndDrop({ 
    onDragStateChange: handleDragStateChange 
  });

  return (
    // Your component JSX
  );
};
```

### Prerequisites

The drag and drop system requires the following contexts to be available in your component tree:
- `GalleryContext` - For managing gallery state and operations
- `AppContext` - For notifications and global settings

## Features

### External File Upload

The system provides robust handling of files dragged from external sources into the application. It automatically validates each file against a 100MB size limit to ensure system stability and prevent memory issues during upload.

During the upload process, the system delivers a smooth user experience by showing real-time progress through the notification system, providing clear visual feedback as files are processed, and efficiently handling multiple files simultaneously. This comprehensive approach ensures users stay informed while maintaining responsive performance even with large batch uploads.

### Gallery Item Movement

The gallery item movement system enables seamless dragging of items between directories, with clear visual indicators highlighting valid drop targets as users drag items around. This creates an intuitive interface for organizing content within the gallery structure.

The system fully supports moving multiple selected items at once and intelligently preserves associated files like latents and txt files based on the user's configured app settings. This ensures that related assets stay together when moving items between locations, maintaining proper organization of gallery content.

### Multi-Selection Support

The system seamlessly integrates with the gallery's multi-selection feature, allowing users to drag multiple selected items simultaneously while providing visual feedback for all selected items during the drag operation. This creates an intuitive and responsive experience for managing multiple gallery items at once.

The multi-selection integration maintains proper selection state throughout drag and drop operations, ensuring that the selected items remain highlighted and grouped together as they are moved between locations. This consistent selection behavior helps users keep track of their selected items during reorganization tasks.

## Events and States

### Drag State Changes

The `onDragStateChange` callback is triggered in the following scenarios:

| Event | State | Description |
|-------|-------|-------------|
| Drag Enter | `true` | Files are dragged over the application |
| Drag Leave | `false` | Files leave the drop zone |
| Drop | `false` | Files are dropped |

### Visual Feedback

The system provides several visual indicators:
- `.being-dragged` class on items being dragged
- `.drag-target` class on valid drop targets
- `.move-failed` class for failed operations (automatically removed after animation)

## Error Handling

The system includes comprehensive error handling:

### Move Operations
The system reports any failed move operations through the notification system, ensuring users are immediately aware when an operation cannot be completed successfully. This provides clear feedback and helps users understand what went wrong.

For common error scenarios, the system provides specific and helpful error messages that explain the exact nature of the failure, such as when a target file already exists, when a source file is missing, or when other types of operation failures occur. These detailed messages help users quickly identify and resolve issues during file operations.

### Upload Operations
The system performs thorough validation of file sizes prior to initiating any uploads, ensuring compliance with size limits. Throughout the upload process, it provides continuous progress updates and clear failure notifications through the notification system. Network errors are handled gracefully with appropriate error messages and recovery options, maintaining a smooth user experience even when connectivity issues occur.

## Best Practices

When implementing drag and drop functionality, proper state management is essential - always clean up drag state when components unmount and handle both success and error states in the UI feedback. Visual feedback should be clear and intuitive, with obvious indicators for valid drop targets, progress indicators for long-running operations, and smooth animations for state changes to enhance the user experience. Error handling must be comprehensive, with graceful handling of potential failures, clear feedback for validation errors, and detailed error logging for debugging purposes. Performance considerations are also critical - event listeners should be properly cleaned up on component unmount, appropriate file size validation should be implemented, and large selections must be handled efficiently to maintain smooth operation.

## API Reference

### `useDragAndDrop`

#### Props

```typescript
interface DragAndDropProps {
  onDragStateChange: (isDragging: boolean) => void;
}
```

#### Returns

```typescript
{
  uploadFiles: (files: FileList) => Promise<void>;
}
```

## CSS Classes

The system uses several CSS classes for visual feedback:

| Class | Purpose |
|-------|---------|
| `.being-dragged` | Applied to items currently being dragged |
| `.drag-target` | Applied to valid drop targets |
| `.move-failed` | Applied briefly to items that failed to move |

## Examples

### Implementing a Drop Zone

```tsx
const DropZone = () => {
  const [isDropTarget, setIsDropTarget] = createSignal(false);

  const { uploadFiles } = useDragAndDrop({
    onDragStateChange: (isDragging) => setIsDropTarget(isDragging)
  });

  return (
    <div class={isDropTarget() ? 'drop-zone active' : 'drop-zone'}>
      {isDropTarget() ? 'Drop files here' : 'Drag files here'}
    </div>
  );
};
```

### Handling Directory Drops

```tsx
const DirectoryItem = (props: { path: string }) => {
  const { uploadFiles } = useDragAndDrop({
    onDragStateChange: (isDragging) => {
      // Update directory visual state
    }
  });

  return (
    <div 
      class="directory" 
      data-path={props.path}
    >
      {/* Directory contents */}
    </div>
  );
};
```
