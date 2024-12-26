import { Component, onCleanup, onMount } from "solid-js";
import { Settings } from "~/components/Settings/Settings";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import "./SettingsOverlay.css";

interface SettingsOverlayProps {
  onClose: () => void;
}

export const SettingsOverlay: Component<SettingsOverlayProps> = (props) => {
  let settingsRef: HTMLDivElement | undefined;
  const { registerHandler, setOverlayState } = useGlobalEscapeManager();

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