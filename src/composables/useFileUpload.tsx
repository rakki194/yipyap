/**
 * A composable for handling file uploads in the gallery.
 * Provides functionality for file upload with progress tracking,
 * size validation, and notification feedback.
 */

import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB per file

export const useFileUpload = () => {
  const gallery = useGallery();
  const appContext = useAppContext();
  const t = appContext.t;

  /**
   * Processes and uploads the provided files, handling size validation,
   * progress tracking, and error states.
   * 
   * - Validates individual file sizes (max 100MB)
   * - Tracks upload progress
   * - Provides feedback through notifications
   * - Refreshes gallery on successful upload
   */
  const uploadFiles = async (files: FileList) => {
    const formData = new FormData();
    let totalSize = 0;
    let oversizedFiles = [];

    // Check file sizes and add to form data
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
        continue;
      }
      totalSize += file.size;
      formData.append("files", file);
    }

    if (oversizedFiles.length > 0) {
      appContext.notify(
        t("gallery.filesExceedLimit", { files: oversizedFiles.join(", ") }),
        "error",
        "file-upload"
      );
      return;
    }

    if (totalSize === 0) {
      appContext.notify(
        t("gallery.noFilesToUpload"),
        "error",
        "file-upload"
      );
      return;
    }

    appContext.notify(
      t("gallery.processingFiles"),
      "info",
      "file-upload",
      "spinner"
    );

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `/api/upload/${gallery.data()?.path}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        appContext.createNotification({
          message: t("gallery.uploadProgressPercent", { progress }),
          type: "info",
          group: "file-upload",
          icon: "spinner",
          progress
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        appContext.notify(
          t("gallery.uploadComplete"),
          "success",
          "file-upload"
        );
        gallery.invalidate();
        gallery.refetch();
      } else {
        appContext.notify(
          t("gallery.uploadFailed", { error: xhr.statusText }),
          "error",
          "file-upload"
        );
      }
    };

    xhr.onerror = () => {
      appContext.notify(
        t("gallery.uploadFailed", { error: "Network error" }),
        "error",
        "file-upload"
      );
    };

    xhr.send(formData);
  };

  return {
    uploadFiles,
    MAX_FILE_SIZE
  };
}; 