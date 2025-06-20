// Product types and data - Updated to work with database products

export interface Product {
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
}

// Database product interface
export interface DbProduct {
    id: number;
    name: string;
    category: string;
    price: number;
    stock: number;
    description: string;
    image_url: string;
    badge?: string;
}

// Fallback products data (used when API is unavailable)
const fallbackProducts: Product[] = [
    {
        id: '1',
        title: 'The Great Gatsby',
        price: 12.99,
        originalPrice: 15.99,
        image: 'https://covers.openlibrary.org/b/id/8225261-L.jpg',
        category: 'Books',
        color: 'Blue',
        rating: 4.2,
        reviews: 1205,
        badge: 'Bestseller',
        discount: 19,
        inStock: true,
        description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.'
    },
    {
        id: '2',
        title: 'To Kill a Mockingbird',
        price: 13.99,
        image: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
        category: 'Books',
        color: 'Green',
        rating: 4.5,
        reviews: 2341,
        badge: 'Classic',
        inStock: true,
        description: 'A gripping tale of racial injustice and childhood innocence in the American South.'
    },
    {
        id: '3',
        title: 'iPhone 14 Pro',
        price: 999.99,
        originalPrice: 1099.99,
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-deep-purple-select?wid=470&hei=556&fmt=png-alpha&.v=1663703841896',
        category: 'Electronics',
        color: 'Purple',
        rating: 4.8,
        reviews: 3456,
        badge: 'New',
        discount: 9,
        inStock: true,
        description: 'Latest iPhone with Pro camera system and Dynamic Island.'
    },
    {
        id: '4',
        title: 'Cotton T-Shirt',
        price: 24.99,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        category: 'Textiles',
        color: 'White',
        rating: 4.3,
        reviews: 567,
        inStock: true,
        description: '100% organic cotton t-shirt, comfortable and breathable.'
    }
];

// Convert database product to frontend format
export const convertDbProductToFrontend = (dbProduct: DbProduct): Product => ({
    id: dbProduct.id.toString(),
    title: dbProduct.name,
    price: dbProduct.price,
    originalPrice: undefined,
    image: dbProduct.image_url,
    category: dbProduct.category,
    color: 'Default',
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    reviews: Math.floor(Math.random() * 500) + 50,
    badge: dbProduct.badge,
    discount: undefined,
    inStock: dbProduct.stock > 0,
    description: dbProduct.description,
});

// Dynamic products loaded from database
export let allProducts: Product[] = fallbackProducts; // Initialize with fallback data

// Loading state
export let isProductsLoading = true;
export let productsLoadError: string | null = null;

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Fetch products from database
export const loadProductsFromDB = async (): Promise<Product[]> => {
    try {
        isProductsLoading = true;
        productsLoadError = null;

        const response = await fetch(`${API_BASE}/products?limit=300`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dbProducts: DbProduct[] = await response.json();
        const frontendProducts = dbProducts.map(convertDbProductToFrontend);

        // Update the global allProducts array
        allProducts = frontendProducts;

        console.log(`✅ Loaded ${frontendProducts.length} products from database`);
        return frontendProducts;
    } catch (error) {
        console.warn('⚠️ Failed to load products from database, using fallback data:', error);
        productsLoadError = error instanceof Error ? error.message : 'Failed to load products';

        // Keep fallback products
        allProducts = fallbackProducts;
        return fallbackProducts;
    } finally {
        isProductsLoading = false;
    }
};

// Helper functions for product operations
export const getProductById = (id: string): Product | undefined => {
    return allProducts.find(product => product.id === id);
};

export const getProductsByCategory = (category: string): Product[] => {
    if (category === 'All') return allProducts;
    return allProducts.filter(product => product.category === category);
};

export const searchProducts = (query: string): Product[] => {
    if (!query.trim()) return allProducts;

    const lowerQuery = query.toLowerCase();
    return allProducts.filter(product =>
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.color.toLowerCase().includes(lowerQuery) ||
        (product.badge && product.badge.toLowerCase().includes(lowerQuery))
    );
};

export const getCategories = (): string[] => {
    return ['All', ...Array.from(new Set(allProducts.map(p => p.category)))];
};

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
    return [...products].sort((a, b) => {
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
};

// Get loading state
export const getProductsLoadingState = () => ({
    isLoading: isProductsLoading,
    error: productsLoadError,
    hasData: allProducts.length > 0
});

// Initialize products on module load
loadProductsFromDB().catch(console.error);
