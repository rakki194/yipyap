// src/components/ImageViewer/ImageInfo.tsx
import { formatFileSize } from "~/utils/format";
import type { Component } from "solid-js";
import type { ImageInfo as ImageInfoType } from "~/types";
// Import Fluent icons
import getIcon from "~/icons";
import { useTranslation } from '~/hooks/useTranslation';

export const ImageInfo: Component<{
  imageInfo: ImageInfoType;
}> = (props) => {
  const { t } = useTranslation();

  return (
    <table class="metadata-table card">
      <tbody>
        <tr>
          <td>
            <span class="icon">{getIcon("size")}</span>
            <span>{t('common.size')}</span>
          </td>
          <td>{formatFileSize(props.imageInfo.size)}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("time")}</span>
            <span>{t('common.date')}</span>
          </td>
          <td>{new Date(props.imageInfo.mtime).toLocaleString()}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("type")}</span>
            <span>{t('common.type')}</span>
          </td>
          <td>{props.imageInfo.mime}</td>
        </tr>
        <tr>
          <td>
            <span class="icon">{getIcon("dimensions")}</span>
            <span>{t('imageViewer.dimensions')}</span>
          </td>
          <td>
            {props.imageInfo.width}×{props.imageInfo.height}
          </td>
        </tr>
      </tbody>
    </table>
  );
};
