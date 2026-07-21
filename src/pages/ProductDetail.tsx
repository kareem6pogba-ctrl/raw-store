import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Deckle } from '../components/Deckle'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
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
    <div className="max-w-[1320px] mx-auto px-8 pt-10 pb-24">
      <div className="font-body text-[12.5px] text-warmgray mb-8 flex gap-2">
        <span onClick={() => navigate('/shop')} className="cursor-pointer">
          Shop
        </span>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span className="text-espresso">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-16">
        <div>
          <Deckle style={{ aspectRatio: '3.4/4' }} className="overflow-hidden bg-beige mb-4">
            <img src={img} alt={product.name} className="w-full h-full object-cover" />
          </Deckle>
          <div className="flex gap-3">
            {[product.image_main, product.image_alt].filter(Boolean).map((src, idx) => (
              <button
                key={src}
                onClick={() => setImg(src as string)}
                className={`w-[78px] h-24 border overflow-hidden ${
                  img === src ? 'border-espresso' : 'border-espresso/10'
                }`}
              >
                <img src={src as string} alt={`${product.name} — view ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {product.tag && (
            <div className="font-body text-[11px] tracking-wide uppercase text-sage mb-3">{product.tag}</div>
          )}
          <h1 className="font-display text-[40px] text-espresso font-normal mb-3 leading-[1.08]">
            {product.name}
          </h1>
          <div className="font-body text-[19px] text-espresso mb-6">{fmt(product.price)}</div>
          <p className="font-body text-[14.5px] leading-loose text-warmgray mb-7 max-w-[440px]">
            {product.description}
          </p>

          <div className="mb-6">
            <div className="font-body text-[12.5px] tracking-wide uppercase text-espresso mb-3">
              Color — {color?.name}
            </div>
            <div className="flex gap-2.5">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColor(c)}
                  title={c.name}
                  className={`w-8 h-8 rounded-full ${
                    color?.name === c.name ? 'ring-2 ring-espresso ring-offset-2' : 'border border-espresso/10'
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="mb-7">
            <div className="flex justify-between mb-3">
              <span className="font-body text-[12.5px] tracking-wide uppercase text-espresso">
                Size {size ? `— ${size}` : ''}
              </span>
              <Link to="/size-guide" className="font-body text-[12.5px] text-sage underline focus-visible:outline-2 focus-visible:outline-sage">
                Size Guide
              </Link>
            </div>
            <div className="flex gap-2.5 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[46px] h-[46px] font-body text-[13px] border ${
                    size === s ? 'bg-espresso text-linen border-espresso' : 'border-espresso/10 text-espresso'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {!size && <div className="font-body text-xs text-sage mt-2">Select a size to continue</div>}
          </div>

          <div className="flex gap-3.5 mb-4">
            <div className="flex items-center border border-espresso/10">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-[42px] h-[50px] text-espresso">
                −
              </button>
              <span className="w-8 text-center font-body text-sm">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-[42px] h-[50px] text-espresso">
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

          <div className="mt-10 border-t border-espresso/10">
            {[
              { key: 'details', label: 'Details & Fabric' },
              { key: 'shipping', label: 'Shipping & Returns' },
            ].map((t) => (
              <div key={t.key} className="border-b border-espresso/10">
                <button
                  onClick={() => setTab(tab === t.key ? null : t.key)}
                  className="w-full flex justify-between py-4.5 font-body text-[13.5px] tracking-wide uppercase text-espresso"
                >
                  {t.label}
                  <span>{tab === t.key ? '−' : '+'}</span>
                </button>
                {tab === t.key && (
                  <div className="font-body text-[13.5px] leading-loose text-warmgray pb-4.5">
                    {t.key === 'details'
                      ? `Fabric: ${product.fabric}. Cut in small batches; slight variation between pieces is part of the character. Cold wash, hang dry.`
                      : 'Delivered in 2–4 business days across Egypt. Free shipping over EGP 1,500. Unworn pieces may be returned within 14 days of delivery.'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">You Might Also Like</div>
          <h2 className="font-display text-[30px] text-espresso font-normal mb-9">Related Pieces</h2>
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
