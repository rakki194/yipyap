import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Settings } from './Settings';
import { AppProvider } from '~/contexts/app';
import { AppContext } from '~/contexts/contexts';
import { GalleryProvider } from '~/contexts/GalleryContext';
import { Router } from '@solidjs/router';
import { Theme } from '~/contexts/theme';
import { Locale } from '~/i18n';

// Mock the icons
vi.mock('~/icons', () => ({
  default: () => '<svg data-testid="mock-icon" />',
}));

// Mock app context with translation function and required settings
const mockAppContext = {
  t: (key: string) => {
    const translations: Record<string, string> = {
      'settings.title': 'Settings',
      'shortcuts.title': 'Keyboard Shortcuts',
      'shortcuts.galleryNavigation': 'Gallery Navigation',
      'shortcuts.tagNavigation': 'Tag Navigation',
      'shortcuts.other': 'Other',
      'shortcuts.quickFolderSwitch': 'Quick Folder Switch',
      'shortcuts.aboveImage': 'Above Image',
      'shortcuts.belowImage': 'Below Image',
      'shortcuts.previousImage': 'Previous Image',
      'shortcuts.nextImage': 'Next Image',
      'shortcuts.togglePreview': 'Toggle Preview',
      'shortcuts.previousTag': 'Previous Tag',
      'shortcuts.nextTag': 'Next Tag',
      'shortcuts.switchTagBubble': 'Switch Tag Bubble',
      'shortcuts.switchTagInput': 'Switch Tag Input',
      'shortcuts.cycleCaptions': 'Cycle Captions',
      'shortcuts.firstTagRow': 'First Tag Row',
      'shortcuts.lastTagRow': 'Last Tag Row',
      'shortcuts.removeTag': 'Remove Tag',
      'shortcuts.closePreview': 'Close Preview',
      'shortcuts.deleteImage': 'Delete Image',
      'shortcuts.doubleShift': 'Double Shift',
      'shortcuts.shift': 'Shift',
      'shortcuts.del': 'Del',
      'shortcuts.esc': 'Esc',
      'settings.appearance': 'Appearance',
      'settings.gallery': 'Gallery',
      'settings.language': 'Language',
      'settings.modelSettings': 'Model Settings',
      'settings.experimentalFeatures': 'Experimental Features',
      'settings.disableAnimations': 'Disable Animations',
      'settings.enableZoom': 'Enable Zoom',
      'settings.enableMinimap': 'Enable Minimap',
      'settings.thumbnailSize': 'Thumbnail Size',
      'settings.thumbnailSizeDescription': 'Change the size of thumbnails in the gallery',
      'common.theme': 'Theme',
      'common.close': 'Close',
      'common.language': 'Language',
      'settings.theme.dark': 'Dark Theme',
      'settings.theme.light': 'Light Theme',
      'settings.theme.gray': 'Gray Theme',
      'settings.theme.banana': 'Banana Theme',
      'settings.theme.strawberry': 'Strawberry Theme',
      'settings.theme.peanut': 'Peanut Theme',
      'settings.theme.christmas': 'Christmas Theme',
      'settings.theme.halloween': 'Halloween Theme',
      'settings.disableNonsense': 'Disable Nonsense',
      'settings.instantDelete': 'Instant Delete',
      'settings.preserveLatents': 'Preserve Latents',
      'settings.preserveLatentsTooltip': 'Preserve latents tooltip',
      'settings.preserveTxt': 'Preserve TXT',
      'settings.preserveTxtTooltip': 'Preserve TXT tooltip',
      'settings.alwaysShowCaptionEditor': 'Always Show Caption Editor',
      'settings.jtp2ModelPath': 'JTP2 Model Path',
      'settings.jtp2TagsPath': 'JTP2 Tags Path',
      'settings.downloadModel': 'Download Model',
      'settings.downloadTags': 'Download Tags'
    };
    return translations[key] || key;
  },
  theme: 'light' as Theme,
  setTheme: vi.fn((theme: Theme) => {
    mockAppContext.theme = theme;
  }),
  disableAnimations: false,
  setDisableAnimations: vi.fn(),
  disableNonsense: false,
  setDisableNonsense: vi.fn(),
  enableZoom: false,
  setEnableZoom: vi.fn(),
  enableMinimap: false,
  setEnableMinimap: vi.fn(),
  thumbnailSize: 200,
  setThumbnailSize: vi.fn(),
  prevRoute: undefined,
  location: { 
    pathname: '/',
    search: '',
    hash: '',
    query: {},
    state: null,
    key: ''
  },
  instantDelete: false,
  setInstantDelete: vi.fn(),
  jtp2ModelPath: '',
  jtp2TagsPath: '',
  setJtp2ModelPath: vi.fn(),
  setJtp2TagsPath: vi.fn(),
  locale: 'en' as Locale,
  setLocale: vi.fn(),
  preserveLatents: false,
  setPreserveLatents: vi.fn(),
  preserveTxt: false,
  setPreserveTxt: vi.fn(),
  alwaysShowCaptionEditor: false,
  setAlwaysShowCaptionEditor: vi.fn(),
  notify: vi.fn(),
  createNotification: vi.fn()
};

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
    Route: (props: any) => props.children,
    Router: (props: any) => <div>{props.children}</div>
  };
});

// Mock browse API
vi.mock('~/resources/browse', () => ({
  fetchPage: () => Promise.resolve({ items: [], total: 0 }),
  createGalleryResourceCached: () => [
    () => ({ items: [], total: 0, total_images: 0 }),
    {
      refetch: () => Promise.resolve(),
      mutate: () => Promise.resolve(),
    }
  ],
  createGalleryResource: () => [
    () => ({ items: [], total: 0, total_images: 0 }),
    {
      refetch: () => Promise.resolve(),
      mutate: () => Promise.resolve(),
    }
  ],
}));

describe('Settings Component', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const renderSettings = () => {
    return render(() => (
      <Router>
        <AppContext.Provider value={mockAppContext}>
          <GalleryProvider>
            <Settings onClose={mockOnClose} />
          </GalleryProvider>
        </AppContext.Provider>
      </Router>
    ));
  };

  it('renders the settings panel with title', () => {
    renderSettings();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  it('closes settings when Escape key is pressed', () => {
    renderSettings();
    fireEvent.keyDown(screen.getByRole('heading', { name: 'Settings' }), {
      key: 'Escape',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('toggles help section when help button is clicked', async () => {
    renderSettings();
    const helpButton = screen.getByTitle('Keyboard Shortcuts');
    
    // Click to show help
    fireEvent.click(helpButton);
    
    // Wait for the closing animation to complete
    vi.advanceTimersByTime(300);
    
    // Now we should see the help content
    expect(screen.getByRole('heading', { name: 'Gallery Navigation', level: 4 })).toBeInTheDocument();
    
    // Click to hide help
    fireEvent.click(helpButton);
    
    // Wait for the closing animation
    vi.advanceTimersByTime(300);
    
    // Help content should be gone
    expect(screen.queryByRole('heading', { name: 'Gallery Navigation' })).not.toBeInTheDocument();
  });

  it('changes theme when theme button is clicked', () => {
    renderSettings();
    const darkThemeButton = screen.getByTitle('Dark Theme');
    fireEvent.click(darkThemeButton);
    expect(mockAppContext.setTheme).toHaveBeenCalledWith('dark');
  });

  it('updates language when selection changes', () => {
    renderSettings();
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'ja' } });
    expect(languageSelect).toHaveValue('ja');
  });

  it('toggles animations when checkbox is clicked', () => {
    renderSettings();
    const animationsCheckbox = screen.getByLabelText('Disable Animations');
    fireEvent.click(animationsCheckbox);
    expect(animationsCheckbox).toBeChecked();
  });

  it('updates thumbnail size when slider is moved', () => {
    renderSettings();
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '200' } });
    
    // Look for the span containing the size value
    const sizeValue = screen.getByTestId('thumbnail-size-value');
    expect(sizeValue.textContent).toMatch(/200\s*px/);
  });

  it('updates model paths when input values change', () => {
    renderSettings();
    const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
    const newPath = '/new/path/to/model.safetensors';
    fireEvent.change(modelPathInput, { target: { value: newPath } });
    expect(modelPathInput).toHaveValue(newPath);
  });

  it('shows warning text only when nonsense is not disabled', () => {
    renderSettings();
    // First check that the warning is visible
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    
    // Check that the warning text matches the expected format
    expect(screen.getByText('⚠️警告！これはあなたをビーバーに変えてしまいます！')).toBeInTheDocument();
  });

  it('toggles experimental features correctly', () => {
    renderSettings();
    const zoomCheckbox = screen.getByLabelText('Enable Zoom');
    const minimapCheckbox = screen.getByLabelText('Enable Minimap');

    fireEvent.click(zoomCheckbox);
    fireEvent.click(minimapCheckbox);

    expect(zoomCheckbox).toBeChecked();
    expect(minimapCheckbox).toBeChecked();
  });
}); 