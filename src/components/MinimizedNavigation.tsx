import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Search, Heart, ShoppingBag, User, Home, Clock, TrendingUp } from '../utils/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../contexts/SearchContext';

interface MinimizedNavigationProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

const MinimizedNavigation: React.FC<MinimizedNavigationProps> = ({
    onBack,
    showBackButton = true
}) => {
    const { itemCount, toggleCart } = useCart();
    const { user, isAuthenticated } = useAuth(); const { searchQuery, setSearchQuery, suggestions, searchHistory, performSearch } = useSearch();
    const navigate = useNavigate();
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []); const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const goHome = () => {
        navigate('/');
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localSearchQuery.trim()) {
            performSearch(localSearchQuery.trim());
            navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchQuery(value);
        setSearchQuery(value);
        setShowSuggestions(value.length >= 2);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setLocalSearchQuery(suggestion);
        setSearchQuery(suggestion);
        performSearch(suggestion);
        navigate(`/search?q=${encodeURIComponent(suggestion)}`);
        setShowSuggestions(false);
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left Section - Back Button & Logo */}
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        {/* Minimized Logo */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={goHome}
                        >
                            <div className="text-2xl font-black text-gray-900">S</div>
                            <span className="text-lg font-medium text-gray-900 hidden sm:block">torely</span>
                        </div>
                    </div>                    {/* Center Section - Enhanced Compact Search */}
                    <div ref={searchRef} className="flex-1 mx-4 max-w-md hidden md:block relative">
                        <form onSubmit={handleSearch}>
                            <input
                                type="text"
                                value={localSearchQuery}
                                onChange={handleInputChange}
                                onFocus={() => setShowSuggestions(localSearchQuery.length >= 2)}
                                placeholder="Search..."
                                className="w-full rounded-full bg-gray-50 px-4 py-2 pr-10 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                            >
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </form>

                        {/* Compact Search Suggestions */}
                        {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto mt-1">                                {/* Recent Searches */}
                                {!localSearchQuery && searchHistory.length > 0 && (
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <Clock className="w-3 h-3" />
                                            <span>Recent</span>
                                        </div>
                                        {searchHistory.slice(0, 3).map((search, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(search)}
                                                className="block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors text-gray-700"
                                            >
                                                {search}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Live Suggestions */}
                                {localSearchQuery && suggestions.length > 0 && (
                                    <div className="p-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                            <TrendingUp className="w-3 h-3" />
                                            <span>Suggestions</span>
                                        </div>
                                        {suggestions.slice(0, 5).map((suggestion, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="block w-full text-left px-2 py-1.5 text-sm rounded hover:bg-gray-50 transition-colors text-gray-700"
                                            >
                                                {highlightMatch(suggestion, localSearchQuery)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Search */}
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>                        {/* Home Button */}
                        <button
                            onClick={goHome}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Go to home"
                        >
                            <Home className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Development: Search Test Page (only in development) */}
                        {process.env.NODE_ENV === 'development' && (
                            <Link
                                to="/search-test"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Search Test Suite"
                            >
                                <div className="w-5 h-5 text-gray-600 text-xs font-bold flex items-center justify-center">
                                    T
                                </div>
                            </Link>
                        )}

                        {/* Wishlist */}
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Heart className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Shopping Cart */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 text-gray-600" />
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* User Profile */}
                        {isAuthenticated && user ? (
                            <div className="flex items-center gap-2 pl-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-pastel-400 to-sage-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-semibold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-700 hidden lg:block">
                                    {user.name}
                                </span>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <User className="w-5 h-5 text-gray-600" />
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default MinimizedNavigation;
