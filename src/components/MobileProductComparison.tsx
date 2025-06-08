import React, { useState } from 'react';
import { X, Star, ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from '../utils/icons';
import { useComparison } from '../hooks/use-comparison';
import { useSwipe } from '../hooks/use-swipe';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

interface MobileProductComparisonProps {
    isOpen: boolean;
    onClose: () => void;
}

const MobileProductComparison: React.FC<MobileProductComparisonProps> = ({ isOpen, onClose }) => {
    const { compareList, removeFromComparison, clearComparison } = useComparison();
    const navigate = useNavigate();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedSection, setExpandedSection] = useState<string | null>('basic');

    // Swipe navigation between compared products
    const { onTouchStart, onTouchEnd } = useSwipe({
        onSwipeLeft: () => {
            if (currentIndex < compareList.length - 1) {
                setCurrentIndex(currentIndex + 1);
            }
        },
        onSwipeRight: () => {
            if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
            }
        },
        threshold: 50,
    });

    if (!isOpen || compareList.length === 0) return null;

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    const goToProduct = (productId: string) => {
        navigate(`/product/${productId}`);
        onClose();
    };

    const currentProduct = compareList[currentIndex];

    return (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden">
            <div className="absolute inset-0 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Compare Products</h2>
                            <p className="text-sm text-gray-500">{compareList.length} products</p>
                        </div>
                    </div>

                    {compareList.length > 1 && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                                disabled={currentIndex === 0}
                                className="p-2 rounded-full bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm font-medium px-2">
                                {currentIndex + 1} / {compareList.length}
                            </span>
                            <button
                                onClick={() => setCurrentIndex(Math.min(compareList.length - 1, currentIndex + 1))}
                                disabled={currentIndex === compareList.length - 1}
                                className="p-2 rounded-full bg-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Product Content */}
                <div
                    className="flex-1 overflow-y-auto"
                    onTouchStart={onTouchStart}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Product Header */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-start gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                                <OptimizedImage
                                    src={currentProduct.image}
                                    alt={currentProduct.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 line-clamp-2">{currentProduct.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{currentProduct.category}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-lg font-bold text-gray-900">₹{currentProduct.price}</span>
                                    {currentProduct.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through">
                                            ₹{currentProduct.originalPrice}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => removeFromComparison(currentProduct.id)}
                                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    {/* Comparison Sections */}
                    <div className="p-4 space-y-4">
                        {/* Basic Info */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => toggleSection('basic')}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <h4 className="font-medium text-gray-900">Basic Information</h4>
                                {expandedSection === 'basic' ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === 'basic' && (
                                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Category</span>
                                        <span className="font-medium">{currentProduct.category}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Color</span>
                                        <span className="font-medium">{currentProduct.color}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Availability</span>
                                        <span className={`font-medium ${currentProduct.inStock ? 'text-green-600' : 'text-red-600'}`}>
                                            {currentProduct.inStock ? 'In Stock' : 'Out of Stock'}
                                        </span>
                                    </div>
                                    {currentProduct.badge && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Badge</span>
                                            <span className="font-medium">{currentProduct.badge}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pricing */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => toggleSection('pricing')}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <h4 className="font-medium text-gray-900">Pricing</h4>
                                {expandedSection === 'pricing' ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === 'pricing' && (
                                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Current Price</span>
                                        <span className="font-bold text-lg">₹{currentProduct.price}</span>
                                    </div>
                                    {currentProduct.originalPrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Original Price</span>
                                            <span className="text-gray-500 line-through">₹{currentProduct.originalPrice}</span>
                                        </div>
                                    )}
                                    {currentProduct.discount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Discount</span>
                                            <span className="text-green-600 font-medium">{currentProduct.discount}% OFF</span>
                                        </div>
                                    )}
                                    {currentProduct.originalPrice && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">You Save</span>
                                            <span className="text-green-600 font-medium">
                                                ₹{currentProduct.originalPrice - currentProduct.price}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Rating & Reviews */}
                        <div className="bg-white rounded-xl border border-gray-200">
                            <button
                                onClick={() => toggleSection('rating')}
                                className="w-full flex items-center justify-between p-4 text-left"
                            >
                                <h4 className="font-medium text-gray-900">Rating & Reviews</h4>
                                {expandedSection === 'rating' ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                )}
                            </button>
                            {expandedSection === 'rating' && (
                                <div className="px-4 pb-4 space-y-3 border-t border-gray-100">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Rating</span>
                                        <div className="flex items-center gap-1">
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < Math.floor(currentProduct.rating)
                                                            ? 'fill-yellow-400 text-yellow-400'
                                                            : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="font-medium ml-1">{currentProduct.rating}</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Reviews</span>
                                        <span className="font-medium">{currentProduct.reviews} reviews</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            onClick={() => goToProduct(currentProduct.id)}
                            className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                            View Product
                        </button>
                        <button
                            onClick={clearComparison}
                            className="px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileProductComparison;
