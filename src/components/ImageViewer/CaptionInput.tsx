// src/components/ImageViewer/CaptionEditor.tsx
import {
  createEffect,
  createSignal,
  splitProps,
  untrack,
  Component,
  JSX,
} from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
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
import { useGallery } from "~/contexts/GalleryContext";

export interface CaptionInputProps
  extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  caption: [string, string];
}

export const CaptionInput: Component<CaptionInputProps> = (props) => {
  let inputRef!: HTMLTextAreaElement;
  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];
  const initialCaption = caption();

  const [focusedType, setFocusedType] = createSignal<string | null>(null);
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);
  // We only update the value from the database when the field is not in focus.
  const updateValue = () => {
    console.log(
      "updating value",
      document.activeElement !== inputRef,
      untrack(caption) !== inputRef.value,
      rest
    );
    if (document.activeElement !== inputRef) {
      const value = untrack(caption);
      if (value !== inputRef.value) {
        console.log("updating value", value);
        inputRef.value = value;
      }
    }
  };

  const { saveCaption } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);

  // There are three conditions where we manually update the field value
  // 1. On save without focus (eg remove commas)
  const saveUpdate = (value: string) => {
    save({
      caption: value,
      type: type(),
    });
    updateValue();
  };
  // 2. On caption change
  createEffect(() => {
    caption();
    updateValue();
  });
  createEffect(() => console.log("caption xx", caption()));
  // 3. On blur
  const onBlur = () => {
    setFocusedType(null);
    inputRef.value = caption();
  };

  const handleInput = debounce((value: string) => {
    saveUpdate(value);
  }, 500);

  const saveWithHistory = (newText: string) => {
    setCaptionHistory((prev) => [...prev, caption()]);
    saveUpdate(newText);
  };

  const removeCommas = () =>
    saveWithHistory(untrack(caption).replace(/,/g, ""));

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
        <StatusIcon status={submission} type={type()} />
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
          onClick={async (e) => {
            e.stopPropagation();
            if (confirm(`Delete ${type()} caption?`)) {
              try {
                const response = await fetch(
                  `/api/caption/${props.caption[0]}?caption_type=${type()}`,
                  { method: "DELETE" }
                );
                if (!response.ok) {
                  throw new Error(
                    `Failed to delete caption: ${response.statusText}`
                  );
                }
                // Handle successful deletion, e.g., update UI or state
              } catch (error) {
                console.error(error);
                // Optionally, handle the error in the UI
              }
            }
          }}
          title={`Delete ${type()} caption`}
          innerHTML={DeleteIcon}
        />
      </div>
      <textarea
        {...rest}
        ref={inputRef}
        value={initialCaption}
        onInput={(e) => handleInput(e.currentTarget.value)}
        placeholder="Add a caption..."
        onFocus={() => setFocusedType(type())}
        onBlur={onBlur}
      />
    </div>
  );
};

// Start of Selection
const StatusIcon = <T extends [{ type: string }], U>(props: {
  status: Partial<Submission<T, U>>;
  type: string;
}) => {
  const getStatusIcon = () => {
    if (props.status.input?.[0].type !== props.type)
      return { innerHTML: EditIcon };
    if (!props.status.result) {
      if (props.status.pending)
        return { innerHTML: SpinnerIcon, class: "spin-icon icon" };
      else return { innerHTML: EditIcon };
    }
    if (props.status.result instanceof Error)
      return {
        innerHTML: ErrorIcon,
        class: "error-icon icon",
        title: props.status.result.message,
      };
    return {
      innerHTML: SaveIcon,
    };
  };
  return <span class="icon" {...getStatusIcon()} />;
};
