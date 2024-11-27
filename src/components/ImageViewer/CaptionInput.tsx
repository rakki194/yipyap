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
  DeleteIcon,
  TextAlignIcon,
  TextAlignDistributedIcon,
  ArrowUndoIcon,
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
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);

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

  const saveWithHistory = (newText: string) => {
    setCaptionHistory((prev) => [...prev, caption()]);
    save({
      caption: newText,
      type: type(),
    });
  };

  const removeCommas = () => {
    const newText = caption().replace(/,/g, "");
    saveWithHistory(newText);
  };

  const replaceNewlines = () => {
    const newText = caption().replace(/\n/g, ", ");
    saveWithHistory(newText);
  };

  const replaceUnderscores = () => {
    const newText = caption().replace(/_/g, " ");
    saveWithHistory(newText);
  };

  const undo = () => {
    const history = captionHistory();
    if (history.length > 0) {
      const previousText = history[history.length - 1];
      setCaptionHistory((prev) => prev.slice(0, -1));
      save({
        caption: previousText,
        type: type(),
      });
    }
  };

  return (
    <div
      class="caption-input-wrapper card"
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
          class="icon"
          title="Remove commas"
          innerHTML={SparkleIcon}
        />
        <button
          onClick={replaceNewlines}
          class="icon"
          title="Replace newlines with commas"
          innerHTML={TextAlignIcon}
        />
        <button
          onClick={replaceUnderscores}
          class="icon"
          title="Replace underscores with spaces"
          innerHTML={TextAlignDistributedIcon}
        />
        {captionHistory().length > 0 && (
          <button
            onClick={undo}
            class="icon"
            title="Undo last change"
            innerHTML={ArrowUndoIcon}
          />
        )}
        <button
          class="icon"
          title={`Delete ${type()} caption`}
          innerHTML={DeleteIcon}
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
