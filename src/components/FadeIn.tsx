// src/components/FadeIn.tsx
//
// FadeIn component for SolidJS

import {
  Component,
  createEffect,
  createMemo,
  createSignal,
  onMount,
  untrack,
  createRoot,
} from "solid-js";
import "./FadeIn.css"; // We'll define the necessary CSS here
import { SpinnerIcon } from "~/icons";
import { useLocation } from "@solidjs/router";
import { useAppContext } from "~/contexts/app"; // For prev-navigation

interface FadeInProps {
  children: any;
  duration?: number; // Transition duration in milliseconds
}

// Create a store outside the component to persist across remounts
const createRouteTracker = createRoot(() => {
  const [prevPath, setPrevPath] = createSignal<string>();
  return { prevPath, setPrevPath };
});

const FadeIn: Component<FadeInProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const routeLocation = useLocation();
  const { prevPath, setPrevPath } = createRouteTracker;

  const appContext = useAppContext();
  const location = useLocation();
  const fadeIn = () => {
    console.log("fade-in", appContext?.prevRoute, location.pathname);
    return appContext?.prevRoute?.pathname !== location.pathname;
  };

  if (import.meta.env.DEV) {
    createEffect(() => {
      console.debug("fade-in visible", {
        isVisible: isVisible(),
        fadeIn: untrack(fadeIn),
      });
    });

    createEffect(() => {
      console.debug("fade-in", fadeIn());
    });
  }

  onMount(() => {
    if (!untrack(isVisible)) {
      setTimeout(() => {
        setIsVisible(true);
      }, 0);
    }
  });

  return (
    <div
      classList={{
        fadeIn: fadeIn(),
        visible: isVisible(),
        hidden: !isVisible(),
      }}
      style={{ "transition-duration": `${props.duration || 300}ms` }}
    >
      {props.children}
    </div>
  );
};

export default FadeIn;
