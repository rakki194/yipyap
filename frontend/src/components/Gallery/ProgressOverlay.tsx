import { Component } from "solid-js";
import "./ProgressOverlay.css";

/**
 * Interface representing the progress information for file operations
 * @interface ProgressInfo
 * @property {number} current - The current progress value (e.g. number of files processed)
 * @property {number} total - The total number of items to process
 * @property {'upload' | 'delete'} type - The type of operation being performed
 * @property {string} message - The message to display during the operation
 */
export interface ProgressInfo {
  current: number;
  total: number;
  type: 'upload' | 'delete';
  message: string;
}

/**
 * Props interface for the ProgressOverlay component
 * @interface ProgressOverlayProps
 * @property {ProgressInfo} progress - The progress information to display
 */
interface ProgressOverlayProps {
  progress: ProgressInfo;
}

/**
 * A component that displays an overlay with progress information for file operations
 * 
 * @component
 * @param {ProgressOverlayProps} props - The component props
 * @returns {JSX.Element} A progress overlay showing current operation status
 * 
 * @example
 * ```tsx
 * <ProgressOverlay 
 *   progress={{
 *     current: 3,
 *     total: 10,
 *     type: 'upload',
 *     message: 'Uploading file.jpg'
 *   }}
 * />
 * ```
 */
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