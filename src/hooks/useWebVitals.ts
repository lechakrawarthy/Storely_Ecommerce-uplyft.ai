import { useEffect } from 'react';

interface WebVitalMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
}

// Web Vitals thresholds (in milliseconds)
const THRESHOLDS = {
    FCP: { good: 1800, poor: 3000 },
    LCP: { good: 2500, poor: 4000 },
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    TTFB: { good: 800, poor: 1800 },
};

const getRating = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    const threshold = THRESHOLDS[metric as keyof typeof THRESHOLDS];
    if (!threshold) return 'good';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
};

export const useWebVitals = (onMetric?: (metric: WebVitalMetric) => void) => {
    useEffect(() => {
        // Only run in production or when explicitly enabled
        if (process.env.NODE_ENV !== 'production' && !localStorage.getItem('enable-web-vitals')) {
            return;
        }

        const handleMetric = (metric: any) => {
            const webVitalMetric: WebVitalMetric = {
                name: metric.name,
                value: metric.value,
                rating: getRating(metric.name, metric.value),
                delta: metric.delta,
                id: metric.id,
            };

            // Log to console in development
            if (process.env.NODE_ENV === 'development') {
                console.log(`Web Vital: ${metric.name}`, {
                    value: `${metric.value}ms`,
                    rating: webVitalMetric.rating,
                    id: metric.id,
                });
            }

            // Send to analytics service (implement your preferred service)
            if (onMetric) {
                onMetric(webVitalMetric);
            }

            // Send to Google Analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', metric.name, {
                    event_category: 'Web Vitals',
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_label: metric.id,
                    non_interaction: true,
                });
            }
        };

        // Dynamically import web-vitals to avoid blocking
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(handleMetric);
            getFID(handleMetric);
            getFCP(handleMetric);
            getLCP(handleMetric);
            getTTFB(handleMetric);
        });
    }, [onMetric]);
};

// Performance monitoring hook for custom metrics
export const usePerformanceMonitor = () => {
    useEffect(() => {
        if (!window.performance || !window.performance.mark) return;

        // Mark when the app starts
        window.performance.mark('app-start');

        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            const longTaskObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.duration > 50) {
                        console.warn(`Long task detected: ${entry.duration}ms`, entry);
                    }
                }
            });

            try {
                longTaskObserver.observe({ entryTypes: ['longtask'] });
            } catch (e) {
                // Longtask API not supported
            }

            // Monitor layout shifts
            const layoutShiftObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput && entry.value > 0.1) {
                        console.warn(`Layout shift detected: ${entry.value}`, entry);
                    }
                }
            });

            try {
                layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                // Layout shift API not supported
            }

            return () => {
                longTaskObserver.disconnect();
                layoutShiftObserver.disconnect();
            };
        }
    }, []);
};

// Resource timing analysis
export const analyzeResourceTiming = () => {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource') as PerformanceResourceTiming[];

    const analysis = {
        totalResources: resources.length,
        totalTransferSize: 0,
        totalEncodedSize: 0,
        largestResources: [] as any[],
        slowestResources: [] as any[],
        resourcesByType: {} as Record<string, number>,
    };

    resources.forEach((resource) => {
        analysis.totalTransferSize += resource.transferSize || 0;
        analysis.totalEncodedSize += resource.encodedBodySize || 0;

        // Count by type
        const type = resource.initiatorType || 'other';
        analysis.resourcesByType[type] = (analysis.resourcesByType[type] || 0) + 1;

        // Track largest resources
        if (resource.transferSize && resource.transferSize > 100000) { // > 100KB
            analysis.largestResources.push({
                name: resource.name,
                size: resource.transferSize,
                type: resource.initiatorType,
            });
        }

        // Track slowest resources
        const duration = resource.responseEnd - resource.requestStart;
        if (duration > 1000) { // > 1s
            analysis.slowestResources.push({
                name: resource.name,
                duration,
                type: resource.initiatorType,
            });
        }
    });

    // Sort by size/duration
    analysis.largestResources.sort((a, b) => b.size - a.size);
    analysis.slowestResources.sort((a, b) => b.duration - a.duration);

    console.log('Resource Analysis:', analysis);
    return analysis;
};

// Performance budget checker
export const checkPerformanceBudget = () => {
    const budget = {
        totalTransferSize: 2000000, // 2MB
        totalResources: 100,
        largestResource: 500000, // 500KB
        slowestResource: 2000, // 2s
    };

    const analysis = analyzeResourceTiming();
    if (!analysis) return;

    const violations = [];

    if (analysis.totalTransferSize > budget.totalTransferSize) {
        violations.push(`Total transfer size (${(analysis.totalTransferSize / 1024 / 1024).toFixed(2)}MB) exceeds budget (${(budget.totalTransferSize / 1024 / 1024).toFixed(2)}MB)`);
    }

    if (analysis.totalResources > budget.totalResources) {
        violations.push(`Total resources (${analysis.totalResources}) exceeds budget (${budget.totalResources})`);
    }

    if (analysis.largestResources.length > 0 && analysis.largestResources[0].size > budget.largestResource) {
        violations.push(`Largest resource (${(analysis.largestResources[0].size / 1024).toFixed(2)}KB) exceeds budget (${(budget.largestResource / 1024).toFixed(2)}KB)`);
    }

    if (analysis.slowestResources.length > 0 && analysis.slowestResources[0].duration > budget.slowestResource) {
        violations.push(`Slowest resource (${(analysis.slowestResources[0].duration / 1000).toFixed(2)}s) exceeds budget (${(budget.slowestResource / 1000).toFixed(2)}s)`);
    }

    if (violations.length > 0) {
        console.warn('Performance Budget Violations:', violations);
    } else {
        console.log('✅ Performance budget OK!');
    }

    return { violations, analysis };
};
