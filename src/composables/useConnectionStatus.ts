/**
 * A reactive hook that monitors and manages the browser's online/offline connection status.
 * 
 * This hook provides real-time connection status monitoring and notification handling:
 * - Returns a signal getter function that indicates the current online status (true = online, false = offline)
 * - Automatically shows notifications when connection status changes
 * - Handles both initial state and subsequent changes
 * - Server-side safe (always returns true when running on server)
 * 
 * Notifications are shown in these scenarios:
 * - When connection is lost (error notification)
 * - When connection is restored (success notification)
 * - On initial load if starting in offline state
 * 
 * @example
 * ```tsx
 * const isOnline = useConnectionStatus();
 * 
 * // Use in JSX
 * <div>Status: {isOnline() ? 'Connected' : 'Offline'}</div>
 * ```
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