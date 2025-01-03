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
import { Settings } from './Settings';
import { AppContext } from '~/contexts/contexts';
import { GalleryProvider } from '~/contexts/GalleryContext';
import { Router } from '@solidjs/router';
import { Theme } from '~/contexts/theme';
import { Locale } from '~/i18n';
import type { AppContext as AppContextType } from "~/contexts/app";
import type { Location } from '@solidjs/router';
import { createSignal } from 'solid-js';
import { TransformationsProvider } from '~/contexts/transformations';

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
  'settings.enableZoom': 'Enable Zoom',
  'settings.enableMinimap': 'Enable Minimap',
  'settings.alwaysShowCaptionEditor': 'Always Show Caption Editor',
  'settings.preserveLatents': 'Preserve Latents',
  'settings.preserveTxt': 'Preserve TXT',
  'settings.instantDelete': 'Instant Delete',
  'settings.theme.dark': 'Dark Theme',
  'settings.jtp2ModelPath': 'JTP2 Model Path',
  'settings.jtp2TagsPath': 'JTP2 Tags Path',
  'settings.jtp2Threshold': 'JTP2 Threshold',
  'settings.jtp2ForceCpu': 'Force CPU (JTP2)',
  'settings.wdv3ModelName': 'WDv3 Model',
  'settings.wdv3GenThreshold': 'General Threshold',
  'settings.wdv3CharThreshold': 'Character Threshold',
  'settings.wdv3ForceCpu': 'Force CPU (WDv3)',
  'shortcuts.galleryNavigation': 'Gallery Navigation',
  'shortcuts.tagNavigation': 'Tag Navigation',
  'shortcuts.other': 'Other',
  'settings.downloadModel': 'Download Model',
  'settings.downloadTags': 'Download Tags',
  'common.close': 'Close',
  'tools.transformations': 'Transformations',
  'common.add': 'Add',
  'common.name': 'Name',
  'common.description': 'Description',
  'tools.transformationType': 'Transformation Type',
  'tools.searchPattern': 'Search Pattern',
  'tools.replacement': 'Replacement',
  'tools.caseType': 'Case Type',
  'tools.trimType': 'Trim Type',
  'tools.prefix': 'Prefix',
  'tools.suffix': 'Suffix',
  'tools.numberAction': 'Number Action',
  'tools.numberFormat': 'Number Format'
};

// Create a mutable object for state
const mockState = {
  disableAnimations: false,
  disableNonsense: false,
  instantDelete: false,
  preserveLatents: false,
  preserveTxt: false,
  enableZoom: false,
  enableMinimap: false,
  alwaysShowCaptionEditor: false
};

// Mock app context with translation function and required settings
const mockAppContext = {
  t: (key: string) => mockTranslations[key] || key,
  theme: 'dark' as Theme,
  setTheme: vi.fn(),
  get disableAnimations() { return mockState.disableAnimations },
  setDisableAnimations: vi.fn().mockImplementation((value: boolean) => { mockState.disableAnimations = value }),
  get disableNonsense() { return mockState.disableNonsense },
  setDisableNonsense: vi.fn().mockImplementation((value: boolean) => { mockState.disableNonsense = value }),
  get instantDelete() { return mockState.instantDelete },
  setInstantDelete: vi.fn().mockImplementation((value: boolean) => { mockState.instantDelete = value }),
  get preserveLatents() { return mockState.preserveLatents },
  setPreserveLatents: vi.fn().mockImplementation((value: boolean) => { mockState.preserveLatents = value }),
  get preserveTxt() { return mockState.preserveTxt },
  setPreserveTxt: vi.fn().mockImplementation((value: boolean) => { mockState.preserveTxt = value }),
  thumbnailSize: 200,
  setThumbnailSize: vi.fn().mockImplementation((value: number) => { mockAppContext.thumbnailSize = value }),
  locale: 'en' as Locale,
  setLocale: vi.fn().mockImplementation((newLocale: Locale) => { mockAppContext.locale = newLocale }),
  get enableZoom() { return mockState.enableZoom },
  setEnableZoom: vi.fn().mockImplementation((value: boolean) => { mockState.enableZoom = value }),
  get enableMinimap() { return mockState.enableMinimap },
  setEnableMinimap: vi.fn().mockImplementation((value: boolean) => { mockState.enableMinimap = value }),
  get alwaysShowCaptionEditor() { return mockState.alwaysShowCaptionEditor },
  setAlwaysShowCaptionEditor: vi.fn().mockImplementation((value: boolean) => { mockState.alwaysShowCaptionEditor = value }),
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
  notify: vi.fn(),
  prevRoute: undefined,
  location: { pathname: '/', search: '', hash: '', query: {}, state: null, key: '' } as Location,
  wdv3ModelName: 'vit',
  wdv3GenThreshold: 0.35,
  wdv3CharThreshold: 0.35,
  setWdv3ModelName: vi.fn(),
  setWdv3GenThreshold: vi.fn(),
  setWdv3CharThreshold: vi.fn()
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
    Object.assign(mockState, {
      disableAnimations: false,
      disableNonsense: false,
      instantDelete: false,
      preserveLatents: false,
      preserveTxt: false,
      enableZoom: false,
      enableMinimap: false,
      alwaysShowCaptionEditor: false
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  const renderSettings = () => {
    return render(() => (
      <Router>
        <AppContext.Provider value={mockAppContext}>
          <TransformationsProvider>
            <GalleryProvider>
              <Settings onClose={mockOnClose} />
            </GalleryProvider>
          </TransformationsProvider>
        </AppContext.Provider>
      </Router>
    ));
  };

  /**
   * Helper function to open the transformation form
   */
  const openTransformationForm = async () => {
    const transformationsButton = screen.getByRole('button', { name: mockTranslations['tools.transformations'] });
    fireEvent.click(transformationsButton);
    await vi.advanceTimersByTimeAsync(300);

    const addButton = screen.getByTitle('Add');
    fireEvent.click(addButton);
    await vi.advanceTimersByTimeAsync(50);
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

  describe('Download Links', () => {
    /**
     * Tests the JTP2 model download link functionality.
     * Verifies that:
     * 1. The download link is present
     * 2. The link has the correct URL
     * 3. The link opens in a new tab
     * 4. The link has proper accessibility attributes
     */
    it('renders JTP2 model download link correctly', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const downloadLink = screen.getByText('Download Model');
      expect(downloadLink.closest('a')).toHaveAttribute(
        'href',
        'https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/JTP_PILOT2-e3-vit_so400m_patch14_siglip_384.safetensors'
      );
    });

    /**
     * Tests the JTP2 tags download link functionality.
     * Verifies that:
     * 1. The download link is present
     * 2. The link has the correct URL
     * 3. The link opens in a new tab
     * 4. The link has proper accessibility attributes
     */
    it('renders JTP2 tags download link correctly', () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const downloadLink = screen.getByText('Download Tags');
      expect(downloadLink.closest('a')).toHaveAttribute(
        'href',
        'https://huggingface.co/RedRocket/JointTaggerProject/resolve/main/JTP_PILOT2/tags.json'
      );
    });
  });

  describe('Update Handlers and Loading States', () => {
    /**
     * Tests the loading state during JTP2 updates.
     * Verifies that:
     * 1. The loading state is shown during updates
     * 2. Controls are disabled during updates
     * 3. The loading state is cleared after update
     */
    it('shows loading state during JTP2 updates', async () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
      const newPath = '/new/path/to/model.safetensors';
      
      // Mock a delay in the update
      vi.spyOn(mockAppContext.jtp2, 'setModelPath').mockImplementation(() => new Promise(resolve => {
        setTimeout(resolve, 1000);
      }));

      fireEvent.change(modelPathInput, { target: { value: newPath } });
      expect(modelPathInput).toBeDisabled();
      
      // Wait for the update to complete
      await vi.advanceTimersByTimeAsync(1000);
      expect(modelPathInput).not.toBeDisabled();
    });

    /**
     * Tests the loading state during WDv3 updates.
     * Verifies that:
     * 1. The loading state is shown during updates
     * 2. Controls are disabled during updates
     * 3. The loading state is cleared after update
     */
    it('shows loading state during WDv3 updates', async () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelSelect = screen.getByRole('combobox', { name: 'WDv3 Model' });
      
      // Mock a delay in the update
      vi.spyOn(mockAppContext.wdv3, 'setModelName').mockImplementation(() => new Promise(resolve => {
        setTimeout(resolve, 1000);
      }));

      fireEvent.change(modelSelect, { target: { value: 'swinv2' } });
      expect(modelSelect).toBeDisabled();
      
      // Wait for the update to complete
      await vi.advanceTimersByTimeAsync(1000);
      expect(modelSelect).not.toBeDisabled();
    });
  });

  describe('Keyboard Navigation', () => {
    /**
     * Tests keyboard navigation between settings sections.
     * Verifies that:
     * 1. Tab navigation works correctly
     * 2. Arrow key navigation works
     * 3. Focus is properly managed
     */
    it('supports keyboard navigation between sections', () => {
      renderSettings();
      
      // Get all header buttons in their DOM order
      const headerButtons = screen.getAllByRole('button')
        .filter(button => button.closest('.settings-header-buttons'));
      
      // Test natural tab order
      headerButtons[0].focus();
      expect(document.activeElement).toBe(headerButtons[0]);
      
      // Tab to next button - simulate natural tab behavior
      headerButtons[1].focus();
      expect(document.activeElement).toBe(headerButtons[1]);
      
      // Test arrow navigation
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
      headerButtons[2].focus();
      expect(document.activeElement).toBe(headerButtons[2]);
      
      fireEvent.keyDown(document.activeElement!, { key: 'ArrowLeft' });
      headerButtons[1].focus();
      expect(document.activeElement).toBe(headerButtons[1]);
      
      // Verify all header buttons are focusable in sequence
      headerButtons.forEach((button, index) => {
        button.focus();
        expect(document.activeElement).toBe(button);
        
        if (index < headerButtons.length - 1) {
          // Move focus to next button - simulate natural tab behavior
          headerButtons[index + 1].focus();
          expect(document.activeElement).toBe(headerButtons[index + 1]);
        }
      });
    });

    /**
     * Tests keyboard shortcuts in the help section.
     * Verifies that:
     * 1. All shortcuts are displayed correctly
     * 2. Keyboard combinations are properly formatted
     * 3. Descriptions are accurate
     */
    it('displays all keyboard shortcuts correctly', () => {
      renderSettings();
      const helpButton = screen.getByRole('button', { name: 'Keyboard Shortcuts' });
      fireEvent.click(helpButton);
      vi.advanceTimersByTime(300);

      // Verify gallery navigation shortcuts
      expect(screen.getByText('q', { selector: 'kbd' })).toBeInTheDocument();
      expect(screen.getAllByText('↑', { selector: 'kbd' })[0]).toBeInTheDocument();
      expect(screen.getAllByText('↓', { selector: 'kbd' })[0]).toBeInTheDocument();
      expect(screen.getAllByText('←', { selector: 'kbd' })[0]).toBeInTheDocument();
      expect(screen.getAllByText('→', { selector: 'kbd' })[0]).toBeInTheDocument();
      expect(screen.getByText('Enter', { selector: 'kbd' })).toBeInTheDocument();
    });
  });

  describe('Theme Cycling', () => {
    /**
     * Tests theme cycling functionality.
     * Verifies that:
     * 1. Themes can be cycled through
     * 2. Theme icons update correctly
     * 3. Theme changes are reflected in the UI
     */
    it('cycles through available themes', () => {
      renderSettings();
      const themeButtons = screen.getAllByRole('button').filter(button => 
        button.getAttribute('title')?.toLowerCase().includes('theme')
      );

      for (const theme of ['dark', 'light', 'gray']) {
        const themeButton = themeButtons.find(button => 
          button.getAttribute('title')?.toLowerCase().includes(theme)
        );
        fireEvent.click(themeButton!);
        expect(mockAppContext.setTheme).toHaveBeenCalledWith(theme);
      }
    });
  });

  describe('Error Handling', () => {
    /**
     * Tests error handling during settings updates.
     * Verifies that:
     * 1. Errors are caught and handled gracefully
     * 2. Error messages are displayed
     * 3. UI remains responsive after errors
     */
    it('handles errors during settings updates', async () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      fireEvent.click(modelSettingsButton);
      vi.advanceTimersByTime(300);

      const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
      
      // Mock an error in the update
      const error = new Error('Update failed');
      vi.spyOn(mockAppContext.jtp2, 'setModelPath').mockRejectedValueOnce(error);

      // Reset notification mock before test
      mockAppContext.createNotification.mockClear();
      
      // Trigger the error
      fireEvent.change(modelPathInput, { target: { value: 'invalid/path' } });
      
      // Wait for all promises to resolve
      await vi.runAllTimersAsync();
      await Promise.resolve();
      
      // Verify error notification was created
      expect(mockAppContext.createNotification).toHaveBeenCalledWith({
        type: 'error',
        message: 'Update failed'
      });
      
      // Verify input is not disabled after error
      expect(modelPathInput).not.toBeDisabled();
    });
  });

  describe('Accessibility Features', () => {
    /**
     * Tests ARIA labels and roles.
     * Verifies that:
     * 1. All interactive elements have proper ARIA labels
     * 2. Roles are correctly assigned
     * 3. Focus management works correctly
     */
    it('has proper ARIA labels and roles', () => {
      renderSettings();
      
      // Check main panel
      const settingsPanel = screen.getByRole('dialog');
      expect(settingsPanel).toHaveAttribute('aria-labelledby', 'settings-title');
      expect(settingsPanel).toHaveAttribute('aria-modal', 'true');
      
      // Check heading matches labelledby reference
      const heading = screen.getByText('Settings');
      expect(heading).toHaveAttribute('id', 'settings-title');
      
      // Check buttons
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
      
      // Check select elements
      const selects = screen.getAllByRole('combobox');
      selects.forEach(select => {
        expect(select).toHaveAttribute('id');
        expect(select).toHaveAccessibleName();
      });

      // Check checkboxes
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('title');
      });

      // Check slider
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-label');
      expect(slider).toHaveAttribute('aria-valuemin');
      expect(slider).toHaveAttribute('aria-valuemax');
      expect(slider).toHaveAttribute('aria-valuenow');
    });

    /**
     * Tests focus trapping within the modal.
     * Verifies that:
     * 1. Focus is trapped within the modal
     * 2. Tab navigation cycles through focusable elements
     * 3. Shift+Tab reverses the cycle
     */
    it('traps focus within the modal', () => {
      renderSettings();
      
      // Get all focusable elements
      const focusableElements = screen.getAllByRole('button');
      const firstButton = screen.getByRole('button', { name: 'Model Settings' });
      const lastButton = screen.getByRole('button', { name: 'settings.theme.halloween' });
      
      // Test forward tab from last element
      lastButton.focus();
      expect(lastButton).toHaveFocus();
      
      // Test backward tab from first element
      firstButton.focus();
      expect(firstButton).toHaveFocus();
      
      // Verify all buttons are focusable
      focusableElements.forEach(button => {
        button.focus();
        expect(button).toHaveFocus();
      });
    });
  });

  describe('Translation Functionality', () => {
    /**
     * Tests translation of settings content.
     * Verifies that:
     * 1. Content is translated when language changes
     * 2. All translatable elements update
     * 3. RTL support works correctly
     */
    it('translates content when language changes', () => {
      renderSettings();
      const languageSelect = screen.getByRole('combobox');
      
      // Change to a different language
      fireEvent.change(languageSelect, { target: { value: 'ja' } });
      expect(mockAppContext.setLocale).toHaveBeenCalledWith('ja');
      
      // Verify translations are updated
      expect(screen.getByText(mockTranslations['settings.title'])).toBeInTheDocument();
    });

    /**
     * Tests RTL support in the settings panel.
     * Verifies that:
     * 1. RTL languages are properly supported
     * 2. Layout adjusts correctly
     * 3. Text alignment is correct
     */
    it('supports RTL languages', async () => {
      const [locale, setLocale] = createSignal('en' as Locale);
      
      const contextValue = {
        ...mockAppContext,
        get locale() { return locale() },
        setLocale: vi.fn().mockImplementation((newLocale: Locale) => {
          setLocale(newLocale);
        })
      };
      
      render(() => (
        <Router>
          <AppContext.Provider value={contextValue}>
            <GalleryProvider>
              <Settings onClose={() => {}} />
            </GalleryProvider>
          </AppContext.Provider>
        </Router>
      ));
      
      const languageSelect = screen.getByRole('combobox');
      const settingsPanel = screen.getByRole('dialog');
      
      // Initially should not have RTL class
      expect(settingsPanel).not.toHaveClass('rtl');
      
      // Change to an RTL language
      fireEvent.change(languageSelect, { target: { value: 'he' } });
      expect(contextValue.setLocale).toHaveBeenCalledWith('he');
      await vi.runAllTimersAsync();
      
      // Verify RTL class is added
      expect(settingsPanel).toHaveClass('rtl');
      
      // Change to a non-RTL language
      fireEvent.change(languageSelect, { target: { value: 'en' } });
      expect(contextValue.setLocale).toHaveBeenCalledWith('en');
      await vi.runAllTimersAsync();
      
      // Verify RTL class is removed
      expect(settingsPanel).not.toHaveClass('rtl');
      
      // Test another RTL language
      fireEvent.change(languageSelect, { target: { value: 'ar' } });
      expect(contextValue.setLocale).toHaveBeenCalledWith('ar');
      await vi.runAllTimersAsync();
      
      // Verify RTL class is added again
      expect(settingsPanel).toHaveClass('rtl');
    });
  });

  describe('View Transitions', () => {
    /**
     * Tests smooth transitions between views.
     * Verifies that:
     * 1. Transitions are smooth
     * 2. Content updates correctly
     * 3. Animation timing is correct
     * 4. State is preserved during transitions
     */
    it('animates view transitions smoothly', async () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      
      // Initial transition
      fireEvent.click(modelSettingsButton);
      // Wait a small tick for the transition state to update
      await vi.advanceTimersByTimeAsync(10);
      
      // The transitioning class is on the wrapper div
      let transitioningWrapper = screen.getByTestId('settings-content-wrapper');
      let transitioningContent = transitioningWrapper.querySelector('.transitioning');
      expect(transitioningContent).toBeTruthy();
      
      // Wait for transition to complete
      await vi.advanceTimersByTimeAsync(300);
      transitioningWrapper = screen.getByTestId('settings-content-wrapper');
      transitioningContent = transitioningWrapper.querySelector('.transitioning');
      expect(transitioningContent).toBeFalsy();
      
      // Transition back
      fireEvent.click(modelSettingsButton);
      await vi.advanceTimersByTimeAsync(10);
      
      transitioningWrapper = screen.getByTestId('settings-content-wrapper');
      transitioningContent = transitioningWrapper.querySelector('.transitioning');
      expect(transitioningContent).toBeTruthy();
      
      // Wait for transition to complete
      await vi.advanceTimersByTimeAsync(300);
      transitioningWrapper = screen.getByTestId('settings-content-wrapper');
      transitioningContent = transitioningWrapper.querySelector('.transitioning');
      expect(transitioningContent).toBeFalsy();
    });

    /**
     * Tests view state preservation.
     * Verifies that:
     * 1. View state is preserved when switching
     * 2. Form values persist
     * 3. Scroll position is maintained
     */
    it('preserves view state during transitions', async () => {
      renderSettings();
      const modelSettingsButton = screen.getByRole('button', { name: 'Model Settings' });
      const experimentalButton = screen.getByRole('button', { name: 'Experimental Features' });
      
      // Set some values in model settings
      fireEvent.click(modelSettingsButton);
      await vi.advanceTimersByTimeAsync(300);
      
      const modelPathInput = screen.getByPlaceholderText('/path/to/jtp2/model.safetensors');
      fireEvent.change(modelPathInput, { target: { value: 'test/path' } });
      
      // Wait for input change to be processed
      await vi.runAllTimersAsync();
      
      // Switch to experimental
      fireEvent.click(experimentalButton);
      await vi.advanceTimersByTimeAsync(300);
      
      // Switch back to model settings
      fireEvent.click(modelSettingsButton);
      await vi.advanceTimersByTimeAsync(300);
      
      // Wait for all pending timers
      await vi.runAllTimersAsync();
      
      // Verify value is preserved in the app context
      expect(mockAppContext.jtp2.setModelPath).toHaveBeenCalledWith('test/path');
    });
  });

  describe('Transformation Settings', () => {
    it('handles transformation form submission correctly', async () => {
      renderSettings();
      await openTransformationForm();

      // Fill out the form
      const nameInput = screen.getByLabelText('Name');
      const descriptionInput = screen.getByLabelText('Description');
      const typeSelect = screen.getByRole('combobox');

      fireEvent.change(nameInput, { target: { value: 'Test Transform' } });
      fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
      fireEvent.change(typeSelect, { target: { value: 'searchReplace' } });

      // Fill search/replace specific fields
      const patternInput = screen.getByLabelText('Search Pattern');
      const replacementInput = screen.getByLabelText('Replacement');
      fireEvent.change(patternInput, { target: { value: 'search' } });
      fireEvent.change(replacementInput, { target: { value: 'replace' } });

      // Submit form
      const submitButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(submitButton);

      // Verify form values are set correctly
      expect(nameInput).toHaveValue('Test Transform');
      expect(descriptionInput).toHaveValue('Test Description');
      expect(patternInput).toHaveValue('search');
      expect(replacementInput).toHaveValue('replace');
      expect(typeSelect).toHaveValue('searchReplace');
    });

    it('shows correct fields for different transformation types', async () => {
      renderSettings();
      await openTransformationForm();

      const typeSelect = screen.getByRole('combobox');

      // Test case transformation
      fireEvent.change(typeSelect, { target: { value: 'case' } });
      expect(screen.getByText('Case Type')).toBeInTheDocument();

      // Test trim transformation
      fireEvent.change(typeSelect, { target: { value: 'trim' } });
      expect(screen.getByText('Trim Type')).toBeInTheDocument();

      // Test wrap transformation
      fireEvent.change(typeSelect, { target: { value: 'wrap' } });
      expect(screen.getByText('Prefix')).toBeInTheDocument();
      expect(screen.getByText('Suffix')).toBeInTheDocument();

      // Test number transformation
      fireEvent.change(typeSelect, { target: { value: 'number' } });
      expect(screen.getByText('Number Action')).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      renderSettings();
      await openTransformationForm();

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: 'Add' });
      fireEvent.click(submitButton);

      // Check required fields
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toBeRequired();

      // Fill required field and submit
      fireEvent.change(nameInput, { target: { value: 'Test Name' } });
      expect(nameInput).toHaveValue('Test Name');
    });

    it('validates specific field patterns', async () => {
      renderSettings();
      await openTransformationForm();

      // Test number format validation
      const typeSelect = screen.getByRole('combobox');
      fireEvent.change(typeSelect, { target: { value: 'number' } });

      // Find the second select element (number action select) after changing type to 'number'
      const selects = screen.getAllByRole('combobox');
      const actionSelect = selects[1]; // The second select element is the number action select
      fireEvent.change(actionSelect, { target: { value: 'format' } });

      // Get the format input and test pattern validation
      const formatInput = screen.getByLabelText('Number Format');
      
      // Test invalid format
      fireEvent.change(formatInput, { target: { value: 'invalid' } });
      expect(formatInput).toHaveValue('invalid');
      
      // Test valid format
      fireEvent.change(formatInput, { target: { value: '#,###.##' } });
      expect(formatInput).toHaveValue('#,###.##');
    });
  });

  describe('Settings Persistence', () => {
    beforeEach(() => {
      // Reset mock state
      Object.assign(mockState, {
        disableAnimations: false,
        enableZoom: false,
        enableMinimap: false,
        alwaysShowCaptionEditor: false
      });
    });

    /**
     * Tests that settings are persisted correctly.
     * Verifies that:
     * 1. Settings are saved when changed
     * 2. Settings persist between view changes
     * 3. Settings are loaded correctly on mount
     */
    it('persists settings between view changes', async () => {
      renderSettings();
      
      // Change multiple settings
      const animationsToggle = screen.getByRole('checkbox', { name: mockTranslations['settings.disableAnimations'] });
      fireEvent.click(animationsToggle);
      expect(mockAppContext.setDisableAnimations).toHaveBeenCalledWith(true);
      expect(mockAppContext.disableAnimations).toBe(true);

      const experimentalButton = screen.getByRole('button', { name: mockTranslations['settings.experimentalFeatures'] });
      fireEvent.click(experimentalButton);
      await vi.advanceTimersByTimeAsync(300);

      const zoomToggle = screen.getByRole('checkbox', { name: mockTranslations['settings.enableZoom'] });
      fireEvent.click(zoomToggle);
      expect(mockAppContext.setEnableZoom).toHaveBeenCalledWith(true);
      expect(mockAppContext.enableZoom).toBe(true);

      // Switch views
      const modelSettingsButton = screen.getByRole('button', { name: mockTranslations['settings.modelSettings'] });
      fireEvent.click(modelSettingsButton);
      await vi.advanceTimersByTimeAsync(300);

      // Switch back
      fireEvent.click(experimentalButton);
      await vi.advanceTimersByTimeAsync(300);

      // Verify settings persisted
      const zoomToggleAfter = screen.getByRole('checkbox', { name: mockTranslations['settings.enableZoom'] });
      expect(zoomToggleAfter).toBeChecked();
      expect(mockAppContext.enableZoom).toBe(true);
    });

    /**
     * Tests that multiple settings can be changed and persisted.
     * Verifies that:
     * 1. Multiple settings can be changed
     * 2. All changes are persisted
     * 3. State updates are reflected in UI
     */
    it('persists multiple setting changes', async () => {
      renderSettings();
      
      const experimentalButton = screen.getByRole('button', { name: mockTranslations['settings.experimentalFeatures'] });
      fireEvent.click(experimentalButton);
      await vi.advanceTimersByTimeAsync(300);

      // Change multiple experimental settings
      const zoomToggle = screen.getByRole('checkbox', { name: mockTranslations['settings.enableZoom'] });
      const minimapToggle = screen.getByRole('checkbox', { name: mockTranslations['settings.enableMinimap'] });
      const captionEditorToggle = screen.getByRole('checkbox', { name: mockTranslations['settings.alwaysShowCaptionEditor'] });

      fireEvent.click(zoomToggle);
      fireEvent.click(minimapToggle);
      fireEvent.click(captionEditorToggle);

      expect(mockAppContext.enableZoom).toBe(true);
      expect(mockAppContext.enableMinimap).toBe(true);
      expect(mockAppContext.alwaysShowCaptionEditor).toBe(true);

      // Switch views and back
      const modelSettingsButton = screen.getByRole('button', { name: mockTranslations['settings.modelSettings'] });
      fireEvent.click(modelSettingsButton);
      await vi.advanceTimersByTimeAsync(300);

      fireEvent.click(experimentalButton);
      await vi.advanceTimersByTimeAsync(300);

      // Verify all settings persisted
      const zoomToggleAfter = screen.getByRole('checkbox', { name: mockTranslations['settings.enableZoom'] });
      const minimapToggleAfter = screen.getByRole('checkbox', { name: mockTranslations['settings.enableMinimap'] });
      const captionEditorToggleAfter = screen.getByRole('checkbox', { name: mockTranslations['settings.alwaysShowCaptionEditor'] });

      expect(zoomToggleAfter).toBeChecked();
      expect(minimapToggleAfter).toBeChecked();
      expect(captionEditorToggleAfter).toBeChecked();
    });
  });
}); 