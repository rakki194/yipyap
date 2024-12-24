# Notification System

The notification system in yipyap provides a flexible and accessible way to display toast notifications. It consists of two main components:

## Components

### NotificationContainer (`NotificationContainer.tsx`)
- Global container for all notifications
- Manages notification stacking and positioning
- Handles notification lifecycle and animations
- Size: 2.4KB, 85 lines

### Notification (`Notification.tsx`)
- Individual notification component
- Supports different types: error, success, info, warning
- Includes progress indicators and icons
- Size: 3.1KB, 120 lines

## Styling

The notification system uses dedicated CSS files:
- `Notification.css` (3.3KB): Individual notification styling
- `NotificationContainer.css` (739B): Container and layout styling

## Usage

Notifications can be created through the app context:

```typescript
const { notify } = useAppContext();

// Basic usage
notify("Operation completed", "success");

// With custom icon and group
notify("Processing...", "info", "upload", "spinner");

// With progress tracking
createNotification({
  message: "Uploading...",
  type: "info",
  group: "upload",
  icon: "spinner",
  progress: 45
});
```

## Features

1. **Notification Types**
   - Error: For error messages
   - Success: For successful operations
   - Info: For general information
   - Warning: For warnings and cautions

2. **Progress Tracking**
   - Support for progress indicators
   - Automatic updates
   - Cancel operations

3. **Grouping**
   - Group related notifications
   - Replace or update existing notifications
   - Batch dismissal

4. **Accessibility**
   - ARIA roles and labels
   - Keyboard navigation
   - Screen reader support

5. **Animations**
   - Smooth enter/exit transitions
   - Progress animations
   - Hover effects

## Best Practices

1. **Message Content**
   - Keep messages concise
   - Use appropriate notification type
   - Include actionable information

2. **Duration**
   - Success/info: 3 seconds
   - Error/warning: 5 seconds
   - Progress: Until completion

3. **Grouping**
   - Group related operations
   - Update existing notifications
   - Avoid notification spam

4. **Progress Updates**
   - Show progress for long operations
   - Update frequently
   - Allow cancellation

## Implementation Details

The notification system is implemented using SolidJS's fine-grained reactivity:

```typescript
// Creating notifications
export const createNotification = (notification: NotificationProps) => {
  const id = generateId();
  notifications.set(id, { ...notification, id });
  return id;
};

// Updating notifications
export const updateNotification = (id: string, updates: Partial<NotificationProps>) => {
  const notification = notifications.get(id);
  if (notification) {
    notifications.set(id, { ...notification, ...updates });
  }
};

// Removing notifications
export const removeNotification = (id: string) => {
  notifications.delete(id);
};
```

## Customization

The notification system can be customized through:
1. CSS variables for styling
2. Component props for behavior
3. App context settings for global defaults 