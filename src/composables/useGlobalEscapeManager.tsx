/**
 * A global keyboard event and overlay state manager that handles escape key presses across different modal states.
 * This manager provides centralized keyboard event handling and state management for modal, settings,
 * and quick jump overlays in the application.
 * 
 * @module useGlobalEscapeManager
 * 
 * Features:
 * - Manages global keyboard state for different overlay types (modal, settings, quick jump)
 * - Handles Escape key presses with priority-based overlay closing
 * - Provides a registration system for close handlers
 * - Automatically cleans up event listeners on unmount
 * 
 * State Structure:
 * ```ts
 * {
 *   modalOpen: boolean;    // Whether a modal is currently open
 *   settingsOpen: boolean; // Whether settings overlay is open
 *   quickJumpOpen: boolean;// Whether quick jump overlay is open
 * }
 * ```
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { registerCloseHandler, setKeyboardState } = createGlobalEscapeManager();
 * 
 *   onMount(() => {
 *     setKeyboardState('modalOpen', true);
 *     const cleanup = registerCloseHandler('modalOpen', () => {
 *       // Handle modal close
 *       setKeyboardState('modalOpen', false);
 *     });
 * 
 *     onCleanup(cleanup);
 *   });
 * 
 *   return <div>My Component</div>;
 * };
 * ```
 * 
 * @returns {Object} Manager methods and state management functions
 * @returns {Function} .registerCloseHandler - Registers a close handler for a specific overlay type
 * @returns {Function} .setKeyboardState - Updates the keyboard state for a specific overlay
 */

import { createSignal, onCleanup, onMount } from "solid-js";

interface KeyboardState {
  modalOpen: boolean;
  settingsOpen: boolean;
  quickJumpOpen: boolean;
}

export const [keyboardState, _setKeyboardState] = createSignal<KeyboardState>({
  modalOpen: false,
  settingsOpen: false,
  quickJumpOpen: false,
});

interface CloseHandlers {
  onCloseModal?: () => void;
  onCloseSettings?: () => void;
  onCloseQuickJump?: () => void;
}

const closeHandlers: CloseHandlers = {};

export const createGlobalEscapeManager = () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      
      const state = keyboardState();
      
      // Handle in order of priority
      if (state.settingsOpen && closeHandlers.onCloseSettings) {
        closeHandlers.onCloseSettings();
      } else if (state.modalOpen && closeHandlers.onCloseModal) {
        closeHandlers.onCloseModal();
      } else if (state.quickJumpOpen && closeHandlers.onCloseQuickJump) {
        closeHandlers.onCloseQuickJump();
      }
    }
  };

  onMount(() => {
    document.addEventListener('keydown', handleKeyDown);
    onCleanup(() => {
      document.removeEventListener('keydown', handleKeyDown);
    });
  });

  const setKeyboardState = (type: keyof KeyboardState, value: boolean) => {
    _setKeyboardState(prev => ({ ...prev, [type]: value }));
  };

  const registerCloseHandler = (type: keyof KeyboardState, handler: () => void) => {
    const baseType = type.replace(/Open$/, '');
    const handlerKey = `onClose${baseType.charAt(0).toUpperCase() + baseType.slice(1)}` as keyof CloseHandlers;
    closeHandlers[handlerKey] = handler;

    return () => {
      delete closeHandlers[handlerKey];
    };
  };

  return {
    registerCloseHandler,
    setKeyboardState,
  };
}; 