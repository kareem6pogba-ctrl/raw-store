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
  const { cartCount, setCartOpen } = useCart()
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
      <div className="bg-espresso text-linen text-center font-body text-[11px] tracking-[0.18em] uppercase py-2">
        Free shipping on all orders over EGP 1,500
      </div>
      <header className="sticky top-4 z-40 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto glass rounded-full shadow-[0_8px_32px_-12px_rgba(58,36,24,0.18)]">
          <div className="px-6 md:px-8 h-[68px] flex items-center justify-between">
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

            <Link to="/" className="font-display font-semibold text-2xl text-espresso tracking-tight focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4">
              RAW
            </Link>

            <nav className="hidden md:flex gap-2">
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  className="font-body text-[13px] tracking-wide uppercase text-espresso font-medium px-4 py-2 rounded-full hover:bg-espresso/8 transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
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
                className="text-espresso p-2 rounded-full hover:bg-espresso/8 transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <button
                aria-label="Account"
                className="hidden sm:block text-espresso p-2 rounded-full hover:bg-espresso/8 transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </button>
              <button
                onClick={() => setCartOpen(true)}
                aria-label={`Cart, ${cartCount} item${cartCount === 1 ? '' : 's'}`}
                className="relative text-espresso p-2 rounded-full hover:bg-espresso/8 transition-colors focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 8h12l-1 12H7L6 8Z" />
                  <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-espresso text-linen text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {searchOpen && (
            <div className="border-t border-espresso/10 px-6 md:px-8 py-4" role="combobox" aria-expanded={suggestions.length > 0} aria-haspopup="listbox">
              <div className="flex items-center gap-3">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#5C5147" strokeWidth="1.6">
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
                  className="flex-1 bg-transparent outline-none font-body text-[15px] text-espresso"
                />
              </div>
              {suggestions.length > 0 && (
                <ul role="listbox" className="mt-3 border-t border-espresso/10 pt-3">
                  {suggestions.map((s, i) => (
                    <li key={s.id} role="option" aria-selected={i === activeIndex}>
                      <button
                        onClick={() => goToSuggestion(s)}
                        onMouseEnter={() => setActiveIndex(i)}
                        className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-lg text-left ${
                          i === activeIndex ? 'bg-espresso/8' : ''
                        }`}
                      >
                        <img src={s.image_main ?? ''} alt="" className="w-9 h-11 object-cover bg-beige shrink-0 rounded" />
                        <span className="font-body text-sm text-espresso flex-1">{s.name}</span>
                        <span className="font-body text-xs text-warmgray">{fmt(s.price)}</span>
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={submitSearch}
                      className="w-full text-left px-2 py-2.5 font-body text-xs text-sage underline"
                    >
                      See all results for "{q}"
                    </button>
                  </li>
                </ul>
              )}
            </div>
          )}

          {menuOpen && (
            <nav className="md:hidden border-t border-espresso/10 px-6 py-5 flex flex-col gap-1">
              {NAV_ITEMS.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className="font-body text-[15px] uppercase tracking-wide text-espresso py-3 border-b border-espresso/10 last:border-0 focus-visible:outline-2 focus-visible:outline-espresso"
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
