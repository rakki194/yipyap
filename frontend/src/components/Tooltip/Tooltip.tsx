import { Component, JSX, createSignal, onCleanup, createEffect, batch } from "solid-js";
import "./Tooltip.css";

export interface TooltipProps {
  content: string;
  children: JSX.Element;
  position?: "top" | "bottom" | "left" | "right";
  class?: string;
}

export const Tooltip: Component<TooltipProps> = (props) => {
  const [isVisible, setIsVisible] = createSignal(false);
  const [shouldShow, setShouldShow] = createSignal(false);
  const [isTimerComplete, setIsTimerComplete] = createSignal(false);
  let timeoutId: number | undefined;

  // Clear any existing timeout
  const clearTooltipTimeout = () => {
    if (timeoutId !== undefined) {
      window.clearTimeout(timeoutId);
      timeoutId = undefined;
      setIsTimerComplete(false);
    }
  };

  // Effect to handle visibility state
  createEffect(() => {
    clearTooltipTimeout();

    if (shouldShow()) {
      // Set timeout to show tooltip
      timeoutId = window.setTimeout(() => {
        batch(() => {
          setIsTimerComplete(true);
          setIsVisible(true);
        });
      }, 500);
    } else {
      // Hide tooltip immediately
      batch(() => {
        setIsVisible(false);
        setIsTimerComplete(false);
      });
    }
  });

  // Effect to sync aria-hidden with timer completion
  createEffect(() => {
    if (!shouldShow()) {
      setIsTimerComplete(false);
    }
  });

  const showTooltip = () => {
    setShouldShow(true);
  };

  const hideTooltip = () => {
    setShouldShow(false);
  };

  onCleanup(clearTooltipTimeout);

  return (
    <div
      class={`tooltip-wrapper ${props.class || ""}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {props.children}
      <div
        class={`tooltip-content ${props.position || "top"} ${isVisible() ? "visible" : ""}`}
        role="tooltip"
        aria-hidden={!isTimerComplete()}
        data-testid="tooltip"
        style={{
          "visibility": isVisible() ? "visible" : "hidden",
          "opacity": isVisible() ? "1" : "0",
          "pointer-events": isVisible() ? "auto" : "none"
        }}
      >
        {props.content}
      </div>
    </div>
  );
}; 