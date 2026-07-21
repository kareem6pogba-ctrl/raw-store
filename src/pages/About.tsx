import { Deckle } from '../components/Deckle'
import { Reveal } from '../components/Reveal'
import { useProducts } from '../lib/useProducts'

export function About() {
  const { products } = useProducts()
  const img = products[3]?.image_main ?? products[0]?.image_main ?? ''

  return (
    <div>
      <section className="max-w-[1400px] mx-auto px-4 md:px-8 pt-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <Reveal>
          <Deckle style={{ aspectRatio: '3/3.6' }} className="overflow-hidden bg-sage">
            <img src={img} alt="" className="w-full h-full object-cover" />
          </Deckle>
        </Reveal>
        <Reveal delay={120}>
          <div className="soft-panel p-8 md:p-10">
            <div className="font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3.5">Our Story</div>
            <h1 className="text-mega text-espresso text-[clamp(36px,5vw,64px)] mb-6">
              Made slowly,
              <br />
              on purpose.
            </h1>
            <p className="font-body text-[15.5px] leading-loose text-warmgray">
              RAWW began with a single puff-sleeve blouse and a conviction that clothing
              should feel like it belongs to you before you've even worn it once. We work
              with small mills, dye in small batches, and let natural fiber do most of the
              talking. No fast turnover, no filler collections — just pieces built to be
              lived in.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="max-w-[1400px] mx-auto my-20 px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { t: 'Sourced Honestly', d: 'Every fabric is chosen for hand-feel and origin, from mills we visit ourselves.' },
          { t: 'Cut in Cairo', d: 'Designed, patterned, and finished locally by a small team of makers.' },
          { t: 'Built to Last', d: 'Fewer, better pieces — constructed to be worn for years, not seasons.' },
        ].map((v, i) => (
          <Reveal key={v.t} delay={i * 90}>
            <div className="soft-panel p-6 h-full">
              <div className="font-display font-extrabold text-xl text-espresso mb-2.5">{v.t}</div>
              <div className="font-body text-sm leading-relaxed text-warmgray">{v.d}</div>
            </div>
          </Reveal>
        ))}
      </section>
    </div>
  )
}
