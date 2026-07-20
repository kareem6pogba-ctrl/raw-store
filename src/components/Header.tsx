import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
          <button
            onClick={() => setMenuOpen((m) => !m)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="md:hidden text-espresso focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>

          <Link to="/" className="font-display font-semibold text-[26px] text-espresso focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4">
            RAW
          </Link>

          <nav className="hidden md:flex gap-10">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="font-body text-[13px] tracking-wide uppercase text-espresso pb-1 border-b border-transparent hover:border-espresso font-medium focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Search"
              aria-expanded={searchOpen}
              className="text-espresso focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              aria-label="Account"
              className="hidden sm:block text-espresso focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
              </svg>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
              className="relative text-espresso focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4"
            >
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
                aria-label="Search products"
                className="flex-1 bg-transparent outline-none font-body text-[15px] text-espresso"
              />
            </div>
          </div>
        )}

        {menuOpen && (
          <nav className="md:hidden border-t border-espresso/10 px-8 py-6 flex flex-col gap-1 bg-linen">
            {NAV_ITEMS.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setMenuOpen(false)}
                className="font-body text-[15px] uppercase tracking-wide text-espresso py-3 border-b border-espresso/10 focus-visible:outline-2 focus-visible:outline-espresso"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
