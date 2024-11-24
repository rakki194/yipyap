// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, For, Show, Index } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { Captions } from "~/resources/browse";
import {
  EditIcon,
  SaveIcon,
  ErrorIcon,
  captionIconsMap,
} from "~/components/icons";

interface CaptionEditorProps {
  path: string;
  captions: Captions;
}

const CaptionInput = (props: {
  value: string;
  onInput: (value: string) => void;
  status: string;
}) => {
  const getStatusIcon = () => {
    switch (props.status) {
      case "saved":
        return SaveIcon;
      case "error":
        return ErrorIcon;
      default:
        return;
    }
  };

  return (
    <div class="caption-input-wrapper">
      <div class="caption-icons">
        <span innerHTML={EditIcon} />
        <span innerHTML={EditIcon} />
      </div>
      <textarea
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder="Add a caption..."
        rows="3"
      />
      <Show when={getStatusIcon()}>
        {(getStatusIcon) => <span innerHTML={getStatusIcon()} />}
      </Show>
    </div>
  );
};

export const CaptionsEditor = (props: CaptionEditorProps) => {
  const [captions, setCaptions] = createSignal(props.captions || []);
  const [status, setStatus] = createSignal("");

  const saveCaption = debounce(async (value: string) => {
    try {
      const response = await fetch(`/caption/${props.path}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caption: value }),
      });

      if (response.ok) {
        setStatus("saved");
        setTimeout(() => setStatus(""), 2000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  }, 1000);

  return (
    <div class="caption-editor">
      <Index each={captions()}>
        {(caption, idx) => (
          <CaptionInput
            value={caption()[1]}
            status={status()}
            onInput={(newValue: string) => {
              setCaptions((prev) =>
                prev.map((c, i) => (i === idx ? [c[0], newValue] : c))
              );
              saveCaption(newValue);
            }}
          />
        )}
      </Index>
    </div>
  );
};
