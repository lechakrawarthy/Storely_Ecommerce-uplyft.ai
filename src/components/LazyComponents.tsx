import React, { lazy, Suspense } from 'react';
import { SkeletonLoader } from './LayoutStabilizer';

// Higher-order component for lazy loading with performance optimizations
export const withLazyLoading = <P extends object>(
    importFunc: () => Promise<{ default: React.ComponentType<P> }>,
    fallback?: React.ReactNode
) => {
    const LazyComponent = lazy(importFunc);

    return React.forwardRef<any, P>((props, ref) => (
        <Suspense fallback={fallback || <SkeletonLoader height="200px" />}>
            <LazyComponent {...props} ref={ref} />
        </Suspense>
    ));
};

// Lazy load heavy components
export const LazyProductDetail = withLazyLoading(
    () => import('../pages/ProductDetail'),
    <div className="flex items-center justify-center h-96">
        <SkeletonLoader height="300px" width="100%" />
    </div>
);

export const LazyUserProfile = withLazyLoading(
    () => import('../components/UserProfile'),
    <SkeletonLoader height="150px" />
);

export const LazyEnhancedChatbot = withLazyLoading(
    () => import('../components/EnhancedChatbotFloat'),
    <div className="fixed bottom-4 right-4">
        <SkeletonLoader height="60px" width="60px" rounded="full" />
    </div>
);

// Component for lazy loading sections below the fold
export const LazySection: React.FC<{
    children: React.ReactNode;
    fallback?: React.ReactNode;
    rootMargin?: string;
}> = ({ children, fallback, rootMargin = '200px' }) => {
    return (
        <Suspense fallback={fallback || <SkeletonLoader height="300px" />}>
            {children}
        </Suspense>
    );
};

export default withLazyLoading;
