import { debounce } from "@solid-primitives/scheduled";
import { Accessor, createRenderEffect, createSignal } from "solid-js";

// Define TypeScript type for the directive
declare module "solid-js" {
  namespace JSX {
    interface Directives {
      preserveState: [Accessor<string>, (value: string) => void];
    }
  }
}

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

// Example usage:
function Editor() {
  const [content, setContent] = createSignal("");

  return <textarea use:preserveState={[content, setContent]} />;
}
