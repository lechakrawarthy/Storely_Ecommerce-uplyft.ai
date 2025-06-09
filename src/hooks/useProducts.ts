// Custom hook for managing products from the database
import { useState, useEffect } from 'react';
import {
    fetchProducts,
    fetchCategories,
    searchProductsAPI,
    sortProducts,
    type Product
} from '../services/productService';

export const useProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(['All']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load initial products and categories
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [productsData, categoriesData] = await Promise.all([
                    fetchProducts(300), // Load all 300 products
                    fetchCategories()
                ]);

                setProducts(productsData);
                setCategories(categoriesData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load products');
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    // Get products by category
    const getProductsByCategory = (category: string, limit?: number) => {
        let filtered = category === 'All'
            ? products
            : products.filter(p => p.category === category);

        return limit ? filtered.slice(0, limit) : filtered;
    };
    // Search products
    const searchProducts = (query: string) => {
        if (!query.trim()) return products;

        const lowerQuery = query.toLowerCase();
        return products.filter(product =>
            product.title.toLowerCase().includes(lowerQuery) ||
            product.description.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
    };

    // Get product by ID
    const getProductById = (id: string) => {
        return products.find(product => product.id.toString() === id);
    };

    // Sort products
    const getSortedProducts = (productsToSort: Product[], sortBy: string) => {
        return sortProducts(productsToSort, sortBy);
    };

    return {
        products,
        categories,
        loading,
        error,
        getProductsByCategory,
        searchProducts,
        getProductById,
        getSortedProducts,
        refetch: () => {
            // Force refetch
            window.location.reload();
        }
    };
};

export const useProduct = (id: string) => {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                // First try to get from all products
                const allProducts = await fetchProducts(300);
                const foundProduct = allProducts.find(p => p.id.toString() === id);

                setProduct(foundProduct || null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load product');
                console.error('Error loading product:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id]);

    return { product, loading, error };
};
