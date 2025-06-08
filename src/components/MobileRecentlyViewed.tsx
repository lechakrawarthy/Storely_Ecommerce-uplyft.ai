import React from 'react';
import { Clock, X, ArrowRight, Eye } from 'lucide-react';
import { useRecentlyViewed } from '../hooks/use-recently-viewed';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { type Product } from '../data/products';
import OptimizedImage from './OptimizedImage';

interface MobileRecentlyViewedProps {
    className?: string;
}

const MobileRecentlyViewed: React.FC<MobileRecentlyViewedProps> = ({ className = '' }) => {
    const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
    const { wishlist, toggleWishlist } = useWishlist();
    const { addItem } = useCart();
    const navigate = useNavigate();

    if (recentlyViewed.length === 0) {
        return null;
    }

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };
    const addToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product);
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-sage-100 rounded-full">
                            <Clock className="w-5 h-5 text-sage-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Recently Viewed</h3>
                            <p className="text-sm text-gray-500">{recentlyViewed.length} item{recentlyViewed.length !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    <button
                        onClick={clearRecentlyViewed}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Clear all"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Products List */}
            <div className="p-4">
                <div className="space-y-3">
                    {recentlyViewed.slice(0, 5).map((product) => (
                        <div
                            key={product.id}
                            onClick={() => handleProductClick(product.id)}
                            className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group"
                        >
                            {/* Product Image */}
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                                <OptimizedImage
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-800 truncate group-hover:text-sage-600 transition-colors">
                                            {product.title}
                                        </h4>
                                        <p className="text-sm text-gray-500 truncate mt-1">
                                            {product.category}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ArrowRight className="w-5 h-5 text-sage-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                {recentlyViewed.length > 5 && (
                    <button
                        onClick={() => navigate('/recently-viewed')}
                        className="w-full mt-4 py-3 px-4 rounded-xl bg-sage-50 hover:bg-sage-100 text-sage-600 font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        <Eye className="w-5 h-5" />
                        View All ({recentlyViewed.length})
                    </button>
                )}
            </div>
        </div>
    );
};

export default MobileRecentlyViewed;
