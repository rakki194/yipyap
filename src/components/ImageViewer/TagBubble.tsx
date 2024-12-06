import { Component, createSignal } from "solid-js";
import getIcon from "~/icons";

// Create a simple focus directive
const focus = (element: HTMLElement) => {
  element.focus();
};

// Add these variables outside the component to track last navigation
let lastNavigationTime = 0;
let lastNavigationDirection: "left" | "right" | null = null;
const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
  onEdit: (newTag: string) => void;
  onNavigate?: (
    direction: "left" | "right" | "up" | "down" | "start" | "end"
  ) => void;
}> = (props) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal(props.tag);
  let inputRef: HTMLInputElement | undefined;
  let contentRef: HTMLSpanElement | undefined;

  const startEditing = () => {
    if (contentRef) {
      // Get the current width before switching to edit mode
      const width = contentRef.offsetWidth;
      setIsEditing(true);

      // Use requestAnimationFrame to ensure the input is rendered before focusing
      requestAnimationFrame(() => {
        if (inputRef) {
          inputRef.focus();
          inputRef.style.width = `${width}px`;
        }
      });
    }
  };

  const getTagColor = (tag: string) => {
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;

    // Get the current theme from document.documentElement
    const currentTheme = document.documentElement.getAttribute("data-theme");

    // Adjust saturation and lightness based on theme
    const isDarkTheme = ["peanut", "gray", "dark"].includes(currentTheme || "");
    const saturation = isDarkTheme ? "30%" : "40%";
    const lightness = isDarkTheme ? "25%" : "85%";

    return `hsl(${hue}, ${saturation}, ${lightness})`;
  };

  const handleSubmit = () => {
    const newValue = editValue().trim();
    if (newValue && newValue !== props.tag) {
      props.onEdit(newValue);
    } else {
      setEditValue(props.tag); // Reset to original if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.shiftKey) {
      const now = Date.now();

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        // Check for double-tap left
        if (
          lastNavigationDirection === "left" &&
          now - lastNavigationTime < DOUBLE_TAP_THRESHOLD
        ) {
          props.onNavigate?.("start");
        } else {
          props.onNavigate?.("left");
        }
        lastNavigationTime = now;
        lastNavigationDirection = "left";
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        // Check for double-tap right
        if (
          lastNavigationDirection === "right" &&
          now - lastNavigationTime < DOUBLE_TAP_THRESHOLD
        ) {
          props.onNavigate?.("end");
        } else {
          props.onNavigate?.("right");
        }
        lastNavigationTime = now;
        lastNavigationDirection = "right";
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        props.onNavigate?.("up");
        lastNavigationDirection = null;
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        props.onNavigate?.("down");
        lastNavigationDirection = null;
      } else if (e.key === "Delete") {
        e.preventDefault();
        setIsEditing(false);
        props.onRemove();
        lastNavigationDirection = null;
      }
    }
  };

  return (
    <span
      class="tag-bubble"
      style={{
        "background-color": getTagColor(props.tag),
      }}
    >
      <span class="tag-content" ref={contentRef}>
        {isEditing() ? (
          <input
            type="text"
            value={editValue()}
            onInput={(e) => {
              setEditValue(e.currentTarget.value);
            }}
            onKeyDown={handleKeyDown}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === "Escape") {
                setIsEditing(false);
                setEditValue(props.tag);
              }
            }}
            onBlur={handleSubmit}
            ref={inputRef}
          />
        ) : (
          <span class="tag-text" onClick={startEditing}>
            {props.tag}
          </span>
        )}
      </span>
      <button
        type="button"
        class="icon remove-tag"
        onClick={props.onRemove}
        title="Remove tag"
      >
        {getIcon("dismiss")}
      </button>
    </span>
  );
};
