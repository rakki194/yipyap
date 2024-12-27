import { createSignal } from "solid-js";
import { useAction, useSubmission } from "@solidjs/router";
import { useGallery } from "~/contexts/GalleryContext";

export function useCaptionHistory(type: () => string, initialCaption: () => string) {
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);
  const { saveCaption } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);

  const saveWithHistory = (newText: string) => {
    setCaptionHistory((prev) => [...prev, initialCaption()]);
    save({
      caption: newText,
      type: type(),
    });
  };

  const undo = () => {
    const history = captionHistory();
    if (history.length > 0) {
      const previousText = history[history.length - 1];
      setCaptionHistory((prev) => prev.slice(0, -1));
      save({
        caption: previousText,
        type: type(),
      });
    }
  };

  return {
    captionHistory,
    saveWithHistory,
    undo,
    submission,
  };
}
