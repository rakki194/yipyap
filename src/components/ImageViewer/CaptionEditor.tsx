// src/components/ImageViewer/CaptionEditor.tsx
import { debounce } from "@solid-primitives/scheduled";
import {
  EditIcon,
  SaveIcon,
  ErrorIcon,
  SpinnerIcon,
  captionIconsMap,
} from "~/components/icons";
import { useAction, useSubmission } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";

export const CaptionInput = (props: { caption: [string, string] }) => {
  const { saveCaption } = useGallery();
  const submission = useSubmission(saveCaption);
  const save = useAction(saveCaption);

  const handleInput = debounce((value: string) => {
    save({
      caption: value,
      type: props.caption[0],
    });
  }, 500);

  const getStatusIcon = () => {
    if (submission.input?.[0].type !== props.caption[0])
      return { innerHTML: EditIcon };
    if (!submission.result) {
      if (submission.pending)
        return { innerHTML: SpinnerIcon, class: "spin-icon" };
      else return { innerHTML: EditIcon };
    }
    if (submission.result instanceof Error)
      return { innerHTML: ErrorIcon, class: "error-icon" };
    return { innerHTML: SaveIcon };
  };

  return (
    <div class="caption-input-wrapper">
      <div class="caption-icons">
        <span
          innerHTML={
            captionIconsMap[props.caption[0] as keyof typeof captionIconsMap]
          }
        />
        <span {...getStatusIcon()} />
      </div>
      <textarea
        value={props.caption[1]}
        onInput={(e) => handleInput(e.currentTarget.value)}
        placeholder="Add a caption..."
      />
    </div>
  );
};
