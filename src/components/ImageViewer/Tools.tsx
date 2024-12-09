import { Component, For } from "solid-js";
import { CAPTION_TOOLS } from "./captionTools";
import { useAppContext } from "~/contexts/app";

export const Tools: Component<{
  onInput: (value: string) => void;
  caption: string;
}> = (props) => {
  const { t } = useAppContext();
  
  return (
    <For each={CAPTION_TOOLS}>
      {(tool) => (
        <button
          type="button"
          class="icon"
          onClick={() => props.onInput(tool.action(props.caption))}
          title={t(tool.title)}
        >
          {tool.icon()}
        </button>
      )}
    </For>
  );
};
