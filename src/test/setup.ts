import "@testing-library/jest-dom";
import { vi } from "vitest";
import { beforeAll, afterAll, afterEach } from 'vitest';
import { cleanup } from '@solidjs/testing-library';

beforeAll(() => {
  // Add any global setup if needed
});

afterAll(() => {
  // Add any global cleanup if needed
});

afterEach(() => {
  // Clean up after each test if needed
  cleanup();
  vi.clearAllMocks();
});

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

// Mock setTimeout with proper typing
const mockSetTimeout = vi.fn((callback: Function, timeout?: number) => {
  // Execute callback asynchronously without using real setTimeout
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

// Add any other global mocks or setup here

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
