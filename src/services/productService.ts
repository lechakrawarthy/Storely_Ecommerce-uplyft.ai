// API service for fetching products from the database

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

// Frontend product interface
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

// Convert database product to frontend format
export const convertDbProductToFrontend = (dbProduct: DbProduct): Product => ({
    id: dbProduct.id.toString(),
    title: dbProduct.name,
    price: dbProduct.price,
    originalPrice: undefined, // Not in DB
    image: dbProduct.image_url,
    category: dbProduct.category,
    color: 'Default', // Not in DB, using default
    rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
    reviews: Math.floor(Math.random() * 500) + 50, // Random reviews
    badge: dbProduct.badge,
    discount: undefined, // Not in DB
    inStock: dbProduct.stock > 0,
    description: dbProduct.description,
});

// API Base URL
const API_BASE = 'http://localhost:5000/api';

// Fetch all products
export const fetchProducts = async (limit?: number, category?: string): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();
        if (limit) params.append('limit', limit.toString());
        if (category && category !== 'All') params.append('category', category);

        const response = await fetch(`${API_BASE}/products?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dbProducts: DbProduct[] = await response.json();
        return dbProducts.map(convertDbProductToFrontend);
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

// Fetch single product by ID
export const fetchProductById = async (id: string): Promise<Product | null> => {
    try {
        const response = await fetch(`${API_BASE}/products/${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dbProduct: DbProduct = await response.json();
        return convertDbProductToFrontend(dbProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};

// Fetch categories
export const fetchCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return ['All', ...data];
    } catch (error) {
        console.error('Error fetching categories:', error);
        return ['All', 'Books', 'Electronics', 'Textiles']; // Fallback
    }
};

// Search products
export const searchProductsAPI = async (query: string): Promise<Product[]> => {
    try {
        const params = new URLSearchParams();
        params.append('q', query);

        const response = await fetch(`${API_BASE}/search?${params}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const dbProducts: DbProduct[] = data.results || [];
        return dbProducts.map(convertDbProductToFrontend);
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

// Sort products (client-side for now)
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
    const sorted = [...products];

    switch (sortBy) {
        case 'price-low':
        case 'Price: Low to High':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
        case 'Price: High to Low':
            return sorted.sort((a, b) => b.price - a.price);
        case 'name':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        case 'Rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
        case 'Newest':
            return sorted.sort((a, b) => b.id.localeCompare(a.id));
        default:
            return sorted;
    }
};

// Filter products by category (client-side)
export const filterProductsByCategory = (products: Product[], category: string): Product[] => {
    if (category === 'All') return products;
    return products.filter(product => product.category === category);
};

// Search products locally (client-side)
export const searchProductsLocal = (products: Product[], query: string): Product[] => {
    if (!query.trim()) return products;

    const lowerQuery = query.toLowerCase();
    return products.filter(product =>
        product.title.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
};
