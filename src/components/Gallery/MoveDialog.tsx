import { Component, For, createSignal, createMemo, Show, createResource, onMount } from "solid-js";
import { useAppContext } from "~/contexts/app";
import { useGallery } from "~/contexts/GalleryContext";
import { useDoubleTap } from "~/composables/useDoubleTap";
import getIcon from "~/icons";
import "./MoveDialog.css";

export const MoveDialog: Component<{
    onClose: () => void;
    onMove: (targetPath: string) => void;
    imageCount: number;
    folderCount: number;
}> = (props) => {
    const app = useAppContext();
    const gallery = useGallery();
    const t = app.t;
    const [selectedPath, setSelectedPath] = createSignal("");
    const [searchQuery, setSearchQuery] = createSignal("");
    const [focusedElement, setFocusedElement] = createSignal<"search" | "list">("search");
    let searchInputRef: HTMLInputElement | undefined;
    let folderListRef: HTMLDivElement | undefined;

    const [folders] = createResource(async () => {
        const data = gallery.data();
        if (!data) return [];

        const currentPath = data.path;
        const allFolders = await gallery.getAllKnownFolders();
        return allFolders
            .filter(folder => folder.fullPath !== currentPath)
            .map(folder => ({
                name: folder.name,
                path: folder.fullPath
            }));
    });

    const filteredFolders = createMemo(() => {
        const folderList = folders() || [];
        const query = searchQuery().toLowerCase();
        return folderList.filter(folder =>
            folder.name.toLowerCase().includes(query)
        );
    });

    const handleMove = () => {
        if (!selectedPath()) return;
        props.onMove(selectedPath());
        props.onClose();
    };

    const handleDoubleTap = () => {
        if (focusedElement() === "search") {
            setFocusedElement("list");
            const firstFolder = filteredFolders()[0];
            if (firstFolder) {
                setSelectedPath(firstFolder.path);
                const firstRadio = folderListRef?.querySelector('input[type="radio"]') as HTMLInputElement;
                if (firstRadio) {
                    firstRadio.checked = true;
                    firstRadio.focus();
                }
            }
        } else {
            setFocusedElement("search");
            searchInputRef?.focus();
        }
    };

    useDoubleTap({
        onDoubleTap: handleDoubleTap,
        passive: false
    });

    onMount(() => {
        searchInputRef?.focus();
    });

    return (
        <div class="settings-overlay" onClick={props.onClose}>
            <div class="dialog-content" onClick={(e) => e.stopPropagation()}>
                <h2>{t('gallery.moveItems')}</h2>
                <div class="dialog-body">
                    <p>
                        {t('gallery.moveItemsDescription', {
                            imageCount: props.imageCount,
                            folderCount: props.folderCount,
                            total: props.imageCount + props.folderCount
                        })}
                    </p>

                    <div class="folder-list">
                        <h3>{t('gallery.selectTargetFolder')}</h3>

                        <div class="folder-search">
                            <span class="search-icon">{getIcon("search")}</span>
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder={t('gallery.searchFolders')}
                                value={searchQuery()}
                                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                                onKeyDown={(e) => {
                                    if (e.key === '_' && !e.getModifierState("Shift")) {
                                        // Allow the underscore to be typed but prevent focus switching
                                        e.stopPropagation();
                                    }
                                }}
                            />
                            <Show when={searchQuery()}>
                                <button
                                    type="button"
                                    class="clear-search"
                                    onClick={() => setSearchQuery("")}
                                    title={t('common.clear')}
                                >
                                    {getIcon("dismiss")}
                                </button>
                            </Show>
                        </div>

                        <div class="folder-options" ref={folderListRef}>
                            <Show
                                when={filteredFolders().length > 0}
                                fallback={
                                    <div class="no-folders">
                                        {searchQuery()
                                            ? t('gallery.noFoldersFound')
                                            : t('gallery.noFoldersAvailable')}
                                    </div>
                                }
                            >
                                <For each={filteredFolders()}>
                                    {(folder) => (
                                        <label class="folder-option">
                                            <input
                                                type="radio"
                                                name="target-folder"
                                                value={folder.path}
                                                checked={selectedPath() === folder.path}
                                                onChange={(e) => setSelectedPath(e.currentTarget.value)}
                                            />
                                            <span class="folder-icon">{getIcon("folder")}</span>
                                            <span class="folder-name">{folder.name}</span>
                                        </label>
                                    )}
                                </For>
                            </Show>
                        </div>
                    </div>
                </div>

                <div class="dialog-actions">
                    <button type="button" class="secondary" onClick={props.onClose}>
                        {t('common.cancel')}
                    </button>
                    <button
                        type="button"
                        class="primary"
                        disabled={!selectedPath()}
                        onClick={handleMove}
                    >
                        {t('gallery.moveItems')}
                    </button>
                </div>
            </div>
        </div>
    );
}; 