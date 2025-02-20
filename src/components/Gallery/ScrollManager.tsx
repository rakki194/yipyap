import { onCleanup } from "solid-js";

export class ScrollManager {
  private element: HTMLElement | null = null;
  private animationFrame: number | null = null;
  private isAnimating = false;

  constructor(private readonly scrollTimeout: number) { }

  init(element: HTMLElement) {
    this.element = element;
  }

  getScrollBounds() {
    if (!this.element) return { min: 0, max: 0 };
    return {
      min: 0,
      max: this.element.scrollHeight - this.element.clientHeight
    };
  }

  smoothScrollTo(targetY: number, force = false) {
    if (!this.element || (!force && this.isAnimating)) return;

    // Cancel any existing animation
    this.cleanup();

    const bounds = this.getScrollBounds();
    targetY = Math.max(bounds.min, Math.min(bounds.max, targetY));

    const startY = this.element.scrollTop;
    const startTime = performance.now();
    this.isAnimating = true;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.scrollTimeout, 1);

      // Use easeInOutQuad easing
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      this.element!.scrollTop = startY + ((targetY - startY) * easeProgress);

      if (progress < 1 && this.isAnimating) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.element!.scrollTop = targetY;
        this.cleanup();
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  cleanup() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    this.isAnimating = false;
  }

  get isActive() {
    return this.isAnimating;
  }
}

export const useScrollManager = (scrollTimeout: number) => {
  const scrollManager = new ScrollManager(scrollTimeout);

  onCleanup(() => {
    scrollManager.cleanup();
  });

  return scrollManager;
}; 
