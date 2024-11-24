// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, For } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { Captions } from "~/resources/browse";
import EditIcon from "@fluentui/svg-icons/icons/edit_24_regular.svg?raw";
import SaveIcon from "@fluentui/svg-icons/icons/checkmark_24_regular.svg?raw";
import ErrorIcon from "@fluentui/svg-icons/icons/error_circle_24_regular.svg?raw";

interface CaptionEditorProps {
  path: string;
  captions: Captions;
}

export const CaptionEditor = (props: CaptionEditorProps) => {
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

  const getStatusIcon = () => {
    switch (status()) {
      case "saved":
        return SaveIcon;
      case "error":
        return ErrorIcon;
      default:
        return "";
    }
  };

  return (
    <div class="caption-editor">
      <For each={captions()}>
        {(caption, getIdx) => (
          <div class="caption-input-wrapper">
            <span class="caption-icon" innerHTML={EditIcon} />
            <textarea
              value={caption[1]}
              onInput={(e) => {
                const idx = getIdx();
                const newValue = e.currentTarget.value;
                setCaptions((prev) =>
                  prev.map((c, i) => (i === idx ? [c[0], newValue] : c))
                );
                saveCaption(newValue);
              }}
              placeholder="Add a caption..."
              rows="3"
            />
            {status() && (
              <span 
                class={`status-icon ${status()}`} 
                innerHTML={getStatusIcon()}
              />
            )}
          </div>
        )}
      </For>
    </div>
  );
};
