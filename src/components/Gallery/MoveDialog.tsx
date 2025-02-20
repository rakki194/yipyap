import { Component, For, createSignal, createMemo, Show, createResource, onMount, onCleanup } from "solid-js";
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

    const handleKeyDown = (e: KeyboardEvent) => {
        // Handle Escape key regardless of focus state
        if (e.key === "Escape") {
            e.preventDefault();
            e.stopPropagation();
            props.onClose();
            return;
        }

        // Only handle keyboard navigation when focused on list or when using arrow keys to enter list
        if (focusedElement() === "search" && e.key !== "ArrowDown") {
            return;
        }

        const currentFolders = filteredFolders();
        const currentIndex = currentFolders.findIndex(folder => folder.path === selectedPath());

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setFocusedElement("list");
            if (currentIndex === -1) {
                // No selection yet, select first item
                if (currentFolders.length > 0) {
                    const firstFolder = currentFolders[0];
                    setSelectedPath(firstFolder.path);
                    const element = folderListRef?.querySelector(`[data-path="${firstFolder.path}"]`);
                    element?.scrollIntoView({ block: 'nearest' });
                }
            } else if (currentIndex < currentFolders.length - 1) {
                const nextFolder = currentFolders[currentIndex + 1];
                setSelectedPath(nextFolder.path);
                const element = folderListRef?.querySelector(`[data-path="${nextFolder.path}"]`);
                element?.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setFocusedElement("list");
            if (currentIndex === -1) {
                // No selection yet, select last item
                if (currentFolders.length > 0) {
                    const lastFolder = currentFolders[currentFolders.length - 1];
                    setSelectedPath(lastFolder.path);
                    const element = folderListRef?.querySelector(`[data-path="${lastFolder.path}"]`);
                    element?.scrollIntoView({ block: 'nearest' });
                }
            } else if (currentIndex > 0) {
                const prevFolder = currentFolders[currentIndex - 1];
                setSelectedPath(prevFolder.path);
                const element = folderListRef?.querySelector(`[data-path="${prevFolder.path}"]`);
                element?.scrollIntoView({ block: 'nearest' });
            }
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedPath()) {
                handleMove();
            }
        }
    };

    const handleDoubleTap = () => {
        if (focusedElement() === "search") {
            setFocusedElement("list");
            const currentFolders = filteredFolders();
            if (currentFolders.length > 0) {
                // If no selection, select first item
                if (!selectedPath()) {
                    const firstFolder = currentFolders[0];
                    setSelectedPath(firstFolder.path);
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
        // Add keyboard event listener
        window.addEventListener('keydown', handleKeyDown);
        onCleanup(() => {
            window.removeEventListener('keydown', handleKeyDown);
        });
    });

    return (
        <div class="modal-overlay" onClick={props.onClose}>
            <div class="modal-dialog" onClick={(e) => e.stopPropagation()}>
                <h2>{t('gallery.moveItems')}</h2>
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
                            onFocus={() => setFocusedElement("search")}
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

                    <div
                        class="folder-options"
                        ref={folderListRef}
                        onFocus={() => setFocusedElement("list")}
                        tabIndex={-1}
                    >
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
                                    <div
                                        class="folder-option"
                                        classList={{ selected: selectedPath() === folder.path }}
                                        onClick={() => setSelectedPath(folder.path)}
                                        data-path={folder.path}
                                    >
                                        <span class="folder-icon">{getIcon("folder")}</span>
                                        <span class="folder-name">{folder.name}</span>
                                    </div>
                                )}
                            </For>
                        </Show>
                    </div>
                </div>

                <div class="modal-actions">
                    <button type="button" onClick={props.onClose}>
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