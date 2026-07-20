import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import { AuthProvider } from './lib/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Checkout } from './pages/Checkout'
import { About } from './pages/About'
import { FAQ, ShippingReturns } from './pages/Info'
import { Contact, Privacy, Terms, SizeGuide } from './pages/Legal'
import { NotFound } from './pages/NotFound'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminOrders } from './pages/admin/AdminOrders'

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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
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
            </Route>

            <Route path="*" element={<StoreLayout><NotFound /></StoreLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
