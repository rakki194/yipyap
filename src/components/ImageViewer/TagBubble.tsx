import { Component, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";

// Create a simple focus directive
const focus = (element: HTMLElement) => {
  element.focus();
};

// Add these variables outside the component to track last navigation
let lastNavigationTime = 0;
let lastNavigationDirection: "left" | "right" | null = null;
const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

const isColorDark = (hsl: string) => {
  // Extract lightness value from HSL string
  const match = hsl.match(/hsl\(\s*\d+\s*,\s*\d+%\s*,\s*(\d+)%\s*\)/);
  if (!match) return false;
  const lightness = parseInt(match[1]);
  
  // Also check if it's a dark blue hue (around 200-240)
  const hueMatch = hsl.match(/hsl\(\s*(\d+)\s*,/);
  const hue = hueMatch ? parseInt(hueMatch[1]) : 0;
  
  // Return true if either:
  // 1. Lightness is low (< 60%)
  // 2. It's a dark blue (hue 200-240) with lightness < 70%
  return lightness < 60 || (hue >= 200 && hue <= 240 && lightness < 70);
};

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
  onEdit: (newTag: string) => void;
  onNavigate?: (
    direction: "left" | "right" | "up" | "down" | "start" | "end"
  ) => void;
}> = (props) => {
  const app = useAppContext();
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

    const currentTheme = app.theme;

    switch (currentTheme) {
      case "dark":
        return `hsl(${hue}, 30%, 25%)`;

      case "light":
        return `hsl(${hue}, 40%, 85%)`;

      case "gray":
        return `hsl(0, 0%, ${45 + (hash % 20)}%)`;

      case "banana":
        // Warm yellow-based colors
        return `hsl(${40 + (hash % 40)}, ${60 + (hash % 20)}%, ${
          75 + (hash % 15)
        }%)`;

      case "strawberry":
        // Strawberry-inspired colors: reds, pinks, and greens for leaves
        const strawberryHues = [
          350, // Deep red
          335, // Pink-red
          15, // Coral-red
          120, // Leaf green
          150, // Light green
        ];
        const selectedStrawberryHue =
          strawberryHues[hash % strawberryHues.length];

        // Adjust saturation and lightness based on the hue
        const isGreen = selectedStrawberryHue >= 120;
        return isGreen
          ? `hsl(${selectedStrawberryHue}, ${50 + (hash % 20)}%, ${
              30 + (hash % 15)
            }%)` // Green leaves
          : `hsl(${selectedStrawberryHue}, ${80 + (hash % 15)}%, ${
              70 + (hash % 20)
            }%)`; // Red/pink fruit

      case "peanut":
        // Brown and warm earth tones
        return `hsl(${20 + (hash % 30)}, ${50 + (hash % 20)}%, ${
          35 + (hash % 15)
        }%)`;

      case "christmas":
        // Alternate between Christmas colors
        return hash % 2 === 0
          ? `hsl(350, ${70 + (hash % 20)}%, ${35 + (hash % 15)}%)` // Red
          : `hsl(120, ${60 + (hash % 20)}%, ${25 + (hash % 15)}%)`; // Green

      case "halloween":
        // Halloween colors: orange, purple, and dark green
        const halloweenHues = [25, 280, 150]; // Orange, Purple, Dark Green
        const selectedHue = halloweenHues[hash % halloweenHues.length];
        return `hsl(${selectedHue}, ${70 + (hash % 20)}%, ${
          45 + (hash % 15)
        }%)`;

      default:
        // Fallback to original behavior
        return `hsl(${hue}, 40%, 85%)`;
    }
  };

  // Add theme-specific hover effects
  const getHoverStyles = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    switch (currentTheme) {
      case "christmas":
        return {
          transform: "scale(1.05)",
          boxShadow: "0 0 8px rgba(196, 30, 58, 0.5)",
        };

      case "halloween":
        return {
          transform: "scale(1.05) rotate(-2deg)",
          boxShadow: "0 0 8px rgba(255, 102, 0, 0.5)",
        };

      case "strawberry":
        return {
          transform: "scale(1.05)",
          boxShadow: "0 0 8px rgba(255, 51, 102, 0.5)",
          filter: "saturate(1.2)",
        };

      default:
        return {
          transform: "scale(1.05)",
          boxShadow: "0 0 8px var(--shadow-color)",
        };
    }
  };

  // Add CSS for theme-specific animations
  const getTagBubbleAnimations = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");

    switch (currentTheme) {
      case "christmas":
        return "tag-bubble-twinkle 2s ease-in-out infinite alternate";

      case "halloween":
        return "tag-bubble-float 3s ease-in-out infinite";

      case "strawberry":
        return "tag-bubble-strawberry 3s ease-in-out infinite";

      default:
        return "none";
    }
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
        color: isColorDark(getTagColor(props.tag)) ? "#ffffff" : "#000000",
        ...getHoverStyles(),
      }}
    >
      <span class="tag-content" ref={contentRef}>
        {isEditing() ? (
          <input
            type="text"
            value={editValue()}
            style={{
              color: "inherit",
              "background-color": "transparent",
              "border-color": "currentColor",
            }}
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
