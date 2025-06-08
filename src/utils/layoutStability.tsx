/**
 * Layout Stability utilities to prevent Cumulative Layout Shift (CLS)
 * Implements skeleton loaders and reserved space for dynamic content
 */

import React, { useState, useEffect } from 'react';

export interface LayoutReservation {
    width?: number | string;
    height?: number | string;
    aspectRatio?: string;
    minHeight?: number | string;
}

/**
 * Skeleton loader component to prevent layout shifts
 */
interface SkeletonProps {
    width?: number | string;
    height?: number | string;
    className?: string;
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
    animation?: 'pulse' | 'wave';
    lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
    width = '100%',
    height = '1rem',
    className = '',
    variant = 'rectangular',
    animation = 'pulse',
    lines = 1
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'text':
                return 'rounded-sm';
            case 'circular':
                return 'rounded-full';
            case 'rounded':
                return 'rounded-lg';
            case 'rectangular':
            default:
                return 'rounded';
        }
    };

    const getAnimationClasses = () => {
        switch (animation) {
            case 'wave':
                return 'animate-wave';
            case 'pulse':
            default:
                return 'animate-pulse';
        }
    };

    if (variant === 'text' && lines > 1) {
        return (
            <div className={`space-y-2 ${className}`}>
                {Array.from({ length: lines }, (_, i) => (
                    <div
                        key={i}
                        className={`bg-gray-200 ${getVariantClasses()} ${getAnimationClasses()}`}
                        style={{
                            width: i === lines - 1 ? '75%' : width,
                            height,
                        }}
                    />
                ))}
            </div>
        );
    }

    return (
        <div
            className={`bg-gray-200 ${getVariantClasses()} ${getAnimationClasses()} ${className}`}
            style={{ width, height }}
        />
    );
};

/**
 * Image placeholder to prevent layout shift
 */
interface ImagePlaceholderProps {
    width: number | string;
    height: number | string;
    aspectRatio?: string;
    className?: string;
    children?: React.ReactNode;
}

export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
    width,
    height,
    aspectRatio,
    className = '',
    children
}) => {
    const style: React.CSSProperties = {
        width,
        height,
        ...(aspectRatio && { aspectRatio })
    };

    return (
        <div
            className={`bg-gray-100 flex items-center justify-center ${className}`}
            style={style}
        >
            {children || (
                <div className="text-gray-400 text-center">
                    <div className="text-2xl mb-2">📷</div>
                    <div className="text-sm">Loading...</div>
                </div>
            )}
        </div>
    );
};

/**
 * Card skeleton for product cards
 */
export const ProductCardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
        <Skeleton height="200px" variant="rounded" />
        <div className="space-y-2">
            <Skeleton height="1.5rem" variant="text" />
            <Skeleton height="1rem" width="60%" variant="text" />
            <div className="flex items-center justify-between">
                <Skeleton height="1.25rem" width="40%" variant="text" />
                <Skeleton height="2rem" width="80px" variant="rounded" />
            </div>
        </div>
    </div>
);

/**
 * Navigation skeleton
 */
export const NavigationSkeleton = () => (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
            <Skeleton height="2rem" width="120px" variant="text" />
            <div className="flex items-center space-x-4">
                <Skeleton height="2rem" width="200px" variant="rounded" />
                <Skeleton height="2rem" width="2rem" variant="circular" />
                <Skeleton height="2rem" width="2rem" variant="circular" />
            </div>
        </div>
    </nav>
);

/**
 * Layout stabilizer hook to prevent shifts during loading
 */
export const useLayoutStabilizer = (isLoading: boolean, reservation: LayoutReservation) => {
    const [reservedSpace, setReservedSpace] = useState(reservation);

    useEffect(() => {
        if (!isLoading) {
            // Release reserved space after content loads
            const timer = setTimeout(() => {
                setReservedSpace({});
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [isLoading]);

    return {
        style: isLoading ? reservedSpace : {},
        isStabilizing: isLoading
    };
};

/**
 * Aspect ratio container to maintain layout during image loading
 */
interface AspectRatioContainerProps {
    aspectRatio: number; // width/height ratio
    children: React.ReactNode;
    className?: string;
}

export const AspectRatioContainer: React.FC<AspectRatioContainerProps> = ({
    aspectRatio,
    children,
    className = ''
}) => {
    return (
        <div
            className={`relative w-full ${className}`}
            style={{
                paddingBottom: `${100 / aspectRatio}%`
            }}
        >
            <div className="absolute inset-0">
                {children}
            </div>
        </div>
    );
};

/**
 * Text line skeleton for text content
 */
interface TextSkeletonProps {
    lines: number;
    className?: string;
}

export const TextSkeleton: React.FC<TextSkeletonProps> = ({ lines, className = '' }) => (
    <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, i) => (
            <Skeleton
                key={i}
                height="1rem"
                width={i === lines - 1 ? `${60 + Math.random() * 20}%` : '100%'}
                variant="text"
            />
        ))}
    </div>
);

/**
 * Grid skeleton for product grids
 */
interface GridSkeletonProps {
    items: number;
    columns?: number;
    className?: string;
}

export const GridSkeleton: React.FC<GridSkeletonProps> = ({
    items,
    columns = 4,
    className = ''
}) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-6 ${className}`}>
        {Array.from({ length: items }, (_, i) => (
            <ProductCardSkeleton key={i} />
        ))}
    </div>
);

/**
 * Layout shift prevention utilities
 */
export const LayoutShiftPrevention = {
    // Reserve space for dynamic content
    reserveSpace: (element: HTMLElement, dimensions: LayoutReservation) => {
        if (dimensions.width) {
            element.style.width = typeof dimensions.width === 'number'
                ? `${dimensions.width}px`
                : dimensions.width;
        }
        if (dimensions.height) {
            element.style.height = typeof dimensions.height === 'number'
                ? `${dimensions.height}px`
                : dimensions.height;
        }
        if (dimensions.minHeight) {
            element.style.minHeight = typeof dimensions.minHeight === 'number'
                ? `${dimensions.minHeight}px`
                : dimensions.minHeight;
        }
        if (dimensions.aspectRatio) {
            element.style.aspectRatio = dimensions.aspectRatio;
        }
    },

    // Preload critical images to prevent layout shift
    preloadImage: (src: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = reject;
            img.src = src;
        });
    },

    // Set up intersection observer for lazy loading without layout shift
    setupLazyLoading: (elements: HTMLElement[], placeholder: LayoutReservation) => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const element = entry.target as HTMLElement;
                    // Maintain reserved space while loading
                    LayoutShiftPrevention.reserveSpace(element, placeholder);
                    observer.unobserve(element);
                }
            });
        }, {
            rootMargin: '50px'
        });

        elements.forEach(element => observer.observe(element));
        return observer;
    }
};
