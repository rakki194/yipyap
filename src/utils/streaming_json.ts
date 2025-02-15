// src/utils/streaming_json.ts
//
// This file contains utility functions for streaming JSON data.

import { batch } from "solid-js";
import { retryStreamingJson } from "./retry";

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
  return retryStreamingJson<T>(url, (data, index) => {
    batch(() => {
      onJson(data, index);
    });
  });
}
