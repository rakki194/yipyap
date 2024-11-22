// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, createEffect, For } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { Captions } from "../../resources/browse";

interface CaptionEditorProps {
  path: string;
  captions: Captions;
}

export const CaptionEditor = (props: CaptionEditorProps) => {
  const [captions, setCaptions] = createSignal(props.captions || "");
  const [status, setStatus] = createSignal("");

  const saveCaption = debounce(async (value: string) => {
    try {
      const response = await fetch(`/caption/${props.path}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ caption: value }),
      });

      if (response.ok) {
        setStatus("Saved");
        setTimeout(() => setStatus(""), 2000);
      } else {
        setStatus("Error saving");
      }
    } catch (error) {
      setStatus("Error saving");
    }
  }, 1000);

  createEffect(() => {
    if (captions() !== props.captions) {
      // saveCaption(captions());
      console.log("captions changed", captions());
    }
  });

  return (
    <div class="caption-editor">
      <For each={captions()}>
        {(caption, getIdx) => (
          <textarea
            value={caption[1]}
            onInput={(e) => {
              const idx = getIdx();
              setCaptions((prev) =>
                prev.map((c, i) =>
                  i === idx ? [c[0], e.currentTarget.value] : c
                )
              );
            }}
            placeholder="Add a caption..."
          />
        )}
      </For>
      <div class="caption-status">{status()}</div>
    </div>
  );
};
