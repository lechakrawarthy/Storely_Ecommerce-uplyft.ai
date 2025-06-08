import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import type { Product } from '../data/products';
import {
    searchProducts,
    getCategories,
    allProducts,
    sortProducts,
    loadProductsFromDB
} from '../data/products';

interface SearchContextType {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: Product[];
    setSearchResults: (results: Product[]) => void;
    isSearching: boolean;
    setIsSearching: (loading: boolean) => void;
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
    sortBy: SortOption;
    setSortBy: (sort: SortOption) => void;
    suggestions: string[];
    searchHistory: string[];
    performSearch: (query: string) => void;
    clearSearch: () => void;
    clearSearchHistory: () => void;
    applyFilters: () => void;
    getAvailableColors: () => string[];
    getAvailableBadges: () => string[];
}

export interface SearchFilters {
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
    color: string;
    hasDiscount: boolean;
    badge: string;
}

export type SortOption = 'relevance' | 'Price: Low to High' | 'Price: High to Low' | 'Rating' | 'Newest';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const defaultFilters: SearchFilters = {
    category: 'all',
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    color: 'all',
    hasDiscount: false,
    badge: 'all',
};

interface SearchCacheEntry {
    results: Product[];
    timestamp: number;
}

interface SearchPerformanceData {
    searchTimes: number[];
    sessionSearches: number;
    lastSearchTime: number | null;
}

// Search cache helper functions
const getSearchCacheFromStorage = (): Record<string, SearchCacheEntry> => {
    try {
        const cache = localStorage.getItem('bookbuddy-search-cache');
        return cache ? JSON.parse(cache) : {};
    } catch {
        return {};
    }
};

const saveSearchCacheToStorage = (cache: Record<string, SearchCacheEntry>) => {
    try {
        // Limit cache size to prevent excessive storage usage
        const keys = Object.keys(cache);
        if (keys.length > 50) {
            // Keep only the 30 most recent entries
            const sortedEntries = keys
                .map(key => ({ key, timestamp: cache[key].timestamp }))
                .sort((a, b) => b.timestamp - a.timestamp)
                .slice(0, 30);

            const trimmedCache: Record<string, SearchCacheEntry> = {};
            sortedEntries.forEach(({ key }) => {
                trimmedCache[key] = cache[key];
            });
            cache = trimmedCache;
        }
        localStorage.setItem('bookbuddy-search-cache', JSON.stringify(cache));
    } catch {
        // Fail silently if localStorage is not available
    }
};

const getCachedSearchResults = (query: string, filters: SearchFilters, sortBy: SortOption): Product[] | null => {
    const cache = getSearchCacheFromStorage();
    const cacheKey = JSON.stringify({ query, filters, sortBy });
    const cachedEntry = cache[cacheKey];

    if (cachedEntry) {
        // Check if cache entry is still valid (5 minutes)
        const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
        if (cachedEntry.timestamp > fiveMinutesAgo) {
            return cachedEntry.results;
        }
    }

    return null;
};

const setCachedSearchResults = (query: string, filters: SearchFilters, sortBy: SortOption, results: Product[]) => {
    const cache = getSearchCacheFromStorage();
    const cacheKey = JSON.stringify({ query, filters, sortBy });
    cache[cacheKey] = {
        results,
        timestamp: Date.now()
    };
    saveSearchCacheToStorage(cache);
};

// Search analytics helper functions
const getSearchAnalyticsFromStorage = (): Record<string, number> => {
    try {
        const analytics = localStorage.getItem('bookbuddy-search-analytics');
        return analytics ? JSON.parse(analytics) : {};
    } catch {
        return {};
    }
};

const saveSearchAnalyticsToStorage = (analytics: Record<string, number>) => {
    try {
        localStorage.setItem('bookbuddy-search-analytics', JSON.stringify(analytics));
    } catch {
        // Fail silently if localStorage is not available
    }
};

const trackSearchQuery = (query: string) => {
    if (!query.trim()) return;

    const analytics = getSearchAnalyticsFromStorage();
    const normalizedQuery = query.toLowerCase().trim();
    analytics[normalizedQuery] = (analytics[normalizedQuery] || 0) + 1;
    saveSearchAnalyticsToStorage(analytics);

    // Track performance metrics
    const performanceData = getSearchPerformanceFromStorage();
    performanceData.sessionSearches = (performanceData.sessionSearches || 0) + 1;
    performanceData.lastSearchTime = Date.now();
    saveSearchPerformanceToStorage(performanceData);

    // Dispatch custom event for metrics component
    window.dispatchEvent(new CustomEvent('searchPerformed'));
};

// Search performance helper functions
const getSearchPerformanceFromStorage = (): SearchPerformanceData => {
    try {
        const performance = localStorage.getItem('bookbuddy-search-performance');
        return performance ? JSON.parse(performance) : { searchTimes: [], sessionSearches: 0, lastSearchTime: null };
    } catch {
        return { searchTimes: [], sessionSearches: 0, lastSearchTime: null };
    }
};

const saveSearchPerformanceToStorage = (performance: SearchPerformanceData) => {
    try {
        localStorage.setItem('bookbuddy-search-performance', JSON.stringify(performance));
    } catch {
        // Fail silently if localStorage is not available
    }
};

// Local storage helper functions
const getSearchHistoryFromStorage = (): string[] => {
    try {
        const history = localStorage.getItem('bookbuddy-search-history');
        return history ? JSON.parse(history) : [];
    } catch {
        return [];
    }
};

const saveSearchHistoryToStorage = (history: string[]) => {
    try {
        localStorage.setItem('bookbuddy-search-history', JSON.stringify(history));
    } catch {
        // Fail silently if localStorage is not available
    }
};

// Helper functions to get available filter options
const getAvailableColors = (): string[] => {
    const colors = new Set<string>();
    allProducts.forEach(product => {
        if (product.color) {
            colors.add(product.color);
        }
    });
    return Array.from(colors).sort();
};

const getAvailableBadges = (): string[] => {
    const badges = new Set<string>();
    allProducts.forEach(product => {
        if (product.badge) {
            badges.add(product.badge);
        }
    });
    return Array.from(badges).sort();
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Load search history on mount
    useEffect(() => {
        setSearchHistory(getSearchHistoryFromStorage());
    }, []);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    // Generate search suggestions based on product data
    const generateSuggestions = useCallback((query: string): string[] => {
        if (!query || query.length < 2) return [];

        const lowerQuery = query.toLowerCase();
        const suggestionSet = new Set<string>();

        allProducts.forEach(product => {
            // Add matching titles
            if (product.title.toLowerCase().includes(lowerQuery)) {
                suggestionSet.add(product.title);
            }

            // Add matching categories
            if (product.category.toLowerCase().includes(lowerQuery)) {
                suggestionSet.add(product.category);
            }

            // Add matching brands/keywords from descriptions
            const words = product.description.toLowerCase().split(' ');
            words.forEach(word => {
                if (word.includes(lowerQuery) && word.length > 2) {
                    suggestionSet.add(word);
                }
            });

            // Add matching badges
            if (product.badge && product.badge.toLowerCase().includes(lowerQuery)) {
                suggestionSet.add(product.badge);
            }
        });

        return Array.from(suggestionSet).slice(0, 8); // Limit to 8 suggestions
    }, []);

    // Enhanced search function with proper debouncing
    const performSearch = useCallback((query: string) => {
        // Clear any existing timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        setSearchQuery(query);

        // If query is empty, clear results immediately
        if (!query.trim()) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);        // Set new timeout for debounced search
        const newTimeout = setTimeout(() => {
            const searchStartTime = performance.now();

            // Check cache first
            const cachedResults = getCachedSearchResults(query, filters, sortBy);
            if (cachedResults) {
                setSearchResults(cachedResults);
                setIsSearching(false);

                // Still track the search for analytics
                trackSearchQuery(query);
                if (query.trim() && query.trim().length > 1) {
                    setSearchHistory(prevHistory => {
                        const newHistory = [query.trim(), ...prevHistory.filter(item => item !== query.trim())].slice(0, 10);
                        saveSearchHistoryToStorage(newHistory);
                        return newHistory;
                    });
                }
                return;
            }

            // Track search analytics
            trackSearchQuery(query);

            // Add to search history if it's a meaningful search
            if (query.trim() && query.trim().length > 1) {
                setSearchHistory(prevHistory => {
                    const newHistory = [query.trim(), ...prevHistory.filter(item => item !== query.trim())].slice(0, 10);
                    saveSearchHistoryToStorage(newHistory);
                    return newHistory;
                });
            }

            // Perform the actual search
            let results = searchProducts(query);
            // Apply filters
            if (filters.category !== 'all') {
                results = results.filter(product => product.category === filters.category);
            }

            if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
                results = results.filter(product =>
                    product.price >= filters.priceRange[0] &&
                    product.price <= filters.priceRange[1]
                );
            }

            if (filters.rating > 0) {
                results = results.filter(product => product.rating >= filters.rating);
            }

            if (filters.inStock) {
                results = results.filter(product => product.inStock);
            }

            if (filters.color !== 'all') {
                results = results.filter(product => product.color.toLowerCase() === filters.color.toLowerCase());
            }

            if (filters.hasDiscount) {
                results = results.filter(product => product.discount && product.discount > 0);
            }

            if (filters.badge !== 'all') {
                results = results.filter(product => product.badge && product.badge.toLowerCase() === filters.badge.toLowerCase());
            }

            // Apply sorting
            if (sortBy !== 'relevance') {
                results = sortProducts(results, sortBy);
            }

            // Track search performance timing
            const searchEndTime = performance.now();
            const searchTime = searchEndTime - searchStartTime;
            const performanceData = getSearchPerformanceFromStorage();
            performanceData.searchTimes = performanceData.searchTimes || [];
            performanceData.searchTimes.push(searchTime);
            // Keep only last 100 search times to avoid excessive storage
            if (performanceData.searchTimes.length > 100) {
                performanceData.searchTimes = performanceData.searchTimes.slice(-100);
            }
            saveSearchPerformanceToStorage(performanceData);

            // Cache the search results
            setCachedSearchResults(query, filters, sortBy, results);

            setSearchResults(results);
            setIsSearching(false);
        }, 300); // 300ms debounce delay

        setSearchTimeout(newTimeout);
    }, [searchTimeout, filters, sortBy]);

    // Apply filters to current search results
    const applyFilters = useCallback(() => {
        if (searchQuery) {
            performSearch(searchQuery);
        }
    }, [searchQuery, performSearch]);

    // Clear search
    const clearSearch = useCallback(() => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        setSearchQuery('');
        setSearchResults([]);
        setSuggestions([]);
        setFilters(defaultFilters);
        setIsSearching(false);
    }, [searchTimeout]);

    // Clear search history
    const clearSearchHistory = useCallback(() => {
        setSearchHistory([]);
        saveSearchHistoryToStorage([]);
    }, []);

    // Update suggestions when search query changes
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const newSuggestions = generateSuggestions(searchQuery);
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, generateSuggestions]); return (
        <SearchContext.Provider value={{
            searchQuery,
            setSearchQuery,
            searchResults,
            setSearchResults,
            isSearching,
            setIsSearching,
            filters,
            setFilters,
            sortBy,
            setSortBy,
            suggestions,
            searchHistory,
            performSearch,
            clearSearch,
            clearSearchHistory,
            applyFilters,
            getAvailableColors,
            getAvailableBadges,
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

// Export SearchProvider as default to satisfy fast refresh
export default SearchProvider;
