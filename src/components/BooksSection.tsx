import React, { useState, useEffect, useCallback } from 'react';
import { Heart, Star, ShoppingCart, Grid, List, Search, SlidersHorizontal, Zap, X } from '../utils/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from './ui/use-toast';
import { useIsMobile } from '../hooks/use-mobile';
import OptimizedImage from './OptimizedImage';
import MobileAdvancedFilters from './MobileAdvancedFilters';
import MobileFilterSidebar from './MobileFilterSidebar';
import MobileProductCard from './MobileProductCard';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { type Product } from '../data/products';
import { useProducts } from '../hooks/useProducts';

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

  const { addItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Get products from database
  const { products, categories, loading, error, getSortedProducts } = useProducts();

  // Filter and sort products
  let filtered = products.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.price >= priceRange[0] && p.price <= priceRange[1] &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()))
  );
  if (chatbotFilter) filtered = filtered.filter(chatbotFilter);

  const sortedProducts = getSortedProducts(filtered, sortBy);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, search, sortBy]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const navigateToProduct = (product: Product) => {
    navigate(`/product/${product.id}`);
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart!",
      description: `${product.title} has been added to your cart.`,
      duration: 3000,
    });
  };

  const handlePageChange = useCallback((page: number) => {
    setIsChangingPage(true);
    setCurrentPage(page);
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

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-3 py-3 rounded-xl flex items-center justify-center gap-2 font-medium transition-all text-sm lg:text-base ${showFilters ? 'bg-sage-500 text-white shadow-md' : 'glass-subtle text-gray-700 hover:glass-strong border border-white/20'}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>

          {/* Expanded Filters */}
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-gray-600">Loading products...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass-card rounded-2xl p-8 mb-8 text-center">
            <div className="text-red-500 mb-4">⚠️ Failed to load products</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && (
          <div className={`${viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
            } ${isChangingPage ? 'opacity-50 pointer-events-none transition-opacity duration-300' : 'transition-opacity duration-300'}`}>
            {currentProducts.map(product => (
              <div key={product.id}>
                {/* Mobile Product Cards */}
                <div className="lg:hidden">
                  <MobileProductCard
                    product={product}
                    viewMode={viewMode}
                    isInWishlist={wishlist.includes(product.id)}
                    onWishlistToggle={() => toggleWishlist(product.id)}
                  />
                </div>

                {/* Desktop Product Cards */}
                <div className="hidden lg:block">
                  {viewMode === 'grid' ? (
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

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                            {product.badge && (
                              <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm border border-white/20 ${getBadgeColor(product.badge)} shadow-lg`}>
                                {product.badge}
                              </span>
                            )}
                            {product.discount && (
                              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg">
                                -{product.discount}%
                              </span>
                            )}
                          </div>

                          {/* Action Icons */}
                          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(product.id);
                              }}
                              className="p-3 glass-strong rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg"
                            >
                              <Heart
                                className={`w-5 h-5 transition-all duration-300 ${wishlist.includes(product.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-gray-600'
                                  }`}
                              />
                            </button>

                            {product.inStock && (
                              <button
                                onClick={(e) => addToCart(product, e)}
                                className="p-3 glass-strong rounded-full hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg"
                              >
                                <ShoppingCart className="w-5 h-5 text-gray-600" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-5 space-y-3">
                        <div>
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {product.category}
                          </span>
                          <h3 className="font-bold text-gray-800 mt-1 line-clamp-2">
                            {product.title}
                          </h3>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>

                        {/* Rating */}
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

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
                              {product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                              )}
                            </div>
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
                    </div>
                  ) : (
                    <div
                      onClick={() => navigateToProduct(product)}
                      className="glass-strong rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-white/20 group cursor-pointer"
                    >
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                            <OptimizedImage
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1">
                              <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                {product.category}
                              </span>
                              <h3 className="font-bold text-gray-800 mt-1">
                                {product.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
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
                          </div>

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
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
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
                    <PaginationItem key={pageNum} className="hidden sm:block">
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className={`cursor-pointer px-2 sm:px-3 text-sm transition-colors ${currentPage === pageNum
                          ? 'bg-sage-500 text-white border-sage-500 hover:bg-sage-600'
                          : 'hover:bg-sage-100 transition-colors'
                          }`}
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
      </div>

      {/* Mobile Advanced Filters */}
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
