// src/components/ImageViewer/CaptionEditor.tsx
import { createSignal, createEffect } from 'solid-js';
import { debounce } from '@solid-primitives/scheduled';

interface CaptionEditorProps {
  path: string;
  initialCaption?: string;
}

export const CaptionEditor = (props: CaptionEditorProps) => {
  const [caption, setCaption] = createSignal(props.initialCaption || '');
  const [status, setStatus] = createSignal('');

  const saveCaption = debounce(async (value: string) => {
    try {
      const response = await fetch(`/caption/${props.path}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ caption: value }),
      });
      
      if (response.ok) {
        setStatus('Saved');
        setTimeout(() => setStatus(''), 2000);
      } else {
        setStatus('Error saving');
      }
    } catch (error) {
      setStatus('Error saving');
    }
  }, 1000);

  createEffect(() => {
    if (caption() !== props.initialCaption) {
      saveCaption(caption());
    }
  });

  return (
    <div class="caption-editor">
      <textarea
        value={caption()}
        onInput={(e) => setCaption(e.currentTarget.value)}
        placeholder="Add a caption..."
      />
      <div class="caption-status">{status()}</div>
    </div>
  );
};