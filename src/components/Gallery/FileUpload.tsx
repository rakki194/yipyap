import { Component } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import getIcon from "~/icons";
import "./FileUpload.css";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export const FileUpload: Component = () => {
  const app = useAppContext();
  const gallery = useGallery();
  const t = app.t;

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
      app.notify(
        t("gallery.filesExceedLimit", { files: oversizedFiles.join(", ") }),
        "error",
        "file-upload"
      );
      return;
    }

    if (totalSize === 0) {
      app.notify(
        t("gallery.noFilesToUpload"),
        "error",
        "file-upload"
      );
      return;
    }

    app.notify(
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
        app.createNotification({
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
        app.notify(
          t("gallery.uploadComplete"),
          "success",
          "file-upload"
        );
        gallery.invalidate();
        gallery.refetch();
      } else {
        app.notify(
          t("gallery.uploadFailed", { error: xhr.statusText }),
          "error",
          "file-upload"
        );
      }
    };

    xhr.onerror = () => {
      app.notify(
        t("gallery.uploadFailed", { error: "Network error" }),
        "error",
        "file-upload"
      );
    };

    xhr.send(formData);
  };

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
