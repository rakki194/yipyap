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