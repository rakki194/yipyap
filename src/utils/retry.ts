// src/utils/retry.ts
//
// This file contains utility functions for retrying API requests.

/**
 * Configuration options for retry behavior
 */
interface RetryOptions {
  maxAttempts?: number;      // Maximum number of retry attempts
  initialDelay?: number;     // Initial delay in milliseconds
  maxDelay?: number;         // Maximum delay between retries
  backoffFactor?: number;    // Factor to increase delay between retries
  shouldRetry?: (error: Error) => boolean;  // Custom retry condition
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 5,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffFactor: 2,
  shouldRetry: (error: Error) => {
    // Retry on connection refused or network errors
    return error.message.includes('ECONNREFUSED') || 
           error.message.includes('Failed to fetch') ||
           error.message.includes('NetworkError');
  }
};

/**
 * Wraps a fetch request with retry logic using exponential backoff
 * 
 * @param request - The fetch request to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the fetch response
 * @throws Error if all retry attempts fail
 */
export async function retryFetch(
  request: Request | string,
  init?: RequestInit & RetryOptions
): Promise<Response> {
  const { maxAttempts, initialDelay, maxDelay, backoffFactor, shouldRetry, ...fetchOptions } = {
    ...defaultOptions,
    ...init
  };
  let lastError: Error;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await fetch(request, fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      lastError = error as Error;
      
      // Check if we should retry
      if (!shouldRetry(lastError) || attempt === maxAttempts) {
        throw lastError;
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase delay for next attempt, but don't exceed maxDelay
      delay = Math.min(delay * backoffFactor, maxDelay);
    }
  }

  throw lastError!;
}

/**
 * Wraps the streaming JSON fetch with retry logic
 * 
 * @param url - The URL to fetch the JSON stream from
 * @param onJson - Callback function to handle each JSON item
 * @param options - Retry configuration options
 * @returns Promise that resolves when stream processing is complete
 */
export async function retryStreamingJson<T>(
  url: string,
  onJson: (data: T, index: number) => void,
  options?: RequestInit & RetryOptions
): Promise<void> {
  const response = await retryFetch(url, options);
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let index = 0;

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      if (buffer.trim()) {
        onJson(JSON.parse(buffer) as T, index);
      }
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");

    // Process all complete lines
    buffer = lines.pop() || "";
    lines.forEach((line) => {
      if (line.trim()) {
        onJson(JSON.parse(line) as T, index++);
      }
    });
  }
} 