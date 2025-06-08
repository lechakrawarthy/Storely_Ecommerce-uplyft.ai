import React, { useEffect } from 'react';
import { X, Search, Heart, User, LogOut, Home, ShoppingBag, Settings, HelpCircle, Star, Clock, BarChart3 } from '../utils/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../contexts/CartContext';

interface MobileMenuOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSearchSubmit: (e: React.FormEvent) => void;
}

const MobileMenuOverlay: React.FC<MobileMenuOverlayProps> = ({
    isOpen,
    onClose,
    searchQuery,
    onSearchChange,
    onSearchSubmit
}) => {
    const { user, isAuthenticated, logout } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNavigation = (path: string) => {
        navigate(path);
        onClose();
    };

    const handleLogout = () => {
        logout();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Menu Panel */}
            <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-out">        {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="text-2xl font-black text-gray-900">B</div>
                        <span className="text-lg font-medium text-gray-900">ookBuddy</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                {/* Search Section */}
                <div className="p-6 border-b border-gray-100">
                    <form onSubmit={onSearchSubmit} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search products..."
                            className="w-full rounded-2xl bg-gray-50 px-4 py-4 pr-12 text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-pastel-400 focus:bg-white transition-all"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </form>
                </div>

                {/* User Profile Section */}
                {isAuthenticated && user ? (
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-pastel-50 to-sage-50 rounded-2xl">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                                <img
                                    src={user.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                    </div>
                ) : null}

                {/* Menu Items */}
                <div className="flex-1 py-6">
                    <nav className="space-y-1 px-4">
                        {/* Home */}
                        <button
                            onClick={() => handleNavigation('/')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-gray-100 rounded-xl group-hover:bg-gray-200 transition-colors">
                                <Home className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-800">Home</span>
                        </button>

                        {/* Wishlist */}
                        <button
                            onClick={() => handleNavigation('/wishlist')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                <Heart className="w-5 h-5 text-red-500" />
                            </div>
                            <span className="font-medium text-gray-800">Wishlist</span>
                        </button>

                        {/* Cart */}
                        <button
                            onClick={() => handleNavigation('/cart')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="relative p-2 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                                <ShoppingBag className="w-5 h-5 text-blue-600" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                                        {itemCount}
                                    </span>
                                )}
                            </div>
                            <span className="font-medium text-gray-800">Cart</span>
                            {itemCount > 0 && (
                                <span className="ml-auto text-sm text-gray-500">({itemCount})</span>
                            )}            </button>

                        {/* Comparison */}
                        <button
                            onClick={() => handleNavigation('/comparison')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <BarChart3 className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-800">Compare</span>
                        </button>

                        {/* Recently Viewed */}
                        <button
                            onClick={() => handleNavigation('/recently-viewed')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                                <Clock className="w-5 h-5 text-indigo-600" />
                            </div>
                            <span className="font-medium text-gray-800">Recently Viewed</span>
                        </button>

                        {/* Orders */}
                        <button
                            onClick={() => handleNavigation('/orders')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-green-50 rounded-xl group-hover:bg-green-100 transition-colors">
                                <Star className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-800">My Orders</span>
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => handleNavigation('/settings')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-purple-50 rounded-xl group-hover:bg-purple-100 transition-colors">
                                <Settings className="w-5 h-5 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-800">Settings</span>
                        </button>

                        {/* Help */}
                        <button
                            onClick={() => handleNavigation('/help')}
                            className="flex items-center gap-4 w-full p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-yellow-50 rounded-xl group-hover:bg-yellow-100 transition-colors">
                                <HelpCircle className="w-5 h-5 text-yellow-600" />
                            </div>
                            <span className="font-medium text-gray-800">Help & Support</span>
                        </button>
                    </nav>
                </div>

                {/* Bottom Section */}
                <div className="p-6 border-t border-gray-200">
                    {isAuthenticated ? (
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-4 w-full p-4 hover:bg-red-50 rounded-2xl transition-colors group"
                        >
                            <div className="p-2 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors">
                                <LogOut className="w-5 h-5 text-red-600" />
                            </div>
                            <span className="font-medium text-red-700">Logout</span>
                        </button>
                    ) : (
                        <Link
                            to="/login"
                            onClick={onClose}
                            className="flex items-center gap-4 w-full p-4 bg-gradient-to-r from-pastel-400 to-sage-500 text-white rounded-2xl transition-all shadow-md hover:shadow-lg group"
                        >
                            <div className="p-2 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                                <User className="w-5 h-5" />
                            </div>
                            <span className="font-semibold">Login / Sign Up</span>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenuOverlay;
