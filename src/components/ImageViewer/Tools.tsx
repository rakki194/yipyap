import { Component, For } from "solid-js";
import { useAppContext } from "~/contexts/app";

import getIcon from "~/icons";

const CAPTION_TOOLS = [
  {
    icon: () => getIcon("sparkle"),
    title: "tools.removeCommas",
    action: (caption: string) => caption.replace(/,/g, ""),
  },
  {
    icon: () => getIcon("textAlign"),
    title: "tools.replaceNewlinesWithCommas",
    action: (caption: string) => caption.replace(/\n/g, ", "),
  },
  {
    icon: () => getIcon("textAlignDistributed"),
    title: "tools.replaceUnderscoresWithSpaces",
    action: (caption: string) => caption.replace(/_/g, " "),
  },
] as const;


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
