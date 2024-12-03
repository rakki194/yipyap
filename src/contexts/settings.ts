import { createSignal, createEffect } from "solid-js";
import { createSingletonRoot } from "@solid-primitives/rootless";

export const useSettings = createSingletonRoot(() => {
  // Initialize from localStorage, default to false if not set
  const storedValue = localStorage.getItem("instantDelete") === "true";
  const [instantDelete, setInstantDelete] = createSignal(storedValue);

  // Save to localStorage whenever the value changes
  createEffect(() => {
    localStorage.setItem("instantDelete", instantDelete().toString());
  });

  return {
    instantDelete,
    setInstantDelete,
  };
});
