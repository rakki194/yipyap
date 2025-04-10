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
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";
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
import { useTagAutocomplete } from "~/composables/useTagAutocomplete";
import { useE621Editor } from "~/composables/useE621Editor";
import { useTomlEditor } from "~/composables/useTomlEditor";
import { logger } from '~/utils/logger';

type CaptionType = "wd" | "e621" | "tags" | string;

export const CaptionInput: Component<
  {
    caption: [CaptionType, string];
    state: "expanded" | "collapsed" | null;
    onClick: () => void;
    shouldAutoFocus?: boolean;
  } & JSX.HTMLAttributes<HTMLDivElement>
> = (props) => {
  const { t } = useAppContext();
  const [localProps, rest] = splitProps(props, ["caption", "shouldAutoFocus"]);
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
  let suggestionsList!: HTMLDivElement;

  const {
    query,
    setQuery,
    suggestions,
    selectedIndex,
    setSelectedIndex,
    isOpen,
    setIsOpen,
    selectNextSuggestion,
    selectPreviousSuggestion,
    getSelectedSuggestion,
    clearSuggestions,
  } = useTagAutocomplete();

  const handleNewTagKeyDown = (e: KeyboardEvent) => {
    if (!containerRef) return;

    if (e.key === "Escape") {
      e.preventDefault();
      if (isOpen()) {
        clearSuggestions();
      } else if (newTag()) {
        setNewTag("");
      } else {
        props.onClick(); // This will collapse the input
      }
      return;
    }

    // Enhanced suggestion navigation with keyboard
    if (isOpen()) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        console.log("ArrowDown pressed, selecting next suggestion");
        selectNextSuggestion();

        // Make sure the selected item is visible in the dropdown
        setTimeout(() => {
          const selectedElement = suggestionsList?.querySelector('.tag-suggestion.selected');
          selectedElement?.scrollIntoView({ block: 'nearest' });
        }, 10);
        return;
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        console.log("ArrowUp pressed, selecting previous suggestion");
        selectPreviousSuggestion();

        // Make sure the selected item is visible in the dropdown
        setTimeout(() => {
          const selectedElement = suggestionsList?.querySelector('.tag-suggestion.selected');
          selectedElement?.scrollIntoView({ block: 'nearest' });
        }, 10);
        return;
      }

      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        console.log("Enter/Tab pressed with open suggestions");
        const selected = getSelectedSuggestion();
        if (selected) {
          console.log("Adding selected suggestion:", selected);
          setNewTag(selected);

          // If Enter was pressed, also add the tag
          if (e.key === "Enter") {
            addTag(selected, tags());
            setNewTag("");
          }

          clearSuggestions();
        } else if (e.key === "Enter" && newTag()) {
          // If no suggestion is selected but we have input text, add it as a tag
          console.log("Adding new tag from input:", newTag());
          addTag(newTag(), tags());
        }

        // If Enter was pressed and there was a selection, also add the tag
        if (e.key === "Enter" && selected) {
          addTag(selected, tags());
        }
        return;
      }
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

  // Update the function to handle positioning of the suggestions dropdown for all input types
  const positionSuggestions = () => {
    if (!suggestionsList) return;

    let targetElement: HTMLElement | null = null;

    // Determine which input is active based on the current caption type
    if (shouldRenderTagInput() && inputRef) {
      // For tag input
      targetElement = inputRef;
    } else if (shouldRenderE621Input() || shouldRenderTomlInput()) {
      // For JSON/TOML editor
      targetElement = editorRef;
    } else if (textareaRef) {
      // For plain text textarea
      targetElement = textareaRef;
    }

    if (targetElement) {
      // Get the position of the target element
      const rect = targetElement.getBoundingClientRect();

      // Position the suggestions below the input
      suggestionsList.style.top = `${rect.bottom}px`;
      suggestionsList.style.left = `${rect.left}px`;
      suggestionsList.style.width = `${rect.width}px`;

      console.log(`Positioned suggestions below ${shouldRenderTagInput() ? 'tag input' : shouldRenderE621Input() ? 'JSON editor' : shouldRenderTomlInput() ? 'TOML editor' : 'textarea'}:`, {
        top: suggestionsList.style.top,
        left: suggestionsList.style.left,
        width: suggestionsList.style.width
      });
    }
  };

  // Modify the handleNewTagInput function to call positionSuggestions
  const handleNewTagInput = (e: InputEvent) => {
    const value = (e.target as HTMLInputElement).value;
    setNewTag(value);

    // Don't show suggestions for empty input
    if (!value || value.trim() === "") {
      setIsOpen(false);
      if (suggestionsList) {
        suggestionsList.classList.remove('visible');
      }
      return;
    }

    setQuery(value);

    // Log what we're doing
    console.log(`Tag input changed to: "${value}"`);

    // Show suggestions if we have at least 2 characters
    const shouldShowSuggestions = value.length >= 2;
    console.log(`Should show suggestions: ${shouldShowSuggestions}`);

    setIsOpen(shouldShowSuggestions);

    // Force the suggestions list to be visible if needed
    if (shouldShowSuggestions && suggestionsList) {
      console.log("Forcing suggestions list to be visible");
      suggestionsList.classList.add('visible');
      positionSuggestions();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setNewTag(suggestion);
    clearSuggestions();
  };

  const handleDeleteCaption = async () => {
    try {
      await deleteCaption(type());
    } catch (error) {
      logger.error("Error deleting caption:", error);
    }
  };

  createEffect(() => {
    if (props.state === "expanded" && props.shouldAutoFocus) {
      if (shouldRenderTagInput()) {
        inputRef?.focus();
      } else {
        textareaRef?.focus();
      }
    } else if (props.state !== "expanded") {
      // When collapsing, explicitly blur the inputs
      inputRef?.blur();
      textareaRef?.blur();
      editorRef?.blur();
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

    // Process based on editor type
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

    // Show suggestions for all editor types
    handleCaptionInput(newText);
  };

  const handleEditorKeyDown = (e: KeyboardEvent, node: HTMLElement) => {
    // Handle suggestion navigation if suggestions are open
    if (isOpen()) {
      if (e.key === "ArrowDown" && suggestions()?.length > 0) {
        e.preventDefault();
        selectNextSuggestion();
        return;
      }
      if (e.key === "ArrowUp" && suggestions()?.length > 0) {
        e.preventDefault();
        selectPreviousSuggestion();
        return;
      }
      if (e.key === "Enter" && getSelectedSuggestion()) {
        e.preventDefault();
        insertSuggestionIntoEditor(node);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
    }

    // Original editor key handling
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
      // Ensure we blur when switching images
      if (!props.shouldAutoFocus) {
        editorRef.blur();
      }
    }
    if (textareaRef && currentCaption !== textareaRef.value) {
      textareaRef.value = currentCaption;
      // Ensure we blur when switching images
      if (!props.shouldAutoFocus) {
        textareaRef.blur();
      }
    }
  });

  // Create an effect to log suggestions when the component is open
  createEffect(() => {
    if (isOpen() && suggestions()) {
      console.log("Current suggestions:", suggestions());
    }
  });

  // Create an effect to log suggestions and visibility state
  createEffect(() => {
    console.log("Autocomplete state:", {
      isOpen: isOpen(),
      hasSuggestions: suggestions() && suggestions().length > 0,
      suggestionCount: suggestions() ? suggestions().length : 0,
      suggestions: suggestions(),
      query: query()
    });

    // Log DOM element details after render
    setTimeout(() => {
      if (suggestionsList) {
        console.log("Suggestions DOM element:", {
          element: suggestionsList,
          isVisible: suggestionsList.classList.contains('visible'),
          display: window.getComputedStyle(suggestionsList).display,
          parentVisible: suggestionsList.parentElement ? window.getComputedStyle(suggestionsList.parentElement).display : 'unknown'
        });
      }
    }, 100);
  });

  // Add a window resize event listener and cleanup
  createEffect(() => {
    // When the component is mounted, add a resize listener
    const handleResize = () => {
      if (isOpen()) {
        positionSuggestions();
      }
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component is unmounted
    onCleanup(() => {
      window.removeEventListener('resize', handleResize);
    });
  });

  // Add code to ensure selected index updates and focus is maintained
  createEffect(() => {
    // When suggestions or selection changes, ensure the input keeps focus
    // This creates a dependency on suggestions and selectedIndex
    const currentSuggestions = suggestions();
    const currentIndex = selectedIndex();

    if (isOpen() && currentSuggestions && currentSuggestions.length > 0) {
      // Keep focus on the input element
      setTimeout(() => {
        if (inputRef && document.activeElement !== inputRef) {
          console.log("Restoring focus to input");
          inputRef.focus();
        }
      }, 10);
    }
  });

  // Add a function to handle caption input for showing suggestions
  const handleCaptionInput = (value: string) => {
    // Only process if we have a value
    if (!value || value.trim() === "") {
      setIsOpen(false);
      if (suggestionsList) {
        suggestionsList.classList.remove('visible');
      }
      return;
    }

    // Get the currently selected word or text near cursor
    const currentWord = getCurrentWordFromValue(value);

    console.log(`Caption input detected, current word: "${currentWord}"`);

    // Show suggestions only if we have at least 2 characters in the current word
    const shouldShowSuggestions = currentWord.length >= 2;
    console.log(`Should show caption suggestions: ${shouldShowSuggestions}`);

    if (shouldShowSuggestions) {
      setQuery(currentWord);
      setIsOpen(true);

      // Force the suggestions list to be visible
      if (suggestionsList) {
        console.log("Forcing suggestions list to be visible for caption");
        suggestionsList.classList.add('visible');
        positionSuggestions();
      }
    } else {
      setIsOpen(false);
      if (suggestionsList) {
        suggestionsList.classList.remove('visible');
      }
    }
  };

  // Helper function to get the current word near cursor in various input types
  const getCurrentWordFromValue = (value: string): string => {
    let cursorPosition = 0;
    let text = value;

    // For textarea, get cursor position
    if (textareaRef && document.activeElement === textareaRef) {
      cursorPosition = textareaRef.selectionStart || 0;
      text = textareaRef.value;
    }
    // For contenteditable editors
    else if (editorRef && document.activeElement === editorRef) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorRef);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        cursorPosition = preCaretRange.toString().length;
      }
      text = editorRef.innerText;
    }

    // Extract the current word around cursor position
    if (!text) return "";

    // Find word boundaries around cursor
    let startPos = cursorPosition;
    while (startPos > 0 && !/\s/.test(text.charAt(startPos - 1))) {
      startPos--;
    }

    let endPos = cursorPosition;
    while (endPos < text.length && !/\s/.test(text.charAt(endPos))) {
      endPos++;
    }

    return text.substring(startPos, endPos);
  };

  // Add a function to insert the selected suggestion into the caption
  const insertSuggestionIntoCaption = () => {
    const suggestion = getSelectedSuggestion();
    if (!suggestion) return;

    console.log("Inserting suggestion into caption:", suggestion);

    // Handle insertion based on current active element
    if (textareaRef && document.activeElement === textareaRef) {
      // For textarea - replace the current word with the suggestion
      const currentPos = textareaRef.selectionStart || 0;
      const text = textareaRef.value;

      // Find word boundaries
      let startPos = currentPos;
      while (startPos > 0 && !/\s/.test(text.charAt(startPos - 1))) {
        startPos--;
      }

      let endPos = currentPos;
      while (endPos < text.length && !/\s/.test(text.charAt(endPos))) {
        endPos++;
      }

      // Replace the word with suggestion
      const newText = text.substring(0, startPos) + suggestion + text.substring(endPos);
      textareaRef.value = newText;
      saveWithHistory(newText);

      // Set cursor position after the inserted suggestion
      textareaRef.selectionStart = startPos + suggestion.length;
      textareaRef.selectionEnd = startPos + suggestion.length;
    }

    // Clear suggestions after insertion
    clearSuggestions();
  };

  // Function to insert a suggestion into the editor
  const insertSuggestionIntoEditor = (editor: HTMLElement) => {
    const suggestion = getSelectedSuggestion();
    if (!suggestion || !editor) return;

    console.log("Inserting suggestion into editor:", suggestion);

    // Get the current selection
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    // Get the current range
    const range = selection.getRangeAt(0);

    // Find word boundaries
    const currentText = editor.innerText;
    const currentPosition = getCaretPositionInEditor(editor);

    // Find word boundaries around cursor
    let startPos = currentPosition;
    while (startPos > 0 && !/\s/.test(currentText.charAt(startPos - 1))) {
      startPos--;
    }

    let endPos = currentPosition;
    while (endPos < currentText.length && !/\s/.test(currentText.charAt(endPos))) {
      endPos++;
    }

    // Create a new range for the word
    const wordRange = document.createRange();
    let startNode: Node = editor;
    let endNode: Node = editor;

    // For text nodes within the editor
    if (editor.firstChild && editor.firstChild.nodeType === Node.TEXT_NODE) {
      startNode = editor.firstChild;
      endNode = editor.firstChild;
    }

    // Set the range to cover the current word
    try {
      wordRange.setStart(startNode, startPos);
      wordRange.setEnd(endNode, endPos);

      // Delete the current word
      wordRange.deleteContents();

      // Insert the suggestion
      const textNode = document.createTextNode(suggestion);
      wordRange.insertNode(textNode);

      // Position cursor after the inserted suggestion
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);

      // Update the editor content
      if (shouldRenderE621Input()) {
        handleE621Input({ target: editor } as any, editor);
      } else if (shouldRenderTomlInput()) {
        handleTomlInput({ target: editor } as any, editor);
      } else {
        saveWithHistory(editor.innerText);
      }
    } catch (error) {
      console.error("Error inserting suggestion:", error);
    }

    // Clear suggestions
    clearSuggestions();
  };

  // Helper function to get caret position in contenteditable
  const getCaretPositionInEditor = (editor: HTMLElement): number => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editor);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
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
            <div class="tag-input-container">
              <input
                ref={inputRef}
                type="text"
                value={newTag()}
                onInput={handleNewTagInput}
                onKeyDown={handleNewTagKeyDown}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isOpen()) {
                    e.preventDefault();
                    addTag(newTag(), tags());
                  }
                }}
                onFocus={() => {
                  console.log("Input focused, current value:", newTag());
                  if (newTag().length >= 2) {
                    console.log("Value is long enough to show suggestions");
                    setQuery(newTag());
                    setIsOpen(true);
                    // Ensure the suggestions list is visible in the DOM
                    if (suggestionsList) {
                      suggestionsList.classList.add('visible');
                      console.log("Added visible class to suggestions list on focus");
                      positionSuggestions();
                    }
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  console.log("Input blurred, delaying hiding suggestions");
                  setTimeout(() => {
                    setIsOpen(false);
                    if (suggestionsList) {
                      suggestionsList.classList.remove('visible');
                      console.log("Removed visible class from suggestions list on blur");
                    }
                  }, 200);
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
          onInput={(e) => {
            saveWithHistory(e.currentTarget.value);
            handleCaptionInput(e.currentTarget.value);
          }}
          onKeyDown={(e) => {
            // Handle navigation of suggestions with arrow keys
            if (isOpen()) {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                selectNextSuggestion();
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                selectPreviousSuggestion();
              } else if (e.key === "Enter" && getSelectedSuggestion()) {
                e.preventDefault();
                insertSuggestionIntoCaption();
              } else if (e.key === "Escape") {
                e.preventDefault();
                setIsOpen(false);
              }
            }
          }}
          onFocus={() => handleCaptionInput(textareaRef.value)}
          onBlur={() => {
            // Delay hiding suggestions
            setTimeout(() => setIsOpen(false), 200);
          }}
        />
      )}

      <Portal>
        <div
          class="tag-suggestions-portal"
          classList={{ visible: isOpen() && suggestions() && suggestions().length > 0 }}
          ref={suggestionsList}
          style={{
            "z-index": "9999",
            "position": "fixed",
            "max-height": "300px",
            "background-color": "var(--bg-color, white)",
            "border": "3px solid var(--border-color, #ccc)",
            "border-radius": "8px",
            "box-shadow": "0 8px 16px rgba(0, 0, 0, 0.4)",
            "overflow-y": "auto",
            "display": isOpen() && suggestions() && suggestions().length > 0 ? "block" : "none",
            "top": "0px",
            "left": "0px",
            "width": "300px",
            "padding": "5px"
          }}
        >
          <Show when={suggestions() && suggestions().length > 0}>
            <For each={suggestions()}>
              {(suggestion, index) => (
                <div
                  class="tag-suggestion"
                  classList={{
                    selected: index() === selectedIndex(),
                  }}
                  onClick={() => handleSuggestionClick(suggestion)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSuggestionClick(suggestion);
                    }
                  }}
                  tabIndex={0}
                  style={{
                    "padding": "10px 12px",
                    "cursor": "pointer",
                    "border-bottom": "1px solid var(--border-color-light, #eee)",
                    "background-color": index() === selectedIndex()
                      ? "var(--hover-bg, #f0f0f0)"
                      : "transparent",
                    "color": index() === selectedIndex()
                      ? "var(--text-primary, #000)"
                      : "var(--text-secondary, #333)",
                    "font-weight": index() === selectedIndex() ? "bold" : "normal",
                    "border-radius": "4px",
                    "transition": "background-color 0.1s ease, color 0.1s ease"
                  }}
                >
                  {suggestion}
                </div>
              )}
            </For>
          </Show>
        </div>
      </Portal>
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
