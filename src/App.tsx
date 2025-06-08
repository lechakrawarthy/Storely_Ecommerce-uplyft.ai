import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { CartProvider } from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { SearchProvider } from "./contexts/SearchContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext";
import { ComparisonProvider } from "./contexts/ComparisonContext";
import LoadingSpinner from "./components/LoadingSpinner";

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
const ChatbotFloat = lazy(() => import("./components/ChatbotFloat"));

const queryClient = new QueryClient();

const App = () => (<QueryClientProvider client={queryClient}>
  <TooltipProvider>      <AuthProvider>
    <RecentlyViewedProvider>
      <WishlistProvider>
        <ComparisonProvider>
          <CartProvider>
            <SearchProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="App">
                  <Suspense
                    fallback={
                      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                        <LoadingSpinner />
                      </div>
                    }
                  >                  <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/product/:id" element={<ProductDetail />} />                    <Route path="/checkout" element={<Checkout />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />                    <Route path="/wishlist" element={<Wishlist />} />
                      <Route path="/comparison" element={<Comparison />} />
                      <Route path="/recently-viewed" element={<RecentlyViewed />} />
                      <Route path="/search" element={<SearchResults />} />
                      <Route path="/search-test" element={<SearchTestPage />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Suspense fallback={null}>
                    <Cart />
                    <ChatbotFloat />
                  </Suspense>
                </div>            </BrowserRouter>              </SearchProvider>
          </CartProvider>
        </ComparisonProvider>
      </WishlistProvider>
    </RecentlyViewedProvider>
  </AuthProvider>
  </TooltipProvider>
</QueryClientProvider>
);

export default App;
