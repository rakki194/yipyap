import { createSignal } from "solid-js";

export function useTagManagement(saveWithHistory: (newText: string) => void) {
  const [newTag, setNewTag] = createSignal("");
  const [lastEditedTag, setLastEditedTag] = createSignal<string | null>(null);

  const splitAndCleanTags = (text: string) =>
    text
      .split(/,\s*/)
      .map((t) => t.trim())
      .filter(Boolean);

  const normalizeTagText = (text: string) => splitAndCleanTags(text).join(", ");

  const addTag = (tag: string, currentTags: string[]) => {
    const trimmedTag = tag.trim();
    if (!trimmedTag) return;

    if (!currentTags.includes(trimmedTag)) {
      saveWithHistory([...currentTags, trimmedTag].join(", "));
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string, currentTags: string[]) => {
    const newTags = currentTags.filter((tag) => tag !== tagToRemove);
    saveWithHistory(newTags.join(", "));
  };

  const editTag = (oldTag: string, newTag: string, currentTags: string[]) => {
    const tagIndex = currentTags.indexOf(oldTag);
    if (tagIndex !== -1) {
      const newTags = [...currentTags];
      newTags[tagIndex] = newTag;
      setLastEditedTag(newTag);
      saveWithHistory(newTags.join(", "));
    }
  };

  const navigateTag = (
    currentTag: string,
    direction: "left" | "right" | "up" | "down" | "start" | "end",
    containerRef: HTMLDivElement,
    currentTags: string[]
  ) => {
    if (!containerRef) return;
    const currentIndex = currentTags.indexOf(currentTag);
    const tagElements = containerRef.querySelectorAll(".tag-bubble");

    if (direction === "start" || direction === "end") {
      const currentElement = tagElements[currentIndex];
      const currentRect = currentElement.getBoundingClientRect();

      const sameRowElements = Array.from(tagElements).filter((element) => {
        const rect = element.getBoundingClientRect();
        return Math.abs(rect.top - currentRect.top) < 5;
      });

      const targetElement =
        direction === "start"
          ? sameRowElements[0]
          : sameRowElements[sameRowElements.length - 1];

      const tagText = targetElement?.querySelector(".tag-text");
      if (tagText) {
        (tagText as HTMLElement).click();
      }
      return;
    }

    if (direction === "left" || direction === "right") {
      let newIndex;
      if (direction === "left") {
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentTags.length - 1;
      } else {
        newIndex = currentIndex < currentTags.length - 1 ? currentIndex + 1 : 0;
      }

      const targetElement = tagElements[newIndex];
      const tagText = targetElement?.querySelector(".tag-text");
      if (tagText) {
        (tagText as HTMLElement).click();
      }
      return;
    }

    if (direction === "down") {
      const newTagInput = containerRef.querySelector(".new-tag-input input");
      if (newTagInput) {
        setLastEditedTag(currentTag);
        (newTagInput as HTMLElement).focus();
      }
    }
  };

  return {
    newTag,
    setNewTag,
    lastEditedTag,
    setLastEditedTag,
    addTag,
    removeTag,
    editTag,
    navigateTag,
    splitAndCleanTags,
    normalizeTagText,
  };
}
