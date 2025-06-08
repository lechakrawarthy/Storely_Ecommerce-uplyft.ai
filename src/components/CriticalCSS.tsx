import { useEffect } from 'react';

const CriticalCSS = () => {
    useEffect(() => {
        // Load non-critical CSS after initial render
        const loadNonCriticalCSS = () => {
            // Load fonts asynchronously
            const fontLink = document.createElement('link');
            fontLink.rel = 'preload';
            fontLink.as = 'font';
            fontLink.type = 'font/woff2';
            fontLink.crossOrigin = 'anonymous';

            // Load additional stylesheets for non-critical features
            const additionalStyles = [
                // Add any additional CSS files that are not critical for initial render
            ];

            additionalStyles.forEach((href) => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = href;
                link.media = 'print';
                link.onload = () => {
                    link.media = 'all';
                };
                document.head.appendChild(link);
            });
        };

        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            requestIdleCallback(loadNonCriticalCSS);
        } else {
            setTimeout(loadNonCriticalCSS, 1);
        }
    }, []);

    return null;
};

export default CriticalCSS;
