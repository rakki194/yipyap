import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Settings } from './Settings';
import { AppProvider } from '~/contexts/app';
import { GalleryProvider } from '~/contexts/GalleryContext';
import { Router, Route } from '@solidjs/router';

// Mock the icons
vi.mock('~/icons', () => ({
  default: () => '<svg data-testid="mock-icon" />',
}));

// Mock router
vi.mock('@solidjs/router', () => ({
  useLocation: () => ({ pathname: '/' }),
  useNavigate: () => vi.fn(),
  useSearchParams: () => [
    {},
    () => {},
    () => ({ page: undefined })
  ],
  useParams: () => ({ path: '/' }),
  action: (fn: Function) => fn,
  A: (props: any) => props.children,
  Router: (props: any) => props.children,
  Route: (props: any) => props.children,
}));

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
  });

  const renderSettings = () => {
    return render(() => (
      <AppProvider>
        <GalleryProvider>
          <Settings onClose={mockOnClose} />
        </GalleryProvider>
      </AppProvider>
    ));
  };

  it('renders the settings panel with title', () => {
    renderSettings();
    expect(screen.getByText('settings.title')).toBeInTheDocument();
  });

  it('closes settings when Escape key is pressed', () => {
    renderSettings();
    fireEvent.keyDown(screen.getByRole('heading', { name: 'settings.title' }), {
      key: 'Escape',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('toggles help section when help button is clicked', async () => {
    renderSettings();
    const helpButton = screen.getByTitle('shortcuts.title');
    
    // Click to show help
    fireEvent.click(helpButton);
    expect(await screen.findByText('shortcuts.galleryNavigation')).toBeInTheDocument();
    
    // Click to hide help
    fireEvent.click(helpButton);
    // Wait for animation to complete
    await new Promise(resolve => setTimeout(resolve, 300));
    expect(screen.queryByText('shortcuts.galleryNavigation')).not.toBeInTheDocument();
  });

  it('changes theme when theme button is clicked', () => {
    renderSettings();
    const darkThemeButton = screen.getByTitle('settings.theme.dark');
    fireEvent.click(darkThemeButton);
    expect(darkThemeButton).toHaveClass('active');
  });

  it('updates language when selection changes', () => {
    renderSettings();
    const languageSelect = screen.getByRole('combobox');
    fireEvent.change(languageSelect, { target: { value: 'ja' } });
    expect(languageSelect).toHaveValue('ja');
  });

  it('toggles animations when checkbox is clicked', () => {
    renderSettings();
    const animationsCheckbox = screen.getByLabelText('settings.disableAnimations');
    fireEvent.click(animationsCheckbox);
    expect(animationsCheckbox).toBeChecked();
  });

  it('updates thumbnail size when slider is moved', () => {
    renderSettings();
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '200' } });
    expect(screen.getByText('200px')).toBeInTheDocument();
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
    const zoomCheckbox = screen.getByLabelText('settings.enableZoom');
    const minimapCheckbox = screen.getByLabelText('settings.enableMinimap');

    fireEvent.click(zoomCheckbox);
    fireEvent.click(minimapCheckbox);

    expect(zoomCheckbox).toBeChecked();
    expect(minimapCheckbox).toBeChecked();
  });
}); 