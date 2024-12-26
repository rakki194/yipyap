# Drag and Drop System

The drag and drop system in yipyap provides a powerful and flexible way to handle both external file uploads and internal gallery item movements. This document covers the implementation details, usage patterns, and best practices for working with the drag and drop functionality.

## Overview

The drag and drop system is implemented through the `useDragAndDrop` composable, which provides a unified interface for:
- Uploading external files via drag and drop
- Moving gallery items between directories
- Handling multi-item selections
- Providing visual feedback during drag operations

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

The system handles dragging files from outside the application:
- Automatically validates file sizes (100MB limit per file)
- Shows upload progress through notifications
- Provides visual feedback during the upload process
- Handles multiple files simultaneously

### Gallery Item Movement

For moving items within the gallery:
- Drag items between directories
- Visual indicators for valid drop targets
- Support for moving multiple selected items
- Preserves associated files (latents, txt) based on app settings

### Multi-Selection Support

The system integrates with the gallery's multi-selection feature:
- Drag multiple selected items at once
- Visual feedback for all selected items during drag
- Maintains selection state during operations

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
- Reports failed moves through notifications
- Provides specific error messages for common scenarios:
  - Target already exists
  - Source file missing
  - Other operation failures

### Upload Operations
- Validates file sizes before upload
- Reports progress and failures through notifications
- Handles network errors gracefully

## Best Practices

1. **State Management**
   - Always clean up drag state when component unmounts
   - Handle both success and error states in UI feedback

2. **Visual Feedback**
   - Provide clear indicators for valid drop targets
   - Show progress for long-running operations
   - Animate state changes for better UX

3. **Error Handling**
   - Always handle potential failures gracefully
   - Provide clear feedback for validation errors
   - Log detailed errors for debugging

4. **Performance**
   - Clean up event listeners on component unmount
   - Use appropriate file size validation
   - Handle large selections efficiently

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

## Troubleshooting

Common issues and their solutions:

1. **Items not draggable**
   - Ensure items have proper data attributes (data-idx, data-name)
   - Check that GalleryContext is available

2. **Drop events not firing**
   - Verify event.preventDefault() is called
   - Check event propagation

3. **Visual feedback missing**
   - Ensure CSS classes are properly defined
   - Verify class application timing

4. **Move operations failing**
   - Check file permissions
   - Verify path construction
   - Ensure proper error handling 