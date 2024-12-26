import { Component } from "solid-js";
import { useAppContext } from "~/contexts/app";
import "./Toggle.css";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  title?: string;
  disabled?: boolean;
}

export const Toggle: Component<ToggleProps> = (props) => {
  const app = useAppContext();

  return (
    <input
      type="checkbox"
      class="toggle"
      classList={{ "no-animation": app.disableAnimations }}
      checked={props.checked}
      onChange={(e) => props.onChange(e.currentTarget.checked)}
      title={props.title}
      disabled={props.disabled}
    />
  );
}; 