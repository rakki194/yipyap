// src/components/Settings/Settings.tsx

import { Component, Show, createSignal, createEffect, For } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { Theme, themeIconMap, themes } from "~/contexts/theme";
import getIcon from "~/icons";
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

export const Settings: Component<{ onClose: () => void }> = (props) => {
  const gallery = useGallery();
  const app = useAppContext();
  const [showHelp, setShowHelp] = createSignal(false);
  const [showShortcuts, setShowShortcuts] = createSignal(false);
  const [isClosing, setIsClosing] = createSignal(false);
  const [isHelpClosing, setIsHelpClosing] = createSignal(false);
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

  const toggleHelp = () => {
    if (showHelp()) {
      setIsHelpClosing(true);
      setTimeout(() => {
        setShowHelp(false);
        setIsHelpClosing(false);
      }, 300); // Match transition duration
    } else {
      setShowHelp(true);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      props.onClose();
    }
  };

  return (
    <div class="settings-panel card" onKeyDown={handleKeyDown}>
      <div class="settings-header">
        <h2>Settings</h2>
        <button
          type="button"
          class="icon help-button"
          onClick={toggleHelp}
          title="Keyboard Shortcuts"
          aria-label="Show keyboard shortcuts"
        >
          {getIcon("bookQuestionMark")}
        </button>
      </div>

      <Show
        when={!showHelp()}
        fallback={
          <div class="help-content" classList={{ closing: isHelpClosing() }}>
            <SlideTransition show={showHelp()}>
              <h3>Keyboard Shortcuts</h3>
              <div class="shortcuts-grid">
                <div class="shortcuts-section">
                  <h4>Gallery Navigation</h4>
                  <div class="shortcut">
                    <kbd>q</kbd>
                    <span>Quick folder switch</span>
                  </div>
                  <div class="shortcut">
                    <kbd>↑</kbd>
                    <span>Above image</span>
                  </div>
                  <div class="shortcut">
                    <kbd>↓</kbd>
                    <span>Below image</span>
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
                    <kbd>Enter</kbd>
                    <span>Toggle image preview</span>
                  </div>
                </div>

                <div class="shortcuts-section">
                  <h4>Tag Navigation</h4>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>←</kbd>
                    <span>Previous tag</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>→</kbd>
                    <span>Next tag</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>↑</kbd>
                    <span>Switch to tag bubble editing</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>↓</kbd>
                    <span>Switch to tag input</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Double Shift</kbd>
                    <span>Cycle through caption inputs</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Double Shift</kbd> + <kbd>←</kbd>
                    <span>First tag in row</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Double Shift</kbd> + <kbd>→</kbd>
                    <span>Last tag in row</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>Del</kbd>
                    <span>Remove tag</span>
                  </div>
                </div>

                <div class="shortcuts-section full-width">
                  <h4>Other</h4>
                  <div class="shortcut">
                    <kbd>Esc</kbd>
                    <span>Close preview/modal</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Del</kbd>
                    <span>Delete image</span>
                  </div>
                </div>
              </div>
            </SlideTransition>
          </div>
        }
      >
        <div class="settings-content" classList={{ closing: isHelpClosing() }}>
          <div class="settings-row">
            <div class="settings-column">
              <h3>Appearance</h3>
              <div class="setting-group">
                <label>Theme</label>
                <div class="theme-buttons">
                  <For each={themes}>
                    {(th) => (
                      <button
                        type="button"
                        class={`icon ${th}-icon`}
                        classList={{ active: app.theme === th }}
                        onClick={() => app.setTheme(th as Theme)}
                        title={`Switch to ${th} theme`}
                        aria-label={`Switch to ${th} theme`}
                      >
                        {getIcon(themeIconMap[th as Theme]!)}
                      </button>
                    )}
                  </For>
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
                  >
                    {getIcon("grid")}
                  </button>
                  <button
                    type="button"
                    class="icon"
                    classList={{ active: gallery.state.viewMode === "list" }}
                    onClick={() => gallery.setViewMode("list")}
                    title="List view"
                    aria-label="Switch to list view"
                  >
                    {getIcon("list")}
                  </button>
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
                  >
                    {getIcon("textSortAscending")}
                  </button>
                  <button
                    type="button"
                    class="icon"
                    classList={{ active: gallery.state.sort === "date" }}
                    onClick={() => gallery.setSort("date")}
                    title="Sort by date modified"
                    aria-label="Sort by date modified"
                  >
                    {getIcon("calendarDate")}
                  </button>
                  <button
                    type="button"
                    class="icon"
                    classList={{ active: gallery.state.sort === "size" }}
                    onClick={() => gallery.setSort("size")}
                    title="Sort by file size"
                    aria-label="Sort by file size"
                  >
                    {getIcon("documentArrowDown")}
                  </button>
                </div>
              </div>

              <div class="setting-group">
                <label>Layout Options</label>
                <div class="icon-buttons">
                  <label>
                    <input
                      type="checkbox"
                      checked={app.disableAnimations}
                      onChange={(e) =>
                        app.setDisableAnimations(e.currentTarget.checked)
                      }
                    />
                    Disable Animations
                  </label>
                </div>
              </div>
            </div>

            <div class="settings-column">
              <h3>Language</h3>
              <div class="setting-group">
                <label>
                  <input
                    type="checkbox"
                    checked={app.disableJapanese}
                    onChange={(e) =>
                      app.setDisableJapanese(e.currentTarget.checked)
                    }
                  />
                  Disable Japanese Text
                </label>
              </div>
            </div>

            <div class="settings-column">
              <h3>Model Settings</h3>
              <div class="setting-group">
                <label>JTP2 Model Path</label>
                <input
                  type="text"
                  value={app.jtp2ModelPath}
                  onChange={(e) => app.setJtp2ModelPath(e.currentTarget.value)}
                  placeholder="/path/to/jtp2/model.safetensors"
                />
                <div class="setting-info">
                  <a 
                    href="https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-link"
                  >
                    <span class="icon">{getIcon("documentArrowDown")}</span>
                    Download Model (1.8GB)
                  </a>
                </div>
              </div>
              <div class="setting-group">
                <label>JTP2 Tags Path</label>
                <input
                  type="text"
                  value={app.jtp2TagsPath}
                  onChange={(e) => app.setJtp2TagsPath(e.currentTarget.value)}
                  placeholder="/path/to/jtp2/tags.json"
                />
                <div class="setting-info">
                  <a 
                    href="https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/tags.json"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="download-link"
                  >
                    <span class="icon">{getIcon("documentArrowDown")}</span>
                    Download Tags (195KB)
                  </a>
                </div>
              </div>
            </div>
          </div>

          <section class="warning-section">
            <Show when={!app.disableJapanese}>
              <p class="warning-text">
                <span>⚠️警告！これを使うと狼になります！</span>
              </p>
            </Show>
            <label>
              <input
                type="checkbox"
                checked={app.instantDelete}
                onChange={(e) => app.setInstantDelete(e.currentTarget.checked)}
              />
              Enable instant delete (skips confirmation)
            </label>
          </section>
        </div>
      </Show>
    </div>
  );
};
