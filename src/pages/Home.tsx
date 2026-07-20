import { Link } from 'react-router-dom'
import { Deckle } from '../components/Deckle'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../lib/useProducts'

function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div
      className={`font-body text-xs tracking-[0.22em] uppercase font-medium mb-3.5 ${
        dark ? 'text-beige' : 'text-sage'
      }`}
    >
      {children}
    </div>
  )
}

export function Home() {
  const { products, loading } = useProducts()
  const featured = products[0]
  const trending = products.slice(1, 4)

  if (loading) {
    return <div className="max-w-[1320px] mx-auto px-8 py-40 text-center font-body text-warmgray">Loading…</div>
  }

  if (!featured) {
    return (
      <div className="max-w-[1320px] mx-auto px-8 py-40 text-center font-body text-warmgray">
        No products yet — add some from the admin panel or Supabase table editor.
      </div>
    )
  }

  return (
    <div>
      <section className="max-w-[1320px] mx-auto px-8 pt-14 grid grid-cols-1 md:grid-cols-[0.85fr_1.15fr] gap-14 items-center">
        <div>
          <Eyebrow>New Arrival — The First Chapter</Eyebrow>
          <h1 className="font-display font-normal text-[clamp(44px,5.2vw,74px)] leading-[1.02] text-espresso -tracking-[0.01em] mb-6">
            Cut from
            <br />
            <em className="italic font-medium">unhurried</em>
            <br />
            cloth.
          </h1>
          <p className="font-body text-[16.5px] leading-relaxed text-warmgray max-w-[400px] mb-8">
            RAW works in natural fibers and quiet silhouettes — pieces designed to fade,
            soften, and belong to you a little more with every season.
          </p>
          <div className="flex gap-4 items-center">
            <Link to="/shop">
              <Button>Shop the Edit</Button>
            </Link>
            <Link to={`/product/${featured.id}`}>
              <Button variant="ghost">View First Piece →</Button>
            </Link>
          </div>
        </div>
        <Deckle style={{ aspectRatio: '4/4.6' }} className="overflow-hidden bg-beige">
          <img src={featured.image_main ?? ''} alt={featured.name} className="w-full h-full object-cover" />
        </Deckle>
      </section>

      <section className="max-w-[1320px] mx-auto mt-20 px-8 py-9 border-y border-espresso/10 grid grid-cols-2 md:grid-cols-4 gap-7">
        {[
          { t: 'Natural Fibers', d: 'Cotton, linen, and undyed cloth chosen for how it feels, not just how it looks.' },
          { t: 'Made to Fade Well', d: 'Every wash, every wear adds character rather than wear-out.' },
          { t: 'Small Batches', d: 'Cut in limited runs so the details stay considered.' },
          { t: 'Cairo, Handled with Care', d: 'Designed and finished in Cairo, shipped nationwide.' },
        ].map((v) => (
          <div key={v.t}>
            <div className="font-display italic text-[17px] text-espresso mb-2">{v.t}</div>
            <div className="font-body text-[13px] leading-relaxed text-warmgray">{v.d}</div>
          </div>
        ))}
      </section>

      <section className="max-w-[1320px] mx-auto px-8 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <Deckle style={{ aspectRatio: '3/3.6' }} className="overflow-hidden bg-sage">
          <img
            src={products[4]?.image_main ?? featured.image_main ?? ''}
            alt=""
            className="w-full h-full object-cover"
          />
        </Deckle>
        <div>
          <Eyebrow>The Studio Note</Eyebrow>
          <h2 className="font-display text-[clamp(30px,3.4vw,44px)] leading-[1.12] text-espresso mb-5 font-normal">
            We don't chase trend cycles.
            <br />
            We chase <em className="italic">good cloth</em>.
          </h2>
          <p className="font-body text-[15.5px] leading-loose text-warmgray mb-7 max-w-[440px]">
            Every RAW piece begins with a fabric, not a sketch. We source linen and cotton
            for their hand-feel first, then let the silhouette follow. The result is a
            wardrobe you reach for out of habit, not obligation.
          </p>
          <Link to="/about">
            <Button variant="outline">Our Story</Button>
          </Link>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="max-w-[1320px] mx-auto px-8 pb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <Eyebrow>Currently Loved</Eyebrow>
              <h2 className="font-display text-[34px] text-espresso font-normal">Trending This Week</h2>
            </div>
            <Link to="/shop">
              <Button variant="ghost">View All →</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-beige py-20 px-8">
        <div className="max-w-[1320px] mx-auto">
          <Eyebrow dark>What They're Saying</Eyebrow>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {[
              {
                q: "The fabric is unlike anything else I own — it just gets better with wear. Minimal, elegant, exactly what I wanted.",
                n: 'Nour A.',
              },
              {
                q: 'My new everyday uniform. It goes with everything and somehow still feels considered.',
                n: 'Jana M.',
              },
            ].map((t) => (
              <div key={t.n}>
                <div className="text-espresso text-[15px] mb-3.5 tracking-widest">★★★★★</div>
                <p className="font-display italic text-[22px] leading-snug text-espresso mb-3.5">"{t.q}"</p>
                <div className="font-body text-[13px] tracking-wide text-espresso/70">— {t.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
