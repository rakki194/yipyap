// src/components/Common/Tooltip.tsx

import { Component, JSX } from "solid-js";
import "./Tooltip.css";

interface TooltipProps {
  text: string;
  children: JSX.Element;
}

const Tooltip: Component<TooltipProps> = (props) => {
  return (
    <div class="tooltip-wrapper">
      {props.children}
      <span class="tooltip-text">{props.text}</span>
    </div>
  );
};

export default Tooltip;
