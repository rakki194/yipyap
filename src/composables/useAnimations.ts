import { createEffect } from "solid-js";
import { useAppContext } from "~/contexts/app";

export function useAnimations() {
    const app = useAppContext();

    createEffect(() => {
        if (app.disableAnimations) {
            // Disable all CSS transitions and animations
            document.documentElement.style.setProperty("--transition-duration", "0s");
            document.documentElement.style.setProperty("--animation-duration", "0s");
            document.documentElement.style.setProperty("--transition-timing", "step-end");
            document.documentElement.style.setProperty("--animation-timing", "step-end");

            // Add class to disable animations globally
            document.documentElement.classList.add("no-animations");

            // Force-disable all animations via CSS
            const style = document.createElement("style");
            style.id = "no-animations-style";
            style.textContent = `
                * {
                    animation-duration: 0s !important;
                    animation-delay: 0s !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0s !important;
                    transition-delay: 0s !important;
                }
                
                /* Disable specific animations but preserve layout properties */
                @keyframes immediate {
                    from { opacity: 1; }
                    to { opacity: 1; }
                }
                
                /* Override specific animations that might affect layout */
                .fadeIn, 
                .fadeOut,
                .slideIn,
                .slideOut,
                .rotate,
                .spin,
                .pulse,
                .tag-bubble,
                .tag-bubble input,
                .tag-bubble:hover,
                [data-theme="strawberry"] .tag-bubble,
                [data-theme="strawberry"] .tag-bubble:hover {
                    animation: none !important;
                    transition: none !important;
                    transform: none !important;
                }

                /* Disable tag bubble specific animations */
                @keyframes tag-bubble-strawberry { 
                    0%, 100% { transform: none; }
                }
                @keyframes input-fade-in {
                    from, to { opacity: 1; transform: none; }
                }
            `;
            document.head.appendChild(style);
        } else {
            // Re-enable animations
            document.documentElement.style.setProperty("--transition-duration", "0.2s");
            document.documentElement.style.setProperty("--animation-duration", "0.3s");
            document.documentElement.style.setProperty("--transition-timing", "ease");
            document.documentElement.style.setProperty("--animation-timing", "ease");

            // Remove no-animations class
            document.documentElement.classList.remove("no-animations");

            // Remove the force-disable style if it exists
            const style = document.getElementById("no-animations-style");
            if (style) {
                style.remove();
            }
        }
    });

    return {
        isDisabled: () => app.disableAnimations
    };
} 