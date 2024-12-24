import { Component, Show } from 'solid-js';
import styles from './UploadOverlay.module.css';

interface UploadOverlayProps {
  isVisible: boolean;
}

export const UploadOverlay: Component<UploadOverlayProps> = (props) => {
  return (
    <Show when={props.isVisible}>
      <div class={styles.overlay}>
        <div class={styles.content}>
          <div class={styles.icon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div class={styles.text}>Drop files here to upload</div>
        </div>
      </div>
    </Show>
  );
}; 