import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Clock, Trash2, Heart, ShoppingCart, Star } from '../utils/icons';
import { useRecentlyViewed } from '../hooks/use-recently-viewed';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/use-toast';
import { useIsMobile } from '../hooks/use-mobile';
import hapticFeedback from '../utils/hapticFeedback';
import MobileProductCard from '../components/MobileProductCard';
import { type Product } from '../data/products';

const RecentlyViewed = () => {
    const { recentlyViewed, clearRecentlyViewed, removeFromRecentlyViewed } = useRecentlyViewed();
    const { wishlist, toggleWishlist } = useWishlist();
    const { addItem } = useCart();
    const { toast } = useToast();
    const isMobile = useIsMobile();

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product);
        hapticFeedback.success();
        toast({
            title: "Added to cart!",
            description: `${product.title} has been added to your cart.`,
            duration: 3000,
        });
    };

    const handleWishlistToggle = (productId: string) => {
        toggleWishlist(productId);
        hapticFeedback.selection();
    };

    const handleClearAll = () => {
        clearRecentlyViewed();
        hapticFeedback.medium();
        toast({
            title: "History cleared",
            description: "All recently viewed products have been removed.",
            duration: 2000,
        });
    };

    const handleRemoveItem = (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        removeFromRecentlyViewed(productId);
        hapticFeedback.light();
        toast({
            title: "Item removed",
            description: "Product removed from recently viewed.",
            duration: 2000,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
                <div className="flex items-center justify-between p-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Back</span>
                    </Link>
                    <h1 className="font-semibold text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recently Viewed
                    </h1>
                    {recentlyViewed.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="text-sm text-red-600 hover:text-red-700 transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {recentlyViewed.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-500 mb-4">
                            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No recently viewed items</h3>
                            <p className="text-gray-500 mb-6">
                                Products you browse will appear here for easy access
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse Products
                            </Link>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Recently Viewed</p>
                                    <p className="text-2xl font-bold text-gray-900">{recentlyViewed.length} products</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Last viewed</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {new Date().toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className={`${isMobile
                            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
                            : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            }`}>
                            {recentlyViewed.map((product) => (
                                <div key={product.id} className="relative group">
                                    {/* Remove button */}
                                    <button
                                        onClick={(e) => handleRemoveItem(product.id, e)}
                                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>

                                    {isMobile ? (
                                        <MobileProductCard
                                            product={product}
                                            viewMode="grid"
                                            isInWishlist={wishlist.includes(product.id)}
                                            onWishlistToggle={handleWishlistToggle}
                                        />
                                    ) : (
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="block bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
                                        >
                                            <div className="aspect-square bg-gray-100 overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                                                    {product.title}
                                                </h3>
                                                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                handleWishlistToggle(product.id);
                                                                e.preventDefault();
                                                            }}
                                                            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                        >
                                                            <Heart
                                                                className={`w-4 h-4 ${wishlist.includes(product.id)
                                                                    ? 'fill-red-500 text-red-500'
                                                                    : 'text-gray-400'
                                                                    }`}
                                                            />
                                                        </button>
                                                        {product.inStock && (
                                                            <button
                                                                onClick={(e) => handleAddToCart(product, e)}
                                                                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                            >
                                                                <ShoppingCart className="w-4 h-4 text-gray-600" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecentlyViewed;
