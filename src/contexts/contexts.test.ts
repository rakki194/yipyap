import { describe, test, expect } from 'vitest';
import { createRoot, JSX, createResource } from 'solid-js';
import { action } from '@solidjs/router';
import { AppContext, GalleryContext } from './contexts';
import type { AppContext as AppContextType } from './app';
import type { GalleryContextType } from './gallery';
import type { BrowsePagesCached, AnyItem } from '~/resources/browse';
import type { Mode } from './selection';

describe('Context Creation', () => {
  test('AppContext should be defined', () => {
    expect(AppContext).toBeDefined();
    expect(AppContext.id).toBeDefined();
    expect(typeof AppContext.id).toBe('symbol');
  });

  test('GalleryContext should be defined', () => {
    expect(GalleryContext).toBeDefined();
    expect(GalleryContext.id).toBeDefined();
    expect(typeof GalleryContext.id).toBe('symbol');
  });

  test('Contexts should have different IDs', () => {
    expect(AppContext.id).not.toBe(GalleryContext.id);
  });
});

describe('Context Usage', () => {
  test('AppContext should work with mock data', () => {
    createRoot((dispose) => {
      const mockAppContext: AppContextType = {
        theme: 'light',
        setTheme: () => {},
        location: {} as any,
        prevRoute: undefined,
        instantDelete: false,
        setInstantDelete: () => {},
        disableAnimations: false,
        setDisableAnimations: () => {},
        disableNonsense: false,
        setDisableNonsense: () => {},
        jtp2: {
          modelPath: '',
          tagsPath: '',
          threshold: 0.35,
          forceCpu: false,
          setModelPath: () => {},
          setTagsPath: () => {},
          setThreshold: () => {},
          setForceCpu: () => {}
        },
        wdv3: {
          modelName: 'vit',
          genThreshold: 0.35,
          charThreshold: 0.35,
          forceCpu: false,
          setModelName: () => {},
          setGenThreshold: () => {},
          setCharThreshold: () => {},
          setForceCpu: () => {}
        },
        wdv3ModelName: 'vit',
        wdv3GenThreshold: 0.35,
        wdv3CharThreshold: 0.35,
        setWdv3ModelName: () => {},
        setWdv3GenThreshold: () => {},
        setWdv3CharThreshold: () => {},
        enableZoom: false,
        enableMinimap: false,
        setEnableZoom: () => {},
        setEnableMinimap: () => {},
        locale: 'en',
        setLocale: () => {},
        t: (key: string) => key,
        preserveLatents: false,
        setPreserveLatents: () => {},
        preserveTxt: false,
        setPreserveTxt: () => {},
        notify: () => {},
        thumbnailSize: 250,
        setThumbnailSize: () => {},
        createNotification: () => {},
        alwaysShowCaptionEditor: false,
        setAlwaysShowCaptionEditor: () => {}
      };

      const provider = AppContext.Provider({
        value: mockAppContext,
        children: (() => null) as unknown as JSX.Element
      });

      expect(provider).toBeDefined();
      dispose();
    });
  });

  test('GalleryContext should work with mock data', () => {
    createRoot((dispose) => {
      const mockBrowsePages: BrowsePagesCached = {
        items: [],
        pages: {} as Record<number, Map<string, AnyItem>>,
        path: '',
        mtime: new Date().toISOString(),
        total_pages: 0,
        total_folders: 0,
        total_images: 0,
        setters: {
          setPath: () => undefined,
          setTotalPages: () => undefined,
          setTotalFolders: () => undefined,
          setTotalImages: () => undefined
        }
      };

      const mockGalleryContext: GalleryContextType = {
        setViewMode: (mode: "grid" | "list") => {},
        setSort: (sort: "name" | "date" | "size") => {},
        setSearch: (search: string) => {},
        setPage: async (page: number) => {},
        select: (idx: number | "last" | null) => false,
        selectedImage: null,
        selectNext: () => false,
        selectPrev: () => false,
        selectDown: () => false,
        selectUp: () => false,
        selectPageUp: () => false,
        selectPageDown: () => false,
        getPreviewSize: () => ({ width: 0, height: 0 }),
        getThumbnailSize: () => ({ width: 250, height: 250 }),
        windowSize: { width: 1920, height: 1080 },
        params: { path: '' },
        data: createResource(() => mockBrowsePages)[0],
        saveCaption: action(async () => new Error()),
        deleteImage: action(async () => [] as AnyItem[]),
        deleteCaption: action(async () => ({ success: true })),
        selection: {
          select: (idx: number | "last" | null) => false,
          selectedImage: null,
          selectPrev: () => false,
          selectNext: () => false,
          selectDown: () => false,
          selectUp: () => false,
          selectPageUp: () => false,
          selectPageDown: () => false,
          selected: null,
          setMode: (mode: Mode) => true,
          multiSelected: new Set<number>(),
          editedImage: null,
          toggleEdit: () => false,
          mode: 'view' as Mode,
          edit: () => false,
          setColumns: () => {},
          toggleMultiSelect: () => false,
          selectAll: () => false,
          clearMultiSelect: () => {},
          multiFolderSelected: new Set<number>(),
          toggleFolderMultiSelect: () => false,
          selectAllFolders: () => false,
          clearFolderMultiSelect: () => {}
        },
        getEditedImage: () => undefined,
        clearImageCache: () => {},
        getAllKnownFolders: async () => [],
        generateTags: action(async () => undefined),
        refetch: () => null,
        invalidate: () => {},
        selectAll: () => {},
        editedImage: null,
        toggleEdit: () => false,
        mode: 'view' as Mode,
        edit: () => false,
        toggleMultiSelect: () => false,
        clearMultiSelect: () => {},
        multiFolderSelected: new Set<number>(),
        toggleFolderMultiSelect: () => false,
        selectAllFolders: () => false,
        clearFolderMultiSelect: () => {},
        setMode: (mode: Mode) => true,
        selected: null,
        setColumns: (columns: number | null) => {},
        multiSelected: new Set<number>(),
        refetchGallery: () => {},
        setData: () => undefined,
        invalidateFolderCache: () => {}
      };

      const provider = GalleryContext.Provider({
        value: mockGalleryContext,
        children: (() => null) as unknown as JSX.Element
      });

      expect(provider).toBeDefined();
      dispose();
    });
  });
}); 