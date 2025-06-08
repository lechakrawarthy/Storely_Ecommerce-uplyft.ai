import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Eye, Share2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useToast } from './ui/use-toast';
import hapticFeedback from '../utils/hapticFeedback';
import { type Product } from '../data/products';

interface MobileProductCardProps {
    product: Product;
    viewMode?: 'grid' | 'list';
    onWishlistToggle?: (id: string) => void;
    isInWishlist?: boolean;
}

const MobileProductCard: React.FC<MobileProductCardProps> = ({
    product,
    viewMode = 'grid',
    onWishlistToggle,
    isInWishlist = false
}) => {
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { toast } = useToast();
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    const navigateToProduct = () => {
        navigate(`/product/${product.id}`);
    };
    const addToCart = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!product.inStock) return;

        addItem(product);
        // Add haptic feedback for cart addition
        hapticFeedback.success();
        toast({
            title: "Added to cart!",
            description: `${product.title} has been added to your cart.`,
            duration: 3000,
        });
    };
    const toggleWishlist = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onWishlistToggle) {
            // Add haptic feedback for wishlist toggle
            hapticFeedback.selection();
            onWishlistToggle(product.id);
        }
    };

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (navigator.share) {
            try {
                await navigator.share({
                    title: product.title,
                    text: `Check out this product: ${product.title}`,
                    url: `${window.location.origin}/product/${product.id}`,
                });
            } catch (error) {
                // User cancelled or error occurred
            }
        } else {
            // Fallback for browsers that don't support Web Share API
            navigator.clipboard.writeText(`${window.location.origin}/product/${product.id}`);
            toast({
                title: "Link copied!",
                description: "Product link has been copied to clipboard.",
                duration: 2000,
            });
        }
    };

    const getBadgeColor = (badge: string) => {
        switch (badge.toLowerCase()) {
            case 'bestseller':
                return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
            case 'new':
                return 'bg-gradient-to-r from-green-400 to-emerald-500 text-white';
            case 'hot deal':
                return 'bg-gradient-to-r from-red-400 to-rose-500 text-white';
            case 'trending':
                return 'bg-gradient-to-r from-purple-400 to-violet-500 text-white';
            default:
                return 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white';
        }
    };

    if (viewMode === 'list') {
        return (
            <div
                onClick={navigateToProduct}
                className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 cursor-pointer group active:scale-98"
            >
                {/* Product Image */}
                <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28">
                    <div className="w-full h-full rounded-xl overflow-hidden bg-gray-100">
                        {!imageError ? (
                            <img
                                src={product.image}
                                alt={product.title}
                                className={`w-full h-full object-cover transition-all duration-300 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
                                    }`}
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 text-xs">No Image</span>
                            </div>
                        )}

                        {/* Loading skeleton */}
                        {!imageLoaded && !imageError && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-xl" />
                        )}
                    </div>

                    {/* Badge */}
                    {product.badge && (
                        <span className={`absolute -top-1 -right-1 px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(product.badge)} shadow-lg transform scale-90`}>
                            {product.badge}
                        </span>
                    )}

                    {/* Stock Overlay */}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">Out of Stock</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2 group-hover:text-pastel-600 transition-colors">
                            {product.title}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-1">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(product.rating)
                                                ? 'text-yellow-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-500">({product.rating})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                            {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                        <button
                            onClick={addToCart}
                            disabled={!product.inStock}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl font-medium text-sm transition-all ${product.inStock
                                    ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
                        </button>

                        <button
                            onClick={toggleWishlist}
                            className={`p-2 rounded-xl border transition-all ${isInWishlist
                                    ? 'bg-red-50 border-red-200 text-red-500'
                                    : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Grid view
    return (
        <div
            onClick={navigateToProduct}
            className="group cursor-pointer bg-white rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-300 overflow-hidden active:scale-98"
        >
            {/* Product Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                {!imageError ? (
                    <img
                        src={product.image}
                        alt={product.title}
                        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                    </div>
                )}

                {/* Loading skeleton */}
                {!imageLoaded && !imageError && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                )}

                {/* Badge */}
                {product.badge && (
                    <span className={`absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(product.badge)} shadow-lg`}>
                        {product.badge}
                    </span>
                )}

                {/* Quick Actions Overlay */}
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={toggleWishlist}
                            className={`p-2 rounded-full backdrop-blur-md transition-all ${isInWishlist
                                    ? 'bg-red-500 text-white'
                                    : 'bg-white/80 text-gray-700 hover:bg-white'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
                        </button>

                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Stock Overlay */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-black/70 px-3 py-1 rounded-full text-sm">
                            Out of Stock
                        </span>
                    </div>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-pastel-600 transition-colors mb-2">
                    {product.title}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.rating})</span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                    )}
                </div>

                {/* Add to Cart Button */}
                <button
                    onClick={addToCart}
                    disabled={!product.inStock}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium text-sm transition-all ${product.inStock
                            ? 'bg-gray-900 text-white hover:bg-gray-800 active:scale-95'
                            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    <ShoppingCart className="w-4 h-4" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
};

export default MobileProductCard;
