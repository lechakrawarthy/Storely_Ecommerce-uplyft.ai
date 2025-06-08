import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import LoadingSpinner from "./components/LoadingSpinner";
import { useWebVitals } from "./hooks/useWebVitals";
import { SkeletonLoader } from "./components/LayoutStabilizer";
import { NavigationSkeleton } from "./utils/layoutStability";

// Lazy load components for better performance
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Checkout = lazy(() => import("./pages/Checkout"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const SearchTestPage = lazy(() => import("./pages/SearchTestPage"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Comparison = lazy(() => import("./pages/Comparison"));
const RecentlyViewed = lazy(() => import("./pages/RecentlyViewed"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Cart = lazy(() => import("./components/Cart"));
const EnhancedChatbotFloat = lazy(() => import("./components/EnhancedChatbotFloat"));

const queryClient = new QueryClient();

const App = () => {
  // Initialize Web Vitals monitoring
  useWebVitals();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <RecentlyViewedProvider>
            <WishlistProvider>
              <ComparisonProvider>                <CartProvider>
                <SearchProvider>
                  <Toaster />
                  <Sonner />                    <BrowserRouter>
                    <div className="App">
                      {/* Navigation skeleton during loading */}
                      <Suspense fallback={<NavigationSkeleton />}>
                        <Routes>
                          <Route path="/" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Index />
                            </Suspense>
                          } />
                          <Route path="/product/:id" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <ProductDetail />
                            </Suspense>
                          } />
                          <Route path="/checkout" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Checkout />
                            </Suspense>
                          } />
                          <Route path="/login" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Login />
                            </Suspense>
                          } />
                          <Route path="/signup" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Signup />
                            </Suspense>
                          } />
                          <Route path="/wishlist" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Wishlist />
                            </Suspense>
                          } />
                          <Route path="/comparison" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <Comparison />
                            </Suspense>
                          } />
                          <Route path="/recently-viewed" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <RecentlyViewed />
                            </Suspense>
                          } />
                          <Route path="/search" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <SearchResults />
                            </Suspense>
                          } />
                          <Route path="/search-test" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <SearchTestPage />
                            </Suspense>
                          } />
                          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                          <Route path="*" element={
                            <Suspense fallback={<SkeletonLoader height="100vh" />}>
                              <NotFound />
                            </Suspense>
                          } />
                        </Routes>
                      </Suspense>
                      <Suspense fallback={null}>
                        <Cart />
                        <EnhancedChatbotFloat />
                      </Suspense>
                    </div>
                  </BrowserRouter>
                </SearchProvider>
              </CartProvider>
              </ComparisonProvider>
            </WishlistProvider>
          </RecentlyViewedProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
