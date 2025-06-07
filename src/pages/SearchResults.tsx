import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, SlidersHorizontal, Search, X, Heart } from 'lucide-react';
import { useSearch } from '../contexts/SearchContext';
import type { SortOption } from '../contexts/SearchContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../components/ui/use-toast';
import MinimizedNavigation from '../components/MinimizedNavigation';
import Footer from '../components/Footer';
import OptimizedImage from '../components/OptimizedImage';
import type { Product } from '../components/BooksSection';

// Import all products from BooksSection (we'll extract this to a separate file later)
const allProducts: Product[] = [
    // Electronics
    {
        id: 'e1',
        title: 'New Gen X-Bud',
        price: 1299,
        originalPrice: 1599,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
        category: 'Electronics',
        color: 'Black',
        rating: 4.7,
        reviews: 320,
        inStock: true,
        description: 'Premium wireless earbuds with noise cancellation',
    },
    {
        id: 'e2',
        title: 'Light Grey Headphone',
        price: 1999,
        originalPrice: 2499,
        image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
        category: 'Electronics',
        color: 'Grey',
        rating: 4.8,
        reviews: 210,
        inStock: true,
        description: 'Professional over-ear headphones with studio quality',
    },
    {
        id: 'e3',
        title: 'Smart Watch Pro',
        price: 2999,
        originalPrice: 3499,
        image: 'https://images.unsplash.com/photo-1579586337278-3f436f25d4d3?auto=format&fit=crop&w=400&q=80',
        category: 'Electronics',
        color: 'Black',
        rating: 4.6,
        reviews: 450,
        inStock: true,
        description: 'Advanced fitness tracking and smart notifications',
    },
    // Books
    {
        id: 'b1',
        title: 'JavaScript Mastery',
        price: 899,
        originalPrice: 1199,
        image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=400&q=80',
        category: 'Books',
        color: 'Paperback',
        rating: 4.8,
        reviews: 892,
        inStock: true,
        description: 'Complete guide to mastering JavaScript programming',
    },
    {
        id: 'b2',
        title: 'React Advanced Concepts',
        price: 1299,
        originalPrice: 1599,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        category: 'Books',
        color: 'Hardcover',
        rating: 4.9,
        reviews: 445,
        inStock: true,
        description: 'Deep dive into React.js advanced patterns and techniques',
    },
    // Fashion
    {
        id: 'f1',
        title: 'Premium Sneakers',
        price: 2499,
        originalPrice: 2999,
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80',
        category: 'Fashion',
        color: 'White',
        rating: 4.5,
        reviews: 156,
        inStock: true,
        description: 'Comfortable premium sneakers for everyday wear',
    },
    {
        id: 'f2',
        title: 'Designer Jacket',
        price: 3999,
        originalPrice: 4999,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80',
        category: 'Fashion',
        color: 'Black',
        rating: 4.7,
        reviews: 89,
        inStock: true,
        description: 'Premium designer jacket with modern fit',
    },
    // Textiles
    {
        id: 't1',
        title: 'Cotton T-Shirt',
        price: 599,
        originalPrice: 799,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
        category: 'Textiles',
        color: 'White',
        rating: 4.3,
        reviews: 78,
        inStock: true,
        description: '100% organic cotton premium quality t-shirt',
    },
    {
        id: 't2',
        title: 'Silk Scarf',
        price: 899,
        originalPrice: 1199,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=400&q=80',
        category: 'Textiles',
        color: 'Blue',
        rating: 4.6,
        reviews: 124,
        inStock: true,
        description: 'Luxurious silk scarf with elegant patterns',
    },
];

const SearchResults = () => {
    const [searchParams] = useSearchParams(); const navigate = useNavigate();
    const { addItem } = useCart();
    const { toast } = useToast();
    const {
        searchQuery,
        setSearchQuery,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        filters,
        setFilters,
        sortBy,
        setSortBy
    } = useSearch();

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Get query from URL parameters
    const query = searchParams.get('q') || ''; useEffect(() => {
        if (query) {
            setSearchQuery(query);
            performSearch(query);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, setSearchQuery]);

    const performSearch = async (searchTerm: string) => {
        setIsSearching(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const results = allProducts.filter(product => {
            const matchesQuery = searchTerm === '' ||
                product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.category.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = filters.category === 'all' || product.category === filters.category;
            const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];
            const matchesRating = product.rating >= filters.rating;
            const matchesStock = !filters.inStock || product.inStock;

            return matchesQuery && matchesCategory && matchesPrice && matchesRating && matchesStock;
        });

        // Apply sorting
        switch (sortBy) {
            case 'price-low':
                results.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                results.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                results.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                // For demo purposes, reverse order
                results.reverse();
                break;
        }

        setSearchResults(results);
        setIsSearching(false);
    };
    const handleAddToCart = (product: Product) => {
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
            onClick={() => handleProductClick(product.id)}>      <div className="relative overflow-hidden">
                <OptimizedImage
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <button className="w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                {product.originalPrice && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </div>
                )}
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">{product.category}</span>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs text-gray-600">{product.rating}</span>
                    </div>
                </div>

                <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
                        )}
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                        }}
                        className="bg-black text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        Add to Cart
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
                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Search Results
                            {query && <span className="text-gray-600"> for "{query}"</span>}
                        </h1>
                        <p className="text-gray-600">
                            {isSearching ? 'Searching...' : `${searchResults.length} products found`}
                        </p>
                    </div>

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
                                        value={filters.category}
                                        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value="all">All Categories</option>
                                        <option value="Electronics">Electronics</option>
                                        <option value="Books">Books</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Textiles">Textiles</option>
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceRange[0]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                priceRange: [Number(e.target.value), filters.priceRange[1]]
                                            })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                        <span className="text-gray-500">-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceRange[1]}
                                            onChange={(e) => setFilters({
                                                ...filters,
                                                priceRange: [filters.priceRange[0], Number(e.target.value)]
                                            })}
                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>
                                </div>

                                {/* Rating Filter */}
                                <div className="mb-6">
                                    <h4 className="font-medium text-gray-800 mb-3">Minimum Rating</h4>
                                    <select
                                        value={filters.rating}
                                        onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm"
                                    >
                                        <option value={0}>Any Rating</option>
                                        <option value={4}>4+ Stars</option>
                                        <option value={4.5}>4.5+ Stars</option>
                                    </select>
                                </div>

                                {/* In Stock Filter */}
                                <div className="mb-6">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.inStock}
                                            onChange={(e) => setFilters({ ...filters, inStock: e.target.checked })}
                                            className="rounded"
                                        />
                                        <span className="text-sm text-gray-700">In Stock Only</span>
                                    </label>
                                </div>

                                <button
                                    onClick={() => performSearch(query)}
                                    className="w-full bg-black text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Apply Filters
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
                                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                                        className="px-4 py-2 glass-card rounded-lg text-sm"
                                    >
                                        <option value="relevance">Sort by Relevance</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="newest">Newest First</option>
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
                            </div>

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
                                            setSearchResults([]);
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
