import { Component, createSignal, createEffect } from "solid-js";
import "./Slider.css";

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  onChange?: (value: number) => void;
  class?: string;
  disabled?: boolean;
  "aria-label"?: string;
}

export const Slider: Component<SliderProps> = (props) => {
  const [trackRef, setTrackRef] = createSignal<HTMLDivElement>();
  const [isDragging, setIsDragging] = createSignal(false);
  const [value, setValue] = createSignal(props.value ?? 0);

  const min = () => props.min ?? 0;
  const max = () => props.max ?? 100;
  const step = () => props.step ?? 1;

  // Calculate percentage for positioning
  const percentage = () => {
    const val = value();
    return ((val - min()) / (max() - min())) * 100;
  };

  // Update value based on mouse/touch position
  const updateValue = (clientX: number) => {
    if (!trackRef()) return;

    const track = trackRef()!;
    const rect = track.getBoundingClientRect();
    const offsetX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, offsetX / rect.width));
    const newValue = min() + percentage * (max() - min());
    const steppedValue = Math.round(newValue / step()) * step();
    const clampedValue = Math.max(min(), Math.min(max(), steppedValue));

    if (clampedValue !== value()) {
      setValue(clampedValue);
      props.onChange?.(clampedValue);
    }
  };

  // Mouse event handlers
  const onMouseDown = (e: MouseEvent) => {
    if (props.disabled) return;
    setIsDragging(true);
    updateValue(e.clientX);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return;
    e.preventDefault(); // Prevent text selection while dragging
    updateValue(e.clientX);
  };

  const onMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  // Touch event handlers
  const onTouchStart = (e: TouchEvent) => {
    if (props.disabled) return;
    setIsDragging(true);
    updateValue(e.touches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!isDragging()) return;
    e.preventDefault(); // Prevent scrolling while dragging
    updateValue(e.touches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsDragging(false);
  };

  // Keyboard support
  const onKeyDown = (e: KeyboardEvent) => {
    if (props.disabled) return;
    
    const currentValue = value();
    let newValue = currentValue;

    switch (e.key) {
      case "ArrowLeft":
      case "ArrowDown":
        newValue = Math.max(min(), currentValue - step());
        break;
      case "ArrowRight":
      case "ArrowUp":
        newValue = Math.min(max(), currentValue + step());
        break;
      case "Home":
        newValue = min();
        break;
      case "End":
        newValue = max();
        break;
      case "PageDown":
        newValue = Math.max(min(), currentValue - (max() - min()) / 10);
        break;
      case "PageUp":
        newValue = Math.min(max(), currentValue + (max() - min()) / 10);
        break;
      default:
        return;
    }

    e.preventDefault();
    setValue(newValue);
    props.onChange?.(newValue);
  };

  // Sync with external value changes
  createEffect(() => {
    if (props.value !== undefined && !isDragging()) {
      setValue(props.value);
    }
  });

  return (
    <div 
      class={`slider ${props.class || ""} ${props.disabled ? "disabled" : ""}`}
      role="slider"
      aria-valuemin={min()}
      aria-valuemax={max()}
      aria-valuenow={value()}
      aria-disabled={props.disabled}
      aria-label={props["aria-label"]}
      tabIndex={props.disabled ? -1 : 0}
      onKeyDown={onKeyDown}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        class="slider-track" 
        ref={setTrackRef}
      >
        <div 
          class="slider-track-fill" 
          style={{ width: `${percentage()}%` }} 
        />
      </div>
      <div 
        class="slider-thumb"
        style={{ left: `${percentage()}%` }}
      />
    </div>
  );
}; 