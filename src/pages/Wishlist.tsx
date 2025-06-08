import React, { useState } from 'react';
import { Heart, Trash2, ShoppingCart, ArrowLeft, Grid, List, Filter } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { allProducts } from '../data/products';
import OptimizedImage from '../components/OptimizedImage';
import { Button } from '../components/ui/button';
import { useToast } from '../components/ui/use-toast';
import MinimizedNavigation from '../components/MinimizedNavigation';

const WishlistPage = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Get wishlist products from all products
    const wishlistProducts = allProducts.filter(product =>
        wishlist.includes(product.id)
    );

    const handleAddToCart = (product: typeof allProducts[0]) => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
        toast({
            title: "Added to Cart",
            description: `${product.title} has been added to your cart.`,
            className: "bg-green-50 border-green-200 text-green-800",
        });
    };

    const handleClearWishlist = () => {
        if (wishlist.length === 0) return;

        if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
            clearWishlist();
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-cream-50">
                <MinimizedNavigation />
                <div className="pt-20 pb-12">
                    <div className="max-w-md mx-auto text-center px-4">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Sign in to view your wishlist
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Save your favorite products and never lose track of what you love.
                            </p>
                            <Link to="/login">
                                <Button className="w-full">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (wishlistProducts.length === 0) {
        return (
            <div className="min-h-screen bg-cream-50">
                <MinimizedNavigation />
                <div className="pt-20 pb-12">
                    <div className="max-w-md mx-auto text-center px-4">
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Your wishlist is empty
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Start adding products you love to your wishlist.
                            </p>
                            <Link to="/">
                                <Button className="w-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-50">
            <MinimizedNavigation />

            <div className="pt-20 pb-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                My Wishlist
                            </h1>
                            <p className="text-gray-600">
                                {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'}
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* View Mode Toggle */}
                            <div className="hidden sm:flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'grid'
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <Grid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-md transition-colors ${viewMode === 'list'
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Clear Wishlist */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearWishlist}
                                disabled={wishlistProducts.length === 0}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear All
                            </Button>
                        </div>
                    </div>

                    {/* Products Grid/List */}
                    <div className={`${viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                            : 'space-y-4'
                        }`}>
                        {wishlistProducts.map(product => (
                            <div
                                key={product.id}
                                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all ${viewMode === 'list' ? 'flex' : ''
                                    }`}
                            >
                                {/* Product Image */}
                                <div className={`relative bg-gray-50 ${viewMode === 'list' ? 'w-32 flex-shrink-0' : 'aspect-square'
                                    }`}>
                                    <OptimizedImage
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />

                                    {/* Remove from Wishlist */}
                                    <button
                                        onClick={() => removeFromWishlist(product.id)}
                                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md"
                                    >
                                        <Heart className="w-4 h-4 fill-current" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                                            {product.title}
                                        </h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-1 mb-2">
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <svg
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(product.rating)
                                                                ? 'text-yellow-400 fill-current'
                                                                : 'text-gray-300'
                                                            }`}
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                ({product.rating})
                                            </span>
                                        </div>

                                        {/* Price */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xl font-bold text-gray-900">
                                                ₹{product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="text-sm text-gray-500 line-through">
                                                    ₹{product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className={`flex gap-2 ${viewMode === 'list' ? 'mt-auto' : ''}`}>
                                        <Button
                                            onClick={() => handleAddToCart(product)}
                                            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                                            size="sm"
                                        >
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Add to Cart
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/product/${product.id}`)}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WishlistPage;
