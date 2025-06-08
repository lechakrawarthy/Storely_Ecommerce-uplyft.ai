/**
 * Web compression and asset optimization utilities
 * Implements Gzip, Brotli compression and optimized asset delivery
 */

// Types for compression optimization
export interface CompressionConfig {
    enableGzip: boolean;
    enableBrotli: boolean;
    threshold: number; // Minimum size to compress (bytes)
    level: number; // Compression level (1-9)
}

export interface AssetOptimization {
    imageFormats: string[];
    lazyLoadThreshold: number;
    preloadCritical: boolean;
    enableWebP: boolean;
}

/**
 * Default compression configuration
 */
export const defaultCompressionConfig: CompressionConfig = {
    enableGzip: true,
    enableBrotli: true,
    threshold: 1024, // 1KB minimum
    level: 6 // Balanced compression level
};

/**
 * Asset optimization configuration
 */
export const defaultAssetConfig: AssetOptimization = {
    imageFormats: ['webp', 'avif', 'jpg', 'png'],
    lazyLoadThreshold: 100, // pixels from viewport
    preloadCritical: true,
    enableWebP: true
};

/**
 * Check if compression is supported by the browser
 */
export const getCompressionSupport = (): { gzip: boolean; brotli: boolean; webp: boolean; avif: boolean } => {
    const supportsWebP = (() => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
        } catch {
            return false;
        }
    })();

    const supportsAvif = (() => {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = canvas.height = 1;
            return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
        } catch {
            return false;
        }
    })();

    return {
        gzip: 'CompressionStream' in window,
        brotli: 'CompressionStream' in window,
        webp: supportsWebP,
        avif: supportsAvif
    };
};

/**
 * Compress text content using native compression API
 */
export const compressText = async (text: string, format: 'gzip' | 'deflate' = 'gzip'): Promise<Uint8Array> => {
    if (!('CompressionStream' in window)) {
        throw new Error('Compression not supported');
    }

    const stream = new CompressionStream(format);
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();

    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];

    // Start compression
    writer.write(encoder.encode(text));
    writer.close();

    // Read compressed data
    let result = await reader.read();
    while (!result.done) {
        chunks.push(result.value);
        result = await reader.read();
    }

    // Combine chunks
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const compressed = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
        compressed.set(chunk, offset);
        offset += chunk.length;
    }

    return compressed;
};

/**
 * Create optimized image source with multiple formats
 */
export const createOptimizedImageSrc = (
    baseSrc: string,
    config: AssetOptimization = defaultAssetConfig
): string => {
    const support = getCompressionSupport();

    // Determine best format based on browser support
    if (support.avif && config.imageFormats.includes('avif')) {
        return baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.avif');
    } else if (support.webp && config.enableWebP && config.imageFormats.includes('webp')) {
        return baseSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    return baseSrc;
};

/**
 * Generate responsive image srcSet with optimized formats
 */
export const generateResponsiveSrcSet = (
    baseSrc: string,
    sizes: number[] = [400, 800, 1200, 1600],
    config: AssetOptimization = defaultAssetConfig
): string => {
    const support = getCompressionSupport();
    let format = 'jpg';

    if (support.avif && config.imageFormats.includes('avif')) {
        format = 'avif';
    } else if (support.webp && config.enableWebP) {
        format = 'webp';
    }

    return sizes
        .map(size => {
            const optimizedSrc = baseSrc.replace(/\.(jpg|jpeg|png)$/i, `.${format}`);
            return `${optimizedSrc}?w=${size} ${size}w`;
        })
        .join(', ');
};

/**
 * Preload critical resources with optimal compression
 */
export const preloadCriticalResources = (resources: Array<{
    href: string;
    as: 'image' | 'font' | 'script' | 'style';
    type?: string;
    crossorigin?: boolean;
}>) => {
    const head = document.head;

    resources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = resource.href;
        link.as = resource.as;

        if (resource.type) {
            link.type = resource.type;
        }

        if (resource.crossorigin) {
            link.crossOrigin = 'anonymous';
        }

        // Add compression hints
        if (resource.as === 'image') {
            const optimizedHref = createOptimizedImageSrc(resource.href);
            link.href = optimizedHref;
        }

        head.appendChild(link);
    });
};

/**
 * Implement text compression for API responses
 */
export const compressApiResponse = async (data: any): Promise<string> => {
    const jsonString = JSON.stringify(data);

    try {
        const compressed = await compressText(jsonString, 'gzip');
        const base64 = btoa(String.fromCharCode(...compressed));
        return base64;
    } catch (error) {
        console.warn('Compression failed, returning original data:', error);
        return jsonString;
    }
};

/**
 * Asset optimization for images
 */
export class AssetOptimizer {
    private config: AssetOptimization;

    constructor(config: AssetOptimization = defaultAssetConfig) {
        this.config = config;
    }

    /**
     * Optimize image loading with lazy loading and format selection
     */
    optimizeImage(img: HTMLImageElement, src: string) {
        // Set up lazy loading
        if ('loading' in img) {
            img.loading = 'lazy';
        } else {
            // Fallback for browsers without native lazy loading
            this.setupIntersectionObserver(img, src);
        }

        // Set optimized source
        img.src = createOptimizedImageSrc(src, this.config);

        // Add responsive srcSet
        if (img.getAttribute('data-sizes')) {
            const sizes = img.getAttribute('data-sizes')!.split(',').map(Number);
            img.srcset = generateResponsiveSrcSet(src, sizes, this.config);
        }
    }

    /**
     * Setup intersection observer for lazy loading
     */
    private setupIntersectionObserver(img: HTMLImageElement, src: string) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target as HTMLImageElement;
                    image.src = createOptimizedImageSrc(src, this.config);
                    observer.unobserve(image);
                }
            });
        }, {
            rootMargin: `${this.config.lazyLoadThreshold}px`
        });

        observer.observe(img);
    }

    /**
     * Preload critical images
     */
    preloadCriticalImages(sources: string[]) {
        if (!this.config.preloadCritical) return;

        const resources = sources.map(src => ({
            href: createOptimizedImageSrc(src, this.config),
            as: 'image' as const,
            crossorigin: true
        }));

        preloadCriticalResources(resources);
    }
}

/**
 * Performance monitoring for compression effectiveness
 */
export const monitorCompressionPerformance = () => {
    const startTime = performance.now();
    const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];

    if (navigationEntries.length > 0) {
        const entry = navigationEntries[0];

        const metrics = {
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            compressionRatio: entry.encodedBodySize / entry.decodedBodySize,
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart
        };

        console.log('Compression Performance Metrics:', metrics);

        // Send to analytics if available
        if ('gtag' in window) {
            (window as any).gtag('event', 'compression_metrics', {
                custom_parameter_compression_ratio: metrics.compressionRatio,
                custom_parameter_transfer_size: metrics.transferSize,
                custom_parameter_load_time: metrics.loadTime
            });
        }

        return metrics;
    }

    return null;
};

/**
 * Initialize compression optimizations
 */
export const initCompressionOptimizations = (
    compressionConfig: CompressionConfig = defaultCompressionConfig,
    assetConfig: AssetOptimization = defaultAssetConfig
) => {
    console.log('Initializing compression optimizations...');

    // Monitor compression performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            monitorCompressionPerformance();
        }, 1000);
    });

    // Initialize asset optimizer
    const optimizer = new AssetOptimizer(assetConfig);

    // Optimize existing images
    document.querySelectorAll('img[data-optimize]').forEach((img) => {
        const src = img.getAttribute('data-src') || img.getAttribute('src');
        if (src) {
            optimizer.optimizeImage(img as HTMLImageElement, src);
        }
    });

    // Preload critical images
    const criticalImages = Array.from(document.querySelectorAll('img[data-critical]'))
        .map(img => img.getAttribute('src'))
        .filter(Boolean) as string[];

    if (criticalImages.length > 0) {
        optimizer.preloadCriticalImages(criticalImages);
    }

    return {
        compressText,
        createOptimizedImageSrc,
        generateResponsiveSrcSet,
        preloadCriticalResources,
        AssetOptimizer: optimizer,
        monitorPerformance: monitorCompressionPerformance
    };
};

export default {
    initCompressionOptimizations,
    compressText,
    createOptimizedImageSrc,
    generateResponsiveSrcSet,
    preloadCriticalResources,
    AssetOptimizer,
    monitorCompressionPerformance,
    getCompressionSupport,
    defaultCompressionConfig,
    defaultAssetConfig
};
