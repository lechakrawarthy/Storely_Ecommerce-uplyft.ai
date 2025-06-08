import React, { useState, useRef, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, LogOut, Menu, X, Clock, TrendingUp } from '../utils/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';
import MobileMenuOverlay from './MobileMenuOverlay';
import MobileSearchBar from './MobileSearchBar';
import MobileSearchBarAdvanced from './MobileSearchBarAdvanced';

const Navigation = () => {
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth(); const { searchQuery, setSearchQuery, suggestions, searchHistory, performSearch } = useSearch();
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  }, []);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
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
  const handleLogoClick = () => {
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-card mx-4 lg:mx-6 mt-4 lg:mt-6 rounded-2xl lg:rounded-3xl">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="text-3xl font-black text-gray-900">S</div>
            <span className="text-xl font-medium text-gray-900">torely</span>
          </div>          {/* Enhanced Search Bar */}
          <div ref={searchRef} className="flex-1 mx-8 max-w-md relative">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={localSearchQuery}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(localSearchQuery.length >= 2)}
                placeholder="Search products..."
                className="w-full rounded-full bg-gray-50 px-6 py-3 pr-12 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-400 focus:bg-white transition-all"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto mt-2">
                {/* Recent Searches */}                {!localSearchQuery && searchHistory.length > 0 && (
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>Recent Searches</span>
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
                        className="block w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors text-gray-700"
                      >
                        {highlightMatch(suggestion, localSearchQuery)}
                      </button>
                    ))}
                  </div>
                )}

                {/* No suggestions */}
                {localSearchQuery && suggestions.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    No suggestions found
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Icons & Profile */}
          <div className="flex items-center gap-4">
            {/* Shopping Bag */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {itemCount}
                </span>
              )}
            </button>            {/* Heart/Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Heart className="w-6 h-6 text-red-500 fill-current" />
            </Link>

            {/* User Profile */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-full px-3 py-2 transition-colors">
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    <img
                      src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 bg-lime-300 hover:bg-lime-400 text-black font-semibold px-4 py-2 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="text-2xl font-black text-gray-900">S</div>
            <span className="text-lg font-medium text-gray-900">torely</span>
          </div>          {/* Mobile Icons */}
          <div className="flex items-center gap-2">            {/* Search Toggle (Mobile) */}
            <MobileSearchBarAdvanced
              onSearch={handleSuggestionClick}
              onCategoryFilter={(category) => {
                navigate(`/search?category=${encodeURIComponent(category)}`);
              }}
              categories={['All', 'Books', 'Electronics', 'Textiles', 'Fashion']}
              selectedCategory="All"
              placeholder="Search for books..."
            />

            {/* Shopping Bag */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>
      </header>      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        searchQuery={localSearchQuery}
        onSearchChange={setLocalSearchQuery}
        onSearchSubmit={handleSearch}
      />
    </>
  );
};

export default Navigation;
