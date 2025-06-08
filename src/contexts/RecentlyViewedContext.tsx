import React, { createContext, useEffect, useState } from 'react';
import { Product } from '../data/products';

interface RecentlyViewedContextType {
    recentlyViewed: Product[];
    addToRecentlyViewed: (product: Product) => void;
    removeFromRecentlyViewed: (productId: string) => void;
    clearRecentlyViewed: () => void;
    getRecentlyViewedCount: () => number;
}

export const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export const RecentlyViewedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

    // Load recently viewed from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bookbuddy-recently-viewed');
        if (saved) {
            try {
                setRecentlyViewed(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading recently viewed from localStorage:', error);
            }
        }
    }, []);

    // Save recently viewed to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('bookbuddy-recently-viewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);
    const addToRecentlyViewed = (product: Product) => {
        setRecentlyViewed(prev => {
            // Remove if already exists to avoid duplicates
            const filtered = prev.filter(item => item.id !== product.id);
            // Add to beginning and keep only last 10 items
            return [product, ...filtered].slice(0, 10);
        });
    };

    const removeFromRecentlyViewed = (productId: string) => {
        setRecentlyViewed(prev => prev.filter(item => item.id !== productId));
    };

    const clearRecentlyViewed = () => {
        setRecentlyViewed([]);
        localStorage.removeItem('bookbuddy-recently-viewed');
    };

    const getRecentlyViewedCount = () => recentlyViewed.length;
    return (
        <RecentlyViewedContext.Provider
            value={{
                recentlyViewed,
                addToRecentlyViewed,
                removeFromRecentlyViewed,
                clearRecentlyViewed,
                getRecentlyViewedCount,
            }}
        >
            {children}
        </RecentlyViewedContext.Provider>
    );
};
