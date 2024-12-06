// src/components/FadeIn.tsx
//
// FadeIn component for SolidJS

import {
  JSX,
  children,
  Component,
  createEffect,
  createSignal,
  onMount,
  Show,
} from "solid-js";
import "./FadeIn.css";
import { useAppContext } from "~/contexts/app"; // For prev-navigation

interface FadeInProps {
  children: any;
  duration?: number; // Transition duration in milliseconds
}

const FadeIn: Component<FadeInProps> = (props) => {
  const appContext = useAppContext();
  // Disabled if there is no prevRoute or pathname change
  const fadeIn = () => {
    const prevRoute = appContext?.prevRoute;
    return prevRoute && prevRoute.pathname === "/";
  };
  const [getOpacity, setOpacity] = createSignal(fadeIn() ? 0 : 1);
  if (import.meta.env.DEV) {
    createEffect(() => {
      console.debug("fade-in", {
        isVisible: getOpacity(),
        fadeIn: fadeIn(),
        prev: appContext?.prevRoute?.pathname,
        route: location.pathname,
      });
    });
  }

  const getStyle = () => {
    const style = {
      opacity: getOpacity(),
    } as JSX.CSSProperties;
    if (props.duration) {
      style["transition-duration"] = `${props.duration}ms`;
    }
    return style;
  };

  onMount(() => {
    if (fadeIn()) {
      setOpacity(0);
      setTimeout(() => {
        setOpacity(1);
      }, 0);
    }
  });

  const child = children(() => props.children);

  return (
    <Show when={fadeIn()} fallback={child()}>
      <div class="fade-in" style={getStyle()}>
        {child()}
      </div>
    </Show>
  );
};

export default FadeIn;
