import React, { useState, useRef, useEffect } from 'react';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholder?: string;
    onLoad?: () => void;
    onError?: () => void;
    priority?: boolean; // For LCP images
    sizes?: string; // Responsive sizing
    width?: number;
    height?: number;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
    onLoad,
    onError,
    priority = false,
    sizes,
    width,
    height,
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(priority); // Load immediately if priority
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer for lazy loading (skip if priority image)
    useEffect(() => {
        if (priority) return; // Don't lazy load priority images

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '100px', // Start loading earlier
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority]);

    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    }; const handleError = () => {
        setHasError(true);
        onError?.();
    };

    // Generate responsive srcSet for better performance
    const generateSrcSet = (baseSrc: string) => {
        if (!baseSrc.includes('placeholder.svg')) {
            // Generate different sizes for responsive images
            return `${baseSrc}?w=400 400w, ${baseSrc}?w=800 800w, ${baseSrc}?w=1200 1200w`;
        }
        return baseSrc;
    };

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            {/* Placeholder/Loading state */}
            {!isLoaded && !hasError && (
                <img
                    src={placeholder}
                    alt=""
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
                />
            )}

            {/* Main image */}
            <img
                ref={imgRef}
                src={isInView ? src : placeholder}
                srcSet={isInView ? generateSrcSet(src) : undefined}
                sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                width={width}
                height={height}
            />

            {/* Error state */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                    <div className="text-center">
                        <div className="text-2xl mb-2">📷</div>
                        <div className="text-sm">Image not available</div>
                    </div>
                </div>
            )}            {/* Loading indicator */}
            {!isLoaded && !hasError && isInView && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                    <div className="animate-pulse">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
