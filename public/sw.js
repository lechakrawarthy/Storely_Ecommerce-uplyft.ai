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
if (cacheName !== CACHE_NAME) {
    return caches.delete(cacheName);
}
        })
      );
    })
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
    if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
        // Images - cache first
        event.respondWith(cacheFirst(request));
    } else if (url.pathname.startsWith('/api/')) {
        // API calls - network first
        event.respondWith(networkFirst(request));
    } else if (url.pathname.match(/\.(js|css)$/)) {
        // Static assets - cache first
        event.respondWith(cacheFirst(request));
    } else {
        // Pages - stale while revalidate
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Cache first strategy
async function cacheFirst(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        // Return offline fallback if available
        return new Response('Network error', { status: 503 });
    }
}

// Network first strategy
async function networkFirst(request) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        return cachedResponse || new Response('Network error', { status: 503 });
    }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    });

    return cachedResponse || fetchPromise;
}
