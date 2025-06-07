import React, { useState, useRef, useEffect } from "react";
import { Search, X, Clock, TrendingUp, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../contexts/SearchContext";
import SearchHistoryManager from "./SearchHistoryManager";

interface SearchBarProps {
    className?: string;
    placeholder?: string;
    showSuggestions?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
    className = "",
    placeholder = "Search products, categories, or brands...",
    showSuggestions = true
}) => {
    const { searchQuery, setSearchQuery, suggestions, searchHistory, performSearch } = useSearch();
    const [localQuery, setLocalQuery] = useState("");
    const [showSuggestionsList, setShowSuggestionsList] = useState(false);
    const [showHistoryManager, setShowHistoryManager] = useState(false);
    const navigate = useNavigate();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestionsList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            performSearch(localQuery.trim());
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
            setShowSuggestionsList(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalQuery(value);
        setSearchQuery(value);
        setShowSuggestionsList(value.length >= 2);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalQuery(suggestion);
        setSearchQuery(suggestion);
        performSearch(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestionsList(false);
    };

    const clearSearch = () => {
        setLocalQuery("");
        setSearchQuery("");
        setShowSuggestionsList(false);
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
        <div ref={searchRef} className={`relative ${className}`}>
            <form onSubmit={handleSubmit} className="w-full flex items-center bg-white rounded-2xl shadow-lg px-6 py-4 mb-6 max-w-2xl mx-auto">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                    ref={inputRef}
                    type="text"
                    value={localQuery}
                    onChange={handleInputChange}
                    onFocus={() => setShowSuggestionsList(localQuery.length >= 2)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent outline-none text-lg text-gray-800 font-medium placeholder-gray-400"
                />
                {localQuery && (
                    <button
                        type="button"
                        onClick={clearSearch}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>
                )}
                <button
                    type="submit"
                    className="ml-4 p-2 rounded-full bg-lime-300 hover:bg-lime-400 transition-colors"
                >
                    <Search className="w-5 h-5 text-gray-700" />
                </button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && showSuggestionsList && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">                    {/* Recent Searches */}
                    {!localQuery && searchHistory.length > 0 && (
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock className="w-4 h-4" />
                                    <span>Recent Searches</span>
                                </div>
                                <button
                                    onClick={() => setShowHistoryManager(true)}
                                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <Settings className="w-3 h-3" />
                                    Manage
                                </button>
                            </div>
                            {searchHistory.slice(0, 5).map((search, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(search)}
                                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Live Suggestions */}
                    {localQuery && suggestions.length > 0 && (
                        <div className="p-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                                <TrendingUp className="w-4 h-4" />
                                <span>Suggestions</span>
                            </div>
                            {suggestions.map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                                >
                                    {highlightMatch(suggestion, localQuery)}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* No suggestions */}
                    {localQuery && suggestions.length === 0 && (
                        <div className="p-4 text-center text-gray-500">
                            No suggestions found
                        </div>)}
                </div>
            )}

            {/* Search History Manager Modal */}
            <SearchHistoryManager
                isOpen={showHistoryManager}
                onClose={() => setShowHistoryManager(false)}
            />
        </div>
    );
};

export default SearchBar;
