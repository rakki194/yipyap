/**
 * A composable that monitors and manages the browser's online/offline connection status.
 * 
 * Features:
 * - Real-time connection status monitoring via browser's Navigator.onLine API
 * - Automatic notification handling for status changes
 * - Server-side safe (returns true when running on server)
 * - Cleanup on component unmount
 * - Deduplication of notifications
 * 
 * Usage Guide:
 * 
 * 1. Basic Usage:
 * ```tsx
 * const isOnline = useConnectionStatus();
 * return <div>Status: {isOnline() ? 'Connected' : 'Offline'}</div>;
 * ```
 * 
 * 2. With Conditional Rendering:
 * ```tsx
 * const isOnline = useConnectionStatus();
 * 
 * return (
 *   <Show when={!isOnline()}>
 *     <div class="offline-banner">
 *       You are currently offline. Some features may be unavailable.
 *     </div>
 *   </Show>
 * );
 * ```
 * 
 * 3. Disabling Features When Offline:
 * ```tsx
 * const isOnline = useConnectionStatus();
 * 
 * return (
 *   <button 
 *     disabled={!isOnline()} 
 *     onClick={handleSync}
 *   >
 *     Sync Data
 *   </button>
 * );
 * ```
 * 
 * Notification Behavior:
 * The system shows error notifications when the connection is lost and success
 * notifications when it is restored. If the application starts in an offline state,
 * it will trigger an initial notification.
 * 
 * All connection status notifications are tagged with 'connection-status' to prevent
 * duplicate notifications from being shown.
 * 
 * Note: The composable automatically handles cleanup of event listeners when the component
 * unmounts, so no manual cleanup is required.
 * 
 * @returns {() => boolean} A signal getter function that returns true if online, false if offline
 */

import { createEffect, createSignal, onCleanup } from 'solid-js';
import { isServer } from 'solid-js/web';
import { useAppContext } from '~/contexts/app';

const useConnectionStatus = isServer
  ? (): (() => boolean) => () => true
  : (): (() => boolean) => {
    const [state, setState] = createSignal(true);
    const app = useAppContext();
    let hasShownInitialOffline = false;

    createEffect(() => {
      const callback = () => {
        const isOnline = navigator.onLine;
        setState(isOnline);

        // Only show notifications after the initial state
        if (hasShownInitialOffline) {
          if (isOnline) {
            app.notify('notifications.connectionRestored', 'success', 'connection-status');
          } else {
            app.notify('notifications.connectionLost', 'error', 'connection-status');
          }
        } else if (!isOnline) {
          // If we start in offline state, show the notification
          app.notify('notifications.connectionLost', 'error', 'connection-status');
          hasShownInitialOffline = true;
        }
      };

      // Check initial state
      callback();

      window.addEventListener('online', callback, false);
      window.addEventListener('offline', callback, false);

      onCleanup(() => {
        window.removeEventListener('online', callback, false);
        window.removeEventListener('offline', callback, false);
      });
    });

    return state;
  };

export default useConnectionStatus; 