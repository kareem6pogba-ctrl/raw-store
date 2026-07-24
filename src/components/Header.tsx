import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'
import { supabase } from '../lib/supabase'

const NAV_ITEMS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

interface Suggestion {
  id: string
  name: string
  price: number
  image_main: string | null
}

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [q, setQ] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const { cartCount, setCartOpen, freeShippingThreshold } = useCart()
  const navigate = useNavigate()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) {
      setSuggestions([])
      return
    }
    debounceRef.current = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, image_main')
        .eq('is_published', true)
        .ilike('name', `%${q.trim()}%`)
        .limit(5)
      setSuggestions((data ?? []) as Suggestion[])
      setActiveIndex(-1)
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [q])

  const submitSearch = () => {
    navigate(`/shop?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSuggestions([])
  }

  const goToSuggestion = (s: Suggestion) => {
    navigate(`/product/${s.id}`)
    setSearchOpen(false)
    setSuggestions([])
    setQ('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && suggestions[activeIndex]) {
        goToSuggestion(suggestions[activeIndex])
      } else {
        submitSearch()
      }
    } else if (e.key === 'Escape') {
      setSearchOpen(false)
    }
  }

  return (
    <>
      <div className="bg-espresso text-linen text-center font-body text-[11px] tracking-[0.16em] uppercase py-2 font-medium">
        Free shipping on all orders over EGP {freeShippingThreshold.toLocaleString()}
      </div>

      <header className="sticky top-4 z-40 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto glass rounded-[34px] shadow-[0_8px_32px_-12px_rgba(58,36,24,0.18)]">
          <div className="flex items-center justify-between gap-3 px-4 md:px-6 h-[68px]">
            {/* Wordmark — sits on the glass bar, always readable regardless of page content */}
            <Link
              to="/"
              aria-label="RAWW home"
              className="shrink-0 px-1 focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4"
            >
              <span className="font-logo text-[22px] md:text-[26px] text-espresso tracking-wide">RAWW</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="font-body text-[13px] tracking-wide uppercase text-espresso font-semibold px-5 py-2.5 rounded-full hover:bg-espresso/6 transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setSearchOpen((s) => !s)}
                aria-label="Search"
                aria-expanded={searchOpen}
                className="icon-circle w-11 h-11 text-espresso hover:bg-espresso/6 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
                className="relative icon-circle w-11 h-11 text-espresso hover:bg-espresso/6 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 8h12l-1 12H7L6 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-espresso text-linen text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => {
                  setMenuOpen((m) => !m)
                  setCartOpen(false)
                }}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                className="md:hidden icon-circle w-11 h-11 bg-espresso text-linen rounded-full focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                {menuOpen ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="5" y1="5" x2="19" y2="19" />
                    <line x1="19" y1="5" x2="5" y2="19" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="4" y1="12" x2="20" y2="12" />
                    <line x1="4" y1="17" x2="20" y2="17" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="px-6 pb-5 pt-1" role="combobox" aria-expanded={suggestions.length > 0} aria-haspopup="listbox">
              <div className="flex items-center gap-3 border-t border-espresso/10 pt-4">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C5147" strokeWidth="1.8">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search for pieces, fabrics, colors…"
                  aria-label="Search products"
                  aria-autocomplete="list"
                  className="search-input flex-1 bg-transparent outline-none font-body text-[15px] text-espresso"
                />
              </div>
              {suggestions.length > 0 && (
                <ul role="listbox" className="mt-4 border-t border-espresso/10 pt-3">
                  {suggestions.map((s, i) => (
                    <li key={s.id} role="option" aria-selected={i === activeIndex}>
                      <button
                        onClick={() => goToSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-2xl text-left ${
                          i === activeIndex ? 'bg-espresso/6' : ''
                        }`}
                      >
                        <img src={s.image_main ?? ''} alt="" className="w-9 h-11 object-cover bg-beige shrink-0 rounded-lg" />
                        <span className="font-body text-sm text-espresso flex-1 font-medium">{s.name}</span>
                        <span className="font-body text-xs text-warmgray">{fmt(s.price)}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={submitSearch}
                      className="w-full text-left px-2 py-2.5 font-body text-xs text-sage underline font-semibold"
                    >
                      See all results for "{q}"
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {menuOpen && (
            <nav className="md:hidden px-6 pb-5 pt-1 flex flex-col gap-1 border-t border-espresso/10">
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-[15px] uppercase tracking-wide text-espresso font-semibold py-3.5 border-b border-espresso/8 last:border-0 focus-visible:outline-2 focus-visible:outline-espresso"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
    </>
  )
}
