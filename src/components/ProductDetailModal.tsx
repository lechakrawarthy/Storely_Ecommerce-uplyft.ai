import React, { useState } from 'react';
import { X, Star, Heart, ShoppingCart, Truck, Shield, RefreshCw, Plus, Minus, Zap, Award, Clock } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from './BooksSection';

interface ProductDetailModalProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, isOpen, onClose }) => {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addItem } = useCart();

    if (!isOpen || !product) return null;

    // Mock additional images (in a real app, these would come from the product data)
    const images = [
        product.image,
        product.image, // In a real app, you'd have multiple angles
        product.image,
    ];

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        onClose();
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
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto glass-card rounded-3xl border border-white/20 shadow-2xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 z-10 p-3 glass-strong rounded-full hover:glass-card transition-all border border-white/30"
                >
                    <X className="w-6 h-6 text-gray-700" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                    {/* Image Section */}
                    <div className="space-y-4">
                        {/* Main Image */}
                        <div className="relative aspect-square glass-subtle rounded-2xl overflow-hidden border border-white/20">
                            <img
                                src={images[selectedImage]}
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />

                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                {product.badge && (
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getBadgeStyle(product.badge)} shadow-lg`}>
                                        {product.badge}
                                    </span>
                                )}
                                {product.discount && (
                                    <span className="px-3 py-1 text-xs font-bold rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
                                        -{product.discount}% OFF
                                    </span>
                                )}
                            </div>

                            {/* Wishlist Button */}
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className="absolute top-4 right-4 p-3 glass-strong rounded-full hover:glass-card transition-all border border-white/30"
                            >
                                <Heart
                                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                />
                            </button>

                            {/* Stock Status */}
                            <div className="absolute bottom-4 left-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium ${product.inStock
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-red-100 text-red-700 border border-red-200'
                                    }`}>
                                    {product.inStock ? '✅ In Stock' : '❌ Out of Stock'}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-2">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`aspect-square w-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                            ? 'border-sage-400 shadow-md'
                                            : 'border-white/30 hover:border-sage-300'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info Section */}
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2 py-1 text-xs font-medium bg-sage-100 text-sage-700 rounded-full">
                                    {product.category}
                                </span>
                                <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                                    {product.color}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating)
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                ))}
                                <span className="text-lg font-semibold text-gray-800 ml-2">{product.rating}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                                ({product.reviews} reviews)
                            </div>
                        </div>

                        {/* Pricing */}
                        <div className="glass-subtle rounded-xl p-4 border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                                {product.originalPrice && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                                            Save ₹{product.originalPrice - product.price}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span>Limited time offer • Ends in 2 days</span>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center glass-subtle rounded-lg border border-white/20">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-white/50 transition-colors"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-4 py-2 font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="p-2 hover:bg-white/50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                                <span className="text-sm text-gray-500">
                                    Total: ₹{(product.price * quantity).toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className="w-full bg-gradient-to-r from-sage-500 to-pastel-500 hover:from-sage-600 hover:to-pastel-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>

                            <button className="w-full glass-subtle border-2 border-white/30 hover:glass-strong text-gray-700 hover:text-gray-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900">What's Included</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                        <feature.icon className="w-4 h-4 text-sage-600" />
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info */}
                        <div className="glass-subtle rounded-xl p-4 border border-white/20">
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-sage-600">24/7</div>
                                    <div className="text-xs text-gray-500">Support</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-pastel-600">2-3</div>
                                    <div className="text-xs text-gray-500">Days Delivery</div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-gold-600">4.8★</div>
                                    <div className="text-xs text-gray-500">Rating</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailModal;
