import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../lib/CartContext'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false)
  const { addToCart } = useCart()

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="product-card-lift"
    >
      <Link to={`/product/${product.id}`} className="focus-visible:outline-2 focus-visible:outline-espresso focus-visible:outline-offset-4 block">
        <div className="relative aspect-[3.2/4] overflow-hidden bg-beige mb-4 rounded-2xl">
          <img
            src={product.image_main ?? ''}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
              hover && product.image_alt ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {product.image_alt && (
            <img
              src={product.image_alt}
              alt=""
              aria-hidden="true"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${
                hover ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          {product.tag && (
            <div className="absolute top-3.5 left-3.5 glass-badge rounded-full text-espresso text-[10.5px] tracking-wider uppercase px-3.5 py-1.5">
              {product.tag}
            </div>
          )}
          <div
            className={`absolute left-2.5 right-2.5 bottom-2.5 transition-transform duration-300 ease-out max-md:translate-y-0 focus-within:translate-y-0 ${
              hover ? 'translate-y-0' : 'translate-y-[130%]'
            }`}
          >
            <button
              onClick={(e) => {
                e.preventDefault()
                addToCart(
                  product,
                  product.colors[0],
                  product.sizes[Math.floor(product.sizes.length / 2)]
                )
              }}
              className="w-full glass-dark rounded-full text-linen py-3 text-[11.5px] tracking-widest uppercase focus-visible:outline-2 focus-visible:outline-beige focus-visible:outline-offset-2"
            >
              Quick Add
            </button>
          </div>
        </div>
        <div className="text-[14.5px] text-espresso mb-1 font-medium">{product.name}</div>
        <div className="flex justify-between text-[13.5px] text-warmgray">
          <span>{fmt(product.price)}</span>
          <span className="flex gap-1.5">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="w-2.5 h-2.5 rounded-full inline-block border border-espresso/10"
                style={{ background: c.hex }}
              />
            ))}
          </span>
        </div>
      </Link>
    </div>
  )
}
