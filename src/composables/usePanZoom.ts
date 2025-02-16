import { createSignal } from "solid-js";

export function usePanZoom({ enableZoom }: { enableZoom: boolean }) {
  const [scale, setScale] = createSignal(1);
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = createSignal(false);
  const [startPos, setStartPos] = createSignal({ x: 0, y: 0 });
  const [viewportStyle, setViewportStyle] = createSignal({
    width: '0%',
    height: '0%',
    left: '0%',
    top: '0%'
  });

  let containerRef: HTMLDivElement | null = null;
  let imageRef: HTMLImageElement | null = null;

  const setContainerRef = (ref: HTMLDivElement | null) => {
    containerRef = ref;
  };

  const setImageRef = (ref: HTMLImageElement | null) => {
    imageRef = ref;
  };

  const handleWheel = (e: WheelEvent) => {
    if (!enableZoom) return;
    if (!containerRef) return;
    const delta = e.deltaY * -0.001; // Smoother zoom factor
    const zoomFactor = Math.exp(delta);
    const newScale = Math.min(Math.max(scale() * zoomFactor, 1), 5);
    if (newScale !== scale()) {
      const rect = containerRef.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;
      const relativeX = (cursorX - containerWidth / 2 - position().x) / scale();
      const relativeY = (cursorY - containerHeight / 2 - position().y) / scale();
      const newX = cursorX - containerWidth / 2 - relativeX * newScale;
      const newY = cursorY - containerHeight / 2 - relativeY * newScale;
      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (scale() > 1) {
      setIsDragging(true);
      setStartPos({ x: e.clientX - position().x, y: e.clientY - position().y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging() && scale() > 1) {
      const newX = e.clientX - startPos().x;
      const newY = e.clientY - startPos().y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const updateMinimapViewport = () => {
    if (!containerRef || !imageRef) return;
    const containerWidth = containerRef.clientWidth;
    const containerHeight = containerRef.clientHeight;
    const imageWidth = imageRef.clientWidth;
    const imageHeight = imageRef.clientHeight;
    const viewportWidth = (containerWidth / (imageWidth * scale())) * 100;
    const viewportHeight = (containerHeight / (imageHeight * scale())) * 100;
    const left = (-position().x / (imageWidth * scale())) * 100;
    const top = (-position().y / (imageHeight * scale())) * 100;
    setViewportStyle({
      width: `${Math.min(100, viewportWidth)}%`,
      height: `${Math.min(100, viewportHeight)}%`,
      left: `${Math.max(0, Math.min(100 - viewportWidth, left))}%`,
      top: `${Math.max(0, Math.min(100 - viewportHeight, top))}%`
    });
  };

  return {
    scale,
    position,
    isDragging,
    viewportStyle,
    setContainerRef,
    setImageRef,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleDoubleClick,
    updateMinimapViewport,
  };
} 