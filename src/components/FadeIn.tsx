// src/components/FadeIn.tsx
//
// FadeIn component for SolidJS

import {
  Component,
  createSignal,
  onMount,
  untrack,
  useTransition,
} from "solid-js";
import "./FadeIn.css"; // We'll define the necessary CSS here
import { SpinnerIcon } from "~/icons";

interface FadeInProps {
  children: any;
  duration?: number; // Transition duration in milliseconds
}

const FadeIn: Component<FadeInProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    if (!untrack(isVisible)) {
      setTimeout(() => {
        setIsVisible(true);
      }, 0);
    }
  });

  return (
    <div
      class={`fade-in ${isVisible() ? "visible" : "hidden"}`}
      style={{ "transition-duration": `${props.duration || 300}ms` }}
    >
      {props.children}
    </div>
  );
};

export default FadeIn;
