import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, LogOut, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useSearch } from '../contexts/SearchContext';

const Navigation = () => {
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setSearchQuery(localSearchQuery);
      navigate(`/search?q=${encodeURIComponent(localSearchQuery.trim())}`);
    }
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
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 mx-8 max-w-md relative">
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
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
            </button>

            {/* Heart/Wishlist */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Heart className="w-6 h-6 text-red-500 fill-current" />
            </button>

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
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={handleLogoClick}>
            <div className="text-2xl font-black text-gray-900">S</div>
            <span className="text-lg font-medium text-gray-900">torely</span>
          </div>

          {/* Mobile Icons */}
          <div className="flex items-center gap-2">
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

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white rounded-b-2xl">
            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full bg-gray-50 px-4 py-3 pr-12 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-400 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* Mobile Menu Items */}
            <div className="p-4 space-y-3">
              {/* Wishlist */}
              <button
                onClick={closeMobileMenu}
                className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <Heart className="w-5 h-5 text-red-500 fill-current" />
                <span className="text-gray-800 font-medium">Wishlist</span>
              </button>

              {/* User Profile Section */}
              {isAuthenticated && user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="flex items-center gap-3 w-full p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span className="text-gray-800 font-medium">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 w-full p-3 bg-lime-300 hover:bg-lime-400 text-black font-semibold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  <User className="w-5 h-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Navigation;
