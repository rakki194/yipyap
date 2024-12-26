// src/components/Settings/Settings.tsx

import { Component, Show, createSignal, createEffect, For, onMount, onCleanup } from "solid-js";
import { useGallery } from "~/contexts/GalleryContext";
import { useAppContext } from "~/contexts/app";
import { Theme, themeIconMap, themes } from "~/contexts/theme";
import getIcon from "~/icons";
import { Tooltip } from "~/components/Tooltip/Tooltip";
import { Slider } from "~/components/Slider/Slider";
import { TransformationSettings } from "./TransformationSettings";
import "./Settings.css";
import { languages } from "~/i18n";
import { useGlobalEscapeManager } from "~/composables/useGlobalEscapeManager";
import { Toggle } from "~/components/Toggle/Toggle";

export const Settings: Component<{ onClose: () => void }> = (props) => {
  const app = useAppContext();
  const escape = useGlobalEscapeManager();
  const [activeView, setActiveView] = createSignal<'main' | 'help' | 'transformations' | 'experimental'>('main');
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const t = app.t;

  onMount(() => {
    escape.setOverlayState("settings", true);
    const unregister = escape.registerHandler("settings", props.onClose);

    onCleanup(() => {
      escape.setOverlayState("settings", false);
      unregister();
    });
  });

  const switchView = (view: 'main' | 'help' | 'transformations' | 'experimental') => {
    if (isTransitioning()) return;
    
    if (activeView() === view) {
      if (view !== 'main') {
        setIsTransitioning(true);
        setTimeout(() => {
          setActiveView('main');
          setIsTransitioning(false);
        }, 300);
      }
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveView(view);
      setIsTransitioning(false);
    }, 300);
  };

  return (
    <div 
      class="settings-panel card" 
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") {
          if (activeView() !== 'main') {
            switchView('main');
          } else {
            props.onClose();
          }
        }
      }}
    >
      <div class="settings-header">
        <h2>{t('settings.title')}</h2>
        <div class="settings-header-buttons">
          <button
            type="button"
            class="icon transformations-button"
            classList={{ active: activeView() === 'transformations' }}
            onClick={() => switchView('transformations')}
            title={t('tools.transformations')}
            aria-label={t('tools.transformations')}
          >
            {getIcon("textAlignDistributed")}
          </button>
          <button
            type="button"
            class="icon experimental-button"
            classList={{ active: activeView() === 'experimental' }}
            onClick={() => switchView('experimental')}
            title={t('settings.experimentalFeatures')}
            aria-label={t('settings.experimentalFeatures')}
          >
            {getIcon("beakerRegular")}
          </button>
          <button
            type="button"
            class="icon help-button"
            classList={{ active: activeView() === 'help' }}
            onClick={() => switchView('help')}
            title={t('shortcuts.title')}
            aria-label={t('shortcuts.title')}
          >
            {getIcon("bookQuestionMark")}
          </button>
          <button
            type="button"
            class="icon close-button"
            onClick={props.onClose}
            title={t('common.close')}
            aria-label={t('common.close')}
          >
            {getIcon("dismiss")}
          </button>
        </div>
      </div>
      
      <div 
        class="settings-content-wrapper"
        onKeyDown={(e) => {
          e.stopPropagation();
        }}
      >
        <Show
          when={activeView() === 'main'}
          fallback={
            <div classList={{ transitioning: isTransitioning() }}>
              <Show
                when={activeView() === 'transformations'}
                fallback={
                  <Show
                    when={activeView() === 'experimental'}
                    fallback={
                      <div class="help-content">
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
                      </div>
                    }
                  >
                    <div class="experimental-content">
                      <h3>{t('settings.experimentalFeatures')}</h3>
                      <div class="experimental-options">
                        <Tooltip content={t('settings.enableZoomTooltip')} position="top">
                          <label>
                            <Toggle
                              checked={app.enableZoom}
                              onChange={(checked) => app.setEnableZoom(checked)}
                              title={t('settings.enableZoom')}
                            />
                            {t('settings.enableZoom')}
                          </label>
                        </Tooltip>
                        <Tooltip content={t('settings.enableMinimapTooltip')} position="top">
                          <label>
                            <Toggle
                              checked={app.enableMinimap}
                              onChange={(checked) => app.setEnableMinimap(checked)}
                              title={t('settings.enableMinimap')}
                            />
                            {t('settings.enableMinimap')}
                          </label>
                        </Tooltip>
                        <Tooltip content={t('settings.alwaysShowCaptionEditorTooltip')} position="top">
                          <label>
                            <Toggle
                              checked={app.alwaysShowCaptionEditor}
                              onChange={(checked) => app.setAlwaysShowCaptionEditor(checked)}
                              title={t('settings.alwaysShowCaptionEditor')}
                            />
                            {t('settings.alwaysShowCaptionEditor')}
                          </label>
                        </Tooltip>
                      </div>
                    </div>
                  </Show>
                }
              >
                <div class="transformations-content">
                  <TransformationSettings onClose={() => switchView('main')} />
                </div>
              </Show>
            </div>
          }
        >
          <div class="settings-content" classList={{ transitioning: isTransitioning() }}>
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
                    <Tooltip content={t('settings.disableAnimationsTooltip')} position="top">
                      <label>
                        <Toggle
                          checked={app.disableAnimations}
                          onChange={(checked) => app.setDisableAnimations(checked)}
                          title={t('settings.disableAnimations')}
                        />
                        {t('settings.disableAnimations')}
                      </label>
                    </Tooltip>
                  </div>
                </div>
              </div>

              <div class="settings-column">
                <h3>{t('settings.language')}</h3>
                <div class="setting-group">
                  <Tooltip content={t('settings.languageTooltip')} position="top">
                    <label for="language-select">{t('common.language')}</label>
                  </Tooltip>
                  <select
                    id="language-select"
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
                      <Tooltip content={t('settings.disableNonsenseTooltip')} position="top">
                        <label>
                          <Toggle
                            checked={app.disableNonsense}
                            onChange={(checked) => app.setDisableNonsense(checked)}
                            title={t('settings.disableNonsense')}
                          />
                          {t('settings.disableNonsense')}
                        </label>
                      </Tooltip>
                    </div>
                  </Show>
                </div>
              </div>

              <div class="settings-column">
                <h3>{t('settings.modelSettings')}</h3>
                <div class="setting-group">
                  <Tooltip content={t('settings.jtp2ModelPathTooltip')} position="top">
                    <label>{t('settings.jtp2ModelPath')}</label>
                  </Tooltip>
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
                  <Tooltip content={t('settings.jtp2TagsPathTooltip')} position="top">
                    <label>{t('settings.jtp2TagsPath')}</label>
                  </Tooltip>
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

            <div class="setting-group">
              <Tooltip content={t('settings.thumbnailSizeDescription')} position="top">
                <h3>{t('settings.thumbnailSize')}</h3>
              </Tooltip>
              <div class="thumbnail-size-controls">
                <Slider
                  min={100}
                  max={500}
                  step={50}
                  value={app.thumbnailSize}
                  onChange={(value) => app.setThumbnailSize(value)}
                  aria-label={t('settings.thumbnailSize')}
                />
                <span class="thumbnail-size-value" data-testid="thumbnail-size-value">
                  {app.thumbnailSize}px
                </span>
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
              <Tooltip content={t('settings.instantDeleteTooltip')} position="top">
                <label>
                  <Toggle
                    checked={app.instantDelete}
                    onChange={(checked) => app.setInstantDelete(checked)}
                    title={t('settings.instantDelete')}
                  />
                  {t('settings.instantDelete')}
                </label>
              </Tooltip>
              
              <div class="setting-item">
                <Tooltip content={t('settings.preserveLatentsTooltip')} position="top">
                  <label>
                    <Toggle
                      checked={app.preserveLatents}
                      onChange={(checked) => app.setPreserveLatents(checked)}
                      title={t('settings.preserveLatents')}
                    />
                    {t('settings.preserveLatents')}
                  </label>
                </Tooltip>
              </div>

              <div class="setting-item">
                <Tooltip content={t('settings.preserveTxtTooltip')} position="top">
                  <label>
                    <Toggle
                      checked={app.preserveTxt}
                      onChange={(checked) => app.setPreserveTxt(checked)}
                      title={t('settings.preserveTxt')}
                    />
                    {t('settings.preserveTxt')}
                  </label>
                </Tooltip>
              </div>
            </section>
          </div>
        </Show>
      </div>
    </div>
  );
};
