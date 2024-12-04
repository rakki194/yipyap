// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, splitProps, Component, JSX, For } from "solid-js";
import { Submission, useAction, useSubmission } from "@solidjs/router";
import {
  EditIcon,
  SuccessIcon,
  ErrorIcon,
  SpinnerIcon,
  captionIconsMap,
  SparkleIcon,
  DeleteIcon,
  TextAlignIcon,
  TextAlignDistributedIcon,
  ArrowUndoIcon,
} from "~/icons";
import { useGallery } from "~/contexts/GalleryContext";
import { preserveState } from "~/directives";

export interface CaptionInputProps
  extends JSX.HTMLAttributes<HTMLTextAreaElement> {
  caption: [string, string];
}

const TOOLS = [
  {
    icon: SparkleIcon,
    title: "Remove commas",
    action: (caption: string) => caption.replace(/,/g, ""),
  },
  {
    icon: TextAlignIcon,
    title: "Replace newlines with commas",
    action: (caption: string) => caption.replace(/\n/g, ", "),
  },
  {
    icon: TextAlignDistributedIcon,
    title: "Replace underscores with spaces",
    action: (caption: string) => caption.replace(/_/g, " "),
  },
];

const Tools: Component<{
  onInput: (value: string) => void;
  caption: string;
}> = (props) => {
  return (
    <For each={TOOLS}>
      {(tool) => (
        <button
          type="button"
          class="icon"
          onClick={() => props.onInput(tool.action(props.caption))}
          title={tool.title}
          innerHTML={tool.icon}
        />
      )}
    </For>
  );
};

export const CaptionInput: Component<
  {
    caption: [string, string];
    state: "expanded" | "collapsed" | null;
  } & JSX.HTMLAttributes<HTMLTextAreaElement>
> = (props) => {
  let inputRef!: HTMLTextAreaElement;
  const [localProps, rest] = splitProps(props, ["caption"]);
  const type = () => localProps.caption[0];
  const caption = () => localProps.caption[1];
  const initialCaption = caption();
  const [captionHistory, setCaptionHistory] = createSignal<string[]>([]);

  const { saveCaption, deleteCaption: deleteCaptionAction } = useGallery();
  const save = useAction(saveCaption);
  const submission = useSubmission(saveCaption);
  const deleteCaption = useAction(deleteCaptionAction);

  const saveWithHistory = (newText: string) => {
    setCaptionHistory((prev) => [...prev, caption()]);
    save({
      caption: newText,
      type: type(),
    });
  };

  const undo = () => {
    const history = captionHistory();
    if (history.length > 0) {
      const previousText = history[history.length - 1];
      setCaptionHistory((prev) => prev.slice(0, -1));
      save({
        caption: previousText,
        type: type(),
      });
    }
  };

  return (
    <div
      class="caption-input-wrapper card"
      classList={props.state === null ? {} : { [props.state]: true }}
    >
      <div class="caption-icons">
        <span
          class="icon"
          innerHTML={captionIconsMap[type() as keyof typeof captionIconsMap]}
        />
        <StatusIcon status={submission} type={type()} />
        <Tools onInput={saveWithHistory} caption={caption()} />
        {captionHistory().length > 0 && (
          <button
            type="button"
            class="icon"
            onClick={undo}
            title="Undo last change"
            innerHTML={ArrowUndoIcon}
          />
        )}
        <button
          type="button"
          class="icon"
          onClick={async (e) => {
            if (confirm(`Delete ${type()} caption?`)) {
              deleteCaption(type());
            }
          }}
          title={`Delete ${type()} caption`}
          innerHTML={DeleteIcon}
        />
      </div>
      <textarea
        {...rest}
        use:preserveState={[caption, saveWithHistory]}
        placeholder="Add a caption..."
      />
    </div>
  );
};

// Start of Selection
const StatusIcon = <T extends [{ type: string }], U>(props: {
  status: Partial<Submission<T, U>>;
  type: string;
}) => {
  const getStatusIcon = () => {
    if (props.status.input?.[0].type !== props.type)
      return { innerHTML: EditIcon };
    if (!props.status.result) {
      if (props.status.pending)
        return { innerHTML: SpinnerIcon, class: "spin-icon icon" };
      else return { innerHTML: EditIcon };
    }
    if (props.status.result instanceof Error)
      return {
        innerHTML: ErrorIcon,
        class: "error-icon icon",
        title: props.status.result.message,
      };
    return {
      innerHTML: SuccessIcon,
    };
  };
  return <span class="icon" {...getStatusIcon()} />;
};
