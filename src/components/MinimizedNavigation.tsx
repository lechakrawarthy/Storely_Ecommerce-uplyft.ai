import React from 'react';
import { ArrowLeft, Search, Heart, ShoppingBag, User, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

interface MinimizedNavigationProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

const MinimizedNavigation: React.FC<MinimizedNavigationProps> = ({
    onBack,
    showBackButton = true
}) => {
    const { itemCount, toggleCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    const goHome = () => {
        navigate('/');
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
                    </div>

                    {/* Center Section - Compact Search */}
                    <div className="flex-1 mx-4 max-w-md hidden md:block">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full rounded-full bg-gray-50 px-4 py-2 pr-10 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                            >
                                <Search className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex items-center gap-2">
                        {/* Mobile Search */}
                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
                            <Search className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Home Button */}
                        <button
                            onClick={goHome}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Go to home"
                        >
                            <Home className="w-5 h-5 text-gray-600" />
                        </button>

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
