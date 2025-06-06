import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const allProducts = [
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
    badge: 'Best Seller',
    discount: 19,
    inStock: true,
    description: 'Premium wireless earbuds with noise cancellation',
  },
  {
    id: 'e2',
    title: 'Light Grey Surface Headphone',
    price: 1999,
    originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    color: 'Grey',
    rating: 4.8,
    reviews: 210,
    badge: 'New',
    discount: 20,
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
    badge: 'Hot Deal',
    discount: 14,
    inStock: true,
    description: 'Advanced fitness tracking and smart notifications',
  },
  {
    id: 'e4',
    title: 'Wireless Mouse',
    price: 899,
    originalPrice: 1099,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=400&q=80',
    category: 'Electronics',
    color: 'White',
    rating: 4.4,
    reviews: 180,
    discount: 18,
    inStock: false,
    description: 'Ergonomic wireless mouse with precision tracking',
  },
  // Textiles
  {
    id: 't1',
    title: 'Classic White T-Shirt',
    price: 499,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles',
    color: 'White',
    rating: 4.5,
    reviews: 98,
    badge: 'Eco-Friendly',
    discount: 29,
    inStock: true,
    description: '100% organic cotton premium quality t-shirt',
  },
  {
    id: 't2',
    title: 'Blue Cotton Shirt',
    price: 699,
    originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles',
    color: 'Blue',
    rating: 4.6,
    reviews: 120,
    badge: 'Premium',
    discount: 30,
    inStock: true,
    description: 'Casual cotton shirt perfect for everyday wear',
  },
  {
    id: 't3',
    title: 'Summer Dress',
    price: 1299,
    originalPrice: 1799,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles',
    color: 'Floral',
    rating: 4.7,
    reviews: 85,
    badge: 'Trending',
    discount: 28,
    inStock: true,
    description: 'Elegant floral dress perfect for summer occasions',
  },
  {
    id: 't4',
    title: 'Denim Jacket',
    price: 1599,
    originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=400&q=80',
    category: 'Textiles',
    color: 'Blue',
    rating: 4.8,
    reviews: 95,
    badge: 'Classic',
    discount: 27,
    inStock: true,
    description: 'Classic denim jacket with modern fit',
  },
  // Books
  {
    id: 'b1',
    title: 'The Midnight Library',
    price: 349,
    originalPrice: 499,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
    category: 'Books',
    color: 'Hardcover',
    rating: 4.9,
    reviews: 1420,
    badge: 'Bestseller',
    discount: 30,
    inStock: true,
    description: 'A life-changing novel about infinite possibility',
  },
  {
    id: 'b2',
    title: 'Atomic Habits',
    price: 399,
    originalPrice: 599,
    image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=400&q=80',
    category: 'Books',
    color: 'Paperback',
    rating: 4.8,
    reviews: 980,
    badge: 'Self-Help',
    discount: 33,
    inStock: true,
    description: 'Transform your habits and achieve remarkable results',
  },
  {
    id: 'b3',
    title: 'The Psychology of Money',
    price: 299,
    originalPrice: 449,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
    category: 'Books',
    color: 'Paperback',
    rating: 4.7,
    reviews: 750,
    badge: 'Finance',
    discount: 33,
    inStock: true,
    description: 'Timeless lessons about wealth, greed, and happiness',
  },
  {
    id: 'b4',
    title: 'Sapiens',
    price: 449,
    originalPrice: 699,
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=400&q=80',
    category: 'Books',
    color: 'Hardcover',
    rating: 4.6,
    reviews: 1200,
    badge: 'History',
    discount: 36,
    inStock: true,
    description: 'A brief history of humankind and our evolution',
  },
];

const categories = ['All', 'Electronics', 'Textiles', 'Books'];
const sortOptions = ['Featured', 'Price: Low to High', 'Price: High to Low', 'Rating', 'Newest'];

export type Product = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  color: string;
  rating: number;
  reviews: number;
  badge?: string;
  discount?: number;
  inStock: boolean;
  description: string;
};

const ProductGrid = ({ chatbotFilter }: { chatbotFilter?: (product: Product) => boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 4000]);
  const [search, setSearch] = useState('');
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Featured');
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCart();

  let filtered = allProducts.filter(p =>
    (selectedCategory === 'All' || p.category === selectedCategory) &&
    p.price >= priceRange[0] && p.price <= priceRange[1] &&
    (search === '' || p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()))
  );

  if (chatbotFilter) filtered = filtered.filter(chatbotFilter);

  // Apply sorting
  const sortedProducts = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.price - b.price;
      case 'Price: High to Low':
        return b.price - a.price;
      case 'Rating':
        return b.rating - a.rating;
      case 'Newest':
        return b.id.localeCompare(a.id);
      default:
        return 0;
    }
  });

  const toggleWishlist = (id: string) => {
    setWishlist(wl => wl.includes(id) ? wl.filter(x => x !== id) : [...wl, id]);
  };

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
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 glass-subtle rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* View Mode */}
            <div className="flex glass-subtle rounded-xl border border-white/20 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-pastel-500 text-white shadow-md' : 'text-gray-600 hover:bg-white/50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all ${viewMode === 'list' ? 'bg-pastel-500 text-white shadow-md' : 'text-gray-600 hover:bg-white/50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl glass-subtle border border-white/20 focus:outline-none focus:ring-2 focus:ring-pastel-400 text-gray-700"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${showFilters ? 'bg-sage-500 text-white shadow-md' : 'glass-subtle text-gray-700 hover:glass-strong border border-white/20'}`}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
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

        {/* Products Grid */}
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {sortedProducts.map(product => (
            <div key={product.id} className={viewMode === 'grid' ? 'group' : 'group'}>
              {viewMode === 'grid' ? (
                /* Grid View */
                <div className="glass-strong rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(product.badge)}`}>
                        {product.badge}
                      </span>
                    )}
                    {product.discount && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute bottom-3 right-3 p-2 glass-subtle rounded-full hover:glass-strong transition-all border border-white/20"
                    >
                      <Heart
                        className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                      />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{product.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-xs px-2 py-1 glass-subtle rounded-full border border-white/20 text-gray-600">
                        {product.color}
                      </span>
                    </div>
                    <button
                      onClick={() => addItem(product)}
                      className="w-full bg-sage-500 hover:bg-sage-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                /* List View */
                <div className="glass-strong rounded-2xl p-4 hover:shadow-lg transition-all border border-white/20">
                  <div className="flex gap-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                      {product.badge && (
                        <span className={`absolute -top-1 -right-1 px-2 py-1 text-xs font-semibold rounded-full ${getBadgeColor(product.badge)}`}>
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{product.title}</h3>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                      <div className="flex items-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                          <span className="text-sm text-gray-500">({product.reviews})</span>
                        </div>
                        <span className="text-xs px-2 py-1 glass-subtle rounded-full border border-white/20 text-gray-600">
                          {product.color}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">₹{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                          )}
                          {product.discount && (
                            <span className="text-xs text-red-600 font-medium">-{product.discount}%</span>
                          )}
                        </div>
                        <button
                          onClick={() => addItem(product)}
                          className="bg-sage-500 hover:bg-sage-600 text-white font-medium py-2 px-4 rounded-xl transition-colors flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
