import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './lib/CartContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CartDrawer } from './components/CartDrawer'
import { Home } from './pages/Home'
import { Shop } from './pages/Shop'
import { ProductDetail } from './pages/ProductDetail'
import { Checkout } from './pages/Checkout'
import { About } from './pages/About'
import { FAQ, ShippingReturns } from './pages/Info'
import { NotFound } from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="bg-linen min-h-screen font-body">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <CartDrawer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
