/**
 * TagBubble Component Module
 * 
 * This module provides an interactive tag bubble component that supports editing,
 * navigation, and theme-based styling. It's used for displaying and managing
 * individual tags in the image viewer interface.
 * 
 * Features:
 * - Interactive editing with keyboard navigation
 * - Theme-aware styling using OKLCH color space
 * - Keyboard shortcuts for tag navigation and removal
 * - Animated hover effects and transitions
 * - Accessibility support with ARIA attributes
 */

import { Component, createMemo, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";

/**
 * Focus directive that programmatically focuses an HTML element
 * @param element - The HTML element to focus
 */
const focus = (element: HTMLElement) => {
  element.focus();
};

// Navigation state variables
let lastNavigationTime = 0;
let lastNavigationDirection: "left" | "right" | null = null;
const DOUBLE_TAP_THRESHOLD = 300; // milliseconds

/**
 * TagBubble Component
 * 
 * A component that renders an individual tag with editing and navigation capabilities.
 * 
 * @component
 * @param props.tag - The tag text to display
 * @param props.index - The index of the tag in the list
 * @param props.onRemove - Callback function when tag is removed
 * @param props.onEdit - Callback function when tag is edited, receives new tag value
 * @param props.onNavigate - Optional callback for keyboard navigation between tags
 */
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

  /**
   * Initiates the tag editing mode
   * Sets up the input field with appropriate sizing and focus
   */
  const startEditing = () => {
    if (contentRef) {
      const width = contentRef.offsetWidth;
      const currentFontSize = window.getComputedStyle(contentRef).fontSize;
      setIsEditing(true);

      requestAnimationFrame(() => {
        if (inputRef) {
          inputRef.focus();
          inputRef.style.minWidth = `${width}px`;
          inputRef.style.fontSize = `calc(${currentFontSize} * 1.1)`;
          inputRef.style.padding = '2px 4px';
        }
      });
    }
  };

  /**
   * Computes the OKLCH color values for the tag based on the current theme
   * Uses a hash of the tag text to generate consistent colors
   * 
   * @returns OKLCHColor object with lightness, chroma, and hue values
   */
  const getTagLCH = createMemo((): OKLCHColor => {
    const currentTheme = app.theme;
    let hash = 0;
    let hue: number;
    const tag = props.tag;

    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    hue = hash % 360;

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

  /**
   * Generates theme-specific hover effect styles
   * 
   * @returns Object containing CSS properties for hover effects
   */
  const getHoverStyles = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const baseScale = isEditing() ? 1.02 : 1.01;

    switch (currentTheme) {
      case "christmas":
        return {
          transform: `scale(${baseScale})`,
          boxShadow: "0 0 8px rgba(196, 30, 58, 0.5)",
        };

      case "halloween":
        return {
          transform: `scale(${baseScale}) rotate(-2deg)`,
          boxShadow: "0 0 8px rgba(255, 102, 0, 0.5)",
        };

      case "strawberry":
        return {
          transform: `scale(${baseScale})`,
          boxShadow: "0 0 8px rgba(255, 51, 102, 0.5)",
          filter: "saturate(1.2)",
        };

      default:
        return {
          transform: `scale(${baseScale})`,
          boxShadow: "0 0 8px var(--shadow-color)",
        };
    }
  };

  /**
   * Returns theme-specific animation class names
   * 
   * @returns CSS animation class name or 'none'
   */
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

  /**
   * Handles the submission of edited tag text
   * 
   * @param value - The new tag value to submit
   */
  const handleSubmit = (value: string) => {
    const newValue = value.trim();
    if (newValue && newValue !== props.tag) {
      props.onEdit(newValue);
    }
    setIsEditing(false);
  };

  /**
   * Handles keyboard navigation and shortcuts
   * Supports arrow key navigation and tag deletion
   * 
   * @param e - Keyboard event
   */
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
        "z-index": isEditing() ? "1" : "auto",
        transition: "transform 0.2s ease",
        margin: "0 0.5rem 0.5rem 0",
        "font-weight": isEditing() ? "bold" : "normal",
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
              "min-width": "100%", // Allow growing but not shrinking
              "box-sizing": "border-box",
              transition: "all 0.2s ease", // Smooth transition for size changes
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

/**
 * Represents a color in the OKLCH color space
 */
type OKLCHColor = {
  l: number; // Lightness percentage (0-100)
  c: number; // Chroma (0-0.4 typically)
  h: number; // Hue (0-360)
};

/**
 * Formats an OKLCH color object into a CSS color string
 * 
 * @param l - Lightness value
 * @param c - Chroma value
 * @param h - Hue value
 * @returns CSS color string in OKLCH format
 */
const formatOKLCH = ({ l, c, h }: OKLCHColor): string => {
  return `oklch(${l}% ${c} ${h})`;
};
