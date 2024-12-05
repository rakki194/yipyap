import { createSignal, createEffect } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";

export const useSettings = createSingletonRoot(() => {
  // Initialize from localStorage
  const storedInstantDelete = localStorage.getItem("instantDelete") === "true";
  const storedDisableVertical =
    localStorage.getItem("disableVerticalLayout") === "true";

  const [instantDelete, setInstantDelete] = createSignal(storedInstantDelete);
  const [disableVerticalLayout, setDisableVerticalLayout] = createSignal(
    storedDisableVertical
  );

  // Save to localStorage whenever values change
  createEffect(() => {
    localStorage.setItem("instantDelete", instantDelete().toString());
    localStorage.setItem(
      "disableVerticalLayout",
      disableVerticalLayout().toString()
    );
  });

  return {
    instantDelete,
    setInstantDelete,
    disableVerticalLayout,
    setDisableVerticalLayout,
  };
});
