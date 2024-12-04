// src/components/Settings/Settings.tsx

import {
  Component,
  Show,
  createSignal,
  createEffect,
  onCleanup,
} from "solid-js";
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
  GridRegular,
  ListRegular,
  TextSortAscendingRegular,
  CalendarDateRegular,
  DocumentArrowDownRegular,
} from "~/icons";
import "./Settings.css";

const SlideTransition = (props: { show: boolean; children: any }) => {
  let contentRef: HTMLDivElement | undefined;
  const [height, setHeight] = createSignal("0px");
  const [isClosing, setIsClosing] = createSignal(false);
  const [display, setDisplay] = createSignal(props.show);

  createEffect(() => {
    if (props.show) {
      setDisplay(true);
      // Small delay to ensure display is set before height animation
      requestAnimationFrame(() => {
        setIsClosing(false);
        setHeight(`${contentRef?.scrollHeight || 0}px`);
      });
    } else {
      setIsClosing(true);
      setHeight("0px");
      // Wait for animation to finish before hiding
      setTimeout(() => {
        setDisplay(false);
        setIsClosing(false);
      }, 300);
    }
  });

  return (
    <Show when={display()}>
      <div
        class={`keyboard-shortcuts ${isClosing() ? "closing" : ""}`}
        style={{ height: height() }}
      >
        <div ref={contentRef}>{props.children}</div>
      </div>
    </Show>
  );
};

export const Settings: Component = () => {
  const gallery = useGallery();
  const theme = useTheme();
  const settings = useSettings();
  const [showHelp, setShowHelp] = createSignal(false);
  const [showShortcuts, setShowShortcuts] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  let shortcutsRef: HTMLDivElement;

  const toggleShortcuts = () => {
    if (showShortcuts()) {
      // Start closing animation
      setIsClosing(true);
      setTimeout(() => {
        setShowShortcuts(false);
        setIsClosing(false);
      }, 300); // Match transition duration from CSS
    } else {
      setShowShortcuts(true);
    }
  };

  return (
    <div class="settings-panel card">
      <div class="settings-header">
        <h2>Settings</h2>
        <button
          type="button"
          class="icon help-button"
          onClick={() => setShowHelp(!showHelp())}
          title="Keyboard Shortcuts"
          aria-label="Show keyboard shortcuts"
          innerHTML={BookQuestionMarkRegular}
        />
      </div>

      <SlideTransition show={showHelp()}>
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
      </SlideTransition>

      <div class="settings-row">
        <div class="settings-column">
          <h3>Appearance</h3>
          <div class="setting-group">
            <label>Theme</label>
            <div class="theme-buttons">
              <button
                type="button"
                class="icon"
                classList={{ active: theme.theme === "light" }}
                onClick={() => theme.setTheme("light")}
                title="Light theme"
                aria-label="Switch to light theme"
                innerHTML={SunIcon}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: theme.theme === "gray" }}
                onClick={() => theme.setTheme("gray")}
                title="Gray theme"
                aria-label="Switch to gray theme"
                innerHTML={CloudIcon}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: theme.theme === "dark" }}
                onClick={() => theme.setTheme("dark")}
                title="Dark theme"
                innerHTML={MoonIcon}
              />
              <button
                type="button"
                class="icon banana-icon"
                classList={{ active: theme.theme === "banana" }}
                onClick={() => theme.setTheme("banana")}
                title="Banana theme"
                innerHTML={BananaIcon}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: theme.theme === "strawberry" }}
                onClick={() => theme.setTheme("strawberry")}
                title="Strawberry theme"
                innerHTML={StrawberryIcon}
              />
              <button
                type="button"
                class="icon strawberry-icon"
                classList={{ active: theme.theme === "peanut" }}
                onClick={() => theme.setTheme("peanut")}
                title="Peanut theme"
                innerHTML={PeanutIcon}
              />
            </div>
          </div>
        </div>

        <div class="settings-column">
          <h3>Gallery</h3>
          <div class="setting-group">
            <label>View Mode</label>
            <div class="icon-buttons">
              <button
                type="button"
                class="icon"
                classList={{ active: gallery.state.viewMode === "grid" }}
                onClick={() => gallery.setViewMode("grid")}
                title="Grid view"
                aria-label="Switch to grid view"
                innerHTML={GridRegular}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: gallery.state.viewMode === "list" }}
                onClick={() => gallery.setViewMode("list")}
                title="List view"
                aria-label="Switch to list view"
                innerHTML={ListRegular}
              />
            </div>
          </div>

          <div class="setting-group">
            <label>Sort By</label>
            <div class="icon-buttons">
              <button
                type="button"
                class="icon"
                classList={{ active: gallery.state.sort === "name" }}
                onClick={() => gallery.setSort("name")}
                title="Sort by name"
                aria-label="Sort by name"
                innerHTML={TextSortAscendingRegular}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: gallery.state.sort === "date" }}
                onClick={() => gallery.setSort("date")}
                title="Sort by date modified"
                aria-label="Sort by date modified"
                innerHTML={CalendarDateRegular}
              />
              <button
                type="button"
                class="icon"
                classList={{ active: gallery.state.sort === "size" }}
                onClick={() => gallery.setSort("size")}
                title="Sort by file size"
                aria-label="Sort by file size"
                innerHTML={DocumentArrowDownRegular}
              />
            </div>
          </div>
        </div>
      </div>

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
