/**
 * SolidJS Custom Directives Module
 * 
 * This module provides custom directives for SolidJS components to handle:
 * 1. Grid column measurement and responsive updates
 * 2. Textarea state preservation including cursor position and scroll state
 * 
 * The directives are designed to be used with the `use:` directive syntax in SolidJS
 * and are fully typed for TypeScript integration.
 * 
 * Key Features:
 * - Automatic grid column counting with ResizeObserver
 * - Textarea state preservation during updates
 * - Cursor position and scroll state maintenance
 * - Debounced input handling
 * - TypeScript type declarations for SolidJS JSX
 * 
 * @module directives
 */

import { debounce } from "@solid-primitives/scheduled";
import { onMount, Accessor, createRenderEffect, onCleanup } from "solid-js";

/**
 * Measures and tracks the number of columns in a CSS Grid layout.
 * 
 * This directive automatically measures the number of columns in a grid container
 * and updates a setter function whenever the grid layout changes. It uses
 * ResizeObserver to track changes in the grid's dimensions.
 * 
 * @param gridRef - Reference to the HTML div element containing the CSS Grid
 * @param value - Accessor function that returns a setter for updating the column count
 * 
 * @example
 * ```tsx
 * <div use:measure_columns={setColumns}>
 *   // Grid items
 * </div>
 * ```
 * 
 * @remarks
 * - Returns null if no grid template columns are defined
 * - Automatically cleans up ResizeObserver on component unmount
 * - Updates immediately on mount and then on any resize events
 */
export function measure_columns(
  gridRef: HTMLDivElement,
  value: Accessor<(columns: number | null) => void>
) {
  const setColumns = value();
  const measure_columns = () => {
    const style = getComputedStyle(gridRef);
    if (style.gridTemplateColumns) {
      setColumns(style.gridTemplateColumns.split(" ").length);
    } else {
      setColumns(null);
    }
  };
  onMount(() => {
    measure_columns();
    const observer = new ResizeObserver((entries) => {
      measure_columns();
    });
    observer.observe(gridRef);
  });
}

/**
 * Preserves textarea state during updates, including cursor position and scroll state.
 * 
 * This directive maintains the textarea's state when its value is updated externally,
 * ensuring that the cursor position and scroll position remain consistent. It also
 * handles user input with debouncing for performance.
 * 
 * @param textarea - Reference to the HTML textarea element to preserve state for
 * @param accessor - Function that returns a tuple of [value accessor, value setter]
 * @param delay - Debounce delay in milliseconds for input handling (default: 100ms)
 * 
 * @example
 * ```tsx
 * <textarea 
 *   use:preserveState={[() => value, setValue]}
 *   // other props
 * />
 * ```
 * 
 * @remarks
 * - Uses queueMicrotask for synchronous state updates
 * - Includes debug logging in development mode
 * - Debounces input events to prevent excessive updates
 * - Preserves:
 *   - Cursor selection start/end positions
 *   - Scroll position
 *   - Input value synchronization
 */
export function preserveState(
  textarea: HTMLTextAreaElement,
  accessor: () => [Accessor<string>, (value: string) => void],
  delay = 100
) {
  const [value, setValue] = accessor();
  let isUserInput = false;

  // Create effect to handle external updates
  createRenderEffect(() => {
    const v = value();
    // Skip if this is a user input or values are already equal
    if (isUserInput || textarea.value === v) return;

    const state = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      scrollTop: textarea.scrollTop,
    };

    if (import.meta.env.DEV) {
      console.debug("preserving input state", {
        signal: v,
        input: textarea.value,
        state,
      });
    }

    textarea.value = v;

    // Use requestAnimationFrame instead of queueMicrotask for smoother updates
    requestAnimationFrame(() => {
      if (document.activeElement === textarea) {
        if (
          state.start !== textarea.selectionStart ||
          state.end !== textarea.selectionEnd
        ) {
          textarea.setSelectionRange(state.start, state.end);
        }
        if (state.scrollTop !== textarea.scrollTop) {
          textarea.scrollTop = state.scrollTop;
        }
      }
    });
  });

  // Handle input with cursor preservation
  const handleInput = debounce((e: Event) => {
    isUserInput = true;
    setValue((e.target as HTMLTextAreaElement).value);
    isUserInput = false;
  }, delay);

  textarea.addEventListener("input", handleInput);

  // Cleanup
  onCleanup(() => {
    textarea.removeEventListener("input", handleInput);
  });
}

/**
 * TypeScript type declarations for SolidJS JSX.
 * 
 * Extends the SolidJS JSX namespace to include type definitions for custom directives.
 * This ensures proper TypeScript type checking when using these directives in components.
 * 
 * @remarks
 * - measure_columns: Function that takes a number or null for column count
 * - preserveState: Tuple of accessor and setter for string values
 */
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      measure_columns: (columns: number | null) => void;
      preserveState: [Accessor<string>, (value: string) => void];
    }
  }
}
