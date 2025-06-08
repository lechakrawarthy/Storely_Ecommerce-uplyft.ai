import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Filter, ArrowRight } from '../utils/icons';
import { useSwipe } from '../hooks/use-swipe';

interface MobileSearchBarAdvancedProps {
    onSearch: (query: string) => void;
    onCategoryFilter: (category: string) => void;
    placeholder?: string;
    categories: string[];
    selectedCategory: string;
}

const MobileSearchBarAdvanced: React.FC<MobileSearchBarAdvancedProps> = ({
    onSearch,
    onCategoryFilter,
    placeholder = 'Search for books...',
    categories,
    selectedCategory,
}) => {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [trendingSearches] = useState([
        'Fiction Books',
        'Programming',
        'Self Help',
        'Science Fiction',
        'Biography',
        'History',
    ]);
    const [quickFilters, setQuickFilters] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('bookbuddy-recent-searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recent searches:', error);
            }
        }
    }, []);

    // Save recent searches to localStorage
    const saveSearch = (searchQuery: string) => {
        if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
            const newRecentSearches = [searchQuery, ...recentSearches.slice(0, 4)];
            setRecentSearches(newRecentSearches);
            localStorage.setItem('bookbuddy-recent-searches', JSON.stringify(newRecentSearches));
        }
    };

    const handleSearch = (searchQuery: string) => {
        setQuery(searchQuery);
        onSearch(searchQuery);
        saveSearch(searchQuery);
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const handleClear = () => {
        setQuery('');
        onSearch('');
        inputRef.current?.focus();
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('bookbuddy-recent-searches');
    };
    // Swipe gesture for category filters
    useSwipe({
        onSwipeLeft: () => {
            if (quickFilters < Math.ceil(categories.length / 3) - 1) {
                setQuickFilters(quickFilters + 1);
            }
        },
        onSwipeRight: () => {
            if (quickFilters > 0) {
                setQuickFilters(quickFilters - 1);
            }
        },
    });

    const getVisibleCategories = () => {
        const startIndex = quickFilters * 3;
        return categories.slice(startIndex, startIndex + 3);
    };

    return (
        <div className="relative w-full">
            {/* Search Input */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={placeholder}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                    className="w-full pl-12 pr-12 py-4 text-lg glass-subtle rounded-2xl border-2 border-white/20 focus:border-sage-300 focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-500 transition-all"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Quick Category Filters */}
            <div ref={categoriesRef} className="mt-4 overflow-hidden touch-pan-x">
                <div className="flex gap-2 pb-2">
                    {getVisibleCategories().map((category) => (
                        <button
                            key={category}
                            onClick={() => onCategoryFilter(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${selectedCategory === category
                                ? 'bg-sage-500 text-white shadow-md'
                                : 'glass-subtle border border-white/20 text-gray-700 hover:glass-strong'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                    {categories.length > 3 && (
                        <div className="flex items-center text-xs text-gray-500 px-2">
                            {quickFilters + 1} / {Math.ceil(categories.length / 3)}
                        </div>
                    )}
                </div>

                {/* Swipe Indicator */}
                {categories.length > 3 && (
                    <div className="flex justify-center mt-2">
                        <div className="flex gap-1">
                            {Array.from({ length: Math.ceil(categories.length / 3) }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${quickFilters === index ? 'bg-sage-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Search Suggestions Overlay */}
            {isFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                    <div className="p-4">
                        {/* Recent Searches */}
                        {recentSearches.length > 0 && (
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                                    </div>
                                    <button
                                        onClick={clearRecentSearches}
                                        className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {recentSearches.map((search, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSearch(search)}
                                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                        >
                                            <span className="text-gray-700 text-left">{search}</span>
                                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trending Searches */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="w-4 h-4 text-sage-500" />
                                <span className="text-sm font-medium text-gray-700">Trending</span>
                            </div>
                            <div className="space-y-2">
                                {trendingSearches.map((search, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearch(search)}
                                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-sage-50 transition-colors group"
                                    >
                                        <span className="text-gray-700 text-left">{search}</span>
                                        <ArrowRight className="w-4 h-4 text-sage-400 group-hover:text-sage-600 transition-colors" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isFocused && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsFocused(false)}
                />
            )}
        </div>
    );
};

export default MobileSearchBarAdvanced;
