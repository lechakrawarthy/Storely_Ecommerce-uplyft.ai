// Service Worker registration utility with enhanced caching
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
        try {
            const registration = await navigator.serviceWorker.register('/sw-enhanced.js');
            console.log('Enhanced Service Worker registered successfully:', registration);

            // Listen for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New content is available, notify user
                            showUpdateNotification();
                        }
                    });
                }
            });

            // Preload critical resources
            await preloadCriticalResources();

            return registration;
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};

// Preload critical resources for better performance
const preloadCriticalResources = async () => {
    try {
        const criticalResources = [
            // Critical CSS files
            '/src/index.css',
            // Critical JavaScript chunks
            '/src/main.tsx',
            // Critical fonts
            'https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700;800&display=swap',
            'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap'
        ];

        // Use fetch to preload resources into cache
        const preloadPromises = criticalResources.map(async (url) => {
            try {
                const response = await fetch(url, { mode: 'no-cors' });
                console.log(`Preloaded: ${url}`);
                return response;
            } catch (error) {
                console.warn(`Failed to preload: ${url}`, error);
                return null;
            }
        });

        await Promise.allSettled(preloadPromises);
    } catch (error) {
        console.warn('Failed to preload critical resources:', error);
    }
};

// Show update notification to user
const showUpdateNotification = () => {
    if (confirm('New version available! Click OK to update.')) {
        window.location.reload();
    }
};

// Unregister service worker (for development/debugging)
export const unregisterServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
            await registration.unregister();
        }
    }
};
