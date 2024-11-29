// src/utils/streaming_json.ts
//
// This file contains utility functions for streaming JSON data.

import { batch } from "solid-js";

/**
 * Callback function type for processing JSON data items in a stream
 * @template T The type of data being processed
 * @param data The parsed JSON data item
 * @param index The sequential index of the data item in the stream
 */
export type JsonCallback<T> = (data: T, index: number) => void;

/**
 * Fetches and processes a stream of newline-delimited JSON data
 * @template T The type of data being processed
 * @param url The URL to fetch the JSON stream from
 * @param onJson Callback function to handle each JSON item
 * @throws {Error} If the HTTP request fails
 * @returns Promise that resolves when stream processing is complete
 *
 * @example
 * await fetchStreamingJson<ImageData>('/api/images', (image, index) => {
 *   console.log(`Received image ${index}:`, image);
 * });
 */
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
