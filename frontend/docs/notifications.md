# Notification System

## Table of Contents

---

- [Notification System](#notification-system)
  - [Table of Contents](#table-of-contents)
  - [Components](#components)
    - [NotificationContainer (`NotificationContainer.tsx`)](#notificationcontainer-notificationcontainertsx)
    - [Notification (`Notification.tsx`)](#notification-notificationtsx)
  - [Styling](#styling)
  - [Usage](#usage)
  - [Features](#features)
  - [Best Practices](#best-practices)
  - [Implementation Details](#implementation-details)
  - [Customization](#customization)

The notification system in yipyap provides a flexible and accessible way to display toast notifications. It consists of two main components:

## Components

---

### NotificationContainer (`NotificationContainer.tsx`)

The `NotificationContainer` serves as a global container component that manages all notifications in the application. It handles the stacking and positioning of notifications as they appear and disappear. The container is responsible for managing the full lifecycle of notifications, including their entrance and exit animations.

### Notification (`Notification.tsx`)

The `Notification` component represents an individual notification element that can be displayed to the user. It provides support for different notification types including error, success, info, and warning messages. Each notification includes appropriate progress indicators and icons based on its type and state.

## Styling

---

The notification system uses dedicated CSS files:

- `Notification.css` (3.3KB): Individual notification styling
- `NotificationContainer.css` (739B): Container and layout styling

## Usage

---

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

---

The notification system supports several notification types including error messages for failures, success notifications for completed operations, info messages for general updates, and warning notifications for cautionary alerts. Each type is visually distinct and appropriately styled.

Progress tracking is a key feature, allowing notifications to display progress indicators that automatically update as operations proceed. Users can cancel in-progress operations when supported.

Notifications can be grouped together logically, with the ability to replace or update existing notifications in a group. This enables batch operations like dismissing all related notifications at once.

The system is built with accessibility in mind, implementing proper ARIA roles and labels for screen readers. Notifications can be navigated and dismissed using the keyboard for full accessibility support.

Smooth animations enhance the user experience, with enter/exit transitions, progress indicator animations, and subtle hover effects that provide visual feedback without being distracting.

## Best Practices

---

When creating notification messages, keep the content concise while ensuring it provides actionable information. Choose the appropriate notification type to match the message severity and purpose.

Different notification types have recommended display durations - success and info messages typically show for 3 seconds, while errors and warnings remain visible for 5 seconds. Progress notifications stay until the operation completes.

Use notification grouping judiciously to organize related operations together. Update existing notifications rather than creating new ones when possible, and avoid spamming users with too many notifications at once.

For long-running operations, show progress indicators that update frequently to keep users informed. Ensure progress notifications can be cancelled when the underlying operation supports cancellation.

## Implementation Details

---

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

---

The notification system offers several customization options. The visual appearance can be adjusted using CSS variables to match the application's theme and styling needs. Component props provide control over notification behavior and interactions. Global defaults for the notification system can be configured through the app context settings to ensure consistent behavior across the application.
