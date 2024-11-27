// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, splitProps } from "solid-js";
import { Component, JSX } from "solid-js";
import { debounce } from "@solid-primitives/scheduled";
import {
  EditIcon,
  SaveIcon,
  ErrorIcon,
  SpinnerIcon,
  captionIconsMap,
  SparkleIcon,
} from "~/components/icons";
import { useAction, useSubmission } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";

export interface CaptionInputProps
  extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  caption: [string, string];
}

export const CaptionInput: Component<CaptionInputProps> = (props) => {
  const { saveCaption } = useGallery();
  const submission = useSubmission(saveCaption);
  const save = useAction(saveCaption);

  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];

  const [focusedType, setFocusedType] = createSignal<string | null>(null);

  const handleInput = debounce((value: string) => {
    save({
      caption: value,
      type: type(),
    });
  }, 500);

  const getStatusIcon = () => {
    if (submission.input?.[0].type !== type())
      return { innerHTML: EditIcon, class: "icon" };
    if (!submission.result) {
      if (submission.pending)
        return { innerHTML: SpinnerIcon, class: "spin-icon icon" };
      else return { innerHTML: EditIcon };
    }
    if (submission.result instanceof Error)
      return { innerHTML: ErrorIcon, class: "error-icon icon" };
    return { innerHTML: SaveIcon };
  };

  const removeCommas = () => {
    const newText = caption().replace(/,/g, "");
    save({
      caption: newText,
      type: type(),
    });
  };

  return (
    <div
      class="caption-input-wrapper"
      classList={{
        focused: focusedType() === type(),
        collapsed: focusedType() !== null && focusedType() !== type(),
      }}
    >
      <div class="caption-icons">
        <span
          class="icon"
          innerHTML={captionIconsMap[type() as keyof typeof captionIconsMap]}
        />
        <span {...getStatusIcon()} />
        <button
          onClick={removeCommas}
          class="sparkle-btn"
          title="Remove commas"
          innerHTML={SparkleIcon}
        />
      </div>
      <textarea
        {...rest}
        value={caption()}
        onInput={(e) => handleInput(e.currentTarget.value)}
        placeholder="Add a caption..."
        onFocus={() => setFocusedType(type())}
        onBlur={() => setFocusedType(null)}
      />
    </div>
  );
};
