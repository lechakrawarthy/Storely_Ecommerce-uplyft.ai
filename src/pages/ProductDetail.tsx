import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Plus, Minus, Zap, Award, Clock, Eye, Share } from '../utils/icons';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useRecentlyViewed } from '../hooks/use-recently-viewed';
import { allProducts, getProductById, type Product } from '../data/products';
import MinimizedNavigation from '../components/MinimizedNavigation';
import MobileProductNavigation from '../components/MobileProductNavigation';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { addItem } = useCart();
    const { wishlist, toggleWishlist } = useWishlist();
    const { addToRecentlyViewed } = useRecentlyViewed();

    const product = getProductById(id || '');

    useEffect(() => {
        if (!product) {
            navigate('/');
        } else {
            // Add to recently viewed when product loads
            addToRecentlyViewed(product);
        }
    }, [product, navigate, addToRecentlyViewed]);

    if (!product) return null;

    // Mock additional images (in a real app, these would come from the product data)
    const images = [
        product.image,
        product.image, // In a real app, you'd have multiple angles
        product.image,
        product.image,
    ];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
    };

    const getBadgeStyle = (badge: string) => {
        switch (badge?.toLowerCase()) {
            case 'bestseller':
            case 'best seller':
                return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
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

    const features = [
        { icon: Truck, text: 'Free shipping on orders over ₹999' },
        { icon: Shield, text: '1 year warranty included' },
        { icon: RefreshCw, text: '30-day return policy' },
        { icon: Award, text: 'Authentic product guarantee' }
    ]; return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <MinimizedNavigation />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-8 flex items-center gap-2 px-4 py-2 glass-card rounded-xl hover:glass-strong transition-all border border-white/20"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Products</span>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div className="space-y-6">
                        {/* Main Image */}                        <div className="relative aspect-square glass-card rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                            <OptimizedImage
                                src={images[selectedImage]}
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                            />

                            {/* Badges */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                {product.badge && (
                                    <span className={`px-4 py-2 text-sm font-bold rounded-full ${getBadgeStyle(product.badge)} shadow-lg animate-pulse-glow`}>
                                        {product.badge}
                                    </span>
                                )}
                                {product.discount && (
                                    <span className="px-4 py-2 text-sm font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg animate-bounce-gentle">
                                        -{product.discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Wishlist & Share */}
                            <div className="absolute top-6 right-6 flex flex-col gap-3">                                <button
                                onClick={() => toggleWishlist(product.id)}
                                className="p-4 glass-strong rounded-full hover:glass-card transition-all border border-white/30 animate-hover-lift"
                            >
                                <Heart
                                    className={`w-6 h-6 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500 animate-heart-bounce' : 'text-gray-600'}`}
                                />
                            </button>
                                <button className="p-4 glass-strong rounded-full hover:glass-card transition-all border border-white/30 animate-hover-lift">
                                    <Share className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>

                            {/* Stock Status */}
                            <div className="absolute bottom-6 left-6">
                                <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${product.inStock
                                    ? 'bg-green-100/90 text-green-700 border border-green-200'
                                    : 'bg-red-100/90 text-red-700 border border-red-200'
                                    }`}>
                                    {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-4 justify-center">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-20 h-20 rounded-xl overflow-hidden border-3 transition-all duration-300 hover:scale-110 ${selectedImage === index
                                        ? 'border-sage-400 shadow-lg scale-110'
                                        : 'border-white/40 hover:border-sage-300'
                                        }`}                                >
                                    <OptimizedImage src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 text-sm font-medium bg-sage-100 text-sage-700 rounded-full border border-sage-200">
                                    {product.category}
                                </span>
                                <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                    {product.color}
                                </span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">{product.title}</h1>
                            <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-6 h-6 ${i < Math.floor(product.rating)
                                            ? 'fill-yellow-400 text-yellow-400'
                                            : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="text-xl font-semibold text-gray-800 ml-2">{product.rating}</span>
                            </div>
                            <div className="text-gray-500">
                                ({product.reviews} reviews)
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                            <div className="flex items-center gap-4 mb-3">
                                <span className="text-4xl font-bold text-gray-900">₹{product.price}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-2xl text-gray-500 line-through">₹{product.originalPrice}</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-700 text-lg font-medium rounded-full border border-green-200">
                                            Save ₹{product.originalPrice - product.price}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Clock className="w-5 h-5" />
                                <span>Limited time offer • Ends in 2 days</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="space-y-4">
                            <label className="block text-lg font-medium text-gray-700">Quantity</label>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center glass-card rounded-2xl border border-white/20 shadow-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-4 hover:bg-white/50 transition-colors rounded-l-2xl"
                                    >
                                        <Minus className="w-5 h-5" />
                                    </button>
                                    <span className="px-6 py-4 font-semibold text-lg min-w-[60px] text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-4 hover:bg-white/50 transition-colors rounded-r-2xl"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <span className="text-lg text-gray-600">
                                    Total: <span className="font-semibold">₹{(product.price * quantity).toLocaleString()}</span>
                                </span>
                            </div>
                        </div>

                        {/* Modern Action Buttons */}
                        <div className="space-y-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:transform-none text-lg"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            <button className="w-full glass-card border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-semibold py-5 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 text-lg">
                                <Zap className="w-6 h-6" />
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">What's Included</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 glass-subtle rounded-xl border border-white/20">
                                        <feature.icon className="w-5 h-5 text-sage-600" />
                                        <span className="text-gray-700">{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="glass-card rounded-2xl p-6 border border-white/20 shadow-lg">
                            <div className="grid grid-cols-3 gap-6 text-center">
                                <div>
                                    <div className="text-3xl font-bold text-sage-600 mb-1">24/7</div>
                                    <div className="text-sm text-gray-500">Support</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-pastel-600 mb-1">2-3</div>
                                    <div className="text-sm text-gray-500">Days Delivery</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-gold-600 mb-1">4.8★</div>
                                    <div className="text-sm text-gray-500">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>                </div>
            </div>

            {/* Mobile Product Navigation */}
            <div className="lg:hidden">
                <MobileProductNavigation currentProduct={product} />
            </div>

            <Footer />
        </div>
    );
};

export default ProductDetail;
