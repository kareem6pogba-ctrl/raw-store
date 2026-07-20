import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import { AuthProvider } from './lib/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { NotFound } from './pages/NotFound'

// Lower-traffic storefront pages: lazy-loaded so they don't bloat the initial bundle
const Checkout = lazy(() => import('./pages/Checkout').then((m) => ({ default: m.Checkout })))
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })))
const FAQ = lazy(() => import('./pages/Info').then((m) => ({ default: m.FAQ })))
const ShippingReturns = lazy(() => import('./pages/Info').then((m) => ({ default: m.ShippingReturns })))
const Contact = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Contact })))
const Privacy = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/Legal').then((m) => ({ default: m.Terms })))
const SizeGuide = lazy(() => import('./pages/Legal').then((m) => ({ default: m.SizeGuide })))

// Admin panel: entirely separate chunk, never shipped to storefront visitors
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })))
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers').then((m) => ({ default: m.AdminCustomers })))
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons').then((m) => ({ default: m.AdminCoupons })))

function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-linen min-h-screen font-body">
      <Header />
      {children}
      <Footer />
      <CartDrawer />
    </div>
  )
}

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center font-body text-warmgray text-sm">
      Loading…
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<StoreLayout><Home /></StoreLayout>} />
              <Route path="/shop" element={<StoreLayout><Shop /></StoreLayout>} />
              <Route path="/product/:id" element={<StoreLayout><ProductDetail /></StoreLayout>} />
              <Route path="/checkout" element={<StoreLayout><Checkout /></StoreLayout>} />
              <Route path="/about" element={<StoreLayout><About /></StoreLayout>} />
              <Route path="/faq" element={<StoreLayout><FAQ /></StoreLayout>} />
              <Route path="/shipping-returns" element={<StoreLayout><ShippingReturns /></StoreLayout>} />
              <Route path="/contact" element={<StoreLayout><Contact /></StoreLayout>} />
              <Route path="/privacy" element={<StoreLayout><Privacy /></StoreLayout>} />
              <Route path="/terms" element={<StoreLayout><Terms /></StoreLayout>} />
              <Route path="/size-guide" element={<StoreLayout><SizeGuide /></StoreLayout>} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="coupons" element={<AdminCoupons />} />
              </Route>

              <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
            </Routes>
          </Suspense>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
