// src/components/ImageViewer/CaptionInput.tsx
import { createSignal, splitProps, Component, JSX, For } from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import {
  EditIcon,
  SuccessIcon,
  ErrorIcon,
  SpinnerIcon,
  captionIconsMap,
  DeleteIcon,
  ArrowUndoIcon,
  PlusIcon,
} from "~/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { preserveState } from "~/directives";
import { Tools } from "./Tools";
import { TagBubble } from "./TagBubble";
import "./CaptionInput.css";

type CaptionType = "wd" | "e621" | "tags" | string;

export const CaptionInput: Component<
  {
    caption: [CaptionType, string];
    state: "expanded" | "collapsed" | null;
  } & JSX.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);
  const [newTag, setNewTag] = createSignal("");
  const [lastEditedTag, setLastEditedTag] = createSignal<string | null>(null);

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

  const editTag = (oldTag: string, newTag: string) => {
    const currentTags = tags();
    const tagIndex = currentTags.indexOf(oldTag);
    if (tagIndex !== -1) {
      const newTags = [...currentTags];
      newTags[tagIndex] = newTag;
      setLastEditedTag(newTag);
      saveWithHistory(newTags.join(", "));
    }
  };

  let containerRef: HTMLDivElement | undefined;

  const navigateTag = (
    currentTag: string,
    direction: "left" | "right" | "up" | "down"
  ) => {
    if (!containerRef) return;
    const currentTags = tags();
    const currentIndex = currentTags.indexOf(currentTag);

    if (direction === "up" || direction === "down") {
      const newTagInput = containerRef.querySelector(".new-tag-input input");

      // Get all tag elements and their positions
      const tagElements = Array.from(
        containerRef.querySelectorAll(".tag-bubble")
      );
      const currentElement = tagElements.find((el) =>
        el.textContent?.includes(currentTag)
      );
      if (!currentElement) return;

      const currentRect = currentElement.getBoundingClientRect();
      const currentRow = Math.round(currentRect.top / currentRect.height);

      if (direction === "down") {
        // Find tags in the row below
        const tagsBelow = tagElements.filter((el) => {
          const rect = el.getBoundingClientRect();
          const row = Math.round(rect.top / rect.height);
          return row === currentRow + 1;
        });

        if (tagsBelow.length > 0) {
          // Find the closest tag horizontally
          const closest = tagsBelow.reduce((prev, curr) => {
            const prevRect = prev.getBoundingClientRect();
            const currRect = curr.getBoundingClientRect();
            const prevDist = Math.abs(prevRect.left - currentRect.left);
            const currDist = Math.abs(currRect.left - currentRect.left);
            return currDist < prevDist ? curr : prev;
          });

          const tagText = closest.querySelector(".tag-text");
          if (tagText) {
            (tagText as HTMLElement).click();
            return;
          }
        } else {
          // If no tags below, go to input
          setLastEditedTag(currentTag);
          (newTagInput as HTMLElement)?.focus();
        }
        return;
      } else {
        // direction === "up"
        // Find tags in the row above
        const tagsAbove = tagElements.filter((el) => {
          const rect = el.getBoundingClientRect();
          const row = Math.round(rect.top / rect.height);
          return row === currentRow - 1;
        });

        if (tagsAbove.length > 0) {
          // Find the closest tag horizontally
          const closest = tagsAbove.reduce((prev, curr) => {
            const prevRect = prev.getBoundingClientRect();
            const currRect = curr.getBoundingClientRect();
            const prevDist = Math.abs(prevRect.left - currentRect.left);
            const currDist = Math.abs(currRect.left - currentRect.left);
            return currDist < prevDist ? curr : prev;
          });

          const tagText = closest.querySelector(".tag-text");
          if (tagText) {
            (tagText as HTMLElement).click();
            return;
          }
        }
        return;
      }
    }

    // Existing left/right navigation code
    let newIndex;
    if (direction === "left") {
      newIndex = currentIndex > 0 ? currentIndex - 1 : currentTags.length - 1;
    } else {
      newIndex = currentIndex < currentTags.length - 1 ? currentIndex + 1 : 0;
    }

    const tagElements = containerRef.querySelectorAll(".tag-bubble");
    const targetElement = tagElements[newIndex];
    const input = targetElement?.querySelector("input");
    const tagText = targetElement?.querySelector(".tag-text");

    if (input) {
      input.focus();
    } else if (tagText) {
      (tagText as HTMLElement).click();
    }
  };

  const handleNewTagKeyDown = (e: KeyboardEvent) => {
    if (!containerRef) return;
    if (e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      const tagElements = containerRef.querySelectorAll(".tag-bubble");
      if (tagElements.length > 0) {
        const lastTag = lastEditedTag();
        if (lastTag) {
          const targetElement = Array.from(tagElements).find((el) =>
            el.textContent?.includes(lastTag)
          );
          if (targetElement) {
            const tagText = targetElement.querySelector(".tag-text");
            if (tagText) {
              (tagText as HTMLElement).click();
              return;
            }
          }
        }
        const lastElement = tagElements[tagElements.length - 1];
        const tagText = lastElement?.querySelector(".tag-text");
        if (tagText) {
          (tagText as HTMLElement).click();
        }
      }
    }
  };

  return (
    <div
      {...rest}
      ref={containerRef}
      class="caption-input-wrapper card"
      classList={{
        [props.state || ""]: props.state !== null,
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
              {(tag) => (
                <TagBubble
                  tag={tag}
                  onRemove={() => removeTag(tag)}
                  onEdit={(newTag) => editTag(tag, newTag)}
                  onNavigate={(direction) => navigateTag(tag, direction)}
                />
              )}
            </For>
          </div>
          <div class="new-tag-input">
            <input
              type="text"
              value={newTag()}
              onInput={(e) => setNewTag(e.currentTarget.value)}
              onKeyDown={handleNewTagKeyDown}
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
              innerHTML={PlusIcon}
            />
          </div>
        </div>
      ) : (
        <textarea
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
