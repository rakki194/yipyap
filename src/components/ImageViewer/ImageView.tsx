// src/components/ImageViewer/ImageView.tsx
import { createEffect, createMemo, on, onMount, onCleanup, splitProps, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import type { ImageInfo } from "~/types";
import { useAppContext } from "~/contexts/app";

interface ImageViewProps extends JSX.HTMLAttributes<HTMLDivElement> {
  imageInfo: ImageInfo;
}

/**
 * An image viewer component that displays a preview and thumbnail image.
 * @param {ImageViewProps} props - The props for the ImageView component.
 * @returns A JSX element representing the ImageView component.
 */
export const ImageView = (props: ImageViewProps) => {
  const [localProps, divProps] = splitProps(props, ["imageInfo"]);
  const app = useAppContext();
  const [scale, setScale] = createSignal(1);
  const [isDragging, setIsDragging] = createSignal(false);
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [startPos, setStartPos] = createSignal({ x: 0, y: 0 });
  let containerRef: HTMLDivElement | undefined;
  let imageRef: HTMLImageElement | undefined;

  const [viewportStyle, setViewportStyle] = createSignal({
    width: '0%',
    height: '0%',
    left: '0%',
    top: '0%'
  });

  const fallback = createMemo(
    on(
      // ImageInfo contains all the updates for now
      () => localProps.imageInfo,
      (img, prev_img) => {
        if (prev_img && prev_img.download_path !== img.download_path) {
          prev_img.preview_img.setPriority("low");
          prev_img.thumbnail_img.setPriority("low");
        }
        if (img.preview_img.isLoaded()) {
          if (import.meta.env.DEV)
            console.debug("fallback: preview loaded");
          return null;
        } else {
          img.preview_img.setPriority("high");
          if (img.thumbnail_img.isLoaded()) {
            if (import.meta.env.DEV)
              console.debug("fallback: thumbnail loaded");
            return img.thumbnail_img.img;
          } else {
            if (import.meta.env.DEV)
              console.debug("fallback: spin");
            img.thumbnail_img.setPriority("high");
            return (
              <span
                class="icon spin-icon"
                style={{ width: "100%", height: "100%", position: "absolute" }}
              />
            );
          }
        }
      }
    )
  );

  // Updated wheel zoom handler with smoother zoom behavior
  const handleWheel = (e: WheelEvent) => {
    if (!app.enableZoom) return;
    e.preventDefault();
    if (!containerRef) return;

    // Make zoom more gradual and smooth
    const delta = e.deltaY * -0.001; // Reduced from 0.002 to 0.001 for smoother zoom
    const zoomFactor = Math.exp(delta);
    const newScale = Math.min(Math.max(scale() * zoomFactor, 1), 5);
    
    if (newScale !== scale()) {
      const rect = containerRef.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      // Get cursor position relative to the container
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // Calculate cursor position relative to the image center
      const relativeX = (cursorX - containerWidth / 2 - position().x) / scale();
      const relativeY = (cursorY - containerHeight / 2 - position().y) / scale();

      // Calculate new position to keep the cursor point fixed
      const newX = cursorX - containerWidth / 2 - relativeX * newScale;
      const newY = cursorY - containerHeight / 2 - relativeY * newScale;

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle drag to pan when zoomed
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

  // Double click to reset zoom
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Update this whenever scale or position changes
  const updateMinimapViewport = () => {
    if (!containerRef || !imageRef) return;

    const containerWidth = containerRef.clientWidth;
    const containerHeight = containerRef.clientHeight;
    const imageWidth = imageRef.clientWidth;
    const imageHeight = imageRef.clientHeight;

    // Calculate the visible portion of the image
    const viewportWidth = (containerWidth / (imageWidth * scale())) * 100;
    const viewportHeight = (containerHeight / (imageHeight * scale())) * 100;

    // Calculate the position of the viewport in the minimap
    // Convert the position from pixels to percentage of the total scaled image size
    const left = (-position().x / (imageWidth * scale())) * 100;
    const top = (-position().y / (imageHeight * scale())) * 100;

    setViewportStyle({
      width: `${Math.min(100, viewportWidth)}%`,
      height: `${Math.min(100, viewportHeight)}%`,
      left: `${Math.max(0, Math.min(100 - viewportWidth, left))}%`,
      top: `${Math.max(0, Math.min(100 - viewportHeight, top))}%`
    });
  };

  // Add effect to update viewport when scale or position changes
  createEffect(() => {
    // Dependencies that should trigger an update
    const _ = scale();
    const pos = position();
    
    // Update the viewport
    updateMinimapViewport();
  });

  // Also update on window resize
  onMount(() => {
    const resizeObserver = new ResizeObserver(() => {
      updateMinimapViewport();
    });
    
    if (containerRef) {
      resizeObserver.observe(containerRef);
    }

    onCleanup(() => {
      resizeObserver.disconnect();
    });
  });

  // Add handleMinimapClick function
  const handleMinimapClick = (e: MouseEvent) => {
    if (!containerRef || !imageRef) return;
    
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    
    const imageWidth = imageRef.clientWidth;
    const imageHeight = imageRef.clientHeight;
    
    // Calculate the new position
    const newX = -(x * imageWidth * scale() - containerRef.clientWidth / 2);
    const newY = -(y * imageHeight * scale() - containerRef.clientHeight / 2);
    
    setPosition({ x: newX, y: newY });
  };

  return (
    <div 
      ref={containerRef}
      class="image-container" 
      {...divProps}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDblClick={handleDoubleClick}
      style={{
        cursor: scale() > 1 ? (isDragging() ? 'grabbing' : 'grab') : 'default',
        "touch-action": "none" // Add this to prevent default touch behaviors
      }}
      data-zoom={scale() > 1 ? `${Math.round(scale() * 100)}%` : undefined}
    >
      <div 
        style={{
          transform: `scale(${scale()}) translate(${position().x / scale()}px, ${position().y / scale()}px)`,
          "transform-origin": "center",
          // Adjust transition timing for smoother zoom
          transition: isDragging() ? 'none' : 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          height: '100%',
          width: '100%',
          display: 'flex',
          "justify-content": 'center',
          "align-items": 'center',
          "will-change": "transform" // Add this for better performance
        }}
      >
        {localProps.imageInfo.preview_img.isLoaded() ? (
          <img 
            ref={imageRef}
            src={localProps.imageInfo.preview_img.img.src}
            alt={localProps.imageInfo.preview_img.img.alt}
            style={{ width: '100%', height: '100%', "object-fit": 'contain' }}
          />
        ) : (
          fallback()
        )}
      </div>
      
      {/* Update minimap conditional rendering */}
      <Show when={scale() > 1 && app.enableZoom && app.enableMinimap}>
        <div class="minimap" onClick={handleMinimapClick}>
          <img 
            src={localProps.imageInfo.thumbnail_img.img.src} 
            alt="Navigation minimap" 
          />
          <div class="overlay" 
            style={{
              "--viewport-left": viewportStyle().left,
              "--viewport-top": viewportStyle().top,
              "--viewport-right": `calc(${viewportStyle().left} + ${viewportStyle().width})`,
              "--viewport-bottom": `calc(${viewportStyle().top} + ${viewportStyle().height})`
            }}
          />
          <div 
            class="viewport" 
            style={{
              width: viewportStyle().width,
              height: viewportStyle().height,
              left: viewportStyle().left,
              top: viewportStyle().top
            }}
          />
        </div>
      </Show>
      
      {/* Zoom indicator */}
      <div class="zoom-indicator">
        {Math.round(scale() * 100)}%
      </div>
    </div>
  );
};
