import { onCleanup, onMount } from "solid-js";

export interface DoubleTapOptions {
    onDoubleTap: () => void;
    threshold?: number;
    key?: string;
    passive?: boolean;
}

export function useDoubleTap(options: DoubleTapOptions) {
    const {
        onDoubleTap,
        threshold = 300,
        key = "Shift",
        passive = false
    } = options;

    let lastTapTime = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === key) {
            const now = Date.now();
            if (now - lastTapTime < threshold) {
                e.preventDefault();
                onDoubleTap();
                lastTapTime = 0; // Reset to prevent triple-tap
            } else {
                lastTapTime = now;
            }
        }
    };

    onMount(() => {
        window.addEventListener('keydown', handleKeyDown, { passive });
        onCleanup(() => window.removeEventListener('keydown', handleKeyDown));
    });
} 