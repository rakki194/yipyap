import { Component, createSignal } from "solid-js";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";
import { useFileUpload } from "~/composables/useFileUpload";
import "./FileUpload.css";

/**
 * A button component that handles file uploads through a hidden file input.
 * Provides a clean UI for file selection and upload functionality.
 */
export const FileUpload: Component = () => {
  const app = useAppContext();
  const { uploadFiles } = useFileUpload();
  const t = app.t;
  const [showMenu, setShowMenu] = createSignal(false);

  const handleUpload = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      uploadFiles(files);
      // Reset the input so the same file can be uploaded again
      input.value = '';
    }
    setShowMenu(false);
  };

  return (
    <div class="upload-container">
      <button
        type="button"
        class="icon"
        onClick={() => setShowMenu(!showMenu())}
        title={t('gallery.uploadFiles')}
        aria-label={t('gallery.uploadFiles')}
        aria-haspopup="true"
        aria-expanded={showMenu()}
      >
        {getIcon("upload")}
      </button>

      <div 
        class="upload-menu" 
        style={{ 
          display: showMenu() ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          right: '0',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          'border-radius': 'var(--radius)',
          'box-shadow': 'var(--shadow-lg)',
          'z-index': 1000,
          padding: '0.5rem'
        }}
      >
        <label class="upload-option">
          <input
            type="file"
            style={{ display: 'none' }}
            multiple
            onChange={handleUpload}
          />
          <span class="upload-label">
            {getIcon("imageAdd")}
            {t('gallery.uploadFiles')}
          </span>
        </label>

        <label class="upload-option">
          <input
            type="file"
            style={{ display: 'none' }}
            multiple
            // @ts-ignore - webkitdirectory is not in the types
            webkitdirectory=""
            // @ts-ignore - directory is not in the types
            directory=""
            onChange={handleUpload}
          />
          <span class="upload-label">
            {getIcon("folder")}
            {t('gallery.uploadFolder')}
          </span>
        </label>
      </div>
    </div>
  );
}; 
