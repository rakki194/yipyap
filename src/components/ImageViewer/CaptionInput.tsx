// src/components/ImageViewer/CaptionInput.tsx
import {
  splitProps,
  Component,
  JSX,
  For,
  createEffect,
  Index,
  onCleanup,
  createMemo,
} from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import { createSelection } from "@solid-primitives/selection";
import getIcon, { captionIconsMap } from "~/icons";
import { preserveState } from "~/directives";
import { useGallery } from "~/contexts/GalleryContext";
import { CaptionTools } from "./CaptionTools";
import { TagBubble } from "./TagBubble";
import "./CaptionInput.css";
import { useAppContext } from "~/contexts/app";
import { useCaptionHistory } from "~/composables/useCaptionHistory";
import { useTagManagement } from "~/composables/useTagManagement";
import { useE621Editor } from "~/composables/useE621Editor";
import { useTomlEditor } from "~/composables/useTomlEditor";
import { logger } from '~/utils/logger';

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
    lineCount: e621LineCount,
    currentLine: e621CurrentLine,
    highlightedContent: e621HighlightedContent,
    isValidJSON,
    calculateCurrentLine: calculateE621Line,
    handleInput: handleE621Input,
    handleKeyDown: handleE621KeyDown,
    handlePaste: handleE621Paste,
    handleScroll: handleE621Scroll,
  } = useE621Editor(caption, saveWithHistory);

  const {
    lineCount: tomlLineCount,
    currentLine: tomlCurrentLine,
    highlightedContent: tomlHighlightedContent,
    isValidTOML,
    calculateCurrentLine: calculateTomlLine,
    handleInput: handleTomlInput,
    handleKeyDown: handleTomlKeyDown,
    handlePaste: handleTomlPaste,
    handleScroll: handleTomlScroll,
  } = useTomlEditor(caption, saveWithHistory);

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
      logger.error("Error deleting caption:", error);
    }
  };

  createEffect(() => {
    if (props.state === "expanded") {
      if (shouldRenderTagInput()) {
        inputRef?.focus();
      } else {
        textareaRef?.focus();
      }
    }
  });

  // Explicitly check for tag-based caption types only
  const isTagInput = () => {
    const currentType = type();
    // Hard-code specific caption types as tag-based formats
    // Any other caption type (including florence/florence2) will be rendered as text
    return currentType === "wd" || currentType === "tags";
  };

  const isE621Input = () => type() === "e621";
  const isTomlInput = () => type() === "toml";

  // Create reactive signals that derive from the caption type
  // These ensure immediate updates when the caption type changes
  const shouldRenderTagInput = createMemo(() => isTagInput());
  const shouldRenderE621Input = createMemo(() => isE621Input());
  const shouldRenderTomlInput = createMemo(() => isTomlInput());

  // Force re-evaluation of captions when component loads or caption changes
  createEffect(() => {
    // This effect creates a dependency on both the caption type and content
    const captionType = type();
    const captionContent = caption();
    const renderMode = shouldRenderTagInput() ? "tags"
      : shouldRenderE621Input() ? "e621"
        : shouldRenderTomlInput() ? "toml"
          : "textarea";

    logger.debug(`Caption rendering: type="${captionType}", mode="${renderMode}", length=${captionContent.length}`);

    // Force textarea to update its value when content changes
    if (renderMode === "textarea" && textareaRef) {
      textareaRef.value = captionContent;
    }
  });

  const tags = () => (shouldRenderTagInput() ? splitAndCleanTags(caption()) : []);

  const handleEditorInput = (e: Event, editor: HTMLDivElement) => {
    const newText = editor.innerText;
    if (shouldRenderE621Input()) {
      handleE621Input(e as InputEvent, editor);
    } else if (shouldRenderTomlInput()) {
      handleTomlInput(e as InputEvent, editor);
    } else {
      // Only save if the text has actually changed
      if (newText !== caption()) {
        saveWithHistory(newText);
      }
    }
  };

  const handleEditorKeyDown = (e: KeyboardEvent, node: HTMLElement) => {
    const [selNode, start, end] = selection();
    if (node === selNode) {
      if (shouldRenderE621Input()) {
        handleE621KeyDown(e, node);
        calculateE621Line(node);
      } else if (shouldRenderTomlInput()) {
        handleTomlKeyDown(e, node);
        calculateTomlLine(node);
      }
    }
  };

  const handleEditorPaste = (e: ClipboardEvent, node: HTMLElement) => {
    const [selNode, start, end] = selection();
    if (node === selNode) {
      if (shouldRenderE621Input()) {
        handleE621Paste(e, node);
      } else if (shouldRenderTomlInput()) {
        handleTomlPaste(e, node);
      }
      // Selection will be updated after paste
      requestAnimationFrame(() => {
        if (shouldRenderE621Input()) {
          calculateE621Line(node);
        } else if (shouldRenderTomlInput()) {
          calculateTomlLine(node);
        }
      });
    }
  };

  const handleEditorScroll = (e: Event) => {
    if (shouldRenderE621Input()) {
      handleE621Scroll(e);
    } else if (shouldRenderTomlInput()) {
      handleTomlScroll(e);
    }
  };

  // Create an effect to handle submission state
  createEffect(() => {
    const sub = submission;
    if (sub && typeof sub === 'object' && 'error' in sub && sub.error) {
      // If there was an error, the original text will be restored by the gallery context
      logger.error("Error saving caption:", sub.error);
    }
  });

  // Create an effect to update the editor content when caption changes
  createEffect(() => {
    const currentCaption = caption();
    if (editorRef && currentCaption !== editorRef.innerText) {
      editorRef.innerText = currentCaption;
    }
    if (textareaRef && currentCaption !== textareaRef.value) {
      textareaRef.value = currentCaption;
    }
  });

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

      {shouldRenderTagInput() ? (
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
      ) : shouldRenderE621Input() || shouldRenderTomlInput() ? (
        <div
          class={shouldRenderE621Input() ? "e621-editor" : "toml-editor"}
          classList={{
            "invalid-json": shouldRenderE621Input() && !isValidJSON(caption() || ""),
            "invalid-toml": shouldRenderTomlInput() && !isValidTOML()
          }}
        >
          <div
            ref={editorRef}
            class={shouldRenderE621Input() ? "e621-content" : "toml-content"}
            contentEditable="plaintext-only"
            spellcheck={false}
            innerHTML={shouldRenderE621Input() ? e621HighlightedContent() : tomlHighlightedContent()}
            onInput={(e) => handleEditorInput(e, e.currentTarget as HTMLDivElement)}
            onKeyDown={(e) => handleEditorKeyDown(e, e.currentTarget as HTMLElement)}
            onPaste={(e) => handleEditorPaste(e, e.currentTarget as HTMLElement)}
            onScroll={handleEditorScroll}
            onSelect={(e) => {
              if (shouldRenderE621Input()) {
                calculateE621Line(e.currentTarget as HTMLElement);
              } else if (shouldRenderTomlInput()) {
                calculateTomlLine(e.currentTarget as HTMLElement);
              }
            }}
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
