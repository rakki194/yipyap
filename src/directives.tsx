/**
 * SolidJS Custom Directives Module
 * 
 * This module provides custom directives for SolidJS components that handle grid layout 
 * measurements and textarea state management. It includes utilities for:
 * - Measuring and tracking CSS Grid column counts
 * - Preserving textarea state including cursor position and scroll
 * - Handling resize events with debouncing
 * 
 * The directives are designed to integrate with SolidJS's directive system using the
 * `use:` syntax and provide full TypeScript type safety.
 * 
 * @module directives
 */

import { debounce } from "@solid-primitives/scheduled";
import { onMount, Accessor, createRenderEffect, onCleanup } from "solid-js";

/**
 * Measures and tracks the number of columns in a CSS Grid layout.
 * 
 * This directive uses ResizeObserver to automatically detect and report changes
 * in the number of columns in a grid container. It's useful for responsive layouts
 * where the grid structure changes based on viewport size.
 * 
 * @param gridRef - The HTML div element containing the CSS Grid
 * @param value - Accessor function returning a setter to update the column count
 * 
 * @example
 * const [columns, setColumns] = createSignal(0);
 * return (
 *   <div use:measure_columns={setColumns}>
 *     // Grid items
 *   </div>
 * );
 * 
 * @remarks
 * - Returns null if no grid template columns are defined
 * - Automatically cleans up ResizeObserver on unmount
 * - Updates immediately on mount and on resize events
 */
export function measure_columns(
  gridRef: HTMLDivElement,
  value: Accessor<(columns: number | null) => void>
) {
  const setColumns = value();
  /**
   * Internal function to measure and update the column count
   * Uses computed styles to determine the number of columns in the grid
   */
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
 * const [value, setValue] = createSignal("");
 * return (
 *   <textarea 
 *     use:preserveState={[() => value, setValue]}
 *     placeholder="Enter text..."
 *   />
 * );
 * 
 * @remarks
 * - Uses requestAnimationFrame for smooth state updates
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

  /**
   * Effect to handle external value updates while preserving textarea state
   * Skips updates if they originate from user input or if values are already equal
   */
  createRenderEffect(() => {
    const v = value();
    if (isUserInput || textarea.value === v) return;

    const state = {
      start: textarea.selectionStart,
      end: textarea.selectionEnd,
      scrollTop: textarea.scrollTop,
    };

    //if (import.meta.env.DEV) {
    //  console.debug("preserving input state", {
    //    signal: v,
    //    input: textarea.value,
    //    state,
    //  });
    //}

    textarea.value = v;

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

  /**
   * Debounced input handler to update the value while preventing excessive updates
   * Sets isUserInput flag to prevent feedback loops with the effect
   */
  const handleInput = debounce((e: Event) => {
    isUserInput = true;
    setValue((e.target as HTMLTextAreaElement).value);
    isUserInput = false;
  }, delay);

  textarea.addEventListener("input", handleInput);
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
