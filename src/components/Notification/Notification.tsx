import { Component, createSignal, onCleanup, Show, createEffect } from "solid-js";
import getIcon from "~/icons";
import "./Notification.css";

export interface NotificationProps {
  message: string;
  type: "error" | "success" | "info" | "warning";
  onClose?: () => void;
}

export const Notification: Component<NotificationProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(true);
  const [isExiting, setIsExiting] = createSignal(false);
  let timeout: NodeJS.Timeout | undefined;

  const getIconName = () => {
    switch (props.type) {
      case "error":
        return "error";
      case "success":
        return "success";
      case "info":
        return "info";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      props.onClose?.();
    }, 300); // Match CSS animation duration
  };

  const startTimer = () => {
    // Clear any existing timer
    if (timeout) {
      clearTimeout(timeout);
    }
    
    // Auto-dismiss after 3 seconds for non-error notifications
    if (props.type !== "error") {
      timeout = setTimeout(handleClose, 3000);
    }
  };

  // Start timer initially
  startTimer();

  // Reset timer when message changes
  createEffect(() => {
    props.message; // Track message changes
    startTimer();
  });

  onCleanup(() => {
    if (timeout) {
      clearTimeout(timeout);
    }
  });

  return (
    <Show when={isVisible()}>
      <div
        class="notification"
        classList={{
          [props.type]: true,
          exiting: isExiting(),
        }}
      >
        <span class="icon">{getIcon(getIconName())}</span>
        <span class="message">{props.message}</span>
        <button
          type="button"
          class="icon close-button"
          onClick={handleClose}
          aria-label="Close notification"
        >
          {getIcon("dismiss")}
        </button>
      </div>
    </Show>
  );
}; 