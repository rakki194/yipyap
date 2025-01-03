/// <reference types="vitest/globals" />
/// <reference types="@solidjs/testing-library" />

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { getInitialTheme, themeIconMap } from "./theme";

describe("Theme Context", () => {
  const mockStorage = {
    theme: undefined as string | undefined,
  };

  beforeEach(() => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(
      (key: string) => mockStorage[key as keyof typeof mockStorage] ?? null
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockStorage.theme = undefined;
  });

  it("should return light theme when no theme is stored", () => {
    expect(getInitialTheme()).toBe("light");
  });

  it("should return stored theme when valid", () => {
    mockStorage.theme = "dark";
    expect(getInitialTheme()).toBe("dark");
  });

  it("should return light theme when stored theme is invalid", () => {
    mockStorage.theme = "invalid-theme";
    expect(getInitialTheme()).toBe("light");
  });

  it("should have correct theme icons", () => {
    expect(themeIconMap.dark).toBe("moon");
    expect(themeIconMap.light).toBe("sun");
    expect(themeIconMap.gray).toBe("cloud");
    expect(themeIconMap.banana).toBe("banana");
    expect(themeIconMap.strawberry).toBe("strawberry");
    expect(themeIconMap.peanut).toBe("peanut");
  });
}); 