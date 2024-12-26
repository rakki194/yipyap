import { Component, onCleanup, onMount } from "solid-js";
import { Settings } from "~/components/Settings/Settings";
import { createGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import "./SettingsOverlay.css";

interface SettingsOverlayProps {
  onClose: () => void;
}

export const SettingsOverlay: Component<SettingsOverlayProps> = (props) => {
  let settingsRef: HTMLDivElement | undefined;
  const { registerCloseHandler, setKeyboardState } = createGlobalEscapeManager();

  onMount(() => {
    // Focus trap
    const previouslyFocused = document.activeElement as HTMLElement;
    settingsRef?.focus();

    // Register escape handler
    setKeyboardState("settingsOpen", true);
    const unregister = registerCloseHandler("settingsOpen", props.onClose);

    onCleanup(() => {
      setKeyboardState("settingsOpen", false);
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