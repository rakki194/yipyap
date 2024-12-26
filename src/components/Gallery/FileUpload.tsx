import { Component } from "solid-js";
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

  return (
    <>
      <button
        type="button"
        class="icon"
        onClick={() => document.getElementById('file-upload-input')?.click()}
        title={t('gallery.uploadFiles')}
        aria-label={t('gallery.uploadFiles')}
      >
        {getIcon("upload")}
      </button>
      <input
        type="file"
        id="file-upload-input"
        style={{ display: 'none' }}
        multiple
        onChange={(e) => {
          const files = e.currentTarget.files;
          if (files && files.length > 0) {
            uploadFiles(files);
            // Reset the input so the same file can be uploaded again
            e.currentTarget.value = '';
          }
        }}
      />
    </>
  );
}; 
