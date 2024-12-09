import { debounce } from "@solid-primitives/scheduled";
import { onMount, Accessor, createRenderEffect } from "solid-js";

/**
 * measure the number of columns in the grid, update the setter
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

/** Preserve the state of a textarea */
export function preserveState(
  textarea: HTMLTextAreaElement,
  accessor: () => [Accessor<string>, (value: string) => void],
  delay = 100
) {
  const [value, setValue] = accessor();

  // Create effect to handle external updates
  createRenderEffect(() => {
    const v = value();
    if (textarea.value === v) return;

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

    queueMicrotask(() => {
      if (
        state.start !== textarea.selectionStart ||
        state.end !== textarea.selectionEnd
      ) {
        textarea.setSelectionRange(state.start, state.end);
      }
      if (state.scrollTop !== textarea.scrollTop) {
        textarea.scrollTop = state.scrollTop;
      }
    });
  });

  // Handle input with cursor preservation
  textarea.addEventListener(
    "input",
    debounce((e) => {
      setValue((e.target as HTMLTextAreaElement).value);
    }, delay)
  );
}

// https://docs.solidjs.com/configuration/typescript
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      measure_columns: (columns: number | null) => void;
      preserveState: [Accessor<string>, (value: string) => void];
    }
  }
}
