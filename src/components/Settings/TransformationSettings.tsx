/**
 * TransformationSettings Component
 * 
 * A component that provides a UI for managing text transformations, including:
 * - Viewing and toggling existing transformations
 * - Adding new custom transformations with various types (search/replace, case, trim, wrap, number)
 * - Removing custom transformations
 * 
 * The component handles form state management, validation, and submission for creating
 * new transformations. It supports different configuration options based on the selected
 * transformation type.
 * 
 * Props:
 * @param {() => void} onClose - Callback function to close the settings panel
 */

import { Component, For, Show, createSignal, createEffect } from "solid-js";
import { useTransformations, TransformationType, Transformation, SearchReplaceTransformation, CaseTransformation, TrimTransformation, WrapTransformation, NumberTransformation } from "~/contexts/transformations";
import { useAppContext } from "~/contexts/app";
import getIcon from "~/icons";
import "./TransformationSettings.css";
import { Toggle } from "~/components/Toggle/Toggle";

/**
 * Interface defining an icon option with an ID and display label
 */
type IconOption = {
  id: string;
  label: string;
};

/**
 * Available icons for custom transformations
 */
const availableIcons: IconOption[] = [
  { id: "rocket", label: "Rocket" },
  { id: "dog", label: "Dog" },
  { id: "cat", label: "Cat" },
  { id: "beakerRegular", label: "Beaker" },
  { id: "turtle", label: "Turtle" },
  { id: "addCircle", label: "Add Circle Filled" },
  { id: "addCircleRegular", label: "Add Circle Regular" },
  { id: "addRegular", label: "Add Regular" },
  
  //{ id: "notepad", label: "Notepad" },
  //{ id: "subtitles", label: "Subtitles" },
  { id: "textSortAscending", label: "Text Sort" },
  { id: "textAlign", label: "Text Align" },
  //{ id: "info", label: "Info" },
  //{ id: "search", label: "Search" },
];

/**
 * Available transformation types with their translation keys
 */
const transformationTypes: { value: TransformationType; label: string }[] = [
  { value: "searchReplace", label: "tools.transformationTypes.searchReplace" },
  { value: "case", label: "tools.transformationTypes.case" },
  { value: "trim", label: "tools.transformationTypes.trim" },
  { value: "wrap", label: "tools.transformationTypes.wrap" },
  { value: "number", label: "tools.transformationTypes.number" },
];

/**
 * Available case transformation types
 */
const caseTypes = [
  { value: "upper", label: "tools.caseTypes.upper" },
  { value: "lower", label: "tools.caseTypes.lower" },
  { value: "title", label: "tools.caseTypes.title" },
  { value: "sentence", label: "tools.caseTypes.sentence" },
];

/**
 * Available trim transformation types
 */
const trimTypes = [
  { value: "all", label: "tools.trimTypes.all" },
  { value: "start", label: "tools.trimTypes.start" },
  { value: "end", label: "tools.trimTypes.end" },
  { value: "duplicates", label: "tools.trimTypes.duplicates" },
];

/**
 * Available number transformation actions
 */
const numberActions = [
  { value: "remove", label: "tools.numberActions.remove" },
  { value: "format", label: "tools.numberActions.format" },
  { value: "extract", label: "tools.numberActions.extract" },
];

export const TransformationSettings: Component<{
  onClose: () => void;
}> = (props) => {
  const { t } = useAppContext();
  const { state, toggleTransformation, addTransformation, removeTransformation } = useTransformations();
  const [showAddForm, setShowAddForm] = createSignal(false);
  const [formVisible, setFormVisible] = createSignal(false);
  const [newName, setNewName] = createSignal("");
  const [newDescription, setNewDescription] = createSignal("");
  const [selectedIcon, setSelectedIcon] = createSignal<string>(availableIcons[0].id);
  const [selectedType, setSelectedType] = createSignal<TransformationType>("searchReplace");

  // Search & Replace specific
  const [pattern, setPattern] = createSignal("");
  const [replacement, setReplacement] = createSignal("");

  // Case specific
  const [caseType, setCaseType] = createSignal<"upper" | "lower" | "title" | "sentence">("upper");

  // Trim specific
  const [trimType, setTrimType] = createSignal<"all" | "start" | "end" | "duplicates">("all");

  // Wrap specific
  const [prefix, setPrefix] = createSignal("");
  const [suffix, setSuffix] = createSignal("");

  // Number specific
  const [numberAction, setNumberAction] = createSignal<"remove" | "format" | "extract">("remove");
  const [numberFormat, setNumberFormat] = createSignal("");

  /**
   * Effect to handle form visibility animation
   * Adds a small delay when showing the form for smooth transition
   */
  createEffect(() => {
    if (showAddForm()) {
      setTimeout(() => setFormVisible(true), 50);
    } else {
      setFormVisible(false);
    }
  });

  /**
   * Handles form submission for adding a new transformation
   * Validates required fields and creates appropriate transformation object based on type
   * 
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e: Event) => {
    e.preventDefault();
    
    if (!newName()) return;

    const baseTransformation = {
      name: newName(),
      description: newDescription() || "Custom transformation",
      icon: selectedIcon(),
      type: selectedType(),
    };

    let transformation;
    switch (selectedType()) {
      case "searchReplace":
        if (!pattern()) return;
        transformation = {
          ...baseTransformation,
          type: "searchReplace",
          pattern: pattern(),
          replacement: replacement(),
        } as Omit<SearchReplaceTransformation, "id" | "enabled" | "isCustom">;
        break;

      case "case":
        transformation = {
          ...baseTransformation,
          type: "case",
          caseType: caseType(),
        } as Omit<CaseTransformation, "id" | "enabled" | "isCustom">;
        break;

      case "trim":
        transformation = {
          ...baseTransformation,
          type: "trim",
          trimType: trimType(),
        } as Omit<TrimTransformation, "id" | "enabled" | "isCustom">;
        break;

      case "wrap":
        if (!prefix() && !suffix()) return;
        transformation = {
          ...baseTransformation,
          type: "wrap",
          prefix: prefix(),
          suffix: suffix(),
        } as Omit<WrapTransformation, "id" | "enabled" | "isCustom">;
        break;

      case "number":
        transformation = {
          ...baseTransformation,
          type: "number",
          numberAction: numberAction(),
          format: numberFormat(),
        } as Omit<NumberTransformation, "id" | "enabled" | "isCustom">;
        break;

      default:
        return;
    }

    addTransformation(transformation);
    setShowAddForm(false);
    resetForm();
  };

  /**
   * Resets all form fields to their default values
   */
  const resetForm = () => {
    setNewName("");
    setNewDescription("");
    setPattern("");
    setReplacement("");
    setCaseType("upper");
    setTrimType("all");
    setPrefix("");
    setSuffix("");
    setNumberAction("remove");
    setNumberFormat("");
    setSelectedIcon(availableIcons[0].id);
    setSelectedType("searchReplace");
  };

  /**
   * Closes the add transformation form with animation
   * Uses a timeout to ensure smooth transition
   */
  const closeForm = () => {
    setFormVisible(false);
    setTimeout(() => setShowAddForm(false), 300);
  };

  return (
    <div class="transformation-settings">
      <div class="settings-header">
        <h3>{t("tools.transformations")}</h3>
        <div class="header-buttons">
          <button
            type="button"
            class="icon add-button"
            onClick={() => setShowAddForm(true)}
            title={t("common.add")}
          >
            {getIcon("plus")}
          </button>
        </div>
      </div>
      
      <div class="add-transformation-form-container" classList={{ expanded: showAddForm() }}>
        <Show when={showAddForm()}>
          <form 
            class="add-transformation-form" 
            classList={{ visible: formVisible() }}
            onSubmit={handleSubmit}
          >
            <h4>{t("tools.addTransformation")}</h4>
            
            <div class="form-group">
              <label for="name">{t("common.name")}</label>
              <input
                type="text"
                id="name"
                value={newName()}
                onInput={(e) => setNewName(e.currentTarget.value)}
                placeholder={t("tools.transformationNamePlaceholder")}
                required
              />
            </div>

            <div class="form-group">
              <label for="description">{t("common.description")}</label>
              <input
                type="text"
                id="description"
                value={newDescription()}
                onInput={(e) => setNewDescription(e.currentTarget.value)}
                placeholder={t("tools.transformationDescriptionPlaceholder")}
              />
            </div>

            <div class="form-group">
              <label>{t("tools.transformationType")}</label>
              <select 
                value={selectedType()} 
                onChange={(e) => setSelectedType(e.currentTarget.value as TransformationType)}
              >
                <For each={transformationTypes}>
                  {(type) => (
                    <option value={type.value}>{t(type.label)}</option>
                  )}
                </For>
              </select>
            </div>

            <Show when={selectedType() === "searchReplace"}>
              <div class="form-group">
                <label for="pattern">{t("tools.searchPattern")}</label>
                <input
                  type="text"
                  id="pattern"
                  value={pattern()}
                  onInput={(e) => setPattern(e.currentTarget.value)}
                  placeholder={t("tools.searchPatternPlaceholder")}
                  required
                />
              </div>

              <div class="form-group">
                <label for="replacement">{t("tools.replacement")}</label>
                <input
                  type="text"
                  id="replacement"
                  value={replacement()}
                  onInput={(e) => setReplacement(e.currentTarget.value)}
                  placeholder={t("tools.replacementPlaceholder")}
                />
              </div>
            </Show>

            <Show when={selectedType() === "case"}>
              <div class="form-group">
                <label>{t("tools.caseType")}</label>
                <select 
                  value={caseType()} 
                  onChange={(e) => setCaseType(e.currentTarget.value as any)}
                >
                  <For each={caseTypes}>
                    {(type) => (
                      <option value={type.value}>{t(type.label)}</option>
                    )}
                  </For>
                </select>
              </div>
            </Show>

            <Show when={selectedType() === "trim"}>
              <div class="form-group">
                <label>{t("tools.trimType")}</label>
                <select 
                  value={trimType()} 
                  onChange={(e) => setTrimType(e.currentTarget.value as any)}
                >
                  <For each={trimTypes}>
                    {(type) => (
                      <option value={type.value}>{t(type.label)}</option>
                    )}
                  </For>
                </select>
              </div>
            </Show>

            <Show when={selectedType() === "wrap"}>
              <div class="form-group">
                <label for="prefix">{t("tools.prefix")}</label>
                <input
                  type="text"
                  id="prefix"
                  value={prefix()}
                  onInput={(e) => setPrefix(e.currentTarget.value)}
                  placeholder={t("tools.prefixPlaceholder")}
                />
              </div>

              <div class="form-group">
                <label for="suffix">{t("tools.suffix")}</label>
                <input
                  type="text"
                  id="suffix"
                  value={suffix()}
                  onInput={(e) => setSuffix(e.currentTarget.value)}
                  placeholder={t("tools.suffixPlaceholder")}
                />
              </div>
            </Show>

            <Show when={selectedType() === "number"}>
              <div class="form-group">
                <label>{t("tools.numberAction")}</label>
                <select 
                  value={numberAction()} 
                  onChange={(e) => setNumberAction(e.currentTarget.value as any)}
                >
                  <For each={numberActions}>
                    {(action) => (
                      <option value={action.value}>{t(action.label)}</option>
                    )}
                  </For>
                </select>
              </div>

              <Show when={numberAction() === "format"}>
                <div class="form-group">
                  <label for="format">{t("tools.numberFormat")}</label>
                  <input
                    type="text"
                    id="format"
                    value={numberFormat()}
                    onInput={(e) => setNumberFormat(e.currentTarget.value)}
                    placeholder={t("tools.numberFormatPlaceholder")}
                  />
                </div>
              </Show>
            </Show>

            <div class="form-group">
              <label>{t("tools.selectIcon")}</label>
              <div class="icon-selection">
                <For each={availableIcons}>
                  {(icon) => (
                    <button
                      type="button"
                      class="icon"
                      classList={{ active: selectedIcon() === icon.id }}
                      onClick={() => setSelectedIcon(icon.id)}
                      title={icon.label}
                    >
                      {getIcon(icon.id)}
                    </button>
                  )}
                </For>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="secondary" onClick={closeForm}>
                {t("common.cancel")}
              </button>
              <button type="submit" class="primary">
                {t("common.add")}
              </button>
            </div>
          </form>
        </Show>
      </div>
      
      <div class="transformations-list">
        <For each={state.transformations}>
          {(transformation) => (
            <div class="transformation-item">
              <span class="icon">{getIcon(transformation.icon)}</span>
              <span class="name">{t(transformation.name)}</span>
              <span class="description">{transformation.description}</span>
              <div class="item-actions">
                <Show when={transformation.isCustom}>
                  <button
                    type="button"
                    class="icon delete-button"
                    onClick={() => removeTransformation(transformation.id)}
                    title={t("common.delete")}
                  >
                    {getIcon("delete")}
                  </button>
                </Show>
                <label>
                  <Toggle
                    checked={transformation.enabled}
                    onChange={() => toggleTransformation(transformation.id)}
                    title={transformation.enabled ? t("common.disable") : t("common.enable")}
                  />
                </label>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}; 