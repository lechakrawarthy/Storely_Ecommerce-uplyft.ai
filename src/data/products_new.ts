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
export let allProducts: Product[] = [];

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

// Initialize products on module load
loadProductsFromDB().catch(console.error);
