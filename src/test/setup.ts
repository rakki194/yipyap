import "@testing-library/jest-dom";
import { vi } from "vitest";
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@solidjs/testing-library';

// Global test setup
beforeAll(() => {
  // Mock global objects and APIs
  setupGlobalMocks();
});

afterAll(() => {
  // Add any global cleanup if needed
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function setupGlobalMocks() {
  // Mock matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  // Mock ResizeObserver
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  // Mock requestAnimationFrame
  global.requestAnimationFrame = vi.fn((callback) => {
    callback(0);
    return 0;
  });

  // Mock setTimeout
  const mockSetTimeout = vi.fn((callback: Function, timeout?: number) => {
    Promise.resolve().then(() => callback());
    return 0;
  }) as unknown as typeof setTimeout;
  (mockSetTimeout as any).__promisify__ = vi.fn();
  global.setTimeout = mockSetTimeout;

  // Mock fetch
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    })
  ) as any;

  // Mock IntersectionObserver
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}
