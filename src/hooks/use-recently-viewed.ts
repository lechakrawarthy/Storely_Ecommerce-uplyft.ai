import { useContext } from 'react';
import { RecentlyViewedContext } from '../contexts/RecentlyViewedContext';

export const useRecentlyViewed = () => {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
};
