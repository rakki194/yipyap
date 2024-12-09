import { createSignal } from "solid-js";

export type NavigationDirection = "left" | "right" | "up" | "down" | "start" | "end";

interface UseTagNavigationOptions {
  onNavigate: (direction: NavigationDirection) => void;
  onEdit: (newTag: string) => void;
  onRemove: () => void;
}

export function useTagNavigation({ onNavigate, onEdit, onRemove }: UseTagNavigationOptions) {
  const [lastNavigationTime, setLastNavigationTime] = createSignal(0);
  const [lastNavigationDirection, setLastNavigationDirection] = createSignal<"left" | "right" | null>(null);
  const DOUBLE_TAP_THRESHOLD = 300;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!e.shiftKey) return;

    const now = Date.now();
    
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      // Check for double-tap left
      if (lastNavigationDirection() === "left" && 
          now - lastNavigationTime() < DOUBLE_TAP_THRESHOLD) {
        onNavigate("start");
      } else {
        onNavigate("left");
      }
      setLastNavigationTime(now);
      setLastNavigationDirection("left");
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      // Check for double-tap right
      if (lastNavigationDirection() === "right" && 
          now - lastNavigationTime() < DOUBLE_TAP_THRESHOLD) {
        onNavigate("end");
      } else {
        onNavigate("right");
      }
      setLastNavigationTime(now);
      setLastNavigationDirection("right");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      onNavigate("up");
      setLastNavigationDirection(null);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onNavigate("down");
      setLastNavigationDirection(null);
    } else if (e.key === "Delete") {
      e.preventDefault();
      onRemove();
      setLastNavigationDirection(null);
    }
  };

  return {
    handleKeyDown
  };
} 