import { Deckle } from '../components/Deckle'
import { useProducts } from '../lib/useProducts'

export function About() {
  const { products } = useProducts()
  const img = products[3]?.image_main ?? products[0]?.image_main ?? ''

  return (
    <div>
      <section className="max-w-[1320px] mx-auto px-8 pt-14 grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <Deckle style={{ aspectRatio: '3/3.6' }} className="overflow-hidden bg-sage">
          <img src={img} alt="" className="w-full h-full object-cover" />
        </Deckle>
        <div>
          <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Our Story</div>
          <h1 className="font-display text-[clamp(36px,4.4vw,58px)] text-espresso leading-[1.06] mb-6 font-normal">
            Made slowly,
            <br />
            on purpose.
          </h1>
          <p className="font-body text-[15.5px] leading-loose text-warmgray max-w-[440px]">
            RAW began with a single puff-sleeve blouse and a conviction that clothing
            should feel like it belongs to you before you've even worn it once. We work
            with small mills, dye in small batches, and let natural fiber do most of the
            talking. No fast turnover, no filler collections — just pieces built to be
            lived in.
          </p>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto my-24 px-8 grid grid-cols-1 md:grid-cols-3 gap-10">
        {[
          { t: 'Sourced Honestly', d: 'Every fabric is chosen for hand-feel and origin, from mills we visit ourselves.' },
          { t: 'Cut in Cairo', d: 'Designed, patterned, and finished locally by a small team of makers.' },
          { t: 'Built to Last', d: 'Fewer, better pieces — constructed to be worn for years, not seasons.' },
        ].map((v) => (
          <div key={v.t} className="border-t border-espresso/10 pt-5">
            <div className="font-display italic text-xl text-espresso mb-2.5">{v.t}</div>
            <div className="font-body text-sm leading-relaxed text-warmgray">{v.d}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
