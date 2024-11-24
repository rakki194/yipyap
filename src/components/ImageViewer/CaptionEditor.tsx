// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, Show, Index } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import { Captions } from "~/resources/browse";
import {
  EditIcon,
  SaveIcon,
  ErrorIcon,
  captionIconsMap,
} from "~/components/icons";
import { action, useAction, useSubmission } from "@solidjs/router";
import { SaveCaption, useGallery } from "~/contexts/GalleryContext";

interface CaptionEditorProps {
  path: string;
  captions: Captions;
}

const CaptionInput = (props: {
  type: string;
  value: string;
  path: string;
  onInput: (value: string) => void;
}) => {
  const { saveCaption } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);

  const debouncedSave = debounce((data: SaveCaption) => {
    props.onInput(data.caption);
    save(data);
  }, 500);

  const handleInput = (value: string) => {
    debouncedSave({
      path: props.path,
      caption: value,
      type: props.type,
    });
  };

  const getStatusIcon = () => {
    if (!submission.result) return;
    if (submission.result instanceof Error) return ErrorIcon;
    return SaveIcon;
  };

  return (
    <div class="caption-input-wrapper">
      <div class="caption-icons">
        <span
          innerHTML={
            captionIconsMap[props.type as keyof typeof captionIconsMap]
          }
        />
        <span innerHTML={EditIcon} />
      </div>
      <textarea
        value={props.value}
        onInput={(e) => handleInput(e.currentTarget.value)}
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

  return (
    <div class="caption-editor">
      <Index each={captions()}>
        {(caption, idx) => (
          <CaptionInput
            value={caption()[1]}
            type={caption()[0]}
            path={props.path}
            onInput={(newValue: string) => {
              setCaptions((prev) =>
                prev.map((c, i) => (i === idx ? [c[0], newValue] : c))
              );
            }}
          />
        )}
      </Index>
    </div>
  );
};
