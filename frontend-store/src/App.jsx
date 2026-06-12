import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { initMetaPixel, trackPageView } from './utils/metaPixel';
import logoImg from './assets/images/logo_black.svg';

import { useAuthStore, useCartStore } from './store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import { WishlistProvider } from './contexts/WishlistContext';

// Pages (lazy loaded)
import { lazy, Suspense } from 'react';
const Home          = lazy(() => import('./pages/Home'));
const Products      = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const Cart          = lazy(() => import('./pages/Cart'));
const Checkout      = lazy(() => import('./pages/Checkout'));
const Orders        = lazy(() => import('./pages/Orders'));
const OrderDetail   = lazy(() => import('./pages/OrderDetail'));
const OrderSuccess  = lazy(() => import('./pages/OrderSuccess'));
const Account       = lazy(() => import('./pages/Account'));
const Wishlist      = lazy(() => import('./pages/Wishlist'));
const Category      = lazy(() => import('./pages/Category'));
const TrackOrder    = lazy(() => import('./pages/TrackOrder'));
const Returns       = lazy(() => import('./pages/Returns'));
const FAQ           = lazy(() => import('./pages/FAQ'));
const Privacy       = lazy(() => import('./pages/Privacy'));

const Contact       = lazy(() => import('./pages/Contact'));
const OurStory      = lazy(() => import('./pages/OurStory'));
const CategoriesInfo = lazy(() => import('./pages/CategoriesInfo'));
const NotFound      = lazy(() => import('./pages/NotFound'));


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF4]">
      <div className="flex flex-col items-center gap-2">
        <img src={logoImg} alt="Loading..." className="h-12 w-auto object-contain mix-blend-multiply animate-pulse" />
      </div>
    </div>
  );
}

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    trackPageView();
  }, [location]);
  return null;
}

export default function App() {
  useEffect(() => {
    initMetaPixel();

    // Initial auth check on app mount. Since we use HttpOnly cookies, we always check.
    useAuthStore.getState().fetchMe().catch((err) => {
      console.error('Initial auth check failed:', err);
      // Fetch guest cart if auth fails
      useCartStore.getState().fetchCart().catch(() => {});
    });
  }, []); // Empty array: run only once on mount



  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <RouteTracker />
          <WishlistProvider>
            <ScrollToTop />
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: { fontFamily: 'DM Sans, sans-serif', borderRadius: '4px', border: '1px solid #E8E2D8', background: '#FFFFFF', color: '#1A1A1A' },
                success: { style: { background: '#FAFAF4', color: '#6B6560', border: '1px solid #E8E2D8' } },
                error:   { style: { background: '#FFF0F0', color: '#C84040', border: '1px solid #E8C8C8' } },
              }}
            />
            <AuthModal />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index                element={<Home />} />
                  <Route path="products"      element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetail />} />
                  <Route path="categories/:slug" element={<Category />} />
                  <Route path="cart"          element={<Cart />} />
                  <Route path="login"         element={<Navigate to="/" replace />} />
                  <Route path="register"      element={<Navigate to="/" replace />} />
                  <Route path="about"         element={<Navigate to="/our-story" replace />} />
                  <Route path="contact"       element={<Contact />} />
                  <Route path="our-story"     element={<OurStory />} />
                  <Route path="categories-info" element={<CategoriesInfo />} />

                  {/* Protected Routes */}
                  <Route path="checkout"  element={<Checkout />} />
                  <Route path="orders"    element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<OrderDetail />} />
                  <Route path="orders/:orderId/success" element={<OrderSuccess />} />
                  <Route path="account"   element={<ProtectedRoute><Account /></ProtectedRoute>} />
                  <Route path="my-account" element={<Navigate to="/account" replace />} />
                  <Route path="wishlist"  element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

                  {/* Other routes */}
                  <Route path="track-order"      element={<TrackOrder />} />
                  <Route path="returns"          element={<Returns />} />
                  <Route path="faq"              element={<FAQ />} />
                  <Route path="privacy"          element={<Privacy />} />

                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </Suspense>
          </WishlistProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}
