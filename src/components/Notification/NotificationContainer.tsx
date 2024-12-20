import { Component, For, createSignal } from "solid-js";
import { Notification } from "./Notification";
import "./NotificationContainer.css";

export interface NotificationItem {
  id: string;
  message: string;
  type: "error" | "success" | "info" | "warning";
  group?: string;
}

let notificationId = 0;

export const createNotification = (
  message: string,
  type: NotificationItem["type"],
  group?: string
): NotificationItem => ({
  id: `notification-${notificationId++}`,
  message,
  type,
  group,
});

export const NotificationContainer: Component = () => {
  const [notifications, setNotifications] = createSignal<NotificationItem[]>([]);

  const addNotification = (notification: NotificationItem) => {
    if (notification.group) {
      // If there's an existing notification with the same group, update it
      setNotifications((prev) => {
        const existingIndex = prev.findIndex((n) => n.group === notification.group);
        if (existingIndex !== -1) {
          const updated = [...prev];
          updated[existingIndex] = { ...notification, id: prev[existingIndex].id };
          return updated;
        }
        return [...prev, notification];
      });
    } else {
      // If no group, just add as a new notification
      setNotifications((prev) => [...prev, notification]);
    }
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
            onClose={() => removeNotification(notification.id)}
          />
        )}
      </For>
    </div>
  );
}; 