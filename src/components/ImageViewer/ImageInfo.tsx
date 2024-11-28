// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from "~/utils/format";
import type { ImageInfo as ImageInfoType } from "./ImageModal";
import type { Component } from "solid-js";
// Import Fluent icons
import {
  SizeIcon,
  TimeIcon,
  TypeIcon,
  DimensionsIcon,
} from "~/components/icons";

export const ImageInfo: Component<{
  imageInfo: ImageInfoType;
}> = (props) => {
  return (
    <table class="metadata-table card">
      <tbody>
        <tr>
          <td>
            <span class="icon" innerHTML={SizeIcon} />
            <span>Size</span>
          </td>
          <td>{formatFileSize(props.imageInfo.size)}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={TimeIcon} />
            <span>Modified</span>
          </td>
          <td>{new Date(props.imageInfo.mtime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={TypeIcon} />
            <span>Type</span>
          </td>
          <td>{props.imageInfo.mime}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={DimensionsIcon} />
            <span>Dimensions</span>
          </td>
          <td>
            {props.imageInfo.width}×{props.imageInfo.height}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
