import { Component, createMemo, createSignal } from "solid-js";
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

export const TagBubble: Component<{
  tag: string;
  index: number;
  onRemove: () => void;
  onEdit: (newTag: string) => void;
  onNavigate?: (
    direction: "left" | "right" | "up" | "down" | "start" | "end"
  ) => void;
}> = (props) => {
  const app = useAppContext();
  const [isEditing, setIsEditing] = createSignal(false);
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

  const getTagLCH = createMemo((): OKLCHColor => {
    const currentTheme = app.theme;
    let hash = 0,
      hue: number;
    if (currentTheme === "golden") {
      hue = props.index * 137.508;
    } else {
      const tag = props.tag;
      for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
      }
      hue = hash % 360;
    }

    switch (currentTheme) {
      case "dark":
        return { l: 25, c: 0.1, h: hue };

      case "light":
        return { l: 85, c: 0.1, h: hue };

      case "gray":
        return { l: 40 + (hash % 40), c: 0.0, h: hue };

      case "banana":
        return {
          l: 75 + (hash % 15),
          c: 0.15 + (hash % 10) / 100,
          h: 40 + (hash % 40),
        };

      case "strawberry":
        const strawberryHues = [350, 335, 15, 120, 150];
        const selectedStrawberryHue =
          strawberryHues[hash % strawberryHues.length];
        const isGreen = selectedStrawberryHue >= 120;

        return isGreen
          ? {
              l: 30 + (hash % 15),
              c: 0.15 + (hash % 10) / 100,
              h: selectedStrawberryHue,
            }
          : {
              l: 70 + (hash % 20),
              c: 0.2 + (hash % 10) / 100,
              h: selectedStrawberryHue,
            };

      case "peanut":
        return {
          l: 35 + (hash % 15),
          c: 0.15 + (hash % 10) / 100,
          h: 20 + (hash % 30),
        };

      case "christmas":
        return hash % 2 === 0
          ? { l: 35, c: 0.2, h: 350 } // Red
          : { l: 25, c: 0.2, h: 120 }; // Green

      case "halloween":
        const halloweenHues = [25, 280, 150];
        const selectedHue = halloweenHues[hash % halloweenHues.length];
        return { l: 45, c: 0.2, h: selectedHue };

      default:
        return { l: 80, c: 0.12, h: hue };
    }
  });

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

  const handleSubmit = (value: string) => {
    const newValue = value.trim();
    if (newValue && newValue !== props.tag) {
      props.onEdit(newValue);
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
        "background-color": formatOKLCH(getTagLCH()),
        color: getTagLCH().l < 50 ? "#ffffff" : "#000000",
        ...getHoverStyles(),
      }}
    >
      <span class="tag-content" ref={contentRef}>
        {isEditing() ? (
          <input
            type="text"
            value={props.tag}
            style={{
              color: "inherit",
              "background-color": "transparent",
              "border-color": "currentColor",
            }}
            onKeyDown={handleKeyDown}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e.currentTarget.value);
              }
              if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
            onBlur={(e) => handleSubmit(e.currentTarget.value)}
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

type OKLCHColor = {
  l: number; // Lightness percentage (0-100)
  c: number; // Chroma (0-0.4 typically)
  h: number; // Hue (0-360)
};

const formatOKLCH = ({ l, c, h }: OKLCHColor): string => {
  return `oklch(${l}% ${c} ${h})`;
};
