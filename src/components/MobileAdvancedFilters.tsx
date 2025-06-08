import React, { useState, useRef } from 'react';
import { Filter, X, ChevronLeft, ChevronRight, Star, SlidersHorizontal } from '../utils/icons';
import { useSwipe } from '../hooks/use-swipe';

interface MobileAdvancedFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    priceRange: number[];
    onPriceRangeChange: (range: number[]) => void;
    sortBy: string;
    onSortChange: (sort: string) => void;
    onReset: () => void;
    activeFiltersCount: number;
}

const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];
const priceRanges = [
    { label: 'Under ₹500', range: [0, 500] },
    { label: '₹500 - ₹1000', range: [500, 1000] },
    { label: '₹1000 - ₹2000', range: [1000, 2000] },
    { label: '₹2000 - ₹3000', range: [2000, 3000] },
    { label: 'Above ₹3000', range: [3000, 4000] },
];

const MobileAdvancedFilters: React.FC<MobileAdvancedFiltersProps> = ({
    isOpen,
    onClose,
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    sortBy,
    onSortChange,
    onReset,
    activeFiltersCount,
}) => {
    const [currentTab, setCurrentTab] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const tabs = ['Categories', 'Price', 'Sort'];
    // Swipe gesture for tab navigation
    useSwipe({
        onSwipeLeft: () => {
            if (currentTab < tabs.length - 1) {
                setCurrentTab(currentTab + 1);
            }
        },
        onSwipeRight: () => {
            if (currentTab > 0) {
                setCurrentTab(currentTab - 1);
            }
        },
    });

    const isPriceRangeSelected = (range: number[]) => {
        return priceRange[0] === range[0] && priceRange[1] === range[1];
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] overflow-hidden animate-slide-up">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <SlidersHorizontal className="w-6 h-6 text-sage-600" />
                            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                            {activeFiltersCount > 0 && (
                                <span className="bg-sage-500 text-white text-xs px-2 py-1 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex mt-4 bg-gray-100 rounded-xl p-1">
                        {tabs.map((tab, index) => (
                            <button
                                key={tab}
                                onClick={() => setCurrentTab(index)}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${currentTab === index
                                    ? 'bg-white text-sage-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Swipe Indicator */}
                    <div className="flex justify-center mt-3">
                        <div className="flex gap-1">
                            {tabs.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-colors ${currentTab === index ? 'bg-sage-500' : 'bg-gray-300'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div ref={containerRef} className="p-6 overflow-y-auto max-h-[60vh] touch-pan-y">
                    {/* Categories Tab */}
                    {currentTab === 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => onCategoryChange(category)}
                                        className={`p-4 rounded-xl text-left transition-all ${selectedCategory === category
                                            ? 'bg-sage-100 border-2 border-sage-300 text-sage-700'
                                            : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="font-medium">{category}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Price Tab */}
                    {currentTab === 1 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Price Range</h3>
                            <div className="space-y-3">
                                {priceRanges.map((price) => (
                                    <button
                                        key={price.label}
                                        onClick={() => onPriceRangeChange(price.range)}
                                        className={`w-full p-4 rounded-xl text-left transition-all ${isPriceRangeSelected(price.range)
                                            ? 'bg-sage-100 border-2 border-sage-300 text-sage-700'
                                            : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="font-medium">{price.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Sort Tab */}
                    {currentTab === 2 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h3>
                            <div className="space-y-3">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => onSortChange(option)}
                                        className={`w-full p-4 rounded-xl text-left transition-all flex items-center justify-between ${sortBy === option
                                            ? 'bg-sage-100 border-2 border-sage-300 text-sage-700'
                                            : 'bg-gray-50 border-2 border-transparent text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="font-medium">{option}</span>
                                        {option.includes('Rating') && (
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-gray-100 bg-white sticky bottom-0">
                    <div className="flex gap-3">
                        <button
                            onClick={onReset}
                            className="flex-1 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                        >
                            Reset All
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl bg-sage-500 text-white font-medium hover:bg-sage-600 transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
                    {currentTab > 0 && (
                        <button
                            onClick={() => setCurrentTab(currentTab - 1)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg pointer-events-auto hover:bg-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                    <div className="flex-1" />
                    {currentTab < tabs.length - 1 && (
                        <button
                            onClick={() => setCurrentTab(currentTab + 1)}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg pointer-events-auto hover:bg-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileAdvancedFilters;
