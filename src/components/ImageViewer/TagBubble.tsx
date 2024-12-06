import { Component, createSignal, onMount } from "solid-js";
import { DismissIcon } from "~/icons";

// Create a simple focus directive
const focus = (element: HTMLElement) => {
  element.focus();
};

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
  onEdit: (newTag: string) => void;
}> = (props) => {
  const [isEditing, setIsEditing] = createSignal(false);
  const [editValue, setEditValue] = createSignal(props.tag);
  let inputRef: HTMLInputElement | undefined;

  const startEditing = () => {
    setIsEditing(true);
    // Use requestAnimationFrame to ensure the input is rendered before focusing
    requestAnimationFrame(() => {
      if (inputRef) {
        inputRef.focus();
        inputRef.style.width = `${props.tag.length + 2}ch`;
      }
    });
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

  return (
    <span
      class="tag-bubble"
      style={{
        "background-color": getTagColor(props.tag),
      }}
    >
      {isEditing() ? (
        <input
          type="text"
          value={editValue()}
          onInput={(e) => {
            setEditValue(e.currentTarget.value);
            // Dynamically adjust input width
            e.currentTarget.style.width = `${
              e.currentTarget.value.length + 2
            }ch`;
          }}
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
