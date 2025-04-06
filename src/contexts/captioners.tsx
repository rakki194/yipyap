/**
 * Captioner context for managing captioner state.
 * 
 * This module provides a context provider for captioner-related functionality:
 * - Retrieving available captioners from the API
 * - Accessing captioner information and configuration
 * - Updating captioner configuration
 * - Managing loading and error states
 * 
 * The captioner context is designed to be integrated with the app's other context providers
 * and enables reactive access to captioner data throughout the application.
 */

import {
    createContext,
    useContext,
    createResource,
    createSignal,
    JSX,
    Accessor
} from 'solid-js';
import { getAvailableCaptioners, CaptionerInfo, getCaptionerConfig, updateCaptionerConfig } from '~/resources/browse';

/**
 * Interface defining the captioner context state and operations
 */
export interface CaptionerContextState {
    captioners: Accessor<Record<string, CaptionerInfo> | undefined>;
    loading: Accessor<boolean>;
    error: Accessor<Error | undefined>;
    refreshCaptioners: () => Promise<Record<string, CaptionerInfo> | null | undefined>;
    getConfig: (name: string) => Promise<Record<string, any>>;
    updateConfig: (name: string, config: Record<string, any>) => Promise<{ success: boolean }>;
}

/**
 * Create the captioner context with default values
 */
const CaptionerContext = createContext<CaptionerContextState>({
    captioners: () => ({}),
    loading: () => false,
    error: () => undefined,
    refreshCaptioners: async () => ({}),
    getConfig: async () => ({}),
    updateConfig: async () => ({ success: false })
});

/**
 * Props for the CaptionerProvider component
 */
interface CaptionerProviderProps {
    children: JSX.Element;
}

/**
 * Provider component for captioner functionality
 * 
 * @param props - Component props containing children elements
 * @returns JSX provider element containing children
 */
export function CaptionerProvider(props: CaptionerProviderProps): JSX.Element {
    // Signal to trigger captioners refetch
    const [refreshTrigger, setRefreshTrigger] = createSignal(0);

    // Resource for captioners data
    const [captioners, { refetch }] = createResource(
        refreshTrigger,
        () => getAvailableCaptioners()
    );

    /**
     * Function to refresh captioners data
     * @returns Promise that resolves to captioners data
     */
    const refreshCaptioners = async () => {
        setRefreshTrigger(n => n + 1);
        return refetch();
    };

    /**
     * Get configuration for a specific captioner
     * @param name - Captioner name
     * @returns Promise with captioner configuration
     */
    const getConfig = async (name: string) => {
        return getCaptionerConfig(name);
    };

    /**
     * Update configuration for a specific captioner
     * @param name - Captioner name
     * @param config - New configuration values
     * @returns Promise with update result
     */
    const updateConfig = async (name: string, config: Record<string, any>) => {
        const result = await updateCaptionerConfig(name, config);
        // Refresh captioners after config update to get latest info
        await refreshCaptioners();
        return result;
    };

    return (
        <CaptionerContext.Provider value={{
            captioners,
            loading: () => captioners.loading,
            error: () => captioners.error,
            refreshCaptioners,
            getConfig,
            updateConfig
        }}>
            {props.children}
        </CaptionerContext.Provider>
    );
}

/**
 * Hook to access the captioner context
 * @returns Captioner context state
 */
export function useCaptioners(): CaptionerContextState {
    return useContext(CaptionerContext);
} 