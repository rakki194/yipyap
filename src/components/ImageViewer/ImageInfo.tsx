// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from "~/utils/format";
import type { Component } from "solid-js";
import type { ImageInfo as ImageInfoType } from "~/types";
// Import Fluent icons
import getIcon from "~/icons";

export const ImageInfo: Component<{
  imageInfo: ImageInfoType;
}> = (props) => {
  return (
    <table class="metadata-table card">
      <tbody>
        <tr>
          <td>
            <span class="icon">{getIcon("size")}</span>
            <span>Size</span>
          </td>
          <td>{formatFileSize(props.imageInfo.size)}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("time")}</span>
            <span>Modified</span>
          </td>
          <td>{new Date(props.imageInfo.mtime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("type")}</span>
            <span>Type</span>
          </td>
          <td>{props.imageInfo.mime}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("dimensions")}</span>
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
