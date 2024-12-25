import { Component } from "solid-js";
import "./ProgressOverlay.css";

export interface ProgressInfo {
  current: number;
  total: number;
  type: 'upload' | 'delete';
  message: string;
}

interface ProgressOverlayProps {
  progress: ProgressInfo;
}

export const ProgressOverlay: Component<ProgressOverlayProps> = (props) => {
  return (
    <div class="upload-progress-overlay">
      <div class="upload-progress-container">
        <div class="upload-current-file">
          {props.progress.message}
        </div>
        <div class="upload-progress-bar">
          <div 
            class="upload-progress-fill"
            classList={{
              'delete': props.progress.type === 'delete'
            }}
            style={{
              width: `${(props.progress.current / props.progress.total) * 100}%`
            }}
          />
        </div>
        <div class="upload-progress-text">
          {`${Math.round((props.progress.current / props.progress.total) * 100)}%`}
        </div>
      </div>
    </div>
  );
}; 