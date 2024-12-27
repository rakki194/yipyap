// src/components/ImageViewer/CaptionInput.tsx
import {
  splitProps,
  Component,
  JSX,
  For,
  createEffect,
  Index,
} from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import { createSelection } from "@solid-primitives/selection";
import getIcon, { captionIconsMap } from "~/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { CaptionTools } from "./CaptionTools";
import { TagBubble } from "./TagBubble";
import { preserveState } from "~/directives";
import "./CaptionInput.css";
import { useAppContext } from "~/contexts/app";
import { useCaptionHistory } from "~/composables/useCaptionHistory";
import { useTagManagement } from "~/composables/useTagManagement";
import { useE621Editor } from "~/composables/useE621Editor";

type CaptionType = "wd" | "e621" | "tags" | string;

export const CaptionInput: Component<
  {
    caption: [CaptionType, string];
    state: "expanded" | "collapsed" | null;
    onClick: () => void;
  } & JSX.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { t } = useAppContext();
  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];
  const { deleteCaption: deleteCaptionAction } = useGallery();
  const deleteCaption = useAction(deleteCaptionAction);

  const {
    captionHistory,
    saveWithHistory,
    undo,
    submission
  } = useCaptionHistory(type, caption);

  const {
    newTag,
    setNewTag,
    lastEditedTag,
    setLastEditedTag,
    addTag,
    removeTag,
    editTag,
    navigateTag,
    splitAndCleanTags
  } = useTagManagement(saveWithHistory);

  const {
    lineCount,
    currentLine,
    highlightedContent,
    isValidJSON,
    calculateCurrentLine,
    handleInput,
    handleKeyDown,
    handlePaste,
    handleScroll,
  } = useE621Editor(caption, saveWithHistory);

  const [selection, setSelection] = createSelection();

  let containerRef!: HTMLDivElement;
  let editorRef!: HTMLDivElement;
  let textareaRef!: HTMLTextAreaElement;
  let inputRef!: HTMLInputElement;

  const handleNewTagKeyDown = (e: KeyboardEvent) => {
    if (!containerRef) return;

    if (e.key === "Escape") {
      e.preventDefault();
      if (newTag()) {
        setNewTag("");
      } else {
        props.onClick(); // This will collapse the input
      }
      return;
    }

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

  const handleDeleteCaption = async () => {
    try {
      await deleteCaption(type());
    } catch (error) {
      console.error("Error deleting caption:", error);
    }
  };

  createEffect(() => {
    if (props.state === "expanded") {
      if (isTagInput()) {
        inputRef?.focus();
      } else {
        textareaRef?.focus();
      }
    }
  });

  const isTagInput = () => ["wd", "tags"].includes(type());
  const isE621Input = () => type() === "e621";

  const tags = () => (isTagInput() ? splitAndCleanTags(caption()) : []);

  const handleE621Input = (e: Event, node: HTMLElement) => {
    const [selNode, start, end] = selection();
    if (node === selNode) {
      handleInput(e as InputEvent, node);
      // Restore selection after content update
      setSelection([node, start, end]);
    }
  };

  const handleE621KeyDown = (e: KeyboardEvent, node: HTMLElement) => {
    const [selNode, start, end] = selection();
    if (node === selNode) {
      handleKeyDown(e, node);
      calculateCurrentLine(node);
    }
  };

  const handleE621Paste = (e: ClipboardEvent, node: HTMLElement) => {
    const [selNode, start, end] = selection();
    if (node === selNode) {
      handlePaste(e, node);
      // Selection will be updated after paste
      requestAnimationFrame(() => {
        calculateCurrentLine(node);
      });
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
        <CaptionTools onInput={saveWithHistory} caption={caption()} />
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
          onClick={handleDeleteCaption}
          title={`Delete ${type()} caption`}
        >
          {getIcon("delete")}
        </button>
      </div>

      {isTagInput() ? (
        <div class="tags-container">
          <div class="tags-list">
            <Index each={tags()}>
              {(getTag, i) => (
                <TagBubble
                  tag={getTag()}
                  index={i}
                  onRemove={() => removeTag(getTag(), tags())}
                  onEdit={(newTag) => editTag(getTag(), newTag, tags())}
                  onNavigate={(direction) => navigateTag(getTag(), direction, containerRef, tags())}
                />
              )}
            </Index>
          </div>
          <div class="new-tag-input">
            <input
              ref={inputRef}
              type="text"
              value={newTag()}
              onInput={(e) => setNewTag(e.currentTarget.value)}
              onKeyDown={handleNewTagKeyDown}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(newTag(), tags());
                }
              }}
              placeholder={t('gallery.addTag')}
            />
            <button
              type="button"
              class="icon add-tag"
              onClick={() => addTag(newTag(), tags())}
              title="Add tag"
            >
              {getIcon("plus")}
            </button>
          </div>
        </div>
      ) : isE621Input() ? (
        <div 
          class="e621-editor" 
          classList={{ "invalid-json": !isValidJSON(caption() || "") }}
        >
          <div
            ref={editorRef}
            class="e621-content"
            contentEditable="plaintext-only"
            spellcheck={false}
            innerHTML={highlightedContent()}
            onInput={(e) => handleE621Input(e, e.currentTarget)}
            onKeyDown={(e) => handleE621KeyDown(e, e.currentTarget)}
            onPaste={(e) => handleE621Paste(e, e.currentTarget)}
            onScroll={handleScroll}
            onSelect={(e) => calculateCurrentLine(e.currentTarget)}
          />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          use:preserveState={[caption, saveWithHistory]}
          placeholder={t('gallery.addCaption')}
        />
      )}
    </div>
  );
};

const StatusIcon = (props: {
  status: Partial<Submission<any, unknown>>;
  type: string;
}) => {
  const getStatusIcon = () => {
    if (props.status.input?.[0].type !== props.type)
      return { children: getIcon("edit") };
    if (!props.status.result) {
      if (props.status.pending)
        return { children: getIcon("spinner"), class: "spin-icon" };
      else return { children: getIcon("edit") };
    }
    if (props.status.result instanceof Error)
      return {
        children: getIcon("error"),
        class: "error-icon",
        title: props.status.result.message,
      };
    return {
      children: getIcon("success"),
    };
  };
  return <span class="icon" {...(getStatusIcon() as any)} />;
};
