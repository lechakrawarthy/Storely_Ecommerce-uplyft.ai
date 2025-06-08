import React from 'react';

interface LayoutStabilityProps {
    children: React.ReactNode;
    aspectRatio?: string;
    minHeight?: string;
    className?: string;
}

// Component to prevent layout shifts by reserving space
export const LayoutStabilizer: React.FC<LayoutStabilityProps> = ({
    children,
    aspectRatio,
    minHeight,
    className = '',
}) => {
    const styles: React.CSSProperties = {
        ...(aspectRatio && { aspectRatio }),
        ...(minHeight && { minHeight }),
    };

    return (
        <div className={`${className}`} style={styles}>
            {children}
        </div>
    );
};

// Skeleton loader component to prevent layout shifts during loading
export const SkeletonLoader: React.FC<{
    width?: string;
    height?: string;
    className?: string;
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}> = ({ width = '100%', height = '20px', className = '', rounded = 'md' }) => {
    const roundedClass = {
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        full: 'rounded-full',
    }[rounded];

    return (
        <div
            className={`bg-gray-200 animate-pulse ${roundedClass} ${className}`}
            style={{ width, height }}
            aria-label="Loading..."
        />
    );
};

// Image container that prevents layout shift
export const ImageContainer: React.FC<{
    children: React.ReactNode;
    width: number;
    height: number;
    className?: string;
}> = ({ children, width, height, className = '' }) => {
    return (
        <div
            className={`relative overflow-hidden ${className}`}
            style={{ width, height }}
        >
            {children}
        </div>
    );
};

// Text container that prevents layout shift during font loading
export const TextContainer: React.FC<{
    children: React.ReactNode;
    lines?: number;
    className?: string;
}> = ({ children, lines = 1, className = '' }) => {
    const minHeight = `${lines * 1.5}em`; // Approximate line height

    return (
        <div
            className={`${className}`}
            style={{ minHeight }}
        >
            {children}
        </div>
    );
};

export default LayoutStabilizer;
