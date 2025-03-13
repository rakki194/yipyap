/**
 * GlobalEscapeManager.tsx
 * 
 * A global manager for handling escape key presses and managing overlay states in the application.
 * This module provides a centralized way to handle escape key events and manage the state of
 * different types of overlays (modal, settings, quickJump) with a priority-based closing system.
 * 
 * Usage Guide:
 * ------------
 * 1. Import and Setup:
 *    ```tsx
 *    import { useGlobalEscapeManager } from './composables/useGlobalEscapeManager';
 *    
 *    const MyComponent = () => {
 *      const escape = useGlobalEscapeManager();
 *      // ... rest of component
 *    };
 *    ```
 * 
 * 2. Managing Overlay State:
 *    - Use setOverlayState to control overlay visibility:
 *    ```tsx
 *    // Opening an overlay
 *    escape.setOverlayState('modal', true);
 *    
 *    // Closing an overlay
 *    escape.setOverlayState('modal', false);
 *    ```
 * 
 * 3. Handling Escape Key:
 *    - Register a close handler in onMount:
 *    ```tsx
 *    onMount(() => {
 *      const cleanup = escape.registerHandler('modal', () => {
 *        // Handle closing logic here
 *        escape.setOverlayState('modal', false);
 *      });
 *      
 *      onCleanup(cleanup);
 *    });
 *    ```
 * 
 * Priority System:
 * ---------------
 * Overlays are closed in the following priority order when Escape is pressed:
 * 1. Settings (highest priority)
 * 2. Modal
 * 3. QuickJump (lowest priority)
 * 
 * Only one overlay can be active at a time. When a higher-priority overlay
 * is open, pressing Escape will close it before affecting lower-priority overlays.
 * 
 * Best Practices:
 * --------------
 * 1. Always clean up handlers:
 *    ```tsx
 *    onMount(() => {
 *      const cleanup = escape.registerHandler('modal', handleClose);
 *      onCleanup(() => {
 *        cleanup();
 *        escape.setOverlayState('modal', false);
 *      });
 *    });
 *    ```
 * 
 * 2. Keep state in sync:
 *    - Update overlay state when manually closing:
 *    ```tsx
 *    const closeModal = () => {
 *      // Your close logic
 *      escape.setOverlayState('modal', false);
 *    };
 *    ```
 * 
 * 3. Check current state:
 *    ```tsx
 *    const isModalOpen = () => escape.state().modalOpen;
 *    ```
 * 
 * Types:
 * ------
 * - OverlayType: 'modal' | 'settings' | 'quickJump'
 * - Each overlay has corresponding state and handler management
 * 
 * Note: This manager automatically prevents event bubbling and default
 * behavior for Escape key events when handling overlays.
 */

import { createSignal, onCleanup, onMount, createRoot } from "solid-js";

type OverlayType = 'modal' | 'settings' | 'quickJump';

/**
 * Represents the current state of all keyboard-managed overlays.
 */
interface KeyboardState {
  modalOpen: boolean;
  settingsOpen: boolean;
  quickJumpOpen: boolean;
}

type CloseHandler = () => void;

interface CloseHandlers {
  modal?: CloseHandler;
  settings?: CloseHandler;
  quickJump?: CloseHandler;
}

/**
 * Creates a singleton instance for managing global escape key and overlay state.
 */
const createGlobalState = () => {
  const [state, setState] = createSignal<KeyboardState>({
    modalOpen: false,
    settingsOpen: false,
    quickJumpOpen: false,
  });

  const handlers: CloseHandlers = {};

  /**
   * Updates the state of a specific overlay type.
   */
  const setOverlayState = (type: OverlayType, value: boolean) => {
    setState(prev => ({ ...prev, [`${type}Open`]: value }));
  };

  /**
   * Registers a close handler for a specific overlay type.
   * Returns a cleanup function to remove the handler.
   */
  const registerHandler = (type: OverlayType, handler: CloseHandler) => {
    handlers[type] = handler;
    return () => {
      delete handlers[type];
    };
  };

  /**
   * Handles escape key press events according to overlay priority.
   * Priority order: settings > modal > quickJump
   */
  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();

      const currentState = state();

      // Handle in order of priority
      if (currentState.settingsOpen && handlers.settings) {
        handlers.settings();
      } else if (currentState.modalOpen && handlers.modal) {
        handlers.modal();
      } else if (currentState.quickJumpOpen && handlers.quickJump) {
        handlers.quickJump();
      }
    }
  };

  return {
    state,
    setOverlayState,
    registerHandler,
    handleEscape,
  };
};

const globalState = createRoot(createGlobalState);

/**
 * A composable that provides global escape key and overlay state management.
 * 
 * @example
 * ```tsx
 * const MyModal = () => {
 *   const escape = useGlobalEscapeManager();
 * 
 *   onMount(() => {
 *     escape.setOverlayState('modal', true);
 *     const cleanup = escape.registerHandler('modal', () => {
 *       escape.setOverlayState('modal', false);
 *     });
 * 
 *     onCleanup(cleanup);
 *   });
 * 
 *   return <div>Modal Content</div>;
 * };
 * ```
 */
export const useGlobalEscapeManager = () => {
  onMount(() => {
    document.addEventListener('keydown', globalState.handleEscape);
    onCleanup(() => {
      document.removeEventListener('keydown', globalState.handleEscape);
    });
  });

  return {
    state: globalState.state,
    setOverlayState: globalState.setOverlayState,
    registerHandler: globalState.registerHandler,
  };
}; 