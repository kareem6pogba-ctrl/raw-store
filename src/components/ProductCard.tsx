import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '../types'
import { useCart } from '../lib/CartContext'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

export function ProductCard({ product }: { product: Product }) {
  const [hover, setHover] = useState(false)
  const { addToCart } = useCart()

  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Link to={`/product/${product.id}`}>
        <div className="relative aspect-[3.2/4] overflow-hidden bg-beige mb-4">
          <img
            src={hover && product.image_alt ? product.image_alt : product.image_main ?? ''}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
              hover ? 'scale-[1.045]' : 'scale-100'
            }`}
          />
          {product.tag && (
            <div className="absolute top-3.5 left-3.5 bg-linen text-espresso text-[10.5px] tracking-wider uppercase px-3 py-1.5">
              {product.tag}
            </div>
          )}
          <div
            className={`absolute left-0 right-0 bottom-0 p-3 transition-transform duration-300 ease-out ${
              hover ? 'translate-y-0' : 'translate-y-[110%]'
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
              className="w-full bg-espresso text-linen py-3 text-[11.5px] tracking-widest uppercase"
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
