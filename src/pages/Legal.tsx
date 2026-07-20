export function Privacy() {
  return (
    <div className="max-w-[820px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Legal</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-8">Privacy Policy</h1>
      <div className="font-body text-[15px] leading-loose text-warmgray space-y-5">
        <p>Last updated: 2025.</p>
        <p>
          RAW collects only what's needed to fulfill your order: your name, contact details, and
          delivery address. This information is used solely to process orders, communicate about
          delivery, and improve our service — never sold to third parties.
        </p>
        <p>
          Payment details for online orders are handled by our payment processor and are never
          stored on RAW's own systems.
        </p>
        <p>
          You may request a copy of the data we hold about you, or ask us to delete it, at any
          time by contacting us.
        </p>
      </div>
    </div>
  )
}

export function Terms() {
  return (
    <div className="max-w-[820px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Legal</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-8">Terms & Conditions</h1>
      <div className="font-body text-[15px] leading-loose text-warmgray space-y-5">
        <p>
          By placing an order with RAW, you agree to pay the listed price plus any applicable
          shipping fees. Orders are confirmed once payment is received (or, for Cash on Delivery,
          once dispatched).
        </p>
        <p>
          Product colors may vary slightly from photos due to natural fiber variation and screen
          display differences — this is expected, not a defect.
        </p>
        <p>
          RAW reserves the right to cancel orders in cases of pricing errors, stock unavailability,
          or suspected fraud, with a full refund issued in such cases.
        </p>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="max-w-[720px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Get in Touch</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-6">Contact Us</h1>
      <p className="font-body text-[15px] leading-loose text-warmgray mb-10 max-w-[500px]">
        Questions about an order, a piece, or anything else — we read every message.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <div className="font-body text-xs tracking-wide uppercase text-espresso mb-2">Email</div>
          <div className="font-body text-sm text-warmgray">hello@raw-store.example</div>
        </div>
        <div>
          <div className="font-body text-xs tracking-wide uppercase text-espresso mb-2">Hours</div>
          <div className="font-body text-sm text-warmgray">Sun–Thu, 10am–6pm (Cairo time)</div>
        </div>
      </div>
    </div>
  )
}

export function SizeGuide() {
  const rows = [
    { size: 'XS', bust: '80–84', waist: '62–66', hip: '88–92' },
    { size: 'S', bust: '85–89', waist: '67–71', hip: '93–97' },
    { size: 'M', bust: '90–94', waist: '72–76', hip: '98–102' },
    { size: 'L', bust: '95–99', waist: '77–81', hip: '103–107' },
    { size: 'XL', bust: '100–104', waist: '82–86', hip: '108–112' },
  ]
  return (
    <div className="max-w-[820px] mx-auto px-8 pt-14 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage mb-3.5">Help</div>
      <h1 className="font-display text-[42px] text-espresso font-normal mb-4">Size Guide</h1>
      <p className="font-body text-[15px] text-warmgray mb-10">
        All measurements in centimeters, taken directly on the body.
      </p>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-espresso/15">
            {['Size', 'Bust', 'Waist', 'Hip'].map((h) => (
              <th key={h} className="text-left font-body text-xs tracking-wide uppercase text-espresso py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.size} className="border-b border-espresso/10">
              <td className="py-3.5 font-body text-sm text-espresso font-medium">{r.size}</td>
              <td className="py-3.5 font-body text-sm text-warmgray">{r.bust}</td>
              <td className="py-3.5 font-body text-sm text-warmgray">{r.waist}</td>
              <td className="py-3.5 font-body text-sm text-warmgray">{r.hip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
