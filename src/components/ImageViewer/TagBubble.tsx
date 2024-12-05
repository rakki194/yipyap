import { Component } from "solid-js";
import { DismissIcon } from "~/icons";

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
}> = (props) => {
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

  return (
    <span
      class="tag-bubble"
      style={{
        "background-color": getTagColor(props.tag),
        color: "var(--text-secondary)",
      }}
    >
      <span class="tag-text">{props.tag}</span>
      <button
        type="button"
        class="icon remove-tag"
        onClick={props.onRemove}
        title="Remove tag"
        innerHTML={DismissIcon}
      />
    </span>
  );
};
