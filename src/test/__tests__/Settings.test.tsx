import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library';
import { Settings } from '../../components/Settings/Settings';
import { AppProvider } from '~/contexts/app';
import { AppContext } from '~/contexts/contexts';
import { GalleryProvider } from '~/contexts/GalleryContext';
import { Router } from '@solidjs/router';
import { Theme } from '~/contexts/theme';
import { Locale } from '~/i18n';
import type { AppContext as AppContextType } from "~/contexts/app";
import type { Location } from '@solidjs/router';

// Mock the icons
vi.mock('~/icons', () => ({
  default: () => '<svg data-testid="mock-icon" />',
}));

// Mock translations for testing
const mockTranslations: Record<string, string> = {
  'settings.title': 'Settings',
  'settings.modelSettings': 'Model Settings',
  'shortcuts.title': 'Keyboard Shortcuts',
  'settings.experimentalFeatures': 'Experimental Features',
  'settings.disableAnimations': 'Disable Animations',
  'settings.theme.dark': 'Dark Theme',
  'settings.enableZoom': 'Enable Zoom',
  'settings.enableMinimap': 'Enable Minimap',
  'settings.gallery.navigation': 'Gallery Navigation',
  'shortcuts.galleryNavigation': 'Gallery Navigation',
  'shortcuts.tagNavigation': 'Tag Navigation',
  'shortcuts.other': 'Other',
  'settings.jtp2ModelPath': 'JTP2 Model Path',
  'settings.jtp2TagsPath': 'JTP2 Tags Path',
  'settings.jtp2Threshold': 'JTP2 Threshold',
  'settings.jtp2ForceCpu': 'Force CPU (JTP2)',
  'settings.wdv3ModelName': 'WDv3 Model',
  'settings.wdv3GenThreshold': 'General Threshold',
  'settings.wdv3CharThreshold': 'Character Threshold',
  'settings.wdv3ForceCpu': 'Force CPU (WDv3)',
  'settings.preserveLatents': 'Preserve Latents',
  'settings.preserveTxt': 'Preserve TXT',
  'settings.instantDelete': 'Instant Delete'
};

// Mock app context with translation function and required settings
const mockAppContext = {
  t: (key: string) => mockTranslations[key] || key,
  theme: 'dark' as Theme,
  setTheme: vi.fn(),
  disableAnimations: false,
  setDisableAnimations: vi.fn(),
  disableNonsense: false,
  setDisableNonsense: vi.fn(),
  instantDelete: false,
  setInstantDelete: vi.fn(),
  preserveLatents: false,
  setPreserveLatents: vi.fn(),
  preserveTxt: false,
  setPreserveTxt: vi.fn(),
  thumbnailSize: 200,
  setThumbnailSize: vi.fn(),
  locale: 'en' as Locale,
  setLocale: vi.fn(),
  enableZoom: false,
  enableMinimap: false,
  setEnableZoom: vi.fn(),
  setEnableMinimap: vi.fn(),
  createNotification: vi.fn(),
  jtp2: {
    modelPath: '',
    tagsPath: '',
    threshold: 0.35,
    forceCpu: false,
    setModelPath: vi.fn(),
    setTagsPath: vi.fn(),
    setThreshold: vi.fn(),
    setForceCpu: vi.fn()
  },
  wdv3: {
    modelName: 'vit',
    genThreshold: 0.35,
    charThreshold: 0.35,
    forceCpu: false,
    setModelName: vi.fn(),
    setGenThreshold: vi.fn(),
    setCharThreshold: vi.fn(),
    setForceCpu: vi.fn()
  },
  wdv3ModelName: 'vit',
  wdv3GenThreshold: 0.35,
  wdv3CharThreshold: 0.35,
  setWdv3ModelName: vi.fn(),
  setWdv3GenThreshold: vi.fn(),
  setWdv3CharThreshold: vi.fn(),
  prevRoute: undefined,
  location: { pathname: '/', search: '', hash: '', query: {}, state: null, key: '' } as Location,
  alwaysShowCaptionEditor: false,
  setAlwaysShowCaptionEditor: vi.fn(),
  notify: vi.fn()
} satisfies AppContextType;

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
    cleanup();
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
    const helpButton = screen.getByRole('button', { name: 'Keyboard Shortcuts' });
    
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
    const darkThemeButton = screen.getByRole('button', { name: 'Dark Theme' });
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
    const animationsCheckbox = screen.getByRole('checkbox', { name: 'Disable Animations' });
    fireEvent.click(animationsCheckbox);
    expect(animationsCheckbox).toBeChecked();
  });

  it('updates thumbnail size when slider is moved', () => {
    // Mock getBoundingClientRect
    const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 400,
      height: 20,
      top: 0,
      left: 0,
      bottom: 0,
      right: 400,
      x: 0,
      y: 0,
      toJSON: () => {}
    }));

    renderSettings();
    const slider = screen.getByRole('slider');
    
    // Calculate the x position for value 200 (middle of the slider)
    // The slider goes from 100 to 500, so 200 is 25% of the way
    const x = 100; // 25% of 400px width
    
    // Simulate mouse events for dragging
    fireEvent.mouseDown(slider, { clientX: x });
    fireEvent.mouseMove(slider, { clientX: x });
    fireEvent.mouseUp(slider);
    
    // Look for the span containing the size value
    const sizeValue = screen.getByTestId('thumbnail-size-value');
    expect(sizeValue.textContent).toMatch(/200\s*px/);

    // Clean up the mock
    getBoundingClientRectMock.mockRestore();
  });

  it('updates model paths when input values change', () => {
    renderSettings();
    
    // Click the model settings button first
    const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
    fireEvent.click(modelSettingsButton);

    // Wait for the transition animation
    vi.advanceTimersByTime(300);

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

  it('toggles experimental features correctly', async () => {
    renderSettings();

    // Find the experimental features button using the translated text
    const experimentalButton = screen.getByRole('button', { name: 'Experimental Features' });
    fireEvent.click(experimentalButton);

    // Wait for the transition animation
    vi.advanceTimersByTime(300);

    // Now we can access the toggles in the experimental section
    const zoomCheckbox = screen.getByRole('checkbox', { name: 'Enable Zoom' });
    const minimapCheckbox = screen.getByRole('checkbox', { name: 'Enable Minimap' });

    // Test zoom toggle
    expect(zoomCheckbox).not.toBeChecked();
    fireEvent.click(zoomCheckbox);
    expect(mockAppContext.setEnableZoom).toHaveBeenCalledWith(true);

    // Test minimap toggle
    expect(minimapCheckbox).not.toBeChecked();
    fireEvent.click(minimapCheckbox);
    expect(mockAppContext.setEnableMinimap).toHaveBeenCalledWith(true);
  });

  describe('JTP2 Settings', () => {
    it('updates JTP2 model path', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
      const newPath = '/new/path/to/model.safetensors';
      fireEvent.change(modelPathInput, { target: { value: newPath } });
      expect(mockAppContext.jtp2.setModelPath).toHaveBeenCalledWith(newPath);
    });

    it('updates JTP2 tags path', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const tagsPathInput = screen.getByPlaceholderText('/path/to/jtp2/tags.json');
      const newPath = '/new/path/to/tags.json';
      fireEvent.change(tagsPathInput, { target: { value: newPath } });
      expect(mockAppContext.jtp2.setTagsPath).toHaveBeenCalledWith(newPath);
    });

    it('updates JTP2 threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      // Mock getBoundingClientRect for the slider
      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        width: 400,
        height: 20,
        top: 0,
        left: 0,
        bottom: 0,
        right: 400,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      const thresholdSlider = screen.getByRole('slider', { name: 'JTP2 Threshold' });
      
      // Calculate x position for value 0.5 (50% of the slider range)
      const x = 200; // 50% of 400px width
      
      // Simulate mouse events for dragging - start at target position
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.jtp2.setThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.jtp2.setThreshold.mock.calls[0][0]).toBeCloseTo(0.5, 5);

      getBoundingClientRectMock.mockRestore();
    });

    it('toggles JTP2 force CPU', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const forceCpuToggle = screen.getByRole('checkbox', { name: 'Force CPU (JTP2)' });
      fireEvent.click(forceCpuToggle);
      expect(mockAppContext.jtp2.setForceCpu).toHaveBeenCalledWith(true);
    });
  });

  describe('WDv3 Settings', () => {
    it('changes WDv3 model', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelSelect = screen.getByRole('combobox', { name: 'WDv3 Model' });
      fireEvent.change(modelSelect, { target: { value: 'swinv2' } });
      expect(mockAppContext.wdv3.setModelName).toHaveBeenCalledWith('swinv2');
    });

    it('updates WDv3 general threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      // Mock getBoundingClientRect for the slider
      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        width: 400,
        height: 20,
        top: 0,
        left: 0,
        bottom: 0,
        right: 400,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      const thresholdSlider = screen.getByRole('slider', { name: 'General Threshold' });
      
      // Calculate x position for value 0.6 (60% of the slider range)
      const x = 240; // 60% of 400px width
      
      // Simulate mouse events for dragging - start at target position
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.wdv3.setGenThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.wdv3.setGenThreshold.mock.calls[0][0]).toBeCloseTo(0.6, 5);

      getBoundingClientRectMock.mockRestore();
    });

    it('updates WDv3 character threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      // Mock getBoundingClientRect for the slider
      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => ({
        width: 400,
        height: 20,
        top: 0,
        left: 0,
        bottom: 0,
        right: 400,
        x: 0,
        y: 0,
        toJSON: () => {}
      }));

      const thresholdSlider = screen.getByRole('slider', { name: 'Character Threshold' });
      
      // Calculate x position for value 0.7 (70% of the slider range)
      const x = 280; // 70% of 400px width
      
      // Simulate mouse events for dragging - start at target position
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.wdv3.setCharThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.wdv3.setCharThreshold.mock.calls[0][0]).toBeCloseTo(0.7, 5);

      getBoundingClientRectMock.mockRestore();
    });

    it('toggles WDv3 force CPU', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const forceCpuToggle = screen.getByRole('checkbox', { name: 'Force CPU (WDv3)' });
      fireEvent.click(forceCpuToggle);
      expect(mockAppContext.wdv3.setForceCpu).toHaveBeenCalledWith(true);
    });
  });

  describe('View Switching', () => {
    it('switches back to main view when clicking active view button', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      
      // Switch to model settings
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByPlaceholderText('/path/to/jtp2/model.safetensors')).toBeInTheDocument();
      
      // Click again to go back to main
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.queryByPlaceholderText('/path/to/jtp2/model.safetensors')).not.toBeInTheDocument();
    });

    it('switches between different views', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      const experimentalButton = screen.getByRole('button', { name: 'Experimental Features' });
      
      // Switch to model settings
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByPlaceholderText('/path/to/jtp2/model.safetensors')).toBeInTheDocument();
      
      // Switch to experimental features
      fireEvent.click(experimentalButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByRole('checkbox', { name: 'Enable Zoom' })).toBeInTheDocument();
    });
  });

  describe('File Preservation Settings', () => {
    it('toggles preserve latents setting', () => {
      renderSettings();
      const preserveLatentsToggle = screen.getByRole('checkbox', { name: 'Preserve Latents' });
      fireEvent.click(preserveLatentsToggle);
      expect(mockAppContext.setPreserveLatents).toHaveBeenCalledWith(true);
    });

    it('toggles preserve txt setting', () => {
      renderSettings();
      const preserveTxtToggle = screen.getByRole('checkbox', { name: 'Preserve TXT' });
      fireEvent.click(preserveTxtToggle);
      expect(mockAppContext.setPreserveTxt).toHaveBeenCalledWith(true);
    });
  });

  describe('Deletion Settings', () => {
    it('toggles instant delete setting', () => {
      renderSettings();
      const instantDeleteToggle = screen.getByRole('checkbox', { name: 'Instant Delete' });
      fireEvent.click(instantDeleteToggle);
      expect(mockAppContext.setInstantDelete).toHaveBeenCalledWith(true);
    });
  });
}); 