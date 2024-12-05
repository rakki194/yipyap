// src/components/ImageViewer/CaptionInput.tsx
import {
  createSignal,
  splitProps,
  Component,
  JSX,
  For,
  createEffect,
} from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import {
  EditIcon,
  SuccessIcon,
  ErrorIcon,
  SpinnerIcon,
  captionIconsMap,
  SparkleIcon,
  DeleteIcon,
  TextAlignIcon,
  TextAlignDistributedIcon,
  ArrowUndoIcon,
  PlusIcon,
} from "~/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { preserveState } from "~/directives";
import { Tools } from "./Tools";
import { TagBubble } from "./TagBubble";

type CaptionType = "wd" | "e621" | "tags" | string;

export const CaptionInput: Component<
  {
    caption: [CaptionType, string];
    state: "expanded" | "collapsed" | null;
  } & JSX.HTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");

  const { saveCaption, deleteCaption: deleteCaptionAction } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);
  const deleteCaption = useAction(deleteCaptionAction);

  const isTagInput = () => ["wd", "e621", "tags"].includes(type());
  const splitAndCleanTags = (text: string) =>
    text
      .split(/,\s*/)
      .map((t) => t.trim())
      .filter(Boolean);

  const tags = () => (isTagInput() ? splitAndCleanTags(caption()) : []);

  const normalizeTagText = (text: string) => splitAndCleanTags(text).join(", ");

  const saveWithHistory = (newText: string) => {
    setCaptionHistory((prev) => [...prev, caption()]);
    save({
      caption: isTagInput() ? normalizeTagText(newText) : newText,
      type: type(),
    });
  };

  const undo = () => {
    const history = captionHistory();
    if (history.length > 0) {
      const previousText = history[history.length - 1];
      setCaptionHistory((prev) => prev.slice(0, -1));
      save({
        caption: isTagInput() ? normalizeTagText(previousText) : previousText,
        type: type(),
      });
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    const currentTags = tags();
    if (!currentTags.includes(trimmedTag)) {
      saveWithHistory([...currentTags, trimmedTag].join(", "));
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags().filter((tag) => tag !== tagToRemove);
    saveWithHistory(newTags.join(", "));
  };

  return (
    <div
      class="caption-input-wrapper card"
      classList={{
        [props.state || ""]: props.state !== null,
        "tag-input": isTagInput(),
      }}
    >
      <div class="caption-icons">
        <span
          class="icon"
          innerHTML={captionIconsMap[type() as keyof typeof captionIconsMap]}
        />
        <StatusIcon status={submission} type={type()} />
        <Tools onInput={saveWithHistory} caption={caption()} />
        {captionHistory().length > 0 && (
          <button
            type="button"
            class="icon"
            onClick={undo}
            title="Undo last change"
            innerHTML={ArrowUndoIcon}
          />
        )}
        <button
          type="button"
          class="icon"
          onClick={async (e) => {
            if (confirm(`Delete ${type()} caption?`)) {
              deleteCaption(type());
            }
          }}
          title={`Delete ${type()} caption`}
          innerHTML={DeleteIcon}
        />
      </div>

      {isTagInput() ? (
        <div class="tags-container">
          <div class="tags-list">
            <For each={tags()}>
              {(tag) => <TagBubble tag={tag} onRemove={() => removeTag(tag)} />}
            </For>
          </div>
          <div class="new-tag-input">
            <input
              type="text"
              value={newTag()}
              onInput={(e) => setNewTag(e.currentTarget.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(newTag());
                }
              }}
              placeholder="Add a tag..."
            />
            <button
              type="button"
              class="icon add-tag"
              onClick={() => addTag(newTag())}
              title="Add tag"
              innerHTML={SparkleIcon}
            />
          </div>
        </div>
      ) : (
        <textarea
          {...rest}
          use:preserveState={[caption, saveWithHistory]}
          placeholder="Add a caption..."
        />
      )}
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
      innerHTML: SuccessIcon,
    };
  };
  return <span class="icon" {...getStatusIcon()} />;
};
