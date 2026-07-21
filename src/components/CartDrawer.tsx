import { useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'
import { Button } from './Button'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function CartDrawer() {
  const { cart, cartOpen, setCartOpen, updateQty, removeItem, subtotal } = useCart()
  const navigate = useNavigate()

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 bg-espresso/35 z-[60] transition-opacity duration-300 ${
          cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />
      <div
        className={`fixed top-0 right-0 h-full w-[min(440px,92vw)] bg-[#FCFAF5] z-[61] flex flex-col shadow-2xl transition-transform duration-500 ${
          cartOpen ? 'translate-x-0 ease-[cubic-bezier(0.34,1.56,0.64,1)]' : 'translate-x-full ease-in'
        }`}
      >
        <div className="px-7 py-6 border-b border-espresso/10 flex justify-between items-center">
          <span className="font-display text-[22px] text-espresso">Your Bag ({cart.length})</span>
          <button onClick={() => setCartOpen(false)} className="text-2xl text-espresso">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-7">
          {cart.length === 0 ? (
            <div className="py-16 text-center font-body text-warmgray text-sm">
              Your bag is empty — go find something raw.
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={idx} className="flex gap-3.5 py-5 border-b border-espresso/10">
                <div className="w-[74px] h-[92px] overflow-hidden bg-beige shrink-0">
                  <img src={item.product.image_main ?? ''} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <span className="font-body text-sm text-espresso font-medium">{item.product.name}</span>
                    <button onClick={() => removeItem(idx)} className="text-xs text-warmgray">
                      Remove
                    </button>
                  </div>
                  <div className="font-body text-[12.5px] text-warmgray mt-1">
                    {item.color.name} · {item.size}
                  </div>
                  <div className="flex justify-between items-center mt-2.5">
                    <div className="flex items-center border border-espresso/10">
                      <button onClick={() => updateQty(idx, item.qty - 1)} className="w-7 h-7 text-espresso">
                        −
                      </button>
                      <span className="w-6 text-center text-xs font-body">{item.qty}</span>
                      <button onClick={() => updateQty(idx, item.qty + 1)} className="w-7 h-7 text-espresso">
                        +
                      </button>
                    </div>
                    <span className="font-body text-[13.5px] text-espresso">
                      {fmt(item.product.price * item.qty)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="px-7 pt-6 pb-7 border-t border-espresso/10">
            <div className="flex justify-between mb-2 font-body text-sm text-warmgray">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="font-body text-xs text-sage mb-4">
              {subtotal >= 1500
                ? "You've unlocked free shipping."
                : `Add ${fmt(1500 - subtotal)} more for free shipping.`}
            </div>
            <Button
              fullWidth
              onClick={() => {
                setCartOpen(false)
                navigate('/checkout')
              }}
            >
              Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
