// src/components/ImageViewer/ImageModal.tsx
import { Show } from 'solid-js';
import { ImageView } from './ImageView';
import { ImageInfo } from './ImageInfo';
import { CaptionEditor } from './CaptionEditor';
import type { ImageInfo as ImageInfoType } from '../../types';

interface ImageModalProps {
  image: ImageInfoType | null;
  onClose: () => void;
}

export const ImageModal = (props: ImageModalProps) => {
  return (
    <Show when={props.image}>
      <div class="modal-content">
        <div class="modal-header">
          <h2>{props.image?.name}</h2>
          <div class="modal-actions">
            <a href={`/download/${props.image?.path}`} class="download-btn" download>
              <i class="ri-download-line" />
            </a>
            <button class="close" onClick={props.onClose}>&times;</button>
          </div>
        </div>
        <div class="modal-body">
          <ImageView image={props.image!} />
          <div class="image-info">
            <ImageInfo image={props.image!} />
            <CaptionEditor path={props.image!.path} />
          </div>
        </div>
      </div>
    </Show>
  );
};