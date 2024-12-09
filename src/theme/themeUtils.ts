import { ThemeName } from "./ThemeProvider";

// LCH color space utilities for consistent color generation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}

function getLCHColor(tag: string): { l: number; c: number; h: number } {
  const hash = hashString(tag);
  return {
    l: 65 + (hash % 20),          // Lightness: 65-85
    c: 40 + (hash % 40),          // Chroma: 40-80
    h: (hash % 360),              // Hue: 0-360
  };
}

export function computeTagBackground(theme: ThemeName, tag: string): string {
  const { l, c, h } = getLCHColor(tag);
  
  // Adjust lightness based on theme
  const lightness = theme === "dark" ? l * 0.7 : l;
  
  return `lch(${lightness}% ${c} ${h})`;
}

export function computeTagColor(theme: ThemeName, tag: string): string {
  const { l } = getLCHColor(tag);
  
  // For dark theme, use lighter text
  if (theme === "dark") {
    return l < 60 ? "rgb(240, 240, 240)" : "rgb(20, 20, 20)";
  }
  
  // For light theme, ensure contrast
  return l > 65 ? "rgb(20, 20, 20)" : "rgb(240, 240, 240)";
}

export function computeHoverStyles(theme: ThemeName): Record<string, string> {
  switch (theme) {
    case "dark":
      return {
        filter: "brightness(1.2)",
        transform: "scale(1.05)",
      };
    case "light":
      return {
        filter: "brightness(0.9)",
        transform: "scale(1.05)",
      };
    default:
      return {
        filter: "brightness(1.1)",
        transform: "scale(1.05)",
      };
  }
}

export function computeAnimation(theme: ThemeName): string {
  // Different animation styles for different themes
  switch (theme) {
    case "christmas":
      return "twinkle 2s infinite";
    case "halloween":
      return "spooky 3s infinite";
    default:
      return "none";
  }
} 