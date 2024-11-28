// src/components/ImageViewer/ImageModal.tsx
import {
  createEffect,
  on,
  createMemo,
  createSignal,
  Index,
  JSX,
} from "solid-js";
import { ImageView } from "./ImageView";
import { ImageInfo } from "./ImageInfo";
import { CaptionInput } from "./CaptionInput";
import type { ImageData, Captions } from "~/resources/browse";
import "./styles.css";
import { useGallery } from "~/contexts/GalleryContext";
import { DownloadIcon, DismissIcon, DeleteIcon } from "~/components/icons";
import { useAction } from "@solidjs/router";
import { joinUrlParts, replaceExtension } from "~/utils";

interface ImageModalProps {
  image: ImageData;
  path: string;
  onClose: () => void;
}

export type ImageInfo = {
  name: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  mtime: string;
  preview: string;
  thumbnail: string;
  download: string;
};

export const ImageModal = (props: ImageModalProps) => {
  const { windowSize } = useGallery();

  const getLayout = createMemo(() => computeLayout(props.image, windowSize));
  const imageInfo = createMemo(
    (): ImageInfo => {
      const image = props.image;
      const name = image.name;
      const path = props.path;
      const webpName = replaceExtension(name, ".webp");
      return {
        name,
        width: image.width,
        height: image.height,
        size: image.size,
        mime: image.mime,
        mtime: image.mtime,
        preview: joinUrlParts("/preview", path, webpName),
        thumbnail: joinUrlParts("/preview", path, webpName),
        download: joinUrlParts("/download", path, name),
      };
    },
    undefined,
    { equals: (a, b) => a.download === b.download }
  );

  createEffect((prev) => {
    const ii = imageInfo();
    console.log("imageInfo", prev !== ii, ii);
    return ii;
  });

  return (
    <div class="modal-content">
      <ModalHeader imageInfo={imageInfo()} onClose={props.onClose} />
      <ModelBody
        imageInfo={imageInfo()}
        captions={props.image.captions}
        layout={getLayout()}
      />
    </div>
  );
};

const ModelBody = (props: {
  captions: Captions;
  imageInfo: ImageInfo;
  layout: LayoutInfo;
}) => {
  let refImageInfo!: HTMLDivElement;
  const [focused, setFocused] = createSignal(false);
  const [focusedType, setFocusedType] = createSignal<string | null>(null);
  const [getStyle, setStyle] = createSignal<JSX.CSSProperties>();

  // Update the style of the image info based on the layout and focus
  createEffect(
    on([() => props.imageInfo.name, focused], ([name, focused], prev_input) => {
      if (!focused || name !== prev_input?.[0]) {
        setStyle(undefined);
        return;
      }

      if (props.layout.layout === "horizontal") {
        const offset = props.layout.free_width - refImageInfo.offsetWidth;
        if (offset >= 0) {
          setStyle(undefined);
        } else {
          setStyle({
            transform: `translateX(${offset}px)`,
          });
        }
      } else {
        const offset = props.layout.free_height - refImageInfo.offsetHeight;
        if (offset >= 0) {
          setStyle(undefined);
        } else {
          setStyle({
            transform: `translateY(${offset}px)`,
          });
        }
      }
    })
  );

  return (
    <div class="modal-body" classList={{ [props.layout.layout]: true }}>
      <ImageView
        imageInfo={props.imageInfo}
        onClick={() => setFocused((f) => !f)}
      />
      <div
        class="image-info"
        ref={refImageInfo}
        style={getStyle()}
        onClick={() => setFocused(true)}
        onFocusIn={() => setFocused(true)}
        onFocusOut={() => setFocused(false)}
      >
        <ImageInfo imageInfo={props.imageInfo} />
        <div class="caption-editor">
          <Index each={props.captions}>
            {(caption, idx) => (
              <CaptionInput
                tabindex={idx + 1}
                caption={caption()}
                onFocus={() => setFocusedType(caption()[0])}
                onBlur={() => setFocusedType(null)}
                state={
                  focusedType() === null
                    ? null
                    : focusedType() === caption()[0]
                    ? "expanded"
                    : "collapsed"
                }
              />
            )}
          </Index>
        </div>
      </div>
    </div>
  );
};

const ModalHeader = (props: { imageInfo: ImageInfo; onClose: () => void }) => {
  const gallery = useGallery();
  const deleteImageAction = useAction(gallery.deleteImage);
  return (
    <div class="modal-header">
      <h2>{props.imageInfo.name}</h2>
      <div class="modal-actions">
        <button
          class="icon"
          onClick={() => {
            window.location.href = props.imageInfo.download;
          }}
          innerHTML={DownloadIcon}
        />
        <button
          class="icon"
          onClick={() =>
            gallery.selected !== null && deleteImageAction(gallery.selected)
          }
          innerHTML={DeleteIcon}
        />
        <button class="icon" onClick={props.onClose} innerHTML={DismissIcon} />
      </div>
    </div>
  );
};

type Size = { width: number; height: number };
type LayoutStr = "horizontal" | "vertical";
type LayoutInfo = Size & {
  scale: number;
  layout: LayoutStr;
  free_width: number;
  free_height: number;
};

function computeLayout(
  image: ImageData,
  windowSize: Readonly<Size>
): LayoutInfo {
  const { width: viewWidth, height: viewHeight } = windowSize;
  if (image === null) {
    //FIXME: we don't need this
    return {
      width: 0,
      height: 0,
      scale: 0,
      layout: "vertical",
      free_width: viewWidth,
      free_height: viewHeight,
    };
  }
  const { width: imageWidth, height: imageHeight } = image!;

  const width_scale = viewWidth / imageWidth;
  const height_scale = viewHeight / imageHeight;
  let scale: number;
  let layout: LayoutStr;
  if (width_scale < height_scale) {
    scale = width_scale;
    layout = "vertical";
  } else {
    scale = height_scale;
    layout = "horizontal";
  }
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const free_width = viewWidth - width;
  const free_height = viewHeight - height;

  return { width, height, scale, layout, free_width, free_height };
}
