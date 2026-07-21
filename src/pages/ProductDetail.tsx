import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Deckle } from '../components/Deckle'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'
import { useProducts } from '../lib/useProducts'
import { useCart } from '../lib/CartContext'
import { SkeletonProductDetail } from '../components/Skeleton'
import type { ColorOption } from '../types'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { products, loading } = useProducts()
  const { addToCart } = useCart()
  const product = products.find((p) => p.id === id)

  const [color, setColor] = useState<ColorOption | null>(null)
  const [size, setSize] = useState<string | null>(null)
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState<string>('')
  const [added, setAdded] = useState(false)
  const [tab, setTab] = useState<string | null>('details')

  useEffect(() => {
    if (product) {
      setColor(product.colors[0])
      setSize(null)
      setQty(1)
      setImg(product.image_main ?? '')
      setAdded(false)
    }
  }, [product])

  if (loading) {
    return <SkeletonProductDetail />
  }

  if (!product) {
    return (
      <div className="max-w-[1320px] mx-auto px-8 py-40 text-center">
        <p className="font-body text-warmgray mb-6">That piece couldn't be found.</p>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    )
  }

  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3)

  const handleAdd = () => {
    if (!size || !color) return
    addToCart(product, color, size, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2200)
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 pb-28">
      <div className="soft-pill inline-flex px-5 py-2.5 font-body text-[12.5px] text-warmgray mb-8 gap-2 items-center">
        <span onClick={() => navigate('/shop')} className="cursor-pointer font-semibold hover:text-espresso transition-colors">
          Shop
        </span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-espresso font-semibold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-10">
        <Reveal>
          <Deckle style={{ aspectRatio: '3.4/4' }} className="overflow-hidden bg-beige mb-4">
            <img src={img} alt={product.name} className="w-full h-full object-cover" />
          </Deckle>
          <div className="flex gap-3">
            {[product.image_main, product.image_alt].filter(Boolean).map((src, idx) => (
              <button
                key={src}
                onClick={() => setImg(src as string)}
                className={`w-[78px] h-24 rounded-2xl overflow-hidden transition-all ${
                  img === src ? 'ring-2 ring-espresso' : 'opacity-60 hover:opacity-100'
                }`}
              >
                <img src={src as string} alt={`${product.name} — view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="soft-panel p-7 md:p-8">
            {product.tag && (
              <div className="inline-block bg-espresso text-linen text-[10.5px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full mb-4">
                {product.tag}
              </div>
            )}
            <div className="font-body text-[11px] tracking-[0.16em] uppercase text-sage font-semibold mb-2">
              {product.category}
            </div>
            <h1 className="font-display text-[34px] text-espresso font-extrabold mb-2 leading-[1.08]">
              {product.name}
            </h1>
            <div className="font-display text-[22px] text-espresso font-extrabold mb-6">{fmt(product.price)}</div>
            <p className="font-body text-[14.5px] leading-loose text-warmgray mb-7">
              {product.description}
            </p>

            <div className="mb-6">
              <div className="font-body text-[12.5px] tracking-wide uppercase text-espresso font-bold mb-3">
                Color — {color?.name}
              </div>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 border-white transition-all ${
                      color?.name === c.name ? 'ring-2 ring-espresso ring-offset-2' : 'shadow-[0_0_0_1px_rgba(58,36,24,0.15)]'
                    }`}
                    style={{ background: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mb-7">
              <div className="flex justify-between mb-3">
                <span className="font-body text-[12.5px] tracking-wide uppercase text-espresso font-bold">
                  Size {size ? `— ${size}` : ''}
                </span>
                <Link to="/size-guide" className="font-body text-[12.5px] text-sage underline font-semibold focus-visible:outline-2 focus-visible:outline-sage">
                  Size Guide
                </Link>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[48px] h-[48px] font-body text-[13px] font-bold rounded-full transition-all ${
                      size === s ? 'bg-espresso text-linen' : 'soft-pill text-espresso'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {!size && <div className="font-body text-xs text-sage mt-2 font-medium">Select a size to continue</div>}
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center soft-pill">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-11 h-[52px] text-espresso font-bold">
                  −
                </button>
                <span className="w-8 text-center font-body text-sm font-bold">{qty}</span>
                <button onClick={() => setQty((q) => q + 1)} className="w-11 h-[52px] text-espresso font-bold">
                  +
                </button>
              </div>
              <Button style={{ flex: 1 }} onClick={handleAdd}>
                {added ? 'Added ✓' : 'Add to Cart'}
              </Button>
            </div>
            <Button variant="ghost" small>
              ♡ Add to Wishlist
            </Button>

            <div className="mt-8 pt-6 border-t border-espresso/8">
              {[
                { key: 'details', label: 'Details & Fabric' },
                { key: 'shipping', label: 'Shipping & Returns' },
              ].map((t) => (
                <div key={t.key} className="border-b border-espresso/8 last:border-0">
                  <button
                    onClick={() => setTab(tab === t.key ? null : t.key)}
                    className="w-full flex justify-between py-4 font-body text-[13.5px] tracking-wide uppercase text-espresso font-bold"
                  >
                    {t.label}
                    <span>{tab === t.key ? '−' : '+'}</span>
                  </button>
                  {tab === t.key && (
                    <div className="font-body text-[13.5px] leading-loose text-warmgray pb-4">
                      {t.key === 'details'
                        ? `Fabric: ${product.fabric}. Cut in small batches; slight variation between pieces is part of the character. Cold wash, hang dry.`
                        : 'Delivered in 2–4 business days across Egypt. Free shipping over EGP 1,500. Unworn pieces may be returned within 14 days of delivery.'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5 font-semibold">You Might Also Like</div>
          <h2 className="text-mega text-espresso text-[clamp(28px,4vw,44px)] mb-9">Related Pieces</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
