// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from "~/utils/format";
import type { ImageData } from "~/resources/browse";
// Import Fluent icons
import SizeIcon from "@fluentui/svg-icons/icons/data_usage_24_regular.svg?raw";
import TimeIcon from "@fluentui/svg-icons/icons/calendar_24_regular.svg?raw";
import TypeIcon from "@fluentui/svg-icons/icons/document_24_regular.svg?raw";
import DimensionsIcon from "@fluentui/svg-icons/icons/image_24_regular.svg?raw";

interface ImageInfoProps {
  image: ImageData;
}

export const ImageInfo = (props: ImageInfoProps) => {
  return (
    <table class="metadata-table">
      <tbody>
        <tr>
          <td>
            <span class="icon" innerHTML={SizeIcon} />
            <span>Size</span>
          </td>
          <td>{formatFileSize(props.image.size)}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={TimeIcon} />
            <span>Modified</span>
          </td>
          <td>{new Date(props.image.mtime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={TypeIcon} />
            <span>Type</span>
          </td>
          <td>{props.image.mime}</td>
        </tr>
        <tr>
          <td>
            <span class="icon" innerHTML={DimensionsIcon} />
            <span>Dimensions</span>
          </td>
          <td>{props.image.width}×{props.image.height}</td>
        </tr>
      </tbody>
    </table>
  );
};
