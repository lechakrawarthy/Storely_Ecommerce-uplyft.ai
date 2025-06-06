
import React, { useState } from 'react';
import { Search, Book, Home, MessageCircle, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  const [cartCount] = useState(0);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-pastel-200/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="relative glass-gold p-2 rounded-full">
              <div className="text-2xl">📖</div>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gold-400 rounded-full animate-sparkle"></div>
            </div>
            <span className="text-xl font-bold font-poppins">
              <span className="bg-gradient-to-r from-pastel-600 to-pastel-700 bg-clip-text text-transparent">Book</span>
              <span className="bg-gradient-to-r from-sage-600 to-sage-700 bg-clip-text text-transparent">Buddy</span>
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-1 text-sage-700 hover:text-pastel-600 transition-colors duration-200 font-medium"
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button 
              onClick={() => scrollToSection('books')}
              className="flex items-center space-x-1 text-sage-700 hover:text-sage-600 transition-colors duration-200 font-medium"
            >
              <Book size={18} />
              <span>Books</span>
            </button>
            <button 
              onClick={() => scrollToSection('categories')}
              className="text-sage-700 hover:text-gold-600 transition-colors duration-200 font-medium"
            >
              Categories
            </button>
            <button 
              onClick={() => scrollToSection('chatbot')}
              className="flex items-center space-x-1 text-sage-700 hover:text-pastel-600 transition-colors duration-200 font-medium"
            >
              <MessageCircle size={18} />
              <span>Chat</span>
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-pastel-50 rounded-full transition-colors duration-200">
              <Search size={20} className="text-sage-600" />
            </button>
            <button className="relative p-2 hover:bg-sage-50 rounded-full transition-colors duration-200">
              <ShoppingCart size={20} className="text-sage-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </button>
            <Link 
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pastel-500 to-sage-500 text-white rounded-full font-medium hover:shadow-soft-hover transition-all duration-200 glass"
            >
              <User size={16} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
