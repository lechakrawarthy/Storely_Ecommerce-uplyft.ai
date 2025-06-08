import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, Search, X, Heart, Star, ShoppingCart } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import type { SortOption } from '../contexts/SearchContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/use-toast';
import MinimizedNavigation from '../components/MinimizedNavigation';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';
import SearchPerformanceMetrics from '../components/SearchPerformanceMetrics';
import { allProducts, getCategories, sortProducts } from '../data/products';
import type { Product } from '../data/products';

// Utility function to highlight search terms
const highlightSearchTerms = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;

    const terms = searchQuery.toLowerCase().split(' ').filter(term => term.length > 0);
    let highlightedText = text;

    terms.forEach(term => {
        const regex = new RegExp(`(${term})`, 'gi');
        highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
    });

    return highlightedText;
};

// Component to render highlighted text
const HighlightedText = ({ text, searchQuery }: { text: string; searchQuery: string }) => {
    const highlightedText = highlightSearchTerms(text, searchQuery);
    return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />;
};

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { addItem } = useCart();
    const { toast } = useToast(); const {
        searchQuery,
        setSearchQuery,
        searchResults,
        isSearching,
        filters,
        setFilters,
        sortBy,
        setSortBy,
        performSearch,
        applyFilters,
        getAvailableColors,
        getAvailableBadges,
    } = useSearch(); const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedRating, setSelectedRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [selectedColor, setSelectedColor] = useState('all');
    const [hasDiscountOnly, setHasDiscountOnly] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState('all');

    const categories = getCategories();
    const query = searchParams.get('q') || '';

    useEffect(() => {
        if (query && query !== searchQuery) {
            performSearch(query);
        }
    }, [query, performSearch, searchQuery]);    // Handle filter changes
    const handleFilterChange = () => {
        setFilters({
            category: selectedCategory,
            priceRange: priceRange,
            rating: selectedRating,
            inStock: inStockOnly,
            color: selectedColor,
            hasDiscount: hasDiscountOnly,
            badge: selectedBadge,
        });
        applyFilters();
    };

    // Handle sort change
    const handleSortChange = (newSortBy: SortOption) => {
        setSortBy(newSortBy);
        applyFilters();
    };

    const handleAddToCart = (product: Product, e: React.MouseEvent) => {
        e.stopPropagation();
        addItem(product);
        toast({
            title: "Added to cart!",
            description: `${product.title} has been added to your cart.`,
            duration: 3000,
        });
    };

    const handleProductClick = (productId: string) => {
        navigate(`/product/${productId}`);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="glass-card rounded-2xl overflow-hidden hover:glass-strong transition-all duration-300 cursor-pointer group"
            onClick={() => handleProductClick(product.id)}>
            <div className="relative overflow-hidden">
                <OptimizedImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <button
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                        <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                {product.originalPrice && product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {product.discount}% OFF
                    </div>
                )}
                {product.badge && (
                    <div className="absolute bottom-3 left-3 bg-lime-400 text-gray-900 text-xs px-2 py-1 rounded-full font-semibold">
                        {product.badge}
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{product.reviews} reviews</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    <HighlightedText text={product.title} searchQuery={searchQuery} />
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    <HighlightedText text={product.description || ''} searchQuery={searchQuery} />
                </p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-lime-400 hover:bg-lime-500 text-gray-900 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Add
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <MinimizedNavigation />

            <main className="pt-28 pb-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8">
                        {/* Filters Sidebar */}
                        <div className={`w-80 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                            <div className="glass-card rounded-2xl p-6 sticky top-32">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-semibold text-gray-900">Filters</h3>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="lg:hidden p-1 hover:bg-gray-100 rounded"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Category Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Category</h4>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => {
                                            setSelectedCategory(e.target.value);
                                            setFilters({ ...filters, category: e.target.value });
                                            handleFilterChange();
                                        }}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category.toLowerCase()}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">
                                        Price Range (₹{priceRange[0].toLocaleString()} - ₹{priceRange[1].toLocaleString()})
                                    </h4>
                                    <div className="space-y-3">
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            value={priceRange[0]}
                                            onChange={(e) => {
                                                const newRange: [number, number] = [Number(e.target.value), priceRange[1]];
                                                setPriceRange(newRange);
                                                setFilters({ ...filters, priceRange: newRange });
                                                handleFilterChange();
                                            }}
                                            className="w-full"
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="5000"
                                            value={priceRange[1]}
                                            onChange={(e) => {
                                                const newRange: [number, number] = [priceRange[0], Number(e.target.value)];
                                                setPriceRange(newRange);
                                                setFilters({ ...filters, priceRange: newRange });
                                                handleFilterChange();
                                            }}
                                            className="w-full"
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Minimum Rating</h4>
                                    <div className="space-y-2">
                                        {[0, 3, 4, 4.5].map(rating => (
                                            <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="rating"
                                                    value={rating}
                                                    checked={selectedRating === rating}
                                                    onChange={(e) => {
                                                        const newRating = Number(e.target.value);
                                                        setSelectedRating(newRating);
                                                        setFilters({ ...filters, rating: newRating });
                                                        handleFilterChange();
                                                    }}
                                                    className="text-yellow-400"
                                                />
                                                <div className="flex items-center gap-1">
                                                    {rating === 0 ? (
                                                        <span className="text-sm text-gray-600">Any Rating</span>
                                                    ) : (
                                                        <>
                                                            <div className="flex">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                                            }`}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="text-sm text-gray-600">& up</span>
                                                        </>
                                                    )}
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>                                {/* In Stock Filter */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={inStockOnly}
                                            onChange={(e) => {
                                                setInStockOnly(e.target.checked);
                                                setFilters({ ...filters, inStock: e.target.checked });
                                                handleFilterChange();
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">In Stock Only</span>
                                    </label>
                                </div>

                                {/* Color Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Color</h4>
                                    <select
                                        value={selectedColor}
                                        onChange={(e) => {
                                            setSelectedColor(e.target.value);
                                            setFilters({ ...filters, color: e.target.value });
                                            handleFilterChange();
                                        }}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="all">All Colors</option>
                                        {getAvailableColors().map(color => (
                                            <option key={color} value={color}>
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Badge Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Badge</h4>
                                    <select
                                        value={selectedBadge}
                                        onChange={(e) => {
                                            setSelectedBadge(e.target.value);
                                            setFilters({ ...filters, badge: e.target.value });
                                            handleFilterChange();
                                        }}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="all">All Badges</option>
                                        {getAvailableBadges().map(badge => (
                                            <option key={badge} value={badge}>
                                                {badge}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Discount Filter */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={hasDiscountOnly}
                                            onChange={(e) => {
                                                setHasDiscountOnly(e.target.checked);
                                                setFilters({ ...filters, hasDiscount: e.target.checked });
                                                handleFilterChange();
                                            }}
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm text-gray-700">On Sale Only</span>
                                    </label>
                                </div>                                {/* Clear Filters */}
                                <button
                                    onClick={() => {
                                        setSelectedCategory('all');
                                        setPriceRange([0, 5000]);
                                        setSelectedRating(0);
                                        setInStockOnly(false);
                                        setSelectedColor('all');
                                        setHasDiscountOnly(false);
                                        setSelectedBadge('all');
                                        setFilters({
                                            category: 'all',
                                            priceRange: [0, 5000],
                                            rating: 0,
                                            inStock: false,
                                            color: 'all',
                                            hasDiscount: false,
                                            badge: 'all',
                                        });
                                        handleFilterChange();
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="flex-1">
                            {/* Controls */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setShowFilters(true)}
                                        className="lg:hidden flex items-center gap-2 px-4 py-2 glass-card rounded-lg hover:glass-strong transition-all"
                                    >
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Filters
                                    </button>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => handleSortChange(e.target.value as SortOption)}
                                        className="px-4 py-2 glass-card rounded-lg text-sm"
                                    >
                                        <option value="relevance">Sort by Relevance</option>
                                        <option value="Price: Low to High">Price: Low to High</option>
                                        <option value="Price: High to Low">Price: High to Low</option>
                                        <option value="Rating">Highest Rated</option>
                                        <option value="Newest">Newest First</option>
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-black text-white' : 'glass-card hover:glass-strong'}`}
                                    >
                                        <Grid className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-black text-white' : 'glass-card hover:glass-strong'}`}
                                    >
                                        <List className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>                            {/* Search Results Summary */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                    {searchQuery ? `Search results for "${searchQuery}"` : 'All Products'}
                                </h2>
                                <p className="text-gray-600">
                                    {isSearching ? 'Searching...' : `${searchResults.length} products found`}
                                </p>
                            </div>

                            {/* Search Performance Metrics */}
                            {searchQuery && <SearchPerformanceMetrics />}

                            {/* Results Grid */}
                            {isSearching ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
                                            <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                                            <div className="bg-gray-200 h-4 rounded mb-2"></div>
                                            <div className="bg-gray-200 h-3 rounded mb-4"></div>
                                            <div className="bg-gray-200 h-6 rounded"></div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className={viewMode === 'grid'
                                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                    : "space-y-4"
                                }>
                                    {searchResults.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
                                    <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            navigate('/');
                                        }}
                                        className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        Browse All Products
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SearchResults;
