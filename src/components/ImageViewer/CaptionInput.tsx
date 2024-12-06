// src/components/ImageViewer/CaptionInput.tsx
import { createSignal, splitProps, Component, JSX, For } from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import getIcon, { captionIconsMap } from "~/icons";
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
    direction: "left" | "right" | "up" | "down" | "start" | "end"
  ) => {
    if (!containerRef) return;
    const currentTags = tags();
    const currentIndex = currentTags.indexOf(currentTag);
    const tagElements = containerRef.querySelectorAll(".tag-bubble");

    // Handle start/end navigation within the same row
    if (direction === "start" || direction === "end") {
      const currentElement = tagElements[currentIndex];
      const currentRect = currentElement.getBoundingClientRect();

      // Find all elements in the same row (similar y-position)
      const sameRowElements = Array.from(tagElements).filter((element) => {
        const rect = element.getBoundingClientRect();
        return Math.abs(rect.top - currentRect.top) < 5; // 5px tolerance
      });

      // Get the first or last element in the row
      const targetElement =
        direction === "start"
          ? sameRowElements[0]
          : sameRowElements[sameRowElements.length - 1];

      const tagText = targetElement?.querySelector(".tag-text");
      if (tagText) {
        (tagText as HTMLElement).click();
      }
      return;
    }

    // Handle left/right navigation
    if (direction === "left" || direction === "right") {
      let newIndex;
      if (direction === "left") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentTags.length - 1;
      } else {
        newIndex = currentIndex < currentTags.length - 1 ? currentIndex + 1 : 0;
      }

      const targetElement = tagElements[newIndex];
      const tagText = targetElement?.querySelector(".tag-text");
      if (tagText) {
        (tagText as HTMLElement).click();
      }
      return;
    }

    // Handle down navigation
    if (direction === "down") {
      const newTagInput = containerRef.querySelector(".new-tag-input input");
      if (newTagInput) {
        setLastEditedTag(currentTag);
        (newTagInput as HTMLElement).focus();
      }
    }
  };

  const handleNewTagKeyDown = (e: KeyboardEvent) => {
    if (!containerRef) return;
    if (e.shiftKey && e.key === "ArrowUp") {
      e.preventDefault();
      const lastTag = lastEditedTag();
      const tagElements = containerRef.querySelectorAll(".tag-bubble");

      if (tagElements.length === 0) return;

      if (lastTag) {
        for (const element of tagElements) {
          if (element.textContent?.includes(lastTag)) {
            const tagText = element.querySelector(".tag-text");
            if (tagText) {
              (tagText as HTMLElement).click();
              return;
            }
          }
        }
      }

      // Fallback to last tag if no last edited tag is found
      const lastElement = tagElements[tagElements.length - 1];
      const tagText = lastElement?.querySelector(".tag-text");
      if (tagText) {
        (tagText as HTMLElement).click();
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
        <span class="icon">
          {getIcon(captionIconsMap[type() as keyof typeof captionIconsMap])}
        </span>
        <StatusIcon status={submission} type={type()} />
        <Tools onInput={saveWithHistory} caption={caption()} />
        {captionHistory().length > 0 && (
          <button
            type="button"
            class="icon"
            onClick={undo}
            title="Undo last change"
          >
            {getIcon("arrowUndo")}
          </button>
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
        >
          {getIcon("delete")}
        </button>
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
            >
              {getIcon("plus")}
            </button>
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
      return { children: getIcon("edit") };
    if (!props.status.result) {
      if (props.status.pending)
        return { children: getIcon("spinner"), class: "spin-icon icon" };
      else return { children: getIcon("edit") };
    }
    if (props.status.result instanceof Error)
      return {
        children: getIcon("error"),
        class: "error-icon icon",
        title: props.status.result.message,
      };
    return {
      innerHTML: getIcon("success"),
    };
  };
  return <span class="icon" {...(getStatusIcon() as any)} />;
};
