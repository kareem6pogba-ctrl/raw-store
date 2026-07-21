import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from './supabase'
import type { CartItem, ColorOption, Product } from '../types'

interface CartContextValue {
  cart: CartItem[]
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  addToCart: (product: Product, color: ColorOption, size: string, qty?: number) => void
  updateQty: (index: number, qty: number) => void
  removeItem: (index: number) => void
  clearCart: () => void
  cartCount: number
  subtotal: number
  freeShippingThreshold: number
}

const CartContext = createContext<CartContextValue | null>(null)

const DEFAULT_THRESHOLD = 1500

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(DEFAULT_THRESHOLD)

  useEffect(() => {
    supabase
      .from('store_settings')
      .select('free_shipping_threshold')
      .eq('id', 1)
      .single()
      .then(({ data }) => {
        if (data?.free_shipping_threshold != null) {
          setFreeShippingThreshold(Number(data.free_shipping_threshold))
        }
      })
  }, [])

  const addToCart = (product: Product, color: ColorOption, size: string, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex(
        (i) => i.product.id === product.id && i.color.name === color.name && i.size === size
      )
      if (idx >= 0) {
        const next = [...prev]
        next[idx] = { ...next[idx], qty: next[idx].qty + qty }
        return next
      }
      return [...prev, { product, color, size, qty }]
    })
    setCartOpen(true)
  }

  const updateQty = (index: number, qty: number) => {
    if (qty < 1) return
    setCart((prev) => prev.map((it, i) => (i === index ? { ...it, qty } : it)))
  }

  const removeItem = (index: number) => setCart((prev) => prev.filter((_, i) => i !== index))
  const clearCart = () => setCart([])

  const cartCount = cart.reduce((s, i) => s + i.qty, 0)
  const subtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        cartCount,
        subtotal,
        freeShippingThreshold,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
