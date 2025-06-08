import React, { Suspense, lazy } from 'react';
import Navigation from '../components/Navigation';
import HeroCard from '../components/HeroCard';
import { useIsMobile } from '../hooks/use-mobile';
import { SkeletonLoader } from '../components/LayoutStabilizer';
import { initPerformanceOptimizations } from '../utils/performance';

// Lazy load below-the-fold components
const ProductGrid = lazy(() => import('../components/BooksSection'));
const CategorySection = lazy(() => import('../components/CategorySection'));
const MobileRecentlyViewed = lazy(() => import('../components/MobileRecentlyViewed'));
const FAQ = lazy(() => import('../components/FAQ'));
const Footer = lazy(() => import('../components/Footer'));

const Index = () => {
  const isMobile = useIsMobile();

  // Initialize performance optimizations
  React.useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative flex flex-col overflow-x-hidden">
      {/* Background decoration for glass effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50/30 via-indigo-50/20 to-purple-50/30 pointer-events-none"></div>
      <div className="fixed top-20 left-10 w-32 h-32 bg-pastel-200/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-2xl pointer-events-none"></div>
      <div className="fixed bottom-32 left-1/4 w-40 h-40 bg-indigo-200/10 rounded-full blur-3xl pointer-events-none"></div>

      <Navigation />
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 flex flex-col gap-10 pt-28 pb-24">
        {/* Above the fold - load immediately */}
        <HeroCard />

        {/* Below the fold - lazy load */}
        <Suspense fallback={<SkeletonLoader height="400px" />}>
          <CategorySection />
        </Suspense>

        {/* Mobile Recently Viewed - Show only on mobile */}
        {isMobile && (
          <Suspense fallback={<SkeletonLoader height="200px" className="lg:hidden" />}>
            <MobileRecentlyViewed className="lg:hidden" />
          </Suspense>
        )}

        <Suspense fallback={<SkeletonLoader height="600px" />}>
          <ProductGrid />
        </Suspense>

        <Suspense fallback={<SkeletonLoader height="300px" />}>
          <FAQ />
        </Suspense>
      </main>

      <Suspense fallback={<SkeletonLoader height="200px" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
