import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ShoppingCart, Filter, Grid, List, Search, SlidersHorizontal, Zap, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from './ui/use-toast';
import { useIsMobile } from '../hooks/use-mobile';
import { usePullToRefresh } from '../hooks/use-pull-to-refresh';
import { useInfiniteScroll } from '../hooks/use-infinite-scroll';
import hapticFeedback from '../utils/hapticFeedback';
import OptimizedImage from './OptimizedImage';
import MobileAdvancedFilters from './MobileAdvancedFilters';
import MobileFilterSidebar from './MobileFilterSidebar';
import MobileProductCard from './MobileProductCard';
import PullToRefresh from './PullToRefresh';
import InfiniteScrollLoader from './InfiniteScrollLoader';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { allProducts, getCategories, type Product } from '../data/products';

const categories = ['All', ...getCategories()];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];

const ProductGrid = ({ chatbotFilter }: { chatbotFilter?: (product: Product) => boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [isChangingPage, setIsChangingPage] = useState(false);
  const [displayCount, setDisplayCount] = useState(12); // For infinite scroll
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Filter and sort products
  let filtered = allProducts.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.price >= priceRange[0] && p.price <= priceRange[1] &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (chatbotFilter) filtered = filtered.filter(chatbotFilter);

  const sortedProducts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High': return a.price - b.price;
      case 'Price: High to Low': return b.price - a.price;
      case 'Rating': return b.rating - a.rating;
      case 'Newest': return b.id.localeCompare(a.id);
      default: return 0;
    }
  });
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
    setDisplayCount(12); // Reset display count for infinite scroll
  }, [selectedCategory, priceRange, search, sortBy]);  // Pull to refresh functionality
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Add haptic feedback for refresh action
    hapticFeedback.light();

    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setCurrentPage(1);
    setDisplayCount(12);
    setIsRefreshing(false);

    // Success haptic feedback
    hapticFeedback.success();

    toast({
      title: "Products refreshed!",
      description: "Product list has been updated.",
      duration: 2000,
    });
  }, [toast]);
  // Infinite scroll for mobile
  const hasMore = displayCount < sortedProducts.length;
  const loadMore = useCallback(() => {
    if (!hasMore) return;
    // Add haptic feedback for loading more content
    hapticFeedback.light();
    setDisplayCount(prev => Math.min(prev + 12, sortedProducts.length));
  }, [hasMore, sortedProducts.length]);

  // Pagination logic (desktop) vs infinite scroll (mobile)
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = isMobile
    ? sortedProducts.slice(0, displayCount)
    : sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const navigateToProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };
  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    // Add haptic feedback for successful cart addition
    hapticFeedback.success();
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setIsChangingPage(true);
    setCurrentPage(page);

    const productsSection = document.getElementById('products');
    if (productsSection) {
      const offset = 100;
      const elementPosition = productsSection.offsetTop;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }

    setTimeout(() => setIsChangingPage(false), 300);
  }, []);

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'bestseller':
      case 'best seller':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'hot deal':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'trending':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'premium':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'eco-friendly':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Mobile touch feedback
  const [touchFeedback, setTouchFeedback] = useState<string | null>(null);
  const handleTouchStart = useCallback((productId: string) => {
    if (isMobile) {
      setTouchFeedback(productId);
      // Enhanced haptic feedback
      hapticFeedback.selection();
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback(() => {
    if (touchFeedback) {
      setTimeout(() => setTouchFeedback(null), 150);
    }
  }, [touchFeedback]);

  // Mobile-specific product loading optimization
  const [visibleProducts, setVisibleProducts] = useState(new Set<string>());
  const observeProduct = useCallback((productId: string, inView: boolean) => {
    setVisibleProducts(prev => {
      const newSet = new Set(prev);
      if (inView) {
        newSet.add(productId);
      } else {
        newSet.delete(productId);
      }
      return newSet;
    });
  }, []);

  return (
    <section id="products" className="w-full py-16 bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Discover Products
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our curated collection of premium electronics, stylish textiles, and bestselling books
          </p>
        </div>

        {/* Category Sections for Scroll Targeting */}
        <div id="electronics" className="scroll-mt-20"></div>
        <div id="books" className="scroll-mt-20"></div>
        <div id="textiles" className="scroll-mt-20"></div>
        <div id="fashion" className="scroll-mt-20"></div>

        {/* Filter Container */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          {/* Search & Controls */}
          <div className="flex flex-col gap-4 mb-6">
            {/* Search */}
            <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder='Try "smartphones under ₹1000"'
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-3 glass-subtle rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:justify-between gap-3">
              {/* View Mode */}
              <div className="flex glass-subtle rounded-xl border border-white/20 p-1 col-span-2 sm:col-span-1 lg:w-auto">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-pastel-500 text-white shadow-md' : 'text-gray-600 hover:bg-white/50'}`}
                >
                  <Grid className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-pastel-500 text-white shadow-md' : 'text-gray-600 hover:bg-white/50'}`}
                >
                  <List className="w-5 h-5 mx-auto" />
                </button>
              </div>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="px-3 py-3 rounded-xl glass-subtle border border-white/20 focus:outline-none focus:ring-2 focus:ring-pastel-400 text-gray-700 text-sm lg:text-base lg:min-w-[160px]"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              {/* Products per page */}
              <select
                value={productsPerPage}
                onChange={e => {
                  setProductsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-3 py-3 rounded-xl glass-subtle border border-white/20 focus:outline-none focus:ring-2 focus:ring-pastel-400 text-gray-700 text-sm lg:text-base"
              >
                <option value={12}>12 per page</option>
                <option value={24}>24 per page</option>
                <option value={36}>36 per page</option>
                <option value={48}>48 per page</option>
              </select>

              {/* Filter Toggle - Desktop */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`hidden lg:flex px-3 py-3 rounded-xl items-center justify-center gap-2 font-medium transition-all text-sm lg:text-base ${showFilters ? 'bg-sage-500 text-white shadow-md' : 'glass-subtle text-gray-700 hover:glass-strong border border-white/20'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>              {/* Filter Toggle - Mobile */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className={`lg:hidden px-3 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-sm ${showMobileFilters ? 'bg-sage-500 text-white shadow-md' : 'glass-subtle text-gray-700 hover:glass-strong border border-white/20'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Advanced Filters</span>
              </button>
            </div>
          </div>

          {/* Expanded Filters - Desktop Only */}
          {showFilters && (
            <div className="pt-6 border-t border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categories */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                          ? 'bg-sage-500 text-white shadow-md'
                          : 'glass-subtle border border-white/20 text-gray-700 hover:glass-strong'}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Price Range</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="4000"
                        value={priceRange[0]}
                        onChange={e => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-16">₹{priceRange[0]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="4000"
                        value={priceRange[1]}
                        onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="flex-1"
                      />
                      <span className="text-sm text-gray-600 w-16">₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-end">
                  <div className="glass-subtle rounded-lg px-4 py-3 border border-white/20">
                    <span className="text-sm text-gray-600">
                      Showing <span className="font-semibold text-gray-800">{sortedProducts.length}</span> products
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>        {/* Products Grid */}
        <PullToRefresh
          onRefresh={handleRefresh}
          disabled={!isMobile}
        >
          <div className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
            } ${isChangingPage ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}`}>
            {currentProducts.map(product => (
              <div key={product.id}>              {/* Mobile Product Cards (< lg screens) */}
                <div className="lg:hidden">
                  <div
                    onTouchStart={() => handleTouchStart(product.id)}
                    onTouchEnd={handleTouchEnd}
                    className={`transition-transform duration-150 ${touchFeedback === product.id ? 'scale-95' : 'scale-100'
                      }`}
                  >
                    <MobileProductCard
                      product={product}
                      viewMode={viewMode}
                      isInWishlist={wishlist.includes(product.id)}
                      onWishlistToggle={() => toggleWishlist(product.id)}
                    />
                  </div>
                </div>

                {/* Desktop Product Cards (>= lg screens) */}
                <div className="hidden lg:block">
                  {viewMode === 'grid' ? (
                    /* Grid View */
                    <div
                      onClick={() => navigateToProduct(product)}
                      className="glass-strong rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-white/20 relative group product-card-hover cursor-pointer"
                    >
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100">
                          <OptimizedImage
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover product-image-zoom"
                          />

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            {product.badge && (
                              <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm border border-white/20 ${getBadgeColor(product.badge)} shadow-lg`}>
                                {product.badge}
                              </span>
                            )}
                            {product.discount && (
                              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg pulse-glow">
                                -{product.discount}%
                              </span>
                            )}
                          </div>

                          {/* Stock Status */}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                                Out of Stock
                              </span>
                            </div>
                          )}

                          {/* Action Icons */}
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                            {/* Wishlist Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className={`p-3 glass-strong rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg group/heart ${wishlist.includes(product.id) ? 'heart-bounce' : ''}`}
                            >
                              <Heart
                                className={`w-5 h-5 transition-all duration-300 ${wishlist.includes(product.id)
                                  ? 'fill-red-500 text-red-500 scale-110'
                                  : 'text-gray-600 group-hover/heart:text-red-400'
                                  }`}
                              />
                            </button>

                            {/* Cart Icon */}
                            {product.inStock && (
                              <button
                                onClick={(e) => addToCart(product, e)}
                                className="p-3 glass-strong rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 hover:bg-slate-900 hover:text-white"
                              >
                                <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-white transition-colors" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 space-y-3">
                        {/* Category & Title */}
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {product.category}
                          </span>
                          <h3 className="font-bold text-gray-800 mt-1 line-clamp-2 group-hover:text-sage-600 transition-colors">
                            {product.title}
                          </h3>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                          <span className="text-sm text-gray-500">({product.reviews})</span>
                        </div>

                        {/* Price & Status */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
                            <span className="text-xs px-2 py-1 glass-subtle rounded-full border border-white/20 text-gray-600">
                              {product.color}
                            </span>
                          </div>
                          {product.inStock ? (
                            <div className="flex items-center gap-1">
                              <Zap className="w-4 h-4 text-green-500" />
                              <span className="text-xs text-green-600 font-medium">In Stock</span>
                            </div>
                          ) : (
                            <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                          )}
                        </div>
                      </div>

                      {/* Hover Effect Border */}
                      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-sage-300/50 transition-all duration-300 pointer-events-none" />
                    </div>
                  ) : (
                    /* List View */
                    <div
                      onClick={() => navigateToProduct(product)}
                      className="glass-strong rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-white/20 group cursor-pointer"
                    >
                      <div className="flex gap-6">
                        {/* Product Image */}
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            <OptimizedImage
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          {product.badge && (
                            <span className={`absolute -top-2 -right-2 px-2 py-1 text-xs font-bold rounded-full ${getBadgeColor(product.badge)} shadow-lg`}>
                              {product.badge}
                            </span>
                          )}
                          {!product.inStock && (
                            <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">Out of Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {product.category}
                              </span>
                              <h3 className="font-bold text-gray-800 mt-1 group-hover:text-sage-600 transition-colors">
                                {product.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              {/* Wishlist Button */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(product.id);
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                              >
                                <Heart
                                  className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                                />
                              </button>
                              {/* Cart Icon */}
                              {product.inStock && (
                                <button
                                  onClick={(e) => addToCart(product, e)}
                                  className="p-2 hover:bg-slate-900 hover:text-white rounded-full transition-all duration-300"
                                >
                                  <ShoppingCart className="w-5 h-5 text-gray-600 hover:text-white" />
                                </button>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          {/* Rating & Color */}
                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                    }`}
                                />
                              ))}
                              <span className="text-sm font-medium text-gray-700 ml-1">{product.rating}</span>
                              <span className="text-sm text-gray-500">({product.reviews})</span>
                            </div>
                            <span className="text-xs px-3 py-1 glass-subtle rounded-full border border-white/20 text-gray-600">
                              {product.color}
                            </span>
                            {product.inStock ? (
                              <div className="flex items-center gap-1">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">In Stock</span>
                              </div>
                            ) : (
                              <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                            )}
                          </div>

                          {/* Price */}
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                            )}
                            {product.discount && (
                              <span className="text-sm text-red-600 font-medium">-{product.discount}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            ))}
          </div>
        </PullToRefresh>        {/* Infinite Scroll Loader for Mobile */}
        {isMobile && (
          <InfiniteScrollLoader
            hasNextPage={hasMore}
            isFetchingNextPage={isRefreshing}
            fetchNextPage={loadMore}
            className="mt-8"
            disabled={!hasMore}
          />
        )}

        {/* Pagination for Desktop */}
        {!isMobile && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12">
            <div className="text-sm text-gray-600 text-center sm:text-left order-2 sm:order-1">
              Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} results
            </div>

            <Pagination className="w-auto order-1 sm:order-2">
              <PaginationContent className="gap-1 sm:gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    onClick={currentPage === 1 ? undefined : () => handlePageChange(currentPage - 1)}
                    className={`cursor-pointer px-2 sm:px-3 text-sm ${currentPage === 1
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : 'hover:bg-sage-100 transition-colors'
                      }`}
                  />
                </PaginationItem>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <PaginationItem key={pageNum} className={`${i >= 3 ? 'hidden sm:block' : ''}`}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className="cursor-pointer hover:bg-sage-100 transition-colors min-w-[40px] h-10 flex items-center justify-center text-sm"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <PaginationItem className="hidden sm:block">
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={currentPage === totalPages ? undefined : () => handlePageChange(currentPage + 1)}
                    className={`cursor-pointer px-2 sm:px-3 text-sm ${currentPage === totalPages
                      ? 'opacity-50 cursor-not-allowed pointer-events-none'
                      : 'hover:bg-sage-100 transition-colors'
                      }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>      {/* Mobile Advanced Filters */}
      <MobileAdvancedFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={() => {
          setSelectedCategory('All');
          setPriceRange([0, 4000]);
          setSortBy('Featured');
        }}
        activeFiltersCount={
          (selectedCategory !== 'All' ? 1 : 0) +
          (priceRange[0] !== 0 || priceRange[1] !== 4000 ? 1 : 0) +
          (sortBy !== 'Featured' ? 1 : 0)
        }
      />

      {/* Mobile Filter Sidebar */}
      <MobileFilterSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onReset={() => {
          setSelectedCategory('All');
          setPriceRange([0, 4000]);
          setSortBy('Featured');
        }}
      />
    </section>
  );
};

export default ProductGrid;
