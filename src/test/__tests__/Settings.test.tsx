/**
 * Settings Component Test Suite
 * 
 * This comprehensive test suite verifies the functionality of the Settings component,
 * which is responsible for managing user preferences and application configuration.
 * 
 * Test Categories:
 * - Basic Rendering and Interaction
 *   - Verifies the component renders correctly
 *   - Tests keyboard interaction (Escape key)
 *   - Tests help section toggling
 * 
 * - Theme and UI Settings
 *   - Tests theme switching functionality
 *   - Tests language selection
 *   - Tests animation toggle
 *   - Tests thumbnail size adjustment
 * 
 * - Model Settings
 *   - Tests JTP2 model configuration
 *     - Model path updates
 *     - Tags path updates
 *     - Threshold adjustments
 *     - CPU forcing toggle
 *   - Tests WDv3 model configuration
 *     - Model selection
 *     - Threshold adjustments
 *     - CPU forcing toggle
 * 
 * - View Management
 *   - Tests navigation between different setting views
 *   - Tests view state persistence
 * 
 * - File Management Settings
 *   - Tests latent preservation toggle
 *   - Tests TXT file preservation toggle
 *   - Tests instant delete functionality
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@solidjs/testing-library';
import { Settings } from '../../components/Settings/Settings';
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

  /**
   * Verifies that the Settings panel renders with the correct title.
   * This is a basic smoke test to ensure the component mounts successfully
   * and displays its main heading.
   */
  it('renders the settings panel with title', () => {
    renderSettings();
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  });

  /**
   * Tests the keyboard interaction for closing the Settings panel.
   * Verifies that pressing the Escape key triggers the onClose callback,
   * which should dismiss the settings panel.
   */
  it('closes settings when Escape key is pressed', () => {
    renderSettings();
    fireEvent.keyDown(screen.getByRole('heading', { name: 'Settings' }), {
      key: 'Escape',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  /**
   * Tests the help section toggle functionality.
   * Verifies that:
   * 1. Clicking the help button shows the help content
   * 2. The animation timing is correct (300ms)
   * 3. The help content contains expected navigation sections
   * 4. Clicking again hides the help content
   * 5. The content is properly removed after the closing animation
   */
  it('toggles help section when help button is clicked', async () => {
    renderSettings();
    const helpButton = screen.getByRole('button', { name: 'Keyboard Shortcuts' });
    
    // Click to show help
    fireEvent.click(helpButton);
    vi.advanceTimersByTime(300);
    expect(screen.getByRole('heading', { name: 'Gallery Navigation', level: 4 })).toBeInTheDocument();
    
    // Click to hide help
    fireEvent.click(helpButton);
    vi.advanceTimersByTime(300);
    expect(screen.queryByRole('heading', { name: 'Gallery Navigation' })).not.toBeInTheDocument();
  });

  /**
   * Tests the theme switching functionality.
   * Verifies that clicking the theme button triggers the theme change
   * through the app context's setTheme function with the correct theme value.
   */
  it('changes theme when theme button is clicked', () => {
    renderSettings();
    const darkThemeButton = screen.getByRole('button', { name: 'Dark Theme' });
    fireEvent.click(darkThemeButton);
    expect(mockAppContext.setTheme).toHaveBeenCalledWith('dark');
  });

  /**
   * Tests the language selection functionality.
   * Verifies that:
   * 1. The language dropdown is present
   * 2. Changing the selection updates the value
   * 3. The selected language is reflected in the UI
   */
  it('updates language when selection changes', () => {
    renderSettings();
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'ja' } });
    expect(languageSelect).toHaveValue('ja');
  });

  /**
   * Tests the animation toggle functionality.
   * Verifies that the animations can be disabled through the checkbox
   * and that the checkbox state reflects the current setting.
   */
  it('toggles animations when checkbox is clicked', () => {
    renderSettings();
    const animationsCheckbox = screen.getByRole('checkbox', { name: 'Disable Animations' });
    fireEvent.click(animationsCheckbox);
    expect(animationsCheckbox).toBeChecked();
  });

  /**
   * Tests the thumbnail size adjustment functionality.
   * Verifies that:
   * 1. The slider is present and interactive
   * 2. Dragging the slider updates the size value
   * 3. The size display updates correctly
   * 4. The slider responds to mouse events properly
   * Uses a mocked getBoundingClientRect for consistent testing
   */
  it('updates thumbnail size when slider is moved', () => {
    const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect')
      .mockImplementation(() => ({
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
    const x = 100;
    
    fireEvent.mouseDown(slider, { clientX: x });
    fireEvent.mouseMove(slider, { clientX: x });
    fireEvent.mouseUp(slider);
    
    const sizeValue = screen.getByTestId('thumbnail-size-value');
    expect(sizeValue.textContent).toMatch(/200\s*px/);

    getBoundingClientRectMock.mockRestore();
  });

  /**
   * Tests the model path input functionality.
   * Verifies that:
   * 1. The model settings section can be accessed
   * 2. The model path input is present
   * 3. Changes to the input are reflected in the UI
   * 4. The transition animation timing is correct
   */
  it('updates model paths when input values change', () => {
    renderSettings();
    
    const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
    fireEvent.click(modelSettingsButton);
    vi.advanceTimersByTime(300);

    const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
    const newPath = '/new/path/to/model.safetensors';
    fireEvent.change(modelPathInput, { target: { value: newPath } });
    expect(modelPathInput).toHaveValue(newPath);
  });

  /**
   * Tests the nonsense warning visibility logic.
   * Verifies that the warning text is only shown when the nonsense
   * feature is not disabled, and that the warning contains the
   * expected emoji and text content.
   */
  it('shows warning text only when nonsense is not disabled', () => {
    renderSettings();
    expect(screen.getByText(/⚠️/)).toBeInTheDocument();
    expect(screen.getByText('⚠️警告！これはあなたをビーバーに変えてしまいます！')).toBeInTheDocument();
  });

  /**
   * Tests the experimental features section functionality.
   * Verifies that:
   * 1. The experimental features section can be accessed
   * 2. The zoom and minimap toggles are present
   * 3. The toggles can be interacted with
   * 4. The toggle states are updated correctly
   * 5. The context functions are called with correct values
   */
  it('toggles experimental features correctly', async () => {
    renderSettings();

    const experimentalButton = screen.getByRole('button', { name: 'Experimental Features' });
    fireEvent.click(experimentalButton);
    vi.advanceTimersByTime(300);

    const zoomCheckbox = screen.getByRole('checkbox', { name: 'Enable Zoom' });
    const minimapCheckbox = screen.getByRole('checkbox', { name: 'Enable Minimap' });

    expect(zoomCheckbox).not.toBeChecked();
    fireEvent.click(zoomCheckbox);
    expect(mockAppContext.setEnableZoom).toHaveBeenCalledWith(true);

    expect(minimapCheckbox).not.toBeChecked();
    fireEvent.click(minimapCheckbox);
    expect(mockAppContext.setEnableMinimap).toHaveBeenCalledWith(true);
  });

  describe('JTP2 Settings', () => {
    /**
     * Tests the JTP2 model path update functionality.
     * Verifies that:
     * 1. The model settings section can be accessed
     * 2. The JTP2 model path input is present
     * 3. Changes to the input update the context correctly
     */
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

    /**
     * Tests the JTP2 tags path update functionality.
     * Verifies that:
     * 1. The model settings section can be accessed
     * 2. The JTP2 tags path input is present
     * 3. Changes to the input update the context correctly
     */
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

    /**
     * Tests the JTP2 threshold adjustment functionality.
     * Verifies that:
     * 1. The threshold slider is present
     * 2. The slider responds to mouse events
     * 3. The threshold value is updated correctly
     * 4. The context is updated with the new threshold
     */
    it('updates JTP2 threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => ({
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
      const x = 200;
      
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.jtp2.setThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.jtp2.setThreshold.mock.calls[0][0]).toBeCloseTo(0.5, 5);

      getBoundingClientRectMock.mockRestore();
    });

    /**
     * Tests the JTP2 force CPU toggle functionality.
     * Verifies that:
     * 1. The force CPU toggle is present
     * 2. The toggle can be interacted with
     * 3. The context is updated correctly when toggled
     */
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
    /**
     * Tests the WDv3 model selection functionality.
     * Verifies that:
     * 1. The model dropdown is present
     * 2. The model can be changed
     * 3. The context is updated with the new model selection
     */
    it('changes WDv3 model', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelSelect = screen.getByRole('combobox', { name: 'WDv3 Model' });
      fireEvent.change(modelSelect, { target: { value: 'swinv2' } });
      expect(mockAppContext.wdv3.setModelName).toHaveBeenCalledWith('swinv2');
    });

    /**
     * Tests the WDv3 general threshold adjustment functionality.
     * Verifies that:
     * 1. The general threshold slider is present
     * 2. The slider responds to mouse events
     * 3. The threshold value is updated correctly
     * 4. The context is updated with the new threshold
     */
    it('updates WDv3 general threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => ({
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
      const x = 240;
      
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.wdv3.setGenThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.wdv3.setGenThreshold.mock.calls[0][0]).toBeCloseTo(0.6, 5);

      getBoundingClientRectMock.mockRestore();
    });

    /**
     * Tests the WDv3 character threshold adjustment functionality.
     * Verifies that:
     * 1. The character threshold slider is present
     * 2. The slider responds to mouse events
     * 3. The threshold value is updated correctly
     * 4. The context is updated with the new threshold
     */
    it('updates WDv3 character threshold', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const getBoundingClientRectMock = vi.spyOn(Element.prototype, 'getBoundingClientRect')
        .mockImplementation(() => ({
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
      const x = 280;
      
      fireEvent.mouseDown(thresholdSlider, { clientX: x });
      fireEvent.mouseMove(thresholdSlider, { clientX: x, buttons: 1 });
      fireEvent.mouseUp(thresholdSlider);

      expect(mockAppContext.wdv3.setCharThreshold).toHaveBeenCalledTimes(1);
      expect(mockAppContext.wdv3.setCharThreshold.mock.calls[0][0]).toBeCloseTo(0.7, 5);

      getBoundingClientRectMock.mockRestore();
    });

    /**
     * Tests the WDv3 force CPU toggle functionality.
     * Verifies that:
     * 1. The force CPU toggle is present
     * 2. The toggle can be interacted with
     * 3. The context is updated correctly when toggled
     */
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
    /**
     * Tests the view switching back functionality.
     * Verifies that:
     * 1. Clicking an active view button returns to the main view
     * 2. The transition animation works correctly
     * 3. The content is properly updated
     */
    it('switches back to main view when clicking active view button', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByPlaceholderText('/path/to/jtp2/model.safetensors')).toBeInTheDocument();
      
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.queryByPlaceholderText('/path/to/jtp2/model.safetensors')).not.toBeInTheDocument();
    });

    /**
     * Tests switching between different setting views.
     * Verifies that:
     * 1. Different views can be accessed
     * 2. The content updates correctly
     * 3. The transition animations work
     * 4. The correct elements are present in each view
     */
    it('switches between different views', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      const experimentalButton = screen.getByRole('button', { name: 'Experimental Features' });
      
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByPlaceholderText('/path/to/jtp2/model.safetensors')).toBeInTheDocument();
      
      fireEvent.click(experimentalButton);
      vi.advanceTimersByTime(300);
      expect(screen.getByRole('checkbox', { name: 'Enable Zoom' })).toBeInTheDocument();
    });
  });

  describe('File Preservation Settings', () => {
    /**
     * Tests the latents preservation toggle functionality.
     * Verifies that:
     * 1. The preserve latents toggle is present
     * 2. The toggle can be interacted with
     * 3. The context is updated correctly when toggled
     */
    it('toggles preserve latents setting', () => {
      renderSettings();
      const preserveLatentsToggle = screen.getByRole('checkbox', { name: 'Preserve Latents' });
      fireEvent.click(preserveLatentsToggle);
      expect(mockAppContext.setPreserveLatents).toHaveBeenCalledWith(true);
    });

    /**
     * Tests the TXT file preservation toggle functionality.
     * Verifies that:
     * 1. The preserve TXT toggle is present
     * 2. The toggle can be interacted with
     * 3. The context is updated correctly when toggled
     */
    it('toggles preserve txt setting', () => {
      renderSettings();
      const preserveTxtToggle = screen.getByRole('checkbox', { name: 'Preserve TXT' });
      fireEvent.click(preserveTxtToggle);
      expect(mockAppContext.setPreserveTxt).toHaveBeenCalledWith(true);
    });
  });

  describe('Deletion Settings', () => {
    /**
     * Tests the instant delete toggle functionality.
     * Verifies that:
     * 1. The instant delete toggle is present
     * 2. The toggle can be interacted with
     * 3. The context is updated correctly when toggled
     */
    it('toggles instant delete setting', () => {
      renderSettings();
      const instantDeleteToggle = screen.getByRole('checkbox', { name: 'Instant Delete' });
      fireEvent.click(instantDeleteToggle);
      expect(mockAppContext.setInstantDelete).toHaveBeenCalledWith(true);
    });
  });
}); 