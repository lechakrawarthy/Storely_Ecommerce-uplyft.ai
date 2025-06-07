import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Product } from '../components/BooksSection';

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
}

export interface SearchFilters {
    category: string;
    priceRange: [number, number];
    rating: number;
    inStock: boolean;
}

export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';

const SearchContext = createContext<SearchContextType | undefined>(undefined);

const defaultFilters: SearchFilters = {
    category: 'all',
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
};

export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
    const [sortBy, setSortBy] = useState<SortOption>('relevance');

    return (
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
