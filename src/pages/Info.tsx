const FAQS = [
  { q: 'How do I find my size?', a: 'Check the Size Guide link on any product page — measurements are given in cm alongside garment fit notes.' },
  { q: 'Do colors vary between pieces?', a: 'Yes — undyed and naturally dyed pieces carry slight, intentional variation. That is part of the material, not a flaw.' },
  { q: 'How long does delivery take?', a: '2–4 business days across Egypt. Orders over EGP 1,500 ship free.' },
  { q: 'What is your return policy?', a: 'Unworn pieces with tags attached may be returned within 14 days of delivery for a full refund.' },
]

export function FAQ() {
  return (
    <div className="max-w-[820px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Help</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-12">Frequently Asked Questions</h1>
      <div>
        {FAQS.map((f) => (
          <div key={f.q} className="border-b border-espresso/10 py-6">
            <div className="font-body text-[15px] text-espresso font-medium mb-2">{f.q}</div>
            <div className="font-body text-sm leading-relaxed text-warmgray">{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ShippingReturns() {
  return (
    <div className="max-w-[820px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Help</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-8">Shipping & Returns</h1>
      <div className="font-body text-[15px] leading-loose text-warmgray space-y-5">
        <p>All orders are processed within 1–2 business days and delivered across Egypt in 2–4 business days. Orders over EGP 1,500 ship free; all other orders carry a flat EGP 90 shipping fee.</p>
        <p>Unworn, unwashed pieces with tags attached can be returned within 14 days of delivery for a full refund. To start a return, contact us with your order number.</p>
        <p>Sale items are final sale and not eligible for return unless faulty.</p>
      </div>
    </div>
  )
}
