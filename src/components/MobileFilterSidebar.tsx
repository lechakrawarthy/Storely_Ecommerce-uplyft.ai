import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, RotateCcw } from '../utils/icons';

interface MobileFilterSidebarProps {
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
}

const MobileFilterSidebar: React.FC<MobileFilterSidebarProps> = ({
    isOpen,
    onClose,
    categories,
    selectedCategory,
    onCategoryChange,
    priceRange,
    onPriceRangeChange,
    sortBy,
    onSortChange,
    onReset
}) => {
    const [expandedSections, setExpandedSections] = useState<string[]>(['category', 'sort']);
    const [tempPriceRange, setTempPriceRange] = useState(priceRange);

    const sortOptions = [
        { value: 'Featured', label: 'Featured' },
        { value: 'Price: Low to High', label: 'Price: Low to High' },
        { value: 'Price: High to Low', label: 'Price: High to Low' },
        { value: 'Rating', label: 'Best Rating' },
        { value: 'Newest', label: 'Newest First' }
    ];

    useEffect(() => {
        setTempPriceRange(priceRange);
    }, [priceRange]);

    // Prevent body scroll when sidebar is open
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

    const toggleSection = (section: string) => {
        setExpandedSections(prev =>
            prev.includes(section)
                ? prev.filter(s => s !== section)
                : [...prev, section]
        );
    };

    const handlePriceRangeChange = (value: number, index: number) => {
        const newRange = [...tempPriceRange];
        newRange[index] = value;
        setTempPriceRange(newRange);
    };

    const applyPriceRange = () => {
        onPriceRangeChange(tempPriceRange);
    };

    const resetFilters = () => {
        onReset();
        setTempPriceRange([0, 4000]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-pastel-50 to-sage-50">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-white/50 rounded-lg transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    {/* Categories */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('category')}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-900">Categories</span>
                            {expandedSections.includes('category') ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {expandedSections.includes('category') && (
                            <div className="px-4 pb-4">
                                <div className="space-y-2">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            onClick={() => onCategoryChange(category)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${selectedCategory === category
                                                ? 'bg-pastel-100 text-pastel-800 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('price')}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-900">Price Range</span>
                            {expandedSections.includes('price') ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {expandedSections.includes('price') && (
                            <div className="px-4 pb-4">
                                <div className="space-y-4">
                                    {/* Price Input Fields */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange[0]}
                                                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 0, 0)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-400"
                                                min="0"
                                                max="4000"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                                            <input
                                                type="number"
                                                value={tempPriceRange[1]}
                                                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value) || 4000, 1)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pastel-400"
                                                min="0"
                                                max="4000"
                                            />
                                        </div>
                                    </div>

                                    {/* Price Range Sliders */}
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Min: ₹{tempPriceRange[0]}</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4000"
                                                step="50"
                                                value={tempPriceRange[0]}
                                                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), 0)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Max: ₹{tempPriceRange[1]}</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max="4000"
                                                step="50"
                                                value={tempPriceRange[1]}
                                                onChange={(e) => handlePriceRangeChange(parseInt(e.target.value), 1)}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={applyPriceRange}
                                        className="w-full py-2 bg-pastel-500 text-white rounded-lg hover:bg-pastel-600 transition-colors font-medium"
                                    >
                                        Apply Price Range
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sort Options */}
                    <div className="border-b border-gray-200">
                        <button
                            onClick={() => toggleSection('sort')}
                            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                            <span className="font-semibold text-gray-900">Sort By</span>
                            {expandedSections.includes('sort') ? (
                                <ChevronUp className="w-5 h-5 text-gray-600" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        {expandedSections.includes('sort') && (
                            <div className="px-4 pb-4">
                                <div className="space-y-2">
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => onSortChange(option.value)}
                                            className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${sortBy === option.value
                                                ? 'bg-pastel-100 text-pastel-800 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors font-medium"
                    >
                        Apply Filters
                    </button>
                </div>
            </div>

            <style jsx>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #94a3b8;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #94a3b8;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
        </div>
    );
};

export default MobileFilterSidebar;
