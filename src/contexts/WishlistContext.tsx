import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '../components/ui/use-toast';
import { Product } from '../data/products';
import hapticFeedback from '../utils/hapticFeedback';

interface WishlistContextType {
    wishlist: string[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    toggleWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    wishlistCount: number;
    getWishlistProducts: () => Product[];
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

interface WishlistProviderProps {
    children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
    const [wishlist, setWishlist] = useState<string[]>([]);
    const { toast } = useToast();

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bookbuddy-wishlist');
        if (saved) {
            try {
                setWishlist(JSON.parse(saved));
            } catch (error) {
                console.error('Error loading wishlist from localStorage:', error);
            }
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('bookbuddy-wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (productId: string) => {
        setWishlist(prev => {
            if (!prev.includes(productId)) {
                toast({
                    title: "Added to Wishlist",
                    description: "Product has been added to your wishlist.",
                    className: "bg-green-50 border-green-200 text-green-800",
                });
                return [...prev, productId];
            }
            return prev;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist(prev => {
            const newWishlist = prev.filter(id => id !== productId);
            toast({
                title: "Removed from Wishlist",
                description: "Product has been removed from your wishlist.",
                className: "bg-red-50 border-red-200 text-red-800",
            });
            return newWishlist;
        });
    };
    const toggleWishlist = (productId: string) => {
        if (wishlist.includes(productId)) {
            removeFromWishlist(productId);
            // Haptic feedback for removing from wishlist
            hapticFeedback.light();
        } else {
            addToWishlist(productId);
            // Haptic feedback for adding to wishlist
            hapticFeedback.success();
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.includes(productId);
    };

    const clearWishlist = () => {
        setWishlist([]);
        toast({
            title: "Wishlist Cleared",
            description: "All items have been removed from your wishlist.",
            className: "bg-blue-50 border-blue-200 text-blue-800",
        });
    };

    const getWishlistProducts = (): Product[] => {
        // This would need to be implemented to fetch actual product data
        // For now, return empty array - this should be implemented based on your product data structure
        return [];
    };

    const value = {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        isInWishlist,
        clearWishlist,
        wishlistCount: wishlist.length,
        getWishlistProducts,
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
