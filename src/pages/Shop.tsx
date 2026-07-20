import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../lib/useProducts'

export function Shop() {
  const { products, loading } = useProducts()
  const [params] = useSearchParams()
  const query = params.get('q') ?? ''
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')

  const cats = ['All', 'Tops', 'Bottoms', 'Sets']

  const list = useMemo(() => {
    let arr = products.filter((p) => category === 'All' || p.category === category)
    if (query) {
      const q = query.toLowerCase()
      arr = arr.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.fabric ?? '').toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }
    if (sort === 'price-asc') arr = [...arr].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') arr = [...arr].sort((a, b) => b.price - a.price)
    return arr
  }, [products, category, sort, query])

  return (
    <div className="max-w-[1320px] mx-auto px-8 pt-14 pb-24">
      <div className="mb-11">
        <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">
          {query ? `Results for "${query}"` : 'The Full Collection'}
        </div>
        <h1 className="font-display text-[clamp(36px,4vw,54px)] text-espresso font-normal">Shop RAW</h1>
      </div>

      <div className="flex justify-between items-center border-y border-espresso/10 py-4.5 mb-11 flex-wrap gap-4">
        <div className="flex gap-2.5 flex-wrap">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`font-body text-[12.5px] tracking-wide uppercase px-4.5 py-2.5 border transition-colors ${
                category === c ? 'bg-espresso text-linen border-espresso' : 'border-espresso/10 text-espresso'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="font-body text-[12.5px] tracking-wide uppercase text-espresso bg-transparent border border-espresso/10 px-3.5 py-2.5"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20 font-body text-warmgray">Loading…</div>
      ) : list.length === 0 ? (
        <div className="text-center py-20 font-body text-warmgray">
          Nothing matches yet — try another search or browse the full collection.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
