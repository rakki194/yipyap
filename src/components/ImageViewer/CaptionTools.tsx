import { Component, For, Show } from "solid-js";
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
        {(transformation) => (
          <Show when={transformation.enabled}>
            <button
              type="button"
              class="icon"
              onClick={() => props.onInput(applyTransformation(transformation.id, props.caption))}
              title={t(transformation.name)}
            >
              {getIcon(transformation.icon)}
            </button>
          </Show>
        )}
      </For>
    </>
  );
};
