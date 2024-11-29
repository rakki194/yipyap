// src/components/FadeIn.tsx
//
// FadeIn component for SolidJS

import { Component, createEffect, createSignal } from "solid-js";
import "./FadeIn.css"; // We'll define the necessary CSS here

interface FadeInProps {
  children: any;
  duration?: number; // Transition duration in milliseconds
}

const FadeIn: Component<FadeInProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);

  createEffect(() => {
    // Trigger fade-in after component mounts
    setTimeout(() => {
      setIsVisible(true);
    }, 50); // Slight delay to ensure CSS transition
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
