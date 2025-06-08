// Performance optimization utilities
export const preloadCriticalResources = () => {
    // Preload critical images
    const criticalImages = [
        'https://cdn2.hubspot.net/hubfs/53/ecommerce%20marketing.jpg', // Hero image
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

// Debounce function for search and scroll events
export const debounce = <T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle function for high-frequency events
export const throttle = <T extends (...args: unknown[]) => unknown>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Resource hints for performance
export const addResourceHints = () => {
    // DNS prefetch for external domains
    const domains = [
        '//images.unsplash.com',
        '//cdn2.hubspot.net',
    ];

    domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
    });

    // Preconnect to critical domains
    const criticalDomains = [
        'https://images.unsplash.com',
    ];

    criticalDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
};

// Memory cleanup utility
export const cleanupMemory = () => {
    // Force garbage collection if available (for development)
    if (window.gc && typeof window.gc === 'function') {
        window.gc();
    }

    // Clear large caches if they exist
    if ('caches' in window) {
        caches.keys().then(names => {
            names.forEach(name => {
                if (name.includes('temp') || name.includes('old')) {
                    caches.delete(name);
                }
            });
        });
    }
};

// Initialize performance optimizations
export const initPerformanceOptimizations = () => {
    // Add resource hints immediately
    addResourceHints();

    // Preload critical resources
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', preloadCriticalResources);
    } else {
        preloadCriticalResources();
    }

    // Cleanup memory periodically (every 5 minutes)
    setInterval(cleanupMemory, 5 * 60 * 1000);
};
