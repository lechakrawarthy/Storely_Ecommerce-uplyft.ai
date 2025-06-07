import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { itemCount, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between glass-card px-8 py-4 mx-6 mt-6 rounded-3xl">
      {/* Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
        <div className="text-3xl font-black text-gray-900">S</div>
        <span className="text-xl font-medium text-gray-900">torely</span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 mx-8 max-w-md relative">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full rounded-full bg-gray-50 px-6 py-3 pr-12 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-pastel-400 focus:bg-white transition-all"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
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
    </header>
  );
};

export default Navigation;
