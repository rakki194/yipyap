import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { ImageModal, EmptyCaptionState, DeleteButton } from '../ImageModal';
import type { ImageInfo } from '~/types';
import type { Component } from 'solid-js';
import userEvent from '@testing-library/user-event';
import { Router } from '@solidjs/router';
import { GalleryContext } from '~/contexts/contexts';
import { createResource } from 'solid-js';
import type { AnyItem } from '~/resources/browse';
import { Action } from '@solidjs/router';
import type { Mode } from '~/contexts/selection';
import type { ImageItem } from '~/resources/browse';
import type { SaveCaption } from '~/resources/browse';
import { ThemeProvider } from '~/theme/ThemeProvider';
import { AppProvider } from '~/contexts/app';
import type { Theme } from '~/contexts/theme';
import { Locale } from '~/i18n';

// Mock the necessary dependencies
vi.mock('~/icons', () => ({
  default: () => '<svg>Mocked Icon</svg>',
  captionIconsMap: {
    txt: 'text',
    tags: 'tag',
    caption: 'caption',
    wd: 'sparkle'
  }
}));

// Mock data
const mockImageInfo = {
  id: 1,
  name: 'test-image.jpg',
  file_name: 'test-image.jpg',
  path: '/path/to/image',
  type: 'image' as const,
  idx: 0,
  width: 800,
  height: 600,
  size: 1024,
  mime: 'image/jpeg',
  mtime: new Date().toISOString(),
  download_path: '/path/to/test-image.jpg',
  preview_path: '/path/to/preview.jpg',
  thumbnail_path: '/path/to/thumbnail.jpg',
  aspect_ratio: '4:3',
  preview_img: {
    img: new Image(),
    isLoaded: () => true,
    unload: () => {},
    setPriority: () => {},
    loaded: true
  },
  thumbnail_img: {
    img: new Image(),
    isLoaded: () => true,
    unload: () => {},
    setPriority: () => {},
    loaded: true
  },
  captions: [],
  call: () => undefined
};

// Cast it after creation
const mockImageInfoWithTypes = mockImageInfo as unknown as ImageInfo & ImageItem;

const mockCaptions: [string, string][] = [
  ['txt', 'Test caption'],
  ['tags', 'tag1, tag2, tag3']
];

// First, create properly typed mock functions
const mockActions = {
  saveCaption: vi.fn().mockImplementation(async (caption: SaveCaption) => ({ success: true })),
  generateTags: vi.fn().mockImplementation(async (model: string) => ({ success: true })),
  deleteImageAction: vi.fn().mockImplementation(async (idx: number) => ({ success: true })),
  deleteCaption: vi.fn().mockImplementation(async (type: string) => ({ success: true })),
  onClose: vi.fn()
};

// Create a mock gallery context that includes both the actions and their implementations
const mockGalleryContext = {
  windowSize: { width: 1920, height: 1080 },
  selection: {
    multiSelected: new Set<number>(),
    multiFolderSelected: new Set<number>(),
    clearMultiSelect: vi.fn(),
    clearFolderMultiSelect: vi.fn(),
    select: vi.fn(),
    selectedImage: mockImageInfoWithTypes,
    selectPrev: vi.fn(),
    selectNext: vi.fn(),
    selectDown: vi.fn(),
    selectUp: vi.fn(),
    selectPageUp: vi.fn(),
    selectPageDown: vi.fn(),
    selected: null,
    setMode: vi.fn(),
    multiSelectedCount: 0,
    editedImage: null,
    toggleEdit: vi.fn(),
    mode: 'view' as Mode,
    edit: vi.fn(),
    setColumns: vi.fn(),
    toggleMultiSelect: vi.fn(),
    selectAll: vi.fn(),
    toggleFolderMultiSelect: vi.fn(),
    selectAllFolders: vi.fn()
  },
  saveCaption: {
    url: '/api/save-caption',
    with: mockActions.saveCaption,
    pending: false,
    error: null,
    run: mockActions.saveCaption
  } as unknown as Action<[SaveCaption], Response | Error, [SaveCaption]>,
  generateTags: {
    url: '/api/generate-tags',
    with: mockActions.generateTags,
    pending: false,
    error: null,
    run: mockActions.generateTags
  } as unknown as Action<[string], unknown, [string]>,
  deleteImage: {
    url: '/api/delete-image',
    with: mockActions.deleteImageAction,
    pending: false,
    error: null,
    run: mockActions.deleteImageAction
  } as unknown as Action<[number], AnyItem[] | Error, [number]>,
  deleteCaption: {
    url: '/api/delete-caption',
    with: mockActions.deleteCaption,
    pending: false,
    error: null,
    run: mockActions.deleteCaption
  } as unknown as Action<[string], Error | { success: boolean }, [string]>,
  setViewMode: vi.fn(),
  setSort: vi.fn(),
  setSearch: vi.fn(),
  setPage: vi.fn().mockResolvedValue(undefined),
  viewMode: 'grid' as const,
  sort: 'name' as const,
  search: '',
  page: 1,
  loading: false,
  error: null,
  setError: vi.fn(),
  setLoading: vi.fn(),
  invalidate: vi.fn(),
  refetch: vi.fn(),
  data: createResource(() => ({
    items: [mockImageInfoWithTypes as unknown as AnyItem],
    path: '',
    total: 1,
    total_images: 1,
    mtime: new Date().toISOString(),
    total_pages: 1,
    total_folders: 0,
    pages: {
      0: new Map([['test-image.jpg', mockImageInfoWithTypes as unknown as AnyItem]])
    },
    setters: {
      setPage: vi.fn(),
      setSort: vi.fn(),
      setSearch: vi.fn(),
      setViewMode: vi.fn()
    }
  }))[0],
  selected: 0,
  selectedImage: mockImageInfoWithTypes,
  getPreviewSize: () => ({ width: 800, height: 600 }),
  getThumbnailSize: () => ({ width: 200, height: 150 }),
  params: { path: '' },
  getEditedImage: vi.fn(),
  clearImageCache: vi.fn(),
  getAllKnownFolders: vi.fn(),
  select: vi.fn(),
  selectedIndex: 0,
  setSelectedIndex: vi.fn(),
  clearSelection: vi.fn(),
  toggleSelection: vi.fn(),
  isSelected: vi.fn(),
  selectAll: vi.fn(),
  deselectAll: vi.fn(),
  toggleMultiSelect: vi.fn(),
  isMultiSelected: vi.fn(),
  multiSelectedCount: 0,
  clearMultiSelect: vi.fn(),
  toggleFolderMultiSelect: vi.fn(),
  isFolderMultiSelected: vi.fn(),
  folderMultiSelectedCount: 0,
  clearFolderMultiSelect: vi.fn(),
  setCaption: vi.fn(),
  setTags: vi.fn(),
  setWdTags: vi.fn(),
  setTxt: vi.fn(),
  getImageInfo: vi.fn(),
  getImagePath: vi.fn(),
  getImageUrl: vi.fn(),
  getImagePreviewUrl: vi.fn(),
  getImageThumbnailUrl: vi.fn(),
  getImageDownloadUrl: vi.fn(),
  getImageCaptionUrl: vi.fn(),
  getImageTagsUrl: vi.fn(),
  selectPrev: () => true,
  selectNext: () => true,
  selectDown: () => true,
  selectUp: () => true,
  selectPageUp: () => true,
  selectPageDown: () => true,
  editedImage: null,
  mode: 'view' as const,
  multiSelected: new Set<number>(),
  multiFolderSelected: new Set<number>(),
  toggleEdit: vi.fn(),
  edit: vi.fn(),
  setMode: vi.fn(),
  setColumns: vi.fn(),
  selectAllFolders: vi.fn(),
  actions: {
    save: mockActions.saveCaption,
    generateTags: mockActions.generateTags,
    deleteImageAction: mockActions.deleteImageAction,
    invalidate: vi.fn(),
    refetch: vi.fn()
  }
};

const mockAppContext = {
  t: (key: string) => key,
  instantDelete: false,
  preserveLatents: false,
  preserveTxt: false,
  prevRoute: undefined,
  location: { pathname: '/', search: '', hash: '', query: {}, state: null, key: '' },
  theme: 'light' as Theme,
  setTheme: vi.fn(),
  disableAnimations: false,
  setDisableAnimations: vi.fn(),
  disableNonsense: false,
  setDisableNonsense: vi.fn(),
  setdisableNonsense: vi.fn(),
  enableZoom: false,
  setEnableZoom: vi.fn(),
  enableMinimap: false,
  setEnableMinimap: vi.fn(),
  thumbnailSize: 200,
  setThumbnailSize: vi.fn(),
  jtp2ModelPath: '',
  jtp2TagsPath: '',
  setJtp2ModelPath: vi.fn(),
  setJtp2TagsPath: vi.fn(),
  locale: 'en' as Locale,
  setLocale: vi.fn(),
  setPreserveLatents: vi.fn(),
  setPreserveTxt: vi.fn(),
  notify: vi.fn(),
  createNotification: vi.fn(),
  setInstantDelete: vi.fn(),
};

// Update the Wrapper component with proper types
interface WrapperProps {
  children: any;
}

// Mock router with proper location context
vi.mock('@solidjs/router', async () => {
  const actual = await vi.importActual('@solidjs/router');
  return {
    ...actual,
    useLocation: () => ({ pathname: '/', search: '', hash: '', query: {}, state: null, key: '' }),
    useSearchParams: () => [{ path: '' }, () => {}],
    useNavigate: () => vi.fn(),
    useParams: () => ({}),
    useRouter: () => ({
      navigate: vi.fn(),
      location: { pathname: '/', search: '', hash: '', query: {}, state: null, key: '' }
    }),
    useAction: () => [null, vi.fn()],
    useSubmission: () => ({
      input: [{ type: 'txt', caption: '' }],
      result: null,
      pending: false
    }),
    Route: (props: any) => props.children,
    Router: (props: any) => <div>{props.children}</div>
  };
});

// Mock fetch for streaming JSON
beforeEach(() => {
  vi.spyOn(global, 'fetch').mockImplementation(() => 
    Promise.resolve({
      ok: true,
      body: {
        getReader: () => ({
          read: () => Promise.resolve({ done: true, value: undefined })
        })
      }
    } as any)
  );

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  };
});

afterEach(() => {
  vi.restoreAllMocks();
});

// Create a mock GalleryContext provider
const MockGalleryProvider: Component<{ children: any }> = (props) => {
  return (
    <GalleryContext.Provider value={mockGalleryContext}>
      {props.children}
    </GalleryContext.Provider>
  );
};

// Update the Wrapper component
const Wrapper: Component<WrapperProps> = (props) => (
  <Router>
    <ThemeProvider>
      <AppProvider>
        <GalleryContext.Provider value={mockGalleryContext}>
          {props.children}
        </GalleryContext.Provider>
      </AppProvider>
    </ThemeProvider>
  </Router>
);

describe('ImageModal', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let generateTags: ReturnType<typeof vi.fn>;
  let saveCaption: ReturnType<typeof vi.fn>;
  let deleteImageAction: ReturnType<typeof vi.fn>;
  let deleteCaption: ReturnType<typeof vi.fn>;
  let testGalleryContext: typeof mockGalleryContext;

  beforeEach(() => {
    vi.clearAllMocks();
    user = userEvent.setup();
    generateTags = vi.fn().mockResolvedValue({ success: true });
    saveCaption = vi.fn().mockResolvedValue({ success: true });
    deleteImageAction = vi.fn().mockResolvedValue({ success: true });
    deleteCaption = vi.fn().mockResolvedValue({ success: true });

    testGalleryContext = {
      ...mockGalleryContext,
      saveCaption: {
        url: '/api/save-caption',
        with: saveCaption,
        pending: false,
        error: null,
        run: saveCaption
      } as unknown as Action<[SaveCaption], Response | Error, [SaveCaption]>,
      generateTags: {
        url: '/api/generate-tags',
        with: generateTags,
        pending: false,
        error: null,
        run: generateTags
      } as unknown as Action<[string], unknown, [string]>,
      deleteImage: {
        url: '/api/delete-image',
        with: deleteImageAction,
        pending: false,
        error: null,
        run: deleteImageAction
      } as unknown as Action<[number], AnyItem[] | Error, [number]>,
      deleteCaption: {
        url: '/api/delete-caption',
        with: deleteCaption,
        pending: false,
        error: null,
        run: deleteCaption
      } as unknown as Action<[string], Error | { success: boolean }, [string]>
    };
  });

  const renderImageModal = () => {
    return render(() => (
      <GalleryContext.Provider value={mockGalleryContext}>
        <ImageModal
          imageInfo={mockImageInfoWithTypes}
          captions={mockCaptions}
          onClose={mockActions.onClose}
          generateTags={mockActions.generateTags}
          saveCaption={mockActions.saveCaption}
          deleteCaption={mockActions.deleteCaption}
          deleteImageAction={mockActions.deleteImageAction}
        />
      </GalleryContext.Provider>
    ), { wrapper: Wrapper });
  };

  it('renders with basic props', () => {
    render(() => (
      <ImageModal
        imageInfo={mockImageInfoWithTypes}
        captions={mockCaptions}
        onClose={vi.fn()}
        generateTags={generateTags}
        saveCaption={saveCaption}
        deleteCaption={deleteCaption}
        deleteImageAction={deleteImageAction}
      />
    ), { wrapper: Wrapper });

    const nameElement = screen.getByRole('heading', { name: mockImageInfoWithTypes.name });
    expect(nameElement).toBeInTheDocument();
    
    const textArea = screen.getByPlaceholderText('gallery.addCaption');
    expect(textArea).toBeInTheDocument();
  });

  it('handles caption creation', async () => {
    const user = userEvent.setup();
    
    render(() => (
      <GalleryContext.Provider value={mockGalleryContext}>
        <ImageModal
          imageInfo={mockImageInfoWithTypes}
          captions={mockCaptions}
          onClose={mockActions.onClose}
          generateTags={mockActions.generateTags}
          saveCaption={mockActions.saveCaption}
          deleteCaption={mockActions.deleteCaption}
          deleteImageAction={mockActions.deleteImageAction}
        />
      </GalleryContext.Provider>
    ), { wrapper: Wrapper });

    const textarea = screen.getByPlaceholderText('gallery.addCaption');
    await user.type(textarea, 'New caption');

    const createButton = screen.getByText('gallery.createCaption');
    await user.click(createButton);

    const captionTypeButton = await screen.findByText('gallery.captionTypes.caption');
    await user.click(captionTypeButton);

    await waitFor(() => {
      expect(mockActions.saveCaption).toHaveBeenCalledWith({
        type: 'caption',
        caption: 'New caption'
      });
    });
  });

  it('handles image deletion with confirmation', async () => {
    const user = userEvent.setup();
    global.confirm = vi.fn(() => true);
    render(() => (
      <ImageModal
        imageInfo={mockImageInfoWithTypes}
        captions={mockCaptions}
        onClose={mockActions.onClose}
        generateTags={mockActions.generateTags}
        saveCaption={mockActions.saveCaption}
        deleteCaption={mockActions.deleteCaption}
        deleteImageAction={mockActions.deleteImageAction}
      />
    ), { wrapper: Wrapper });

    const deleteButton = screen.getByTitle('Hold to delete image');
    
    // Simulate holding the button
    await user.pointer([
      { keys: '[MouseLeft>]', target: deleteButton, coords: { x: 0, y: 0 } },
      { target: deleteButton, coords: { x: 0, y: 0 } },
      { keys: '[/MouseLeft]', target: deleteButton, coords: { x: 0, y: 0 } }
    ]);

    // Add a manual delay to simulate holding
    await new Promise(resolve => setTimeout(resolve, 1000));

    await waitFor(() => {
      expect(mockActions.deleteImageAction).toHaveBeenCalledWith(0);
    });
  });

  it('handles metadata toggle', async () => {
    const user = userEvent.setup();
    
    render(() => (
      <ImageModal
        imageInfo={mockImageInfoWithTypes}
        captions={mockCaptions}
        onClose={mockActions.onClose}
        generateTags={mockActions.generateTags}
        saveCaption={mockActions.saveCaption}
        deleteCaption={mockActions.deleteCaption}
        deleteImageAction={mockActions.deleteImageAction}
      />
    ), { wrapper: Wrapper });

    const metadataButton = screen.getByTitle('Show Metadata');
    await user.click(metadataButton);

    const nameElement = screen.getByText(mockImageInfoWithTypes.name);
    expect(nameElement).toBeInTheDocument();
  });

  it('handles tag generation', async () => {
    const user = userEvent.setup();
    
    render(() => (
      <GalleryContext.Provider value={mockGalleryContext}>
        <ImageModal
          imageInfo={mockImageInfoWithTypes}
          captions={mockCaptions}
          onClose={mockActions.onClose}
          generateTags={mockActions.generateTags}
          saveCaption={mockActions.saveCaption}
          deleteCaption={mockActions.deleteCaption}
          deleteImageAction={mockActions.deleteImageAction}
        />
      </GalleryContext.Provider>
    ), { wrapper: Wrapper });

    // Click the generate tags button to open dropdown
    const generateButton = screen.getByTitle('Generate Tags');
    await user.click(generateButton);

    // Find and click the JTP2 option
    const jtp2Button = await screen.findByText('Generate with JTP2');
    await user.click(jtp2Button);

    await waitFor(() => {
      expect(mockActions.generateTags).toHaveBeenCalledWith('jtp2');
    });
  });

  it('handles keyboard shortcuts', async () => {
    const onClose = vi.fn();
    
    render(() => (
      <ImageModal
        imageInfo={mockImageInfoWithTypes}
        captions={mockCaptions}
        onClose={onClose}
        generateTags={mockActions.generateTags}
        saveCaption={mockActions.saveCaption}
        deleteCaption={mockActions.deleteCaption}
        deleteImageAction={mockActions.deleteImageAction}
      />
    ), { wrapper: Wrapper });

    fireEvent.keyDown(window, { key: 'Shift' });
    await new Promise(resolve => setTimeout(resolve, 100));
    fireEvent.keyDown(window, { key: 'Shift' });
  });
});

// Test EmptyCaptionState component
describe('EmptyCaptionState', () => {
  it('renders empty state correctly', () => {
    const onCreateCaption = vi.fn();
    
    render(() => (
      <EmptyCaptionState onCreateCaption={onCreateCaption} />
    ), { wrapper: Wrapper });

    expect(screen.getByText('gallery.noCaptionFiles')).toBeInTheDocument();
    expect(screen.getByText('gallery.createCaption')).toBeInTheDocument();
  });
});

// Test DeleteButton component
describe('DeleteButton', () => {
  it('handles multi-selection delete', async () => {
    const user = userEvent.setup();
    mockGalleryContext.selection.multiSelected = new Set([0, 1]);
    global.confirm = vi.fn(() => true);

    render(() => (
      <DeleteButton imageInfo={mockImageInfoWithTypes} />
    ), { wrapper: Wrapper });

    const deleteButton = screen.getByRole('button');
    await user.click(deleteButton);

    expect(global.confirm).toHaveBeenCalled();
    expect(mockGalleryContext.invalidate).toHaveBeenCalled();
    expect(mockGalleryContext.refetch).toHaveBeenCalled();
  });
}); 