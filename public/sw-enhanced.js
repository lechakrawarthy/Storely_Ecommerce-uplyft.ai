// Enhanced Service Worker with aggressive caching and compression
const CACHE_NAME = 'storely-v1.2.0';
const STATIC_CACHE_NAME = 'storely-static-v1.2.0';
const DYNAMIC_CACHE_NAME = 'storely-dynamic-v1.2.0';
const IMAGE_CACHE_NAME = 'storely-images-v1.2.0';

// Resources to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/favicon.ico',
    '/placeholder.svg',
    '/manifest.json'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
    /\/api\/products/,
    /\/api\/categories/,
    /\/api\/search/
];

// Image patterns to cache
const IMAGE_PATTERNS = [
    /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i,
    /\/images\//,
    /\/static\//
];

// Font patterns to cache
const FONT_PATTERNS = [
    /fonts\.googleapis\.com/,
    /fonts\.gstatic\.com/,
    /\.(woff|woff2|ttf|eot)$/i
];

// Cache duration settings (in seconds)
const CACHE_DURATIONS = {
    static: 86400 * 30, // 30 days
    dynamic: 86400 * 7, // 7 days
    images: 86400 * 14, // 14 days
    api: 300, // 5 minutes
    fonts: 86400 * 365 // 1 year
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE_NAME).then((cache) => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            }),
            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return !cacheName.includes('v1.2.0');
                        })
                        .map((cacheName) => {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ])
    );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(url)) {
        event.respondWith(handleStaticAsset(request));
    } else if (isAPIRequest(url)) {
        event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(url)) {
        event.respondWith(handleImageRequest(request));
    } else if (isFontRequest(url)) {
        event.respondWith(handleFontRequest(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Check if request is for static asset
function isStaticAsset(url) {
    return STATIC_ASSETS.some(asset => url.pathname === asset) ||
        url.pathname.includes('.js') ||
        url.pathname.includes('.css') ||
        url.pathname.includes('.tsx') ||
        url.pathname.includes('.ts');
}

// Check if request is for API
function isAPIRequest(url) {
    return API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname)) ||
        url.pathname.startsWith('/api/');
}

// Check if request is for image
function isImageRequest(url) {
    return IMAGE_PATTERNS.some(pattern => pattern.test(url.pathname));
}

// Check if request is for font
function isFontRequest(url) {
    return FONT_PATTERNS.some(pattern => pattern.test(url.href));
}

// Handle static assets - Cache First strategy
async function handleStaticAsset(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.static)) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Static asset fetch failed:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Handle API requests - Network First with cache fallback
async function handleAPIRequest(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, falling back to cache:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.api)) {
            return cachedResponse;
        }
        throw error;
    }
}

// Handle images - Cache First with compression
async function handleImageRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse && !isExpired(cachedResponse, CACHE_DURATIONS.images)) {
            return cachedResponse;
        }

        let networkResponse = await fetch(request);

        // Try to get WebP version if original request was for JPEG/PNG
        if (!networkResponse.ok && isConvertibleImage(request.url)) {
            const webpUrl = convertToWebP(request.url);
            try {
                networkResponse = await fetch(webpUrl);
            } catch (webpError) {
                console.log('WebP fallback failed, using original:', webpError);
            }
        }

        if (networkResponse.ok) {
            const cache = await caches.open(IMAGE_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Image fetch failed:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Return placeholder image
        return createPlaceholderResponse();
    }
}

// Handle fonts - Cache First with long expiration
async function handleFontRequest(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Font fetch failed:', error);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

// Handle dynamic requests - Stale While Revalidate
async function handleDynamicRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    // Return cached response immediately if available
    if (cachedResponse) {
        // Update cache in background
        fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
        }).catch(() => {
            // Ignore network errors for background updates
        });

        return cachedResponse;
    }

    // No cache, fetch from network
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.error('Dynamic request failed:', error);
        throw error;
    }
}

// Check if cached response is expired
function isExpired(response, maxAge) {
    const dateHeader = response.headers.get('date');
    if (!dateHeader) return false;

    const responseDate = new Date(dateHeader).getTime();
    const now = Date.now();
    return (now - responseDate) > (maxAge * 1000);
}

// Check if image can be converted to WebP
function isConvertibleImage(url) {
    return /\.(jpg|jpeg|png)$/i.test(url);
}

// Convert image URL to WebP format
function convertToWebP(url) {
    return url.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}

// Create placeholder response for failed image loads
function createPlaceholderResponse() {
    const svg = `
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
        Image not available
      </text>
    </svg>
  `;

    return new Response(svg, {
        headers: {
            'Content-Type': 'image/svg+xml',
            'Cache-Control': 'public, max-age=86400'
        }
    });
}

// Message handling for cache management
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;

    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;

        case 'CLEAR_CACHE':
            clearSpecificCache(payload.cacheName);
            break;

        case 'PRELOAD_RESOURCES':
            preloadResources(payload.urls);
            break;

        case 'GET_CACHE_INFO':
            getCacheInfo().then(info => {
                event.ports[0].postMessage({ type: 'CACHE_INFO', payload: info });
            });
            break;
    }
});

// Clear specific cache
async function clearSpecificCache(cacheName) {
    try {
        await caches.delete(cacheName);
        console.log(`Cache ${cacheName} cleared`);
    } catch (error) {
        console.error(`Failed to clear cache ${cacheName}:`, error);
    }
}

// Preload resources
async function preloadResources(urls) {
    try {
        const cache = await caches.open(STATIC_CACHE_NAME);
        await cache.addAll(urls);
        console.log('Resources preloaded:', urls);
    } catch (error) {
        console.error('Failed to preload resources:', error);
    }
}

// Get cache information
async function getCacheInfo() {
    const cacheNames = await caches.keys();
    const info = {};

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        info[cacheName] = {
            count: keys.length,
            urls: keys.slice(0, 10).map(request => request.url) // First 10 URLs
        };
    }

    return info;
}

console.log('Enhanced Service Worker loaded with compression and caching optimizations');
