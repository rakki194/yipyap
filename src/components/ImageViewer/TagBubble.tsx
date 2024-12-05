import { Component } from "solid-js";
import { DeleteIcon } from "~/icons";

export const TagBubble: Component<{
  tag: string;
  onRemove: () => void;
}> = (props) => {
  return (
    <span class="tag-bubble">
      <span class="tag-text">{props.tag}</span>
      <button
        type="button"
        class="icon remove-tag"
        style={{
          border: "none",
        }}
        onClick={props.onRemove}
        title="Remove tag"
        innerHTML={DeleteIcon}
      />
    </span>
  );
};
