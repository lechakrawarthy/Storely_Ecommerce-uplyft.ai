import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '../data/products';

interface ComparisonContextType {
    compareList: Product[];
    addToComparison: (product: Product) => void;
    removeFromComparison: (productId: string) => void;
    clearComparison: () => void;
    isInComparison: (productId: string) => boolean;
    getComparisonCount: () => number;
}

export const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [compareList, setCompareList] = useState<Product[]>([]);

    // Load comparison list from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bookbuddy-comparison');
        if (saved) {
            try {
                setCompareList(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading comparison list from localStorage:', error);
            }
        }
    }, []);

    // Save comparison list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('bookbuddy-comparison', JSON.stringify(compareList));
    }, [compareList]);

    const addToComparison = (product: Product) => {
        setCompareList(prev => {
            // Check if already in comparison
            if (prev.some(item => item.id === product.id)) {
                return prev;
            }
            // Limit to 3 products for comparison
            if (prev.length >= 3) {
                return [product, ...prev.slice(0, 2)];
            }
            return [product, ...prev];
        });
    };

    const removeFromComparison = (productId: string) => {
        setCompareList(prev => prev.filter(item => item.id !== productId));
    };

    const clearComparison = () => {
        setCompareList([]);
        localStorage.removeItem('bookbuddy-comparison');
    };

    const isInComparison = (productId: string) => {
        return compareList.some(item => item.id === productId);
    };

    const getComparisonCount = () => compareList.length;

    return (
        <ComparisonContext.Provider
            value={{
                compareList,
                addToComparison,
                removeFromComparison,
                clearComparison,
                isInComparison,
                getComparisonCount,
            }}
        >
            {children}
        </ComparisonContext.Provider>
    );
};
