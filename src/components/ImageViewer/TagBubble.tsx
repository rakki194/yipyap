import { Component } from "solid-js";
import { DismissIcon } from "~/icons";

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
}> = (props) => {
  const getTagColor = (tag: string) => {
    // Generate a consistent hue based on the tag string
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    // Use a muted saturation and higher lightness for a lighter look
    return `hsl(${hue}, 40%, 85%)`;
  };

  return (
    <span
      class="tag-bubble"
      style={{
        "background-color": getTagColor(props.tag),
        color: "var(--text-secondary)", // Darker text for better contrast on light backgrounds
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
