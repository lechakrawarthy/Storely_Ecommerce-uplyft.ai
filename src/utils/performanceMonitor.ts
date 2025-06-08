import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

interface WebVitalsMetric {
    name: string;
    value: number;
    rating: 'good' | 'needs-improvement' | 'poor';
    delta: number;
    id: string;
}

class PerformanceMonitor {
    private metrics: WebVitalsMetric[] = [];
    private observers: PerformanceObserver[] = [];

    constructor() {
        this.initWebVitals();
        this.initResourceTimingObserver();
        this.initLongTaskObserver();
    }

    private initWebVitals() {
        const handleMetric = (metric: WebVitalsMetric) => {
            this.metrics.push(metric);
            this.reportMetric(metric);
        };

        getCLS(handleMetric);
        getFID(handleMetric);
        getFCP(handleMetric);
        getLCP(handleMetric);
        getTTFB(handleMetric);
    }

    private initResourceTimingObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'resource') {
                        this.analyzeResourceTiming(entry as PerformanceResourceTiming);
                    }
                }
            });

            observer.observe({ entryTypes: ['resource'] });
            this.observers.push(observer);
        }
    }

    private initLongTaskObserver() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.reportLongTask(entry as PerformanceEntry);
                }
            });

            try {
                observer.observe({ entryTypes: ['longtask'] });
                this.observers.push(observer);
            } catch (e) {
                // Long task observer not supported
                console.log('Long task observer not supported');
            }
        }
    }

    private analyzeResourceTiming(entry: PerformanceResourceTiming) {
        const duration = entry.responseEnd - entry.startTime;

        // Flag slow resources (>1s)
        if (duration > 1000) {
            console.warn(`Slow resource detected: ${entry.name} took ${duration.toFixed(2)}ms`);

            // Report to analytics in production
            if (process.env.NODE_ENV === 'production') {
                this.reportSlowResource(entry.name, duration);
            }
        }

        // Flag large resources (>500KB)
        if (entry.transferSize && entry.transferSize > 500 * 1024) {
            console.warn(`Large resource detected: ${entry.name} is ${(entry.transferSize / 1024).toFixed(2)}KB`);
        }
    }

    private reportLongTask(entry: PerformanceEntry) {
        const duration = entry.duration;
        console.warn(`Long task detected: ${duration.toFixed(2)}ms`);

        if (process.env.NODE_ENV === 'production') {
            this.reportToAnalytics('long_task', {
                duration,
                startTime: entry.startTime
            });
        }
    }

    private reportMetric(metric: WebVitalsMetric) {
        console.log(`Web Vital: ${metric.name}`, {
            value: metric.value,
            rating: metric.rating,
            delta: metric.delta
        });

        // Report to analytics in production
        if (process.env.NODE_ENV === 'production') {
            this.reportToAnalytics(`web_vital_${metric.name.toLowerCase()}`, {
                value: metric.value,
                rating: metric.rating,
                delta: metric.delta
            });
        }
    }

    private reportSlowResource(url: string, duration: number) {
        this.reportToAnalytics('slow_resource', {
            url,
            duration,
            timestamp: Date.now()
        });
    }

    private reportToAnalytics(eventName: string, data: Record<string, unknown>) {
        // In a real app, send to your analytics service
        // Example: Google Analytics, DataDog, New Relic, etc.
        if (typeof window !== 'undefined' && 'gtag' in window) {
            (window as any).gtag('event', eventName, data);
        }
    }

    public getMetrics(): WebVitalsMetric[] {
        return [...this.metrics];
    }

    public getPerformanceReport() {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        const paint = performance.getEntriesByType('paint');

        return {
            metrics: this.metrics,
            navigation: {
                domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                load: navigation.loadEventEnd - navigation.loadEventStart,
                firstByte: navigation.responseStart - navigation.requestStart,
                domInteractive: navigation.domInteractive - navigation.navigationStart,
                domComplete: navigation.domComplete - navigation.navigationStart
            },
            paint: {
                firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0
            },
            memory: (performance as any).memory ? {
                usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
                totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
                jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit
            } : null
        };
    }

    public dispose() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
    }
}

// Export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for components to access performance data
export const usePerformanceMetrics = () => {
    return {
        getMetrics: () => performanceMonitor.getMetrics(),
        getReport: () => performanceMonitor.getPerformanceReport()
    };
};

export default PerformanceMonitor;
