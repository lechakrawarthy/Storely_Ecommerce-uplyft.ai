// Custom hook for monitoring product loading state
import { useState, useEffect } from 'react';
import { getProductsLoadingState, allProducts } from '../data/products';

export const useProductsLoadingState = () => {
    const [loadingState, setLoadingState] = useState(getProductsLoadingState());

    useEffect(() => {
        // Check loading state periodically
        const checkLoadingState = () => {
            const currentState = getProductsLoadingState();
            setLoadingState(currentState);
        };

        checkLoadingState();

        // Check every 100ms until loading is complete
        const interval = setInterval(() => {
            const currentState = getProductsLoadingState();
            setLoadingState(currentState);

            if (!currentState.isLoading) {
                clearInterval(interval);
            }
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return {
        isLoading: loadingState.isLoading,
        error: loadingState.error,
        hasData: loadingState.hasData,
        products: allProducts
    };
};
