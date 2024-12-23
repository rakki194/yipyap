# Notification System

The notification system is a sophisticated component-based system that provides temporary user feedback with theme-aware styling, animations, and accessibility features. The system consists of three main components: `NotificationContainer`, `Notification`, and the app context integration.

## Architecture

### 1. NotificationContainer Component (`/src/components/Notification/NotificationContainer.tsx`)
- Manages the global notification stack
- Handles notification grouping and positioning
- Exposes global methods through `window.__notificationContainer`
- Uses SolidJS signals for reactive state management

### 2. Notification Component (`/src/components/Notification/Notification.tsx`)
- Handles individual notification rendering and lifecycle
- Manages animations and interaction states
- Supports theme-aware styling and icons
- Implements auto-dismiss and hover behaviors

### 3. App Context Integration (`/src/contexts/app.tsx`)
- Provides high-level notification API through `app.notify` and `app.createNotification`
- Handles translation integration
- Manages notification type defaults and icon mapping

## Usage

### Basic Notification

```typescript
// Through app context
app.notify("Message", "info");

// With translation key
app.notify("gallery.uploadProgress", "info");

// With all options
app.notify(
  "Processing...",
  "info",
  "upload-group",
  "spinner"
);
```

### Advanced Usage

```typescript
// Create notification with full control
app.createNotification({
  message: "Custom notification",
  type: "success",
  group: "custom-group",
  icon: "success"
});
```

## Features

### 1. Notification Types
- `"info"` - Default type with blue styling
- `"success"` - Green styling for successful operations
- `"warning"` - Yellow styling for warnings
- `"error"` - Red styling for errors, persists until dismissed

### 2. Icons
- `"spinner"` - Animated loading indicator
- `"success"` - Checkmark icon
- `"error"` - Error symbol
- `"info"` - Information icon
- `"warning"` - Warning symbol
- Icons automatically match notification type if not specified

### 3. Grouping System
- Notifications can be grouped using the `group` parameter
- New notifications in the same group update existing ones
- Groups maintain stack position for consistent UX
- Useful for progress updates and related messages

### 4. Behavior
- Non-error notifications auto-dismiss after 3 seconds
- Error notifications persist until manually closed
- Auto-dismiss pauses on hover
- Close button appears on hover or for error types
- Smooth enter/exit animations
- Skip animations for rapid updates in groups

### 5. Theme Integration
- Uses CSS custom properties for theme-aware colors
- Supports dark/light mode transitions
- Consistent with application's theme system
- Hover effects use `color-mix` for theme-aware interactions

### 6. Accessibility
- Proper ARIA labels for interactive elements
- Keyboard navigation support
- High contrast ratios in all themes
- Screen reader friendly structure

### 7. Translation Support
- Integrates with i18n system
- Automatic message translation
- Type-safe translation keys
- Supports interpolation for dynamic content

## Styling

The notification system uses three CSS modules:
- `NotificationContainer.css` - Layout and stacking behavior
- `Notification.css` - Individual notification appearance and animations
- Theme variables from `themes.css` for consistent styling

Example of theme-aware styling:
```css
.notification {
  background-color: var(--card-bg);
  color: var(--text-primary);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.notification.error {
  background-color: var(--error-bg);
  color: var(--error-text);
}
```

## Best Practices

### 1. Message Content
- Use translation keys for consistent messaging
- Keep messages concise and clear
- Include specific details for errors
- Use proper capitalization and punctuation

### 2. Notification Types
- Use `"error"` for unrecoverable errors
- Use `"warning"` for important but non-critical issues
- Use `"success"` for completed operations
- Use `"info"` for general updates

### 3. Grouping
- Group related notifications (e.g., upload progress)
- Use consistent group names across related operations
- Clear groups when operations complete

### 4. Icons
- Use `"spinner"` for ongoing operations
- Let type-based icons handle standard cases
- Custom icons only when necessary

## Testing

The notification system includes comprehensive tests:
- Component rendering tests
- Behavior tests (auto-dismiss, hover, etc.)
- Integration tests with app context
- Theme integration tests
- Translation tests
- Group behavior tests

Example test:

```typescript
test("auto-dismisses non-error notifications", () => {
  const onClose = vi.fn();
  render(() => (
    <Notification message="Test" type="info" onClose={onClose} />
  ));
  vi.advanceTimersByTime(3000);
  expect(onClose).toHaveBeenCalled();
});
``` 