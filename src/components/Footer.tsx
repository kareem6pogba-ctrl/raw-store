import { useState } from 'react'
import { Link } from 'react-router-dom'

const SHOP_LINKS = [
  { label: 'All Pieces', to: '/shop' },
  { label: 'Tops', to: '/shop?category=Tops' },
  { label: 'Bottoms', to: '/shop?category=Bottoms' },
  { label: 'Sets', to: '/shop?category=Sets' },
]

const HELP_LINKS = [
  { label: 'Shipping & Returns', to: '/shipping-returns' },
  { label: 'Size Guide', to: '/size-guide' },
  { label: 'FAQs', to: '/faq' },
  { label: 'Contact Us', to: '/contact' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="bg-espresso text-linen">
      <div className="max-w-[1320px] mx-auto px-8 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-[28px] mb-4">RAW</div>
          <p className="font-body text-sm leading-relaxed text-linen/65 max-w-[280px]">
            Natural fibers, unhurried silhouettes. Pieces made to soften, fade, and stay with you.
          </p>
        </div>
        <div>
          <div className="font-body text-xs tracking-widest uppercase mb-5 text-beige">Shop</div>
          {SHOP_LINKS.map((l) => (
            <div key={l.label} className="mb-3">
              <Link
                to={l.to}
                className="text-linen/75 font-body text-sm hover:text-linen focus-visible:outline-2 focus-visible:outline-beige focus-visible:outline-offset-2 transition-colors"
              >
                {l.label}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <div className="font-body text-xs tracking-widest uppercase mb-5 text-beige">Help</div>
          {HELP_LINKS.map((l) => (
            <div key={l.label} className="mb-3">
              <Link
                to={l.to}
                className="text-linen/75 font-body text-sm hover:text-linen focus-visible:outline-2 focus-visible:outline-beige focus-visible:outline-offset-2 transition-colors"
              >
                {l.label}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <div className="font-body text-xs tracking-widest uppercase mb-5 text-beige">Stay in the loop</div>
          <p className="font-body text-[13.5px] text-linen/65 mb-4">
            New arrivals, quiet sales, occasional letters.
          </p>
          {sent ? (
            <div className="font-body text-[13.5px] text-beige">You're on the list.</div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (email.includes('@')) setSent(true)
              }}
              className="flex border-b border-linen/35 pb-2.5"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                aria-label="Email address"
                className="flex-1 bg-transparent outline-none text-linen font-body text-sm"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="text-beige font-body focus-visible:outline-2 focus-visible:outline-beige focus-visible:outline-offset-2"
              >
                →
              </button>
            </form>
          )}
        </div>
      </div>
      <div className="border-t border-linen/15 px-8 py-5 max-w-[1320px] mx-auto flex flex-wrap justify-between gap-2 font-body text-xs text-linen/50">
        <span>© 2025 RAW. All rights reserved.</span>
        <span className="flex gap-5">
          <Link to="/privacy" className="hover:text-linen/80 transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-linen/80 transition-colors">
            Terms & Conditions
          </Link>
        </span>
      </div>
    </footer>
  )
}
