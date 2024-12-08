// src/components/ImageViewer/ImageView.tsx
import { createEffect, createMemo, on, onMount, onCleanup, splitProps, createSignal } from "solid-js";
import type { JSX } from "solid-js";
import type { ImageInfo } from "~/types";

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
          console.log("fallback: preview loaded");
          return null;
        } else {
          img.preview_img.setPriority("high");
          if (img.thumbnail_img.isLoaded()) {
            console.log("fallback: thumbnail loaded");
            return img.thumbnail_img.img;
          } else {
            console.log("fallback: spin");
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

  // Updated wheel zoom handler
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    if (!containerRef) return;

    // Make zoom more gradual
    const delta = e.deltaY * -0.002; // Reduced from 0.01 to 0.002
    const newScale = Math.min(Math.max(scale() * (1 + delta), 1), 5);
    
    if (newScale !== scale()) {
      const rect = containerRef.getBoundingClientRect();
      const containerWidth = rect.width;
      const containerHeight = rect.height;

      // Get cursor position relative to the image center
      const cursorX = e.clientX - rect.left - containerWidth / 2;
      const cursorY = e.clientY - rect.top - containerHeight / 2;

      // Calculate new position
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        const scaleChange = newScale - scale();
        setPosition({
          x: position().x - (cursorX * scaleChange / scale()),
          y: position().y - (cursorY * scaleChange / scale())
        });
      }
      
      setScale(newScale);
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
        cursor: scale() > 1 ? (isDragging() ? 'grabbing' : 'grab') : 'default'
      }}
      data-zoom={scale() > 1 ? `${Math.round(scale() * 100)}%` : undefined}
    >
      {fallback()}
      <div 
        style={{
          transform: `scale(${scale()}) translate(${position().x / scale()}px, ${position().y / scale()}px)`,
          "transform-origin": "center",
          transition: isDragging() ? 'none' : 'transform 0.2s ease-out',
          height: '100%',
          width: '100%',
          display: 'flex',
          "justify-content": 'center',
          "align-items": 'center'
        }}
      >
        <img 
          ref={imageRef}
          src={localProps.imageInfo.preview_img.img.src}
          alt={localProps.imageInfo.preview_img.img.alt}
          style={{ width: '100%', height: '100%', "object-fit": 'contain' }}
        />
      </div>
      
      {/* Add minimap */}
      <div class="minimap">
        <img src={props.imageInfo.thumbnail_path} alt="Navigation minimap" />
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
      
      {/* Zoom indicator */}
      <div class="zoom-indicator">
        {Math.round(scale() * 100)}%
      </div>
    </div>
  );
};
