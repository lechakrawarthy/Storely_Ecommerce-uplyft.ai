// Enhanced Performance Configuration
export const PERFORMANCE_CONFIG = {
    // Bundle optimization
    bundleOptimization: {
        treeShaking: true,
        codesplitting: true,
        minification: true,
        compression: 'gzip',
        removeUnusedCSS: true,
        optimizeImages: true,
        inlineSmallAssets: true,
        lazyLoading: true
    },

    // Service Worker configuration
    serviceWorker: {
        enabled: true,
        scope: '/',
        updateOnReload: true,
        skipWaiting: true,
        clientsClaim: true,
        precacheManifest: true,
        runtimeCaching: [
            {
                urlPattern: /^https:\/\/api\//,
                handler: 'NetworkFirst',
                options: {
                    cacheName: 'api-cache',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 300 // 5 minutes
                    }
                }
            },
            {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
                handler: 'CacheFirst',
                options: {
                    cacheName: 'images-cache',
                    expiration: {
                        maxEntries: 200,
                        maxAgeSeconds: 86400 * 30 // 30 days
                    }
                }
            },
            {
                urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
                handler: 'StaleWhileRevalidate',
                options: {
                    cacheName: 'static-resources',
                    expiration: {
                        maxEntries: 100,
                        maxAgeSeconds: 86400 * 7 // 7 days
                    }
                }
            }
        ]
    },

    // Critical resource hints
    resourceHints: {
        preload: [
            '/fonts/main.woff2',
            '/css/critical.css'
        ],
        prefetch: [
            '/api/products',
            '/api/categories'
        ],
        preconnect: [
            'https://fonts.googleapis.com',
            'https://api.example.com'
        ]
    },

    // Image optimization
    imageOptimization: {
        formats: ['avif', 'webp', 'jpg'],
        sizes: [320, 640, 960, 1280, 1920],
        quality: {
            avif: 50,
            webp: 70,
            jpg: 80
        },
        lazyLoading: {
            enabled: true,
            threshold: '10px',
            rootMargin: '50px'
        }
    },

    // Code splitting strategy
    codeSplitting: {
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
        },
        common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true
        },
        async: {
            chunks: 'async',
            minSize: 20000,
            maxSize: 244000
        }
    },

    // Runtime performance
    runtime: {
        memoryOptimization: true,
        componentMemoization: true,
        virtualScrolling: true,
        suspenseBoundaries: true,
        errorBoundaries: true,
        performanceMonitoring: true
    },

    // Network optimization
    network: {
        http2Push: true,
        compressionLevel: 9,
        keepAlive: true,
        connectionReuse: true,
        requestTimeout: 10000,
        retryAttempts: 3
    },

    // Metrics and monitoring
    monitoring: {
        webVitals: true,
        performanceObserver: true,
        resourceTiming: true,
        navigationTiming: true,
        userTiming: true,
        longTasks: true
    }
};

// Performance utilities
export const PerformanceUtils = {
    // Measure Core Web Vitals
    measureWebVitals: () => {
        return new Promise((resolve) => {
            const vitals = {};

            // Largest Contentful Paint
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                vitals.lcp = lastEntry.startTime;
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // First Input Delay
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    vitals.fid = entry.processingStart - entry.startTime;
                });
            }).observe({ entryTypes: ['first-input'] });

            // Cumulative Layout Shift
            let clsValue = 0;
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                vitals.cls = clsValue;
            }).observe({ entryTypes: ['layout-shift'] });

            setTimeout(() => resolve(vitals), 5000);
        });
    },

    // Optimize bundle loading
    optimizeBundleLoading: () => {
        // Preload critical resources
        PERFORMANCE_CONFIG.resourceHints.preload.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.woff') ? 'font' : 'style';
            if (resource.includes('.woff')) link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // Prefetch next page resources
        PERFORMANCE_CONFIG.resourceHints.prefetch.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = resource;
            document.head.appendChild(link);
        });

        // Preconnect to external domains
        PERFORMANCE_CONFIG.resourceHints.preconnect.forEach(domain => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = domain;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    },

    // Memory optimization
    optimizeMemory: () => {
        // Clean up event listeners
        window.addEventListener('beforeunload', () => {
            // Cleanup logic
            if (window.performanceObserver) {
                window.performanceObserver.disconnect();
            }
        });

        // Throttle resize events
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Handle resize
            }, 250);
        });
    },

    // Network optimization
    optimizeNetwork: () => {
        // Enable keep-alive for fetch requests
        const originalFetch = window.fetch;
        window.fetch = (input, init = {}) => {
            return originalFetch(input, {
                ...init,
                keepalive: true,
                ...PERFORMANCE_CONFIG.network
            });
        };
    }
};

export default PERFORMANCE_CONFIG;
