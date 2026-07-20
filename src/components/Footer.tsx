import { useState } from 'react'
import { Link } from 'react-router-dom'

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
          {['All Pieces', 'Tops', 'Bottoms', 'Sets'].map((t) => (
            <div key={t} className="mb-3">
              <Link to="/shop" className="text-linen/75 font-body text-sm">
                {t}
              </Link>
            </div>
          ))}
        </div>
        <div>
          <div className="font-body text-xs tracking-widest uppercase mb-5 text-beige">Help</div>
          {['Shipping & Returns', 'Size Guide', 'FAQs', 'Contact Us'].map((t) => (
            <div key={t} className="mb-3 font-body text-sm text-linen/75">
              {t}
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
            <div className="flex border-b border-linen/35 pb-2.5">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-transparent outline-none text-linen font-body text-sm"
              />
              <button
                onClick={() => email.includes('@') && setSent(true)}
                className="text-beige font-body"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-linen/15 px-8 py-5 max-w-[1320px] mx-auto flex flex-wrap justify-between gap-2 font-body text-xs text-linen/50">
        <span>© 2025 RAW. All rights reserved.</span>
        <span className="flex gap-5">
          <span>Privacy Policy</span>
          <span>Terms & Conditions</span>
        </span>
      </div>
    </footer>
  )
}
