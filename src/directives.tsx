import { debounce } from "@solid-primitives/scheduled";
import {
  onCleanup,
  onMount,
  createSignal,
  Accessor,
  Setter,
  createEffect,
  createRenderEffect,
} from "solid-js";

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
  let observer: ResizeObserver;
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

    textarea.value = v;

    queueMicrotask(() => {
      textarea.setSelectionRange(state.start, state.end);
      textarea.scrollTop = state.scrollTop;
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
