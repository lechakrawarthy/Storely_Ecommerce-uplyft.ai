import { useContext } from 'react';
import { ComparisonContext } from '../contexts/ComparisonContext';

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (!context) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
