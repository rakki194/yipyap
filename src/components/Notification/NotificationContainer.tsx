import { Component, For, createSignal } from "solid-js";
import { Notification } from "./Notification";
import "./NotificationContainer.css";

export interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "info" | "warning";
  group?: string;
  icon?: "spinner" | "success" | "error" | "info" | "warning";
}

let notificationId = 0;

export const createNotification = (
  message: string,
  type: NotificationItem["type"],
  group?: string,
  icon?: NotificationItem["icon"]
): NotificationItem => ({
  id: `notification-${notificationId++}`,
  message,
  type,
  group,
  icon,
});

export const NotificationContainer: Component = () => {
  const [notifications, setNotifications] = createSignal<NotificationItem[]>([]);

  const addNotification = (notification: NotificationItem) => {
    setNotifications((prev) => {
      // If the notification has a group
      if (notification.group) {
        // Find any existing notification with the same group
        const existingIndex = prev.findIndex((n) => n.group === notification.group);
        if (existingIndex !== -1) {
          // Update the existing notification in place
          const updated = [...prev];
          // Keep the same ID but update message, type and icon
          updated[existingIndex] = {
            ...prev[existingIndex],
            message: notification.message,
            type: notification.type,
            icon: notification.icon
          };
          return updated;
        }
      }
      // If no group or no existing notification with this group, add as new
      return [...prev, notification];
    });
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Expose methods globally
  if (typeof window !== "undefined") {
    (window as any).__notificationContainer = {
      addNotification,
      removeNotification,
    };
  }

  return (
    <div class="notification-container">
      <For each={notifications()}>
        {(notification) => (
          <Notification
            message={notification.message}
            type={notification.type}
            group={notification.group}
            icon={notification.icon}
            onClose={() => removeNotification(notification.id)}
          />
        )}
      </For>
    </div>
  );
}; 