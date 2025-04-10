import { createSignal, createResource, createEffect } from "solid-js";
import { useAppContext } from "~/contexts/app";

/**
 * Composable for tag auto-completion functionality
 * 
 * Provides:
 * - Fetching tag suggestions from the backend
 * - Processing suggestions for display with spaces instead of underscores
 * - Managing selection state
 */
export function useTagAutocomplete() {
    const app = useAppContext();
    const [query, setQuery] = createSignal("");
    const [selectedIndex, setSelectedIndex] = createSignal(-1);
    const [isOpen, setIsOpen] = createSignal(false);

    // Store original suggestions with underscores
    const [originalSuggestions, setOriginalSuggestions] = createSignal<string[]>([]);

    // Fetch suggestions from the backend
    const [suggestions, { refetch }] = createResource(query, async (searchQuery) => {
        if (!searchQuery || searchQuery.length < 2) {
            console.log("Query too short, returning empty suggestions");
            setOriginalSuggestions([]);
            return [];
        }

        try {
            console.log(`Fetching suggestions for query: ${searchQuery}`);
            const response = await fetch(`/api/tags/autocomplete?q=${encodeURIComponent(searchQuery)}&limit=10`);
            const data = await response.json();
            console.log("Received autocomplete data:", data);

            // Check if we got any suggestions
            if (!data.suggestions || data.suggestions.length === 0) {
                console.log("No suggestions received from API");
                setOriginalSuggestions([]);
                return [];
            }

            // Store the original suggestions with underscores
            setOriginalSuggestions(data.suggestions);

            // Only display with spaces but maintain original values
            if (app.replaceUnderscoresInTags) {
                const displaySuggestions = data.suggestions.map((tag: string) => tag.replace(/_/g, " "));
                console.log("Display suggestions with underscores replaced:", displaySuggestions);
                return displaySuggestions;
            }

            console.log("Using original suggestions for display:", data.suggestions);
            return data.suggestions;
        } catch (error) {
            console.error("Error fetching tag suggestions:", error);
            setOriginalSuggestions([]);
            return [];
        }
    });

    // Reset selection when query changes
    createEffect(() => {
        query(); // Track query changes
        setSelectedIndex(-1);
    });

    // Functions for handling keyboard navigation
    const selectNextSuggestion = () => {
        if (!suggestions() || suggestions().length === 0) return;

        setSelectedIndex((prev) => {
            if (prev >= suggestions().length - 1) {
                return 0; // Wrap to the beginning
            }
            return prev + 1;
        });
    };

    const selectPreviousSuggestion = () => {
        if (!suggestions() || suggestions().length === 0) return;

        setSelectedIndex((prev) => {
            if (prev <= 0) {
                return suggestions().length - 1; // Wrap to the end
            }
            return prev - 1;
        });
    };

    // Modified to return the original tag with underscores
    const getSelectedSuggestion = () => {
        if (
            selectedIndex() >= 0 &&
            suggestions() &&
            selectedIndex() < suggestions().length
        ) {
            // Return the original suggestion with underscores
            return originalSuggestions()[selectedIndex()];
        }
        return null;
    };

    // Clear state
    const clearSuggestions = () => {
        setQuery("");
        setSelectedIndex(-1);
        setIsOpen(false);
        setOriginalSuggestions([]);
    };

    return {
        query,
        setQuery,
        suggestions,
        originalSuggestions,
        selectedIndex,
        setSelectedIndex,
        isOpen,
        setIsOpen,
        selectNextSuggestion,
        selectPreviousSuggestion,
        getSelectedSuggestion,
        clearSuggestions,
        refetchSuggestions: refetch
    };
} 