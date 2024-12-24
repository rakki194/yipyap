import { Component, For } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useTransformations } from "~/contexts/transformations";
import getIcon from "~/icons";
import "./CaptionTools.css";

export const CaptionTools: Component<{
  onInput: (value: string) => void;
  caption: string;
}> = (props) => {
  const { t } = useAppContext();
  const { state, applyTransformation } = useTransformations();
  
  return (
    <>
      <For each={state.transformations}>
        {(tool) => (
          <button
            type="button"
            class="icon"
            onClick={() => props.onInput(applyTransformation(tool.id, props.caption))}
            title={t(tool.name)}
          >
            {getIcon(tool.icon)}
          </button>
        )}
      </For>
    </>
  );
};
