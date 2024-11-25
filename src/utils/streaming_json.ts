import { batch } from "solid-js";
export type JsonCallback<T> = (data: T, index: number) => void;

export async function fetchStreamingJson<T>(
  url: string,
  onJson: JsonCallback<T>
): Promise<void> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let index = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.trim()) {
        onJson(JSON.parse(buffer), index);
      }
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");

    // Process all complete lines
    buffer = lines.pop() || "";
    batch(() => {
      lines.forEach((line) => {
        if (line.trim()) {
          onJson(JSON.parse(line), index++);
        }
      });
    });
  }
}
