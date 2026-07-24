import { Link } from 'react-router-dom'
import { Deckle } from '../components/Deckle'
import { Button } from '../components/Button'
import { ProductCard } from '../components/ProductCard'
import { Reveal } from '../components/Reveal'
import { LineReveal } from '../components/LineReveal'
import { SkeletonGrid } from '../components/Skeleton'
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
    return (
      <div className="max-w-[1320px] mx-auto px-8 py-20">
        <SkeletonGrid count={3} />
      </div>
    )
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
      <section className="relative max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
          <div className="md:col-span-7 md:row-start-1 relative z-10">
            <Reveal>
              <div className="md:hidden inline-block soft-pill px-4 py-1.5 mb-6">
                <span className="font-body text-[11px] tracking-[0.18em] uppercase text-espresso font-medium">
                  New Arrival — The First Chapter
                </span>
              </div>
              <h1 className="text-mega text-espresso text-[clamp(56px,9vw,148px)]">
                <LineReveal delay={100}>Cut from</LineReveal>
                <LineReveal delay={220}>
                  <em className="italic font-medium">unhurried</em>
                </LineReveal>
                <LineReveal delay={340}>cloth.</LineReveal>
              </h1>
            </Reveal>

            {/* Desktop-only: sits tight under the headline, inside the same column flow */}
            <Reveal delay={400} className="hidden md:block mt-8 md:max-w-[420px]">
              <p className="font-body text-[16.5px] leading-relaxed text-warmgray mb-8">
                RAWW works in natural fibers and quiet silhouettes — pieces designed to fade,
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
            </Reveal>
          </div>

          <div className="md:col-span-5 md:row-start-1 relative z-0">
            <Reveal delay={150}>
              <div className="relative">
                <Deckle style={{ aspectRatio: '4/5' }} className="overflow-hidden bg-beige">
                  <img
                    src={featured.image_main ?? ''}
                    alt={featured.name}
                    className="hero-zoom w-full h-full object-cover"
                  />
                </Deckle>
                <div className="absolute -bottom-6 -left-6 soft-panel px-5 py-4 max-w-[210px] hidden sm:block">
                  <div className="font-display italic text-lg text-espresso mb-1">{featured.name}</div>
                  <div className="font-body text-sm text-warmgray">EGP {featured.price.toLocaleString()}</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Mobile-only: original position, right after the whole grid (below the image) */}
        <Reveal delay={400} className="md:hidden">
          <div className="mt-8">
            <p className="font-body text-[16.5px] leading-relaxed text-warmgray mb-8">
              RAWW works in natural fibers and quiet silhouettes — pieces designed to fade,
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
        </Reveal>
      </section>

      <section className="max-w-[1400px] mx-auto mt-24 px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { t: 'Natural Fibers', d: 'Cotton, linen, and undyed cloth chosen for how it feels, not just how it looks.' },
          { t: 'Made to Fade Well', d: 'Every wash, every wear adds character rather than wear-out.' },
          { t: 'Small Batches', d: 'Cut in limited runs so the details stay considered.' },
          { t: 'One Size, Carefully Considered', d: 'Each piece is cut for a specific fit — a recommended weight and height range guides you to the piece it was made for.' },
        ].map((v, i) => (
          <Reveal key={v.t} delay={i * 80}>
            <div className="soft-panel p-5 h-full">
              <div className="font-display italic text-[17px] text-espresso mb-2">{v.t}</div>
              <div className="font-body text-[13px] leading-relaxed text-warmgray">{v.d}</div>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-28 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <Reveal>
          <Deckle style={{ aspectRatio: '3/3.6' }} className="overflow-hidden bg-sage">
            <img
              src={products[4]?.image_main ?? featured.image_main ?? ''}
              alt=""
              className="w-full h-full object-cover"
            />
          </Deckle>
        </Reveal>
        <Reveal delay={150}>
          <Eyebrow>The Studio Note</Eyebrow>
          <h2 className="text-mega text-espresso text-[clamp(38px,5vw,64px)] mb-6">
            We don't chase
            <br />
            trend cycles. We chase
            <br />
            <em className="italic font-medium">good cloth</em>.
          </h2>
          <p className="font-body text-[15.5px] leading-loose text-warmgray mb-7 max-w-[440px]">
            Every RAWW piece begins with a fabric, not a sketch. We source linen and cotton
            for their hand-feel first, then let the silhouette follow. The result is a
            wardrobe you reach for out of habit, not obligation.
          </p>
          <Link to="/about">
            <Button variant="outline">Our Story</Button>
          </Link>
        </Reveal>
      </section>

      {trending.length > 0 && (
        <section className="max-w-[1400px] mx-auto px-4 md:px-8 pb-28">
          <Reveal>
            <div className="flex justify-between items-end mb-10">
              <div>
                <Eyebrow>Currently Loved</Eyebrow>
                <h2 className="text-mega text-espresso text-[clamp(32px,4.5vw,56px)]">Trending This Week</h2>
              </div>
              <Link to="/shop">
                <Button variant="ghost">View All →</Button>
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7">
            {trending.map((p, i) => (
              <Reveal key={p.id} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="bg-espresso py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <Reveal>
            <Eyebrow dark>What They're Saying</Eyebrow>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                q: "The fabric is unlike anything else I own — it just gets better with wear. Minimal, elegant, exactly what I wanted.",
                n: 'Nour A.',
              },
              {
                q: 'My new everyday uniform. It goes with everything and somehow still feels considered.',
                n: 'Jana M.',
              },
            ].map((t, i) => (
              <Reveal key={t.n} delay={i * 120}>
                <div className="soft-panel-dark p-8 h-full">
                  <div className="text-beige text-[15px] mb-3.5 tracking-widest">★★★★★</div>
                  <p className="font-display italic text-[24px] leading-snug text-linen mb-4">"{t.q}"</p>
                  <div className="font-body text-[13px] tracking-wide text-linen/70">— {t.n}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
