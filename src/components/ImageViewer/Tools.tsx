import { Component, For } from "solid-js";
import { CAPTION_TOOLS } from "./captionTools";

export const Tools: Component<{
  onInput: (value: string) => void;
  caption: string;
}> = (props) => {
  return (
    <For each={CAPTION_TOOLS}>
      {(tool) => (
        <button
          type="button"
          class="icon"
          onClick={() => props.onInput(tool.action(props.caption))}
          title={tool.title}
          innerHTML={tool.icon}
        />
      )}
    </For>
  );
};
