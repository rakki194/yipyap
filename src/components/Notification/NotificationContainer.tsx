import { Component, createSignal, For } from "solid-js";
import { Notification, NotificationProps } from "./Notification";

export interface NotificationItem extends NotificationProps {
  id: number;
}

let nextId = 0;

export const [notifications, setNotifications] = createSignal<NotificationItem[]>([]);

export const addNotification = (notification: Omit<NotificationProps, "onClose">) => {
  const id = nextId++;
  setNotifications(prev => [...prev, { ...notification, id }]);
  return id;
};

export const removeNotification = (id: number) => {
  setNotifications(prev => prev.filter(n => n.id !== id));
};

export const NotificationContainer: Component = () => {
  return (
    <div class="notification-container">
      <For each={notifications()}>
        {(notification) => (
          <Notification
            {...notification}
            onClose={() => removeNotification(notification.id)}
          />
        )}
      </For>
    </div>
  );
}; 