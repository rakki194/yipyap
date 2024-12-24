import { Component, For } from "solid-js";
import { useTransformations } from "~/contexts/transformations";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";
import "./TransformationSettings.css";

export const TransformationSettings: Component<{
  onClose: () => void;
}> = (props) => {
  const { t } = useAppContext();
  const { state, applyTransformation } = useTransformations();

  return (
    <div class="transformation-settings">
      <div class="settings-header">
        <h3>{t("tools.transformations")}</h3>
      </div>
      
      <div class="transformations-list">
        <For each={state.transformations}>
          {(transformation) => (
            <div class="transformation-item">
              <span class="icon">{getIcon(transformation.icon)}</span>
              <span class="name">{t(transformation.name)}</span>
              <span class="description">{transformation.description}</span>
              <button
                type="button"
                class="icon apply-button"
                onClick={() => {
                  applyTransformation(transformation.id, "");
                  props.onClose();
                }}
                title={t("common.apply")}
              >
                {getIcon("check")}
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
} 