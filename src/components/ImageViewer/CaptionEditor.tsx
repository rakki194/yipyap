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

export const CaptionsEditor = (props: CaptionEditorProps) => {
  return (
    <div class="caption-editor">
      <Index each={props.captions}>
        {(caption, idx) => (
          <CaptionInput
            value={caption()[1]}
            type={caption()[0]}
            path={props.path}
          />
        )}
      </Index>
    </div>
  );
};

const CaptionInput = (props: { type: string; value: string; path: string }) => {
  const { saveCaption } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);

  const debouncedSave = debounce((value: string) => {
    save({
      path: props.path,
      caption: value,
      type: props.type,
    });
  }, 500);

  const handleInput = (value: string) => {
    debouncedSave(value);
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
