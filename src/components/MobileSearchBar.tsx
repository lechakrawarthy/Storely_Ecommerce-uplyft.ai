import React, { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp, X, Filter, SlidersHorizontal } from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../contexts/SearchContext';

interface MobileSearchBarProps {
    onFilterToggle?: () => void;
    showFilterButton?: boolean;
}

const MobileSearchBar: React.FC<MobileSearchBarProps> = ({
    onFilterToggle,
    showFilterButton = false
}) => {
    const { searchQuery, setSearchQuery, suggestions, searchHistory, performSearch } = useSearch();
    const navigate = useNavigate();
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localSearchQuery.trim()) {
            performSearch(localSearchQuery.trim());
            navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
            setShowSuggestions(false);
            setIsFocused(false);
            inputRef.current?.blur();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        setSearchQuery(value);
        setShowSuggestions(value.length >= 2 || (value.length === 0 && searchHistory.length > 0));
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalSearchQuery(suggestion);
        setSearchQuery(suggestion);
        performSearch(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestions(false);
        setIsFocused(false);
        inputRef.current?.blur();
    };

    const clearSearch = () => {
        setLocalSearchQuery('');
        setSearchQuery('');
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <span key={index} className="font-semibold text-gray-900">{part}</span> :
                part
        );
    };

    return (
        <div ref={searchRef} className="relative w-full">
            {/* Search Input Container */}
            <form onSubmit={handleSearch} className="relative">
                <div className={`flex items-center bg-white rounded-2xl border-2 transition-all duration-200 ${isFocused ? 'border-pastel-400 shadow-lg' : 'border-gray-200'
                    }`}>
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <input
                            ref={inputRef}
                            type="text"
                            value={localSearchQuery}
                            onChange={handleInputChange}
                            onFocus={() => {
                                setIsFocused(true);
                                setShowSuggestions(localSearchQuery.length >= 2 || searchHistory.length > 0);
                            }}
                            placeholder="Search products..."
                            className="w-full pl-4 pr-10 py-4 bg-transparent text-gray-800 text-base placeholder-gray-500 focus:outline-none"
                        />

                        {/* Clear Button */}
                        {localSearchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        )}
                    </div>

                    {/* Filter Button */}
                    {showFilterButton && (
                        <button
                            type="button"
                            onClick={onFilterToggle}
                            className="p-3 mx-1 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                        </button>
                    )}

                    {/* Search Button */}
                    <button
                        type="submit"
                        className="p-3 mx-1 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (isFocused || localSearchQuery) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 max-h-80 overflow-y-auto mt-2">
                    {/* Recent Searches */}
                    {!localSearchQuery && searchHistory.length > 0 && (
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <Clock className="w-4 h-4" />
                                <span>Recent Searches</span>
                            </div>
                            {searchHistory.slice(0, 5).map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(search)}
                                    className="block w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Live Suggestions */}
                    {localSearchQuery && suggestions.length > 0 && (
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <TrendingUp className="w-4 h-4" />
                                <span>Suggestions</span>
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="block w-full text-left px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    {highlightMatch(suggestion, localSearchQuery)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No suggestions */}
                    {localSearchQuery && suggestions.length === 0 && searchHistory.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No suggestions found</p>
                            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>
            )}

            {/* Backdrop for suggestions */}
            {showSuggestions && (isFocused || localSearchQuery) && (
                <div
                    className="fixed inset-0 bg-black/20 z-40"
                    onClick={() => {
                        setShowSuggestions(false);
                        setIsFocused(false);
                    }}
                />
            )}
        </div>
    );
};

export default MobileSearchBar;
