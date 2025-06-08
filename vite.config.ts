import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
    // Bundle analyzer - generate analysis file
    visualizer({
      filename: 'dist/bundle-analysis.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable code splitting and compression
    rollupOptions: {
      output: {
        // Let Vite handle automatic chunking for optimal performance
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
      // Improved tree-shaking configuration
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
      external: (id) => {
        // Mark unused dependencies as external to exclude them
        const unusedDeps = [
          'moment',
          '@emotion/react',
          '@emotion/styled',
          'styled-components'
        ];
        return unusedDeps.some(dep => id.includes(dep));
      }
    },
    // Enable compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
        // Remove unused code more aggressively
        dead_code: true,
        unused: true,
        // Remove unused imports
        pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.warn'] : [],
      },
      mangle: {
        // Better variable name mangling
        toplevel: true,
        safari10: true,
      },
    },
    // Source maps for production debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Set reasonable chunk size limits
    chunkSizeWarningLimit: 1000,
  },
  // Enable compression middleware
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000',
    },
  },
}));
