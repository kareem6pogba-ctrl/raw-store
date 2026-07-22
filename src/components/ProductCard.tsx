import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { ColorOption, Product } from '../types'
import { useCart } from '../lib/CartContext'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false)
  const [selectedColor, setSelectedColor] = useState<ColorOption>(product.colors[0])
  const { addToCart } = useCart()

  // Prefer the selected color's own images; fall back to the product default —
  // keeps working exactly as before for products with no per-color images.
  const activeVariant = product.variants?.find((v) => v.color_name === selectedColor?.name)
  const mainImg = activeVariant?.main_image || product.image_main || ''
  const hoverImg = activeVariant?.hover_image || product.image_alt || ''

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="soft-panel product-card-lift p-3"
    >
      <Link to={`/product/${product.id}`} className="focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4 block">
        <div className="relative aspect-[3.2/4] overflow-hidden bg-beige mb-4 rounded-[22px]">
          <img
            key={mainImg}
            src={mainImg}
            alt={`${product.name} — ${selectedColor?.name ?? ''}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
              hover && hoverImg ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {hoverImg && (
            <img
              key={hoverImg}
              src={hoverImg}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-out ${
                hover ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {product.tag && (
            <div className="absolute top-3 right-3 bg-espresso text-linen text-[10.5px] tracking-wider uppercase font-bold px-3 py-1.5 rounded-full">
              {product.tag}
            </div>
          )}
        </div>
      </Link>

      <div className="px-1.5 pb-1">
        <div className="font-body text-[10.5px] tracking-[0.14em] uppercase text-sage font-semibold mb-1.5">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <div className="font-display text-[16px] text-espresso mb-2.5 font-bold leading-snug">{product.name}</div>
        </Link>

        <div className="flex items-center gap-2 mb-3">
          {product.colors.slice(0, 4).map((c) => (
            <button
              key={c.name}
              type="button"
              title={c.name}
              aria-label={`View in ${c.name}`}
              aria-pressed={selectedColor?.name === c.name}
              onClick={(e) => {
                e.preventDefault()
                setSelectedColor(c)
              }}
              className={`w-4 h-4 rounded-full inline-block border-2 border-white transition-all focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2 ${
                selectedColor?.name === c.name
                  ? 'shadow-[0_0_0_2px_rgba(58,36,24,0.55)] scale-110'
                  : 'shadow-[0_0_0_1px_rgba(58,36,24,0.15)]'
              }`}
              style={{ background: c.hex }}
            />
          ))}
        </div>

        <div className="flex items-end justify-between gap-2">
          <div className="font-display text-[17px] text-espresso font-extrabold">{fmt(product.price)}</div>
          <button
            onClick={(e) => {
              e.preventDefault()
              addToCart(
                product,
                selectedColor,
                product.sizes[Math.floor(product.sizes.length / 2)]
              )
            }}
            className="soft-pill flex items-center gap-1.5 px-4 py-2.5 text-espresso text-[11.5px] font-bold tracking-wide uppercase focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-2 active:scale-95 transition-transform"
          >
            Add
            <span className="text-base leading-none">+</span>
          </button>
        </div>
      </div>
    </div>
  )
}
