import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [q, setQ] = useState('')
  const { cartCount, setCartOpen } = useCart()
  const navigate = useNavigate()

  const submitSearch = () => {
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
  }

  return (
    <>
      <div className="bg-espresso text-linen text-center font-body text-[11.5px] tracking-wider uppercase py-2.5">
        Free shipping on all orders over EGP 1,500
      </div>
      <header className="sticky top-0 z-40 bg-linen/95 backdrop-blur border-b border-espresso/10">
        <div className="max-w-[1320px] mx-auto px-8 h-[78px] flex items-center justify-between">
          <Link to="/" className="font-display font-semibold text-[26px] text-espresso">
            RAW
          </Link>

          <nav className="hidden md:flex gap-10">
            {[
              { to: '/', label: 'Home' },
              { to: '/shop', label: 'Shop' },
              { to: '/about', label: 'About' },
            ].map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="font-body text-[13px] tracking-wide uppercase text-espresso pb-1 border-b border-transparent hover:border-espresso font-medium"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="text-espresso">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button aria-label="Account" className="text-espresso">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </button>
            <button onClick={() => setCartOpen(true)} aria-label="Cart" className="relative text-espresso">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 8h12l-1 12H7L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-espresso text-linen text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="border-t border-espresso/10 px-8 py-4">
            <div className="max-w-[1320px] mx-auto flex items-center gap-3">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C5147" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                placeholder="Search for pieces, fabrics, colors…"
                className="flex-1 bg-transparent outline-none font-body text-[15px] text-espresso"
              />
            </div>
          </div>
        )}
      </header>
    </>
  )
}
