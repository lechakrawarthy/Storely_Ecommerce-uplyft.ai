/**
 * Critical CSS utilities for performance optimization
 * Extracts and inlines critical CSS for above-the-fold content
 */

export interface CriticalCSSConfig {
    width: number;
    height: number;
    selectors?: string[];
    whitelist?: string[];
    blacklist?: string[];
}

// Default configuration for critical CSS extraction
export const defaultConfig: CriticalCSSConfig = {
    width: 1200,
    height: 900,
    selectors: [
        // Navigation and header
        'nav', 'header', '.navigation',

        // Hero section
        '.hero', '.hero-section', '.hero-card',

        // Above-the-fold content
        '.above-fold', '.landing-section',

        // Critical layout elements
        '.container', '.grid', '.flex',

        // Typography for readability
        'h1', 'h2', 'h3', 'p',

        // Critical interactive elements
        'button', '.btn', '.button',
        'input', '.input', '.form-control',

        // Loading states
        '.loading', '.skeleton', '.spinner',
    ],
    whitelist: [
        // Tailwind utilities that are always needed
        'block', 'inline-block', 'flex', 'grid', 'hidden',
        'relative', 'absolute', 'fixed', 'sticky',
        'w-full', 'h-full', 'min-h-screen',
        'text-center', 'text-left', 'text-right',
        'font-bold', 'font-medium', 'font-semibold',

        // Critical responsive classes
        'sm:', 'md:', 'lg:', 'xl:',

        // Critical color classes
        'text-white', 'text-black', 'text-gray-900',
        'bg-white', 'bg-black', 'bg-gray-50',
    ],
    blacklist: [
        // Animation classes (not critical for initial render)
        'animate-', 'transition-', 'duration-', 'ease-',

        // Complex effects (can be loaded later)
        'backdrop-', 'filter-', 'shadow-xl', 'shadow-2xl',

        // Print styles
        'print:',
    ]
};

/**
 * Critical CSS styles that should always be inlined
 * These are essential for preventing layout shift and ensuring proper initial render
 */
export const criticalInlineCSS = `
/* Critical layout styles */
*,
*::before,
*::after {
  box-sizing: border-box;
}

html {
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  color: #1f2937;
  background-color: #ffffff;
}

/* Critical layout utilities */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container {
    max-width: 640px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 768px;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1280px) {
  .container {
    max-width: 1280px;
  }
}

/* Critical typography */
h1, h2, h3, h4, h5, h6 {
  margin: 0;
  font-weight: 600;
  line-height: 1.25;
}

h1 {
  font-size: 2.25rem;
}

h2 {
  font-size: 1.875rem;
}

h3 {
  font-size: 1.5rem;
}

/* Critical button styles */
button {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
}

/* Critical form styles */
input {
  font-family: inherit;
  font-size: 100%;
  line-height: 1.15;
  margin: 0;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

/* Critical visibility utilities */
.hidden {
  display: none;
}

.block {
  display: block;
}

.flex {
  display: flex;
}

.grid {
  display: grid;
}

/* Critical positioning */
.relative {
  position: relative;
}

.absolute {
  position: absolute;
}

.fixed {
  position: fixed;
}

/* Critical flexbox utilities */
.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

/* Critical spacing */
.p-4 {
  padding: 1rem;
}

.m-0 {
  margin: 0;
}

.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

/* Critical width/height */
.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

.min-h-screen {
  min-height: 100vh;
}

/* Critical text utilities */
.text-center {
  text-align: center;
}

.font-bold {
  font-weight: 700;
}

.font-semibold {
  font-weight: 600;
}

/* Critical colors */
.text-white {
  color: #ffffff;
}

.text-gray-900 {
  color: #111827;
}

.bg-white {
  background-color: #ffffff;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

/* Loading skeleton styles */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Critical responsive utilities */
@media (min-width: 640px) {
  .sm\\:hidden {
    display: none;
  }
  
  .sm\\:block {
    display: block;
  }
}

@media (min-width: 768px) {
  .md\\:hidden {
    display: none;
  }
  
  .md\\:block {
    display: block;
  }
}

@media (min-width: 1024px) {
  .lg\\:hidden {
    display: none;
  }
  
  .lg\\:block {
    display: block;
  }
}
`;

/**
 * Extract critical CSS selectors based on configuration
 */
export function extractCriticalSelectors(config: CriticalCSSConfig = defaultConfig): string[] {
    const { selectors = [], whitelist = [] } = config;

    // Combine base selectors with whitelist
    const criticalSelectors = [...selectors, ...whitelist];

    // Add responsive variants
    const responsiveSelectors = criticalSelectors.flatMap(selector => [
        selector,
        `sm:${selector}`,
        `md:${selector}`,
        `lg:${selector}`,
        `xl:${selector}`
    ]);

    return responsiveSelectors;
}

/**
 * Generate critical CSS style tag for inline injection
 */
export function generateCriticalStyleTag(): string {
    return `<style id="critical-css">${criticalInlineCSS}</style>`;
}

/**
 * Preload non-critical CSS
 */
export function generateCSSPreloadLinks(cssFiles: string[]): string {
    return cssFiles
        .map(file => `<link rel="preload" href="${file}" as="style" onload="this.onload=null;this.rel='stylesheet'">`)
        .join('\n');
}

/**
 * Create CSS loading strategy for performance
 */
export function createCSSLoadingStrategy(criticalCSS: string, nonCriticalFiles: string[]): string {
    return `
    ${generateCriticalStyleTag()}
    ${generateCSSPreloadLinks(nonCriticalFiles)}
    <noscript>
      ${nonCriticalFiles.map(file => `<link rel="stylesheet" href="${file}">`).join('\n')}
    </noscript>
  `;
}

/**
 * Font loading optimization
 */
export const fontPreloadLinks = `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
`;

/**
 * Resource hints for performance
 */
export const performanceHints = `
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="dns-prefetch" href="//fonts.gstatic.com">
<link rel="preconnect" href="${import.meta.env.VITE_API_URL || 'http://localhost:5000'}" crossorigin>
`;

export default {
    criticalInlineCSS,
    defaultConfig,
    extractCriticalSelectors,
    generateCriticalStyleTag,
    generateCSSPreloadLinks,
    createCSSLoadingStrategy,
    fontPreloadLinks,
    performanceHints
};
