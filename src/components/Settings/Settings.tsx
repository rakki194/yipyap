// src/components/Settings/Settings.tsx

import { Component, Show, createSignal } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useTheme, Theme } from "~/contexts/theme";
import { useSettings } from "~/contexts/settings";
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  DimensionsIcon,
  SizeIcon,
  TimeIcon,
  BananaIcon,
  StrawberryIcon,
  PeanutIcon,
  BookQuestionMarkRegular,
} from "~/icons";
import "./Settings.css";

export const Settings: Component = () => {
  const gallery = useGallery();
  const theme = useTheme();
  const settings = useSettings();
  const [showHelp, setShowHelp] = createSignal(false);

  return (
    <div class="settings-panel card">
      <div class="settings-header">
        <h2>Settings</h2>
        <button
          class="icon help-button"
          onClick={() => setShowHelp(!showHelp())}
          title="Keyboard Shortcuts"
          aria-label="Show keyboard shortcuts"
          innerHTML={BookQuestionMarkRegular}
        />
      </div>

      <Show when={showHelp()}>
        <section class="keyboard-shortcuts">
          <h3>Keyboard Shortcuts</h3>
          <div class="shortcuts-grid">
            <div class="shortcut">
              <kbd>q</kbd>
              <span>Quick folder switch</span>
            </div>
            <div class="shortcut">
              <kbd>←</kbd>
              <span>Previous image</span>
            </div>
            <div class="shortcut">
              <kbd>→</kbd>
              <span>Next image</span>
            </div>
            <div class="shortcut">
              <kbd>Esc</kbd>
              <span>Close preview/modal</span>
            </div>
            <div class="shortcut">
              <kbd>Del</kbd>
              <span>Delete image</span>
            </div>
            <div class="shortcut">
              <kbd>Space</kbd>
              <span>Toggle image fit</span>
            </div>
          </div>
        </section>
      </Show>

      <section>
        <h3>Appearance</h3>
        <div class="setting-group">
          <label>Theme</label>
          <div class="theme-buttons">
            <button
              class="icon"
              classList={{ active: theme.theme === "light" }}
              onClick={() => theme.setTheme("light")}
              title="Light theme"
              aria-label="Switch to light theme"
              innerHTML={SunIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "gray" }}
              onClick={() => theme.setTheme("gray")}
              title="Gray theme"
              aria-label="Switch to gray theme"
              innerHTML={CloudIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "dark" }}
              onClick={() => theme.setTheme("dark")}
              title="Dark theme"
              innerHTML={MoonIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "banana" }}
              onClick={() => theme.setTheme("banana")}
              title="Banana theme"
              innerHTML={BananaIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "strawberry" }}
              onClick={() => theme.setTheme("strawberry")}
              title="Strawberry theme"
              innerHTML={StrawberryIcon}
            />
            <button
              class="icon"
              classList={{ active: theme.theme === "peanut" }}
              onClick={() => theme.setTheme("peanut")}
              title="Peanut theme"
              innerHTML={PeanutIcon}
            />
          </div>
        </div>

        <div class="setting-group">
          <label>View Mode</label>
          <select
            value={gallery.state.viewMode}
            onChange={(e) =>
              gallery.setViewMode(e.currentTarget.value as "grid" | "list")
            }
          >
            <option value="grid">Grid</option>
            <option value="list">List</option>
          </select>
        </div>
      </section>

      <section>
        <h3>Gallery</h3>
        <div class="setting-group">
          <label>Sort By</label>
          <select
            value={gallery.state.sort}
            onChange={(e) =>
              gallery.setSort(e.currentTarget.value as "name" | "date" | "size")
            }
          >
            <option value="name">Name</option>
            <option value="date">Modified Date</option>
            <option value="size">File Size</option>
          </select>
        </div>
      </section>

      <section class="warning-section">
        <p class="warning-text">
          <span>⚠️警告！これを使うと狼になります！</span>
        </p>
        <label>
          <input
            type="checkbox"
            checked={settings.instantDelete()}
            onChange={(e) => settings.setInstantDelete(e.currentTarget.checked)}
          />
          Enable instant delete (skips confirmation)
        </label>
      </section>
    </div>
  );
};
