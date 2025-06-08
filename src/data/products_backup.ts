// Product types and data
// Updated to work with database products

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
let allProducts: Product[] = [];

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Fetch products from database
export const loadProductsFromDB = async (): Promise<Product[]> => {
    try {
        const response = await fetch(`${API_BASE}/products?limit=300`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const dbProducts: DbProduct[] = await response.json();
        const frontendProducts = dbProducts.map(convertDbProductToFrontend);
        
        // Update the global allProducts array
        allProducts = frontendProducts;
        
        return frontendProducts;
    } catch (error) {
        console.error('Error loading products from database:', error);
        // Return empty array on error
        return [];
    }
};

// Initialize products on module load
loadProductsFromDB().catch(console.error);
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
        description: 'Advanced fitness tracking with health monitoring',
    },
    {
        id: 'e4',
        title: 'Smartphone Pro Max',
        price: 3999,
        originalPrice: 4599,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
        category: 'Electronics',
        color: 'Blue',
        rating: 4.9,
        reviews: 890,
        badge: 'Trending',
        discount: 13,
        inStock: true,
        description: 'Latest flagship smartphone with advanced camera system',
    },

    // Textiles
    {
        id: 't1',
        title: 'Classic Denim Jacket',
        price: 899,
        originalPrice: 1199,
        image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5b?auto=format&fit=crop&w=400&q=80',
        category: 'Textiles',
        color: 'Blue',
        rating: 4.5,
        reviews: 156,
        badge: 'Classic',
        discount: 25,
        inStock: true,
        description: 'Timeless denim jacket with vintage appeal',
    },
    {
        id: 't2',
        title: 'Cotton White T-Shirt',
        price: 349,
        originalPrice: 499,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80',
        category: 'Textiles',
        color: 'White',
        rating: 4.3,
        reviews: 89,
        badge: 'Essential',
        discount: 30,
        inStock: true,
        description: 'Premium cotton t-shirt for everyday comfort',
    },
    {
        id: 't3',
        title: 'Wool Scarf',
        price: 599,
        originalPrice: 799,
        image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=400&q=80',
        category: 'Textiles',
        color: 'Grey',
        rating: 4.4,
        reviews: 67,
        badge: 'Winter',
        discount: 25,
        inStock: false,
        description: 'Soft wool scarf perfect for cold weather',
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
        reviews: 2340,
        badge: 'Self-Help',
        discount: 33,
        inStock: true,
        description: 'Transform your life with the power of small habits',
    },
    {
        id: 'b3',
        title: 'The Psychology of Money',
        price: 299,
        originalPrice: 449,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=400&q=80',
        category: 'Books',
        color: 'Paperback',
        rating: 4.6,
        reviews: 980,
        badge: 'Finance',
        discount: 33,
        inStock: true,
        description: 'Timeless lessons on wealth, greed, and happiness',
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
