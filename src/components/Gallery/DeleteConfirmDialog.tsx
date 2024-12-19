import { Component, Show } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { Portal } from "solid-js/web";

interface DeleteConfirmDialogProps {
  imageCount: number;
  folderCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmDialog: Component<DeleteConfirmDialogProps> = (props) => {
  const app = useAppContext();
  const t = app.t;

  return (
    <Portal>
      <div class="modal-overlay" onClick={props.onCancel}>
        <div class="modal-dialog" onClick={(e) => e.stopPropagation()}>
          <h2>{t('gallery.deleteConfirmation')}</h2>
          <p>
            {t('gallery.confirmMultiDelete', {
              count: props.imageCount + props.folderCount,
              folders: props.folderCount,
              images: props.imageCount
            })}
          </p>
          <div class="modal-actions">
            <button type="button" onClick={props.onCancel}>
              {t('common.cancel')}
            </button>
            <button type="button" class="primary delete" onClick={props.onConfirm}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}; 