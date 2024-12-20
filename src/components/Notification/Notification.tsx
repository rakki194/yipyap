import { Component, createSignal, onCleanup, Show, createEffect } from "solid-js";
import getIcon from "~/icons";
import "./Notification.css";

export interface NotificationProps {
  message: string;
  type: "error" | "success" | "info" | "warning";
  group?: string;
  icon?: "spinner" | "success" | "error" | "info" | "warning";
  onClose?: () => void;
}

export const Notification: Component<NotificationProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(true);
  const [isExiting, setIsExiting] = createSignal(false);
  const [isHovered, setIsHovered] = createSignal(false);
  const [hasEnteredOnce, setHasEnteredOnce] = createSignal(false);
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const getIconName = () => {
    if (props.icon) {
      return props.icon;
    }
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

  // Reset timer when message changes, but don't restart animation if already shown
  createEffect(() => {
    props.message; // Track message changes
    if (!hasEnteredOnce()) {
      setHasEnteredOnce(true);
    }
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
          "skip-animation": hasEnteredOnce(),
        }}
        data-group={props.group || ""}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span 
          class="icon" 
          classList={{ 
            "spin-icon": props.icon === "spinner" 
          }}
        >
          {getIcon(getIconName())}
        </span>
        <span class="message">{props.message}</span>
        <Show when={props.type === "error" || isHovered()}>
          <button
            type="button"
            class="icon close-button"
            onClick={handleClose}
            aria-label="Close notification"
          >
            {getIcon("dismiss")}
          </button>
        </Show>
      </div>
    </Show>
  );
}; 