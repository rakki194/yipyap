// src/components/Settings/Settings.tsx

import { Component, Show, createSignal, createEffect, For } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { Theme, themeIconMap, themes } from "~/contexts/theme";
import getIcon from "~/icons";
import "./Settings.css";
import { languages } from "~/i18n";

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
  const t = app.t;
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
        <h2>{t('settings.title')}</h2>
        <button
          type="button"
          class="icon help-button"
          onClick={toggleHelp}
          title={t('shortcuts.title')}
          aria-label={t('shortcuts.title')}
        >
          {getIcon("bookQuestionMark")}
        </button>
      </div>

      <Show
        when={!showHelp()}
        fallback={
          <div class="help-content" classList={{ closing: isHelpClosing() }}>
            <SlideTransition show={showHelp()}>
              <h3>{t('shortcuts.title')}</h3>
              <div class="shortcuts-grid">
                <div class="shortcuts-section">
                  <h4>{t('shortcuts.galleryNavigation')}</h4>
                  <div class="shortcut">
                    <kbd>q</kbd>
                    <span>{t('shortcuts.quickFolderSwitch')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>↑</kbd>
                    <span>{t('shortcuts.aboveImage')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>↓</kbd>
                    <span>{t('shortcuts.belowImage')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>←</kbd>
                    <span>{t('shortcuts.previousImage')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>→</kbd>
                    <span>{t('shortcuts.nextImage')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Enter</kbd>
                    <span>{t('shortcuts.togglePreview')}</span>
                  </div>
                </div>

                <div class="shortcuts-section">
                  <h4>{t('shortcuts.tagNavigation')}</h4>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>←</kbd>
                    <span>{t('shortcuts.previousTag')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>→</kbd>
                    <span>{t('shortcuts.nextTag')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>↑</kbd>
                    <span>{t('shortcuts.switchTagBubble')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>Shift</kbd> + <kbd>↓</kbd>
                    <span>{t('shortcuts.switchTagInput')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.doubleShift')}</kbd>
                    <span>{t('shortcuts.cycleCaptions')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.doubleShift')}</kbd> + <kbd>←</kbd>
                    <span>{t('shortcuts.firstTagRow')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.doubleShift')}</kbd> + <kbd>→</kbd>
                    <span>{t('shortcuts.lastTagRow')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.shift')}</kbd> + <kbd>{t('shortcuts.del')}</kbd>
                    <span>{t('shortcuts.removeTag')}</span>
                  </div>
                </div>

                <div class="shortcuts-section full-width">
                  <h4>{t('shortcuts.other')}</h4>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.esc')}</kbd>
                    <span>{t('shortcuts.closePreview')}</span>
                  </div>
                  <div class="shortcut">
                    <kbd>{t('shortcuts.del')}</kbd>
                    <span>{t('shortcuts.deleteImage')}</span>
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
              <h3>{t('settings.appearance')}</h3>
              <div class="setting-group">
                <label>{t("common.theme")}</label>
                <div class="theme-buttons">
                  <For each={themes}>
                    {(th) => (
                      <button
                        type="button"
                        class={`icon ${th}-icon`}
                        classList={{ active: app.theme === th }}
                        onClick={() => app.setTheme(th as Theme)}
                        title={t(`settings.theme.${th}`)}
                        aria-label={t(`settings.theme.${th}`)}
                      >
                        {getIcon(themeIconMap[th as Theme]!)}
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </div>

            <div class="settings-column">
              <h3>{t('settings.gallery')}</h3>
              {/* <div class="setting-group">
                <label>{t('settings.viewMode')}</label>
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
                <label>{t('settings.sortBy')}</label>
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
              </div> */}

              <div class="setting-group">
                <div class="icon-buttons">
                  <label>
                    <input
                      type="checkbox"
                      checked={app.disableAnimations}
                      onChange={(e) =>
                        app.setDisableAnimations(e.currentTarget.checked)
                      }
                    />
                    {t('settings.disableAnimations')}
                  </label>
                </div>
              </div>
            </div>

            <div class="settings-column">
              <h3>{t('settings.language')}</h3>
              <div class="setting-group">
                <select
                  class="language-select"
                  value={app.locale}
                  onChange={(e) => app.setLocale(e.currentTarget.value as any)}
                >
                  <For each={languages}>
                    {(lang) => (
                      <option value={lang.code}>{lang.name}</option>
                    )}
                  </For>
                </select>
                <Show when={app.locale !== 'ja'}>
                  <div class="setting-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={app.disableNonsense}
                        onChange={(e) => app.setDisableNonsense(e.currentTarget.checked)}
                      />
                      {t('settings.disableNonsense')}
                    </label>
                  </div>
                </Show>
              </div>
            </div>

            <div class="settings-column">
              <h3>{t('settings.modelSettings')}</h3>
              <div class="setting-group">
                <label>{t('settings.jtp2ModelPath')}</label>
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
                    {t('settings.downloadModel')}
                  </a>
                </div>
              </div>
              <div class="setting-group">
                <label>{t('settings.jtp2TagsPath')}</label>
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
                    {t('settings.downloadTags')}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <section class="warning-section">
            <Show when={!app.disableNonsense}>
              <p class="warning-text">
                <span>
                  {app.locale === 'pl' 
                    ? "⚠️UWAGA! To zamieni cię w bobra!"
                    : "⚠️警告！これはあなたをビーバーに変えてしまいます！"}
                </span>
              </p>
            </Show>
            <label>
              <input
                type="checkbox"
                checked={app.instantDelete}
                onChange={(e) => app.setInstantDelete(e.currentTarget.checked)}
              />
              {t('settings.instantDelete')}
            </label>
            
            <div class="setting-item">
              <label class="tooltip-container">
                <input
                  type="checkbox"
                  checked={app.preserveLatents}
                  onChange={(e) => app.setPreserveLatents(e.currentTarget.checked)}
                />
                {t('settings.preserveLatents')}
                <span class="tooltip">{t('settings.preserveLatentsTooltip')}</span>
              </label>
            </div>

            <div class="setting-item">
              <label class="tooltip-container">
                <input
                  type="checkbox"
                  checked={app.preserveTxt}
                  onChange={(e) => app.setPreserveTxt(e.currentTarget.checked)}
                />
                {t('settings.preserveTxt')}
                <span class="tooltip">{t('settings.preserveTxtTooltip')}</span>
              </label>
            </div>

            <h4 class="experimental-header">{t('settings.experimentalFeatures')}</h4>
            <div class="experimental-options">
              <label>
                <input
                  type="checkbox"
                  checked={app.enableZoom}
                  onChange={(e) => app.setEnableZoom(e.currentTarget.checked)}
                />
                {t('settings.enableZoom')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={app.enableMinimap}
                  onChange={(e) => app.setEnableMinimap(e.currentTarget.checked)}
                />
                {t('settings.enableMinimap')}
              </label>
            </div>
          </section>

          <div class="setting-group">
            <label>{t('settings.thumbnailSize')}</label>
            <div class="thumbnail-size-controls">
              <input
                type="range"
                min="100"
                max="500"
                step="50"
                value={app.thumbnailSize}
                onInput={(e) => app.setThumbnailSize(parseInt(e.currentTarget.value))}
              />
              <span class="thumbnail-size-value" data-testid="thumbnail-size-value">
                {app.thumbnailSize}px
              </span>
            </div>
            <small class="setting-description">
              {t('settings.thumbnailSizeDescription')}
            </small>
          </div>
        </div>
      </Show>
    </div>
  );
};
