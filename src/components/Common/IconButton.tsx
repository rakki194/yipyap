// src/components/Common/IconButton.tsx
//
// A versatile button component that displays an icon and handles click events.
// It also supports tooltips.

import { Component, JSX } from "solid-js";

interface IconButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string; // SVG or icon HTML string
  title?: string;
  tooltip?: string;
}

const IconButton: Component<IconButtonProps> = (props) => {
  return (
    <button
      class={`icon-button ${props.class}`}
      onClick={props.onClick}
      title={props.tooltip || props.title}
      disabled={props.disabled}
      aria-label={props.title}
    >
      <span class="icon" innerHTML={props.icon}></span>
    </button>
  );
};

export default IconButton;
