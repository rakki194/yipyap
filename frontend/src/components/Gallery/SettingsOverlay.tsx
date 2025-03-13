import { Component, onCleanup, onMount } from "solid-js";
import { Settings } from "~/components/Settings/Settings";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import "./SettingsOverlay.css";

/**
 * Props interface for the SettingsOverlay component
 */
interface SettingsOverlayProps {
  /** Callback function to close the settings overlay */
  onClose: () => void;
}

/**
 * SettingsOverlay component that displays application settings in a modal overlay
 * 
 * This component handles:
 * - Focus management (focus trap and restoration)
 * - Escape key handling for closing
 * - Click outside to close behavior
 * - Proper cleanup of event handlers and focus state
 * 
 * @param props - Component props of type SettingsOverlayProps
 * @returns A modal overlay containing the Settings component
 */
export const SettingsOverlay: Component<SettingsOverlayProps> = (props) => {
  let settingsRef: HTMLDivElement | undefined;
  const { registerHandler, setOverlayState } = useGlobalEscapeManager();

  /**
   * Setup function that runs on component mount
   * - Implements focus trap by storing previous focus and moving focus to overlay
   * - Registers escape key handler
   * - Sets up cleanup function for proper teardown
   */
  onMount(() => {
    // Focus trap
    const previouslyFocused = document.activeElement as HTMLElement;
    settingsRef?.focus();

    // Register escape handler
    setOverlayState("settings", true);
    const unregister = registerHandler("settings", props.onClose);

    onCleanup(() => {
      setOverlayState("settings", false);
      unregister();
      previouslyFocused?.focus();
    });
  });

  return (
    <div
      class="settings-overlay"
      onClick={props.onClose}
      ref={settingsRef}
      tabIndex={-1}
    >
      <div
        class="settings-content"
        onClick={(e) => e.stopPropagation()}
      >
        <Settings onClose={props.onClose} />
      </div>
    </div>
  );
}; 