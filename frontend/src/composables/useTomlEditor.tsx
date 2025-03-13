import { createSignal, createEffect } from "solid-js";
import TOML from '@ltd/j-toml';

export const useTomlEditor = (
  initialContent: () => string,
  onSave: (content: string) => void
) => {
  const [currentLine, setCurrentLine] = createSignal(1);
  const [lineCount, setLineCount] = createSignal(1);
  const [isValidTOML, setIsValidTOML] = createSignal(true);

  const validateToml = (content: string) => {
    try {
      TOML.parse(content);
      return true;
    } catch (e) {
      return false;
    }
  };

  const highlightToml = (content: string) => {
    const lines = content.split("\n");
    let highlighted = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Handle comments
      if (line.trim().startsWith("#")) {
        highlighted += `<span class="toml-comment">${line}</span>`;
      }
      // Handle sections
      else if (line.trim().match(/^\[.*\]$/)) {
        highlighted += `<span class="toml-section">${line}</span>`;
      }
      // Handle key-value pairs
      else {
        const parts = line.split("=");
        if (parts.length === 2) {
          const key = parts[0].trim();
          const value = parts[1].trim();

          highlighted += `<span class="toml-key">${key}</span>`;
          highlighted += `<span class="toml-equals">=</span>`;

          // Handle different value types
          if (value.match(/^".*"$/)) {
            highlighted += `<span class="toml-string">${value}</span>`;
          } else if (value.match(/^[0-9]+(\.[0-9]+)?$/)) {
            highlighted += `<span class="toml-number">${value}</span>`;
          } else if (value.match(/^(true|false)$/)) {
            highlighted += `<span class="toml-boolean">${value}</span>`;
          } else if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
            highlighted += `<span class="toml-date">${value}</span>`;
          } else if (value.match(/^\[.*\]$/)) {
            highlighted += `<span class="toml-array">${value}</span>`;
          } else {
            highlighted += value;
          }
        } else {
          highlighted += line;
        }
      }

      if (i < lines.length - 1) {
        highlighted += "\n";
      }
    }

    return highlighted;
  };

  const handleInput = (e: InputEvent, node: HTMLElement) => {
    const content = node.innerText;
    const isValid = validateToml(content);
    setIsValidTOML(isValid);

    if (isValid) {
      onSave(content);
    }

    // Update line count
    setLineCount(content.split("\n").length);

    // Update syntax highlighting
    node.innerHTML = highlightToml(content);
  };

  const handleKeyDown = (e: KeyboardEvent, node: HTMLElement) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode("  "));
        range.collapse(false);
      }
    }
  };

  const handlePaste = async (e: ClipboardEvent, node: HTMLElement) => {
    e.preventDefault();
    const text = e.clipboardData?.getData("text/plain") || "";
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
    }
  };

  const calculateCurrentLine = (node: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    const text = preCaretRange.toString();
    setCurrentLine(text.split("\n").length);
  };

  const handleScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.scrollTop !== 0) {
      target.style.borderTopLeftRadius = "0";
      target.style.borderTopRightRadius = "0";
    } else {
      target.style.borderTopLeftRadius = "var(--half-spacing)";
      target.style.borderTopRightRadius = "var(--half-spacing)";
    }
  };

  createEffect(() => {
    const content = initialContent();
    setIsValidTOML(validateToml(content));
    setLineCount(content.split("\n").length);
  });

  return {
    lineCount,
    currentLine,
    highlightedContent: () => highlightToml(initialContent()),
    isValidTOML,
    calculateCurrentLine,
    handleInput,
    handleKeyDown,
    handlePaste,
    handleScroll,
  };
}; 