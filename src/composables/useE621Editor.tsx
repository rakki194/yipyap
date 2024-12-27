import { createSignal, createEffect } from "solid-js";

export function useE621Editor(
  caption: () => string,
  saveWithHistory: (newText: string) => void
) {
  const [lineCount, setLineCount] = createSignal(1);
  const [currentLine, setCurrentLine] = createSignal(1);
  const [highlightedContent, setHighlightedContent] = createSignal("");

  const isValidJSON = (text: string): boolean => {
    try {
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  const formatJSON = (text: string): string => {
    try {
      return JSON.stringify(JSON.parse(text), null, 2);
    } catch {
      return text;
    }
  };

  const syntaxHighlight = (json: string) => {
    if (!json) return "";

    // Always convert newlines to <br> and spaces to &nbsp; first
    let result = json.replace(/\n/g, '<br>').replace(/\s/g, '&nbsp;');

    // Try to parse and format if it's valid JSON
    try {
      JSON.parse(json);
      // If valid JSON, replace the result with properly formatted version
      const formatted = formatJSON(json);
      
      // First escape HTML special characters
      result = formatted.replace(/[&<>'"]/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[char] || char));

      // Replace line breaks with <br> tags
      result = result.replace(/\n/g, '<br>');

      // Replace spaces at the start of lines with &nbsp;
      result = result.replace(/^(\s+)|(?<=<br>)(\s+)/g, (match) => '&nbsp;'.repeat(match.length));

      // Define regex patterns for JSON elements
      const patterns = {
        key: /(&quot;(?:[^&]|&(?!quot;))*&quot;)(?=\s*:)/g,
        string: /&quot;(?:[^&]|&(?!quot;))*&quot;/g,
        number: /-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/g,
        boolean: /\b(?:true|false)\b/g,
        null: /\bnull\b/g,
        bracket: /[{}\[\]]/g,
        colon: /:/g,
        comma: /,/g
      };

      // Apply syntax highlighting
      result = result
        .replace(patterns.key, '<span class="json-key">$1</span>')
        .replace(patterns.string, '<span class="json-string">$&</span>')
        .replace(patterns.number, '<span class="json-number">$&</span>')
        .replace(patterns.boolean, '<span class="json-boolean">$&</span>')
        .replace(patterns.null, '<span class="json-null">$&</span>')
        .replace(patterns.bracket, '<span class="json-bracket">$&</span>')
        .replace(patterns.colon, '<span class="json-colon">$&</span>')
        .replace(patterns.comma, '<span class="json-comma">$&</span>');
    } catch {
      // If invalid JSON, still try to highlight what we can
      const patterns = {
        string: /"(?:\\.|[^"\\])*"/g,
        number: /-?\b\d+\.?\d*(?:[eE][+-]?\d+)?\b/g,
        boolean: /\b(?:true|false)\b/g,
        null: /\bnull\b/g,
        bracket: /[{}\[\]]/g,
        colon: /:/g,
        comma: /,/g
      };

      // Apply basic syntax highlighting even for invalid JSON
      result = result
        .replace(patterns.string, '<span class="json-string">$&</span>')
        .replace(patterns.number, '<span class="json-number">$&</span>')
        .replace(patterns.boolean, '<span class="json-boolean">$&</span>')
        .replace(patterns.null, '<span class="json-null">$&</span>')
        .replace(patterns.bracket, '<span class="json-bracket">$&</span>')
        .replace(patterns.colon, '<span class="json-colon">$&</span>')
        .replace(patterns.comma, '<span class="json-comma">$&</span>');
    }

    return result;
  };

  const countLinesInElement = (element: HTMLElement): number => {
    // Get the raw text content first
    const text = element.innerText || '';
    const textLines = text.split('\n').length;

    // Also count <br> elements
    const brElements = element.getElementsByTagName('br');
    const brCount = brElements.length;

    // Return the maximum of text lines and br-based lines
    return Math.max(textLines, brCount + 1);
  };

  const calculateCurrentLine = (element: HTMLElement) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);

    // Get text content up to caret
    const textUpToCaret = preCaretRange.toString();
    const currentLine = textUpToCaret.split('\n').length;
    setCurrentLine(currentLine);
  };

  const getPlainText = (element: HTMLElement): string => {
    return element.innerText;
  };

  const handleInput = (e: InputEvent, element: HTMLElement) => {
    const text = getPlainText(element);
    
    // Store selection state before updating content
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    
    // Get the text content up to the cursor to count characters
    const textBeforeCursor = preCaretRange.toString();
    const cursorOffset = textBeforeCursor.length;

    // Update content
    const highlighted = syntaxHighlight(text);
    setHighlightedContent(highlighted);

    // Save after highlighting to ensure we save the plain text
    saveWithHistory(text);

    // Restore cursor position after content update
    requestAnimationFrame(() => {
      try {
        const textNodes = [];
        const walk = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );

        let node;
        while (node = walk.nextNode()) {
          textNodes.push(node);
        }

        let currentOffset = 0;
        let targetNode = textNodes[0];
        let targetOffset = 0;

        // Find the text node and offset where our cursor should be
        for (const node of textNodes) {
          const nodeLength = node.textContent?.length || 0;
          if (currentOffset + nodeLength >= cursorOffset) {
            targetNode = node;
            targetOffset = cursorOffset - currentOffset;
            break;
          }
          currentOffset += nodeLength;
        }

        if (targetNode) {
          const newRange = document.createRange();
          newRange.setStart(targetNode, targetOffset);
          newRange.setEnd(targetNode, targetOffset);
          
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      } catch (error) {
        console.error('Error restoring cursor position:', error);
      }
    });
  };

  const handleKeyDown = (e: KeyboardEvent, element: HTMLElement) => {
    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      document.execCommand('insertText', false, '  ');
      calculateCurrentLine(element);
      setLineCount(countLinesInElement(element));
    }
    // Handle Shift+Enter for formatting
    else if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const text = getPlainText(element);
      if (isValidJSON(text)) {
        const formatted = formatJSON(text);
        element.innerHTML = syntaxHighlight(formatted);
        saveWithHistory(formatted);
        calculateCurrentLine(element);
        setLineCount(countLinesInElement(element));
      }
    }
    // Handle regular Enter key
    else if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertLineBreak');
      calculateCurrentLine(element);
      setLineCount(countLinesInElement(element));
    }
  };

  const handlePaste = (e: ClipboardEvent, element: HTMLElement) => {
    e.preventDefault();
    const text = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, text);
    
    const newText = getPlainText(element);
    const highlighted = syntaxHighlight(newText);
    element.innerHTML = highlighted;
    calculateCurrentLine(element);
    setLineCount(countLinesInElement(element));
    saveWithHistory(newText);
  };

  const handleScroll = (e: Event) => {
    const editor = e.currentTarget as HTMLElement;
    const lineNumbers = editor.parentElement?.querySelector('.line-numbers-content') as HTMLElement;
    if (lineNumbers) {
      lineNumbers.style.transform = `translateY(-${editor.scrollTop}px)`;
    }
  };

  createEffect(() => {
    const code = caption() || "";
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = syntaxHighlight(code);
      setLineCount(countLinesInElement(tempDiv));
      setHighlightedContent(syntaxHighlight(code));
    } catch (error) {
      console.error('Error updating content:', error);
      setLineCount(1);
    }
  });

  return {
    lineCount,
    currentLine,
    highlightedContent,
    isValidJSON,
    formatJSON,
    calculateCurrentLine,
    handleInput,
    handleKeyDown,
    handlePaste,
    handleScroll,
  };
}
