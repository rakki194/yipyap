import { Component } from "solid-js";
import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  disabled?: boolean;
}

export const Toggle: Component<ToggleProps> = (props) => {
  return (
    <input
      type="checkbox"
      class="toggle"
      checked={props.checked}
      onChange={(e) => props.onChange(e.currentTarget.checked)}
      title={props.title}
      disabled={props.disabled}
    />
  );
}; 