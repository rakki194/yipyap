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

import { Component, createMemo, createSignal, Show, onCleanup, onMount } from "solid-js";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";
import { useTagAutocomplete } from "~/composables/useTagAutocomplete";
import { Portal } from "solid-js/web";

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
 * Interface for OKLCH color representation
 * OKLCH is a perceptually uniform color space that represents colors using:
 * - Lightness (L): 0-100%, where 0 is black and 100 is white
 * - Chroma (C): 0+, represents color intensity/saturation
 * - Hue (H): 0-360 degrees on the color wheel
 */
type OKLCHColor = {
  l: number; // Lightness percentage (0-100)
  c: number; // Chroma (0-0.4 typically)
  h: number; // Hue (0-360)
};

/**
 * Creates a memoized color generator with caching for tag colors.
 * Uses a deterministic hashing algorithm to generate consistent colors for the same tag.
 * Colors are theme-aware and optimized for accessibility and visual harmony.
 * 
 * Color generation strategy per theme:
 * - dark: Low lightness (25%), subtle chroma for muted colors
 * - light: High lightness (85%), subtle chroma for soft colors
 * - gray: Variable lightness (40-80%), zero chroma for grayscale
 * - banana: Warm yellows and creams with high lightness
 * - strawberry: Red/pink tones with green accents
 * - peanut: Warm browns and tans
 * 
 * @returns A function that computes and caches OKLCH colors for tags
 */
function createTagColorGenerator() {
  const colorCache = new Map<string, OKLCHColor>();

  return {
    getTagColor(theme: string, tag: string): OKLCHColor {
      // Normalize the tag by replacing spaces with underscores for consistent hashing
      const normalizedTag = tag.replace(/\s+/g, '_');
      const cacheKey = `${theme}:${normalizedTag}`;

      // Return cached color if available
      const cachedColor = colorCache.get(cacheKey);
      if (cachedColor) {
        return cachedColor;
      }

      /**
       * Generate a deterministic hash from the normalized tag string
       * This ensures the same tag always gets the same color
       * The hash is used to vary hue, lightness, and chroma values
       */
      let hash = 0;
      for (let i = 0; i < normalizedTag.length; i++) {
        hash = normalizedTag.charCodeAt(i) + ((hash << 5) - hash);
      }
      const hue = hash % 360;

      // Theme-specific color generation
      const color = (() => {
        switch (theme) {
          case "dark":
            // Dark theme: Low lightness for dark background, subtle color variations
            return { l: 25, c: 0.1, h: hue };

          case "light":
            // Light theme: High lightness for light background, subtle color variations
            return { l: 85, c: 0.1, h: hue };

          case "gray":
            // Gray theme: Variable lightness, no chroma for pure grayscale
            return { l: 40 + (hash % 40), c: 0.0, h: hue };

          case "banana":
            // Banana theme: Warm yellows and creams
            return {
              l: 75 + (hash % 15),  // High lightness range: 75-90%
              c: 0.15 + (hash % 10) / 100,  // Subtle chroma variations
              h: 40 + (hash % 40),  // Hue range: 40-80 (yellow to orange)
            };

          case "strawberry": {
            // Strawberry theme: Red/pink with green accents
            const strawberryHues = [350, 335, 15, 120, 150]; // Red, pink, coral, green hues
            const selectedStrawberryHue = strawberryHues[hash % strawberryHues.length];
            const isGreen = selectedStrawberryHue >= 120;

            return isGreen
              ? {
                l: 35 + (hash % 10),  // Dark background for green (white text)
                c: 0.25 + (hash % 10) / 100,  // Saturated green
                h: selectedStrawberryHue,
              }
              : {
                l: 75 + (hash % 15),  // Light background for pink/red (black text)
                c: 0.2 + (hash % 15) / 100,  // Variable saturation for pink/red
                h: selectedStrawberryHue,
              };
          }

          case "peanut":
            // Peanut theme: Warm browns and tans
            return {
              l: 35 + (hash % 15),  // Mid-range lightness
              c: 0.15 + (hash % 10) / 100,  // Moderate chroma
              h: 20 + (hash % 30),  // Brown hue range
            };

          default:
            // Default theme: Soft, neutral colors
            return { l: 80, c: 0.12, h: hue };
        }
      })();

      // Cache and return the computed color
      colorCache.set(cacheKey, color);
      return color;
    },

    // Add method to clear the cache
    clearCache() {
      colorCache.clear();
    }
  };
}

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
  const t = app.t;
  const [isEditing, setIsEditing] = createSignal(false);
  let inputRef: HTMLInputElement | undefined;
  let contentRef: HTMLDivElement | undefined;
  let suggestionsList: HTMLDivElement | undefined;
  let tagBubbleRef: HTMLDivElement | undefined;
  const tagColorGenerator = createTagColorGenerator();
  
  // Initialize tag autocomplete
  const {
    query,
    setQuery,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    isOpen,
    setIsOpen,
    selectNextSuggestion,
    selectPreviousSuggestion,
    getSelectedSuggestion,
    clearSuggestions,
  } = useTagAutocomplete();

  /**
   * Close all suggestions and exit editing mode
   */
  const closeAllSuggestions = () => {
    clearSuggestions();
    setIsOpen(false);
    if (suggestionsList) {
      suggestionsList.classList.remove('visible');
    }
  };

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
          
          // Initialize autocomplete with current tag value
          setQuery(props.tag);
          if (props.tag.length >= 2) {
            setIsOpen(true);
            positionSuggestions();
          }
        }
      });
    }
  };

  // Global click handler to detect clicks outside component
  const handleDocumentClick = (e: MouseEvent) => {
    if (!isEditing()) return;
    
    // Check if click was inside our component or suggestions list
    const target = e.target as Node;
    const isClickInsideTagBubble = tagBubbleRef?.contains(target);
    const isClickInsideSuggestions = suggestionsList?.contains(target);
    
    // If clicking outside both tag bubble and suggestions
    if (!isClickInsideTagBubble && !isClickInsideSuggestions) {
      if (inputRef) {
        handleSubmit(inputRef.value);
      }
      closeAllSuggestions();
      setIsEditing(false);
    }
  };
  
  // Set up and clean up global event listeners
  onMount(() => {
    document.addEventListener('mousedown', handleDocumentClick);
  });
  
  onCleanup(() => {
    document.removeEventListener('mousedown', handleDocumentClick);
    closeAllSuggestions();
  });

  // Position the suggestions dropdown below the input
  const positionSuggestions = () => {
    if (!suggestionsList || !inputRef) return;
    
    const rect = inputRef.getBoundingClientRect();
    
    // Position the suggestions below the input
    suggestionsList.style.top = `${rect.bottom + 2}px`;
    suggestionsList.style.left = `${rect.left}px`;
    suggestionsList.style.width = `${rect.width}px`;
    
    // Make sure suggestions are visible
    suggestionsList.classList.add('visible');
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    if (inputRef) {
      inputRef.value = suggestion;
      handleSubmit(suggestion);
    }
    closeAllSuggestions();
  };

  /**
   * Computes and caches the OKLCH color values for the tag based on the current theme
   * Uses a hash of the tag text to generate consistent colors
   * 
   * @returns OKLCHColor object with lightness, chroma, and hue values
   */
  const getTagLCH = createMemo(() =>
    // Always use the original tag with underscores for consistent color generation
    tagColorGenerator.getTagColor(app.theme, props.tag)
  );

  /**
   * Generates theme-specific hover effect styles
   * 
   * @returns Object containing CSS properties for hover effects
   */
  const getHoverStyles = () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const baseScale = isEditing() ? 1.02 : 1.01;

    switch (currentTheme) {
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
    if (!newValue) {
      props.onRemove();
    } else if (newValue !== props.tag) {
      tagColorGenerator.clearCache(); // Clear the cache before editing
      props.onEdit(newValue);
    }
    setIsEditing(false);
    closeAllSuggestions();
  };

  /**
   * Handles keyboard navigation and shortcuts
   * Supports arrow key navigation and tag deletion
   * 
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle autocomplete navigation when suggestions are open
    if (isOpen() && suggestions() && suggestions().length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectNextSuggestion();
        return;
      }
      
      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectPreviousSuggestion();
        return;
      }
      
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        const selected = getSelectedSuggestion();
        if (selected) {
          if (inputRef) {
            inputRef.value = selected;
          }
          if (e.key === "Enter") {
            handleSubmit(selected);
          }
          closeAllSuggestions();
        } else if (e.key === "Enter" && inputRef) {
          handleSubmit(inputRef.value);
        }
        return;
      }
      
      if (e.key === "Escape") {
        e.preventDefault();
        closeAllSuggestions();
        return;
      }
    }
    
    // Continue with existing keyboard navigation
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
  
  // Handle input changes for autocomplete
  const handleInputChange = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    
    // Don't show suggestions for empty input
    if (!value || value.trim() === "") {
      setIsOpen(false);
      if (suggestionsList) {
        suggestionsList.classList.remove('visible');
      }
      return;
    }
    
    setQuery(value);
    
    // Show suggestions if we have at least 2 characters
    if (value.length >= 2) {
      setIsOpen(true);
      positionSuggestions();
    } else {
      setIsOpen(false);
      if (suggestionsList) {
        suggestionsList.classList.remove('visible');
      }
    }
  };

  return (
    <div
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
      ref={tagBubbleRef}
    >
      <div class="tag-content" ref={contentRef}>
        <Show
          when={!isEditing()}
          fallback={
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
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !isOpen()) {
                  handleSubmit(e.currentTarget.value);
                }
                if (e.key === "Escape") {
                  setIsEditing(false);
                  closeAllSuggestions();
                }
              }}
              onFocus={() => {
                if (inputRef && inputRef.value.length >= 2) {
                  setQuery(inputRef.value);
                  setIsOpen(true);
                  positionSuggestions();
                }
              }}
              ref={inputRef}
              placeholder={t('gallery.addTag')}
            />
          }
        >
          <span class="tag-text" onClick={startEditing}>
            {props.tag}
          </span>
        </Show>
      </div>
      <button
        type="button"
        class="icon remove-tag"
        onClick={props.onRemove}
        title="Remove tag"
      >
        {getIcon("dismiss")}
      </button>
      
      {/* Tag suggestions dropdown */}
      <Portal>
        <Show when={isEditing() && isOpen() && suggestions() && suggestions().length > 0}>
          <div
            class="tag-suggestions-portal tag-suggestions visible"
            ref={suggestionsList}
            style={{
              "z-index": "9999",
              "position": "fixed",
              "max-height": "200px",
              "overflow-y": "auto",
              "background-color": "var(--card-bg, white)",
              "border": "1px solid var(--border-color, #ccc)",
              "border-radius": "4px",
              "box-shadow": "0 4px 12px rgba(0, 0, 0, 0.2)",
            }}
          >
            {suggestions().length > 0 ? (
              suggestions().map((suggestion: string, index: number) => (
                <div
                  class="tag-suggestion"
                  classList={{ selected: index === selectedIndex() }}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))
            ) : (
              <div class="no-suggestions">No suggestions found</div>
            )}
          </div>
        </Show>
      </Portal>
    </div>
  );
};

/**
 * Formats an OKLCH color object into a CSS color string
 * 
 * @param color - OKLCH color object with lightness, chroma, and hue values
 * @returns CSS color string in OKLCH format (e.g., "oklch(80% 0.12 240)")
 */
const formatOKLCH = ({ l, c, h }: OKLCHColor): string => {
  return `oklch(${l}% ${c} ${h})`;
};
