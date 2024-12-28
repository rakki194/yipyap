import { Component } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { Tooltip } from "~/components/Tooltip/Tooltip";
import { Slider } from "~/components/Slider/Slider";
import { Toggle } from "~/components/Toggle/Toggle";
import getIcon from "~/icons";
import { useTranslations } from "~/composables/useTranslations";

export const TaggerSettings: Component = () => {
  const app = useAppContext();
  const t = useTranslations();

  return (
    <div class="tagger-settings">
      <div class="setting-group">
        <h3>JTP2</h3>
        <Tooltip content={t('settings.jtp2ModelPathTooltip')} position="top">
          <label>{t('settings.jtp2ModelPath')}</label>
        </Tooltip>
        <input
          type="text"
          value={app.jtp2.modelPath}
          onChange={(e) => app.jtp2.setModelPath(e.currentTarget.value)}
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
            <span class="icon">{getIcon("download")}</span>
          </a>
        </div>
      </div>
      <div class="setting-group">
        <Tooltip content={t('settings.jtp2TagsPathTooltip')} position="top">
          <label>{t('settings.jtp2TagsPath')}</label>
        </Tooltip>
        <input
          type="text"
          value={app.jtp2.tagsPath}
          onChange={(e) => app.jtp2.setTagsPath(e.currentTarget.value)}
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
            <span class="icon">{getIcon("download")}</span>
          </a>
        </div>
      </div>

      <div class="setting-group">
        <Tooltip content={t('settings.jtp2ThresholdTooltip')} position="top">
          <label>{t('settings.jtp2Threshold')}</label>
        </Tooltip>
        <div class="threshold-controls">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={app.jtp2.threshold}
            onChange={(value) => app.jtp2.setThreshold(value)}
            aria-label={t('settings.jtp2Threshold')}
          />
          <span class="threshold-value">{app.jtp2.threshold.toFixed(2)}</span>
        </div>
      </div>
      <div class="setting-group">
        <Tooltip content={t('settings.jtp2ForceCpuTooltip')} position="top">
          <label>
            <Toggle
              checked={app.jtp2.forceCpu}
              onChange={(checked) => app.jtp2.setForceCpu(checked)}
              title={t('settings.jtp2ForceCpu')}
            />
            {t('settings.jtp2ForceCpu')}
          </label>
        </Tooltip>
      </div>

      <div class="setting-group">
        <h3>WDv3</h3>
        <Tooltip content={t('settings.wdv3ModelNameTooltip')} position="top">
          <label>{t('settings.wdv3ModelName')}</label>
        </Tooltip>
        <select
          value={app.wdv3.modelName}
          onChange={(e) => app.wdv3.setModelName(e.currentTarget.value)}
        >
          <option value="vit">ViT</option>
          <option value="swinv2">SwinV2</option>
          <option value="convnext">ConvNext</option>
        </select>
      </div>

      <div class="setting-group">
        <Tooltip content={t('settings.wdv3GenThresholdTooltip')} position="top">
          <label>{t('settings.wdv3GenThreshold')}</label>
        </Tooltip>
        <div class="threshold-controls">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={app.wdv3.genThreshold}
            onChange={(value) => app.wdv3.setGenThreshold(value)}
            aria-label={t('settings.wdv3GenThreshold')}
          />
          <span class="threshold-value">{app.wdv3.genThreshold.toFixed(2)}</span>
        </div>
      </div>

      <div class="setting-group">
        <Tooltip content={t('settings.wdv3CharThresholdTooltip')} position="top">
          <label>{t('settings.wdv3CharThreshold')}</label>
        </Tooltip>
        <div class="threshold-controls">
          <Slider
            min={0}
            max={1}
            step={0.01}
            value={app.wdv3.charThreshold}
            onChange={(value) => app.wdv3.setCharThreshold(value)}
            aria-label={t('settings.wdv3CharThreshold')}
          />
          <span class="threshold-value">{app.wdv3.charThreshold.toFixed(2)}</span>
        </div>
      </div>

      <div class="setting-group">
        <Tooltip content={t('settings.wdv3ForceCpuTooltip')} position="top">
          <label>
            <Toggle
              checked={app.wdv3.forceCpu}
              onChange={(checked) => app.wdv3.setForceCpu(checked)}
              title={t('settings.wdv3ForceCpu')}
            />
            {t('settings.wdv3ForceCpu')}
          </label>
        </Tooltip>
      </div>
    </div>
  );
}; 