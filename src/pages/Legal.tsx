export function Privacy() {
  return (
    <div className="max-w-[860px] mx-auto px-4 md:px-8 pt-10 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3.5">Legal</div>
      <h1 className="text-mega text-espresso text-[clamp(34px,5vw,50px)] mb-8">Privacy Policy</h1>
      <div className="soft-panel p-8 font-body text-[15px] leading-loose text-warmgray space-y-5">
        <p>Last updated: 2025.</p>
        <p>
          RAWW collects only what's needed to fulfill your order: your name, contact details, and
          delivery address. This information is used solely to process orders, communicate about
          delivery, and improve our service — never sold to third parties.
        </p>
        <p>
          Payment details for online orders are handled by our payment processor and are never
          stored on RAWW's own systems.
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
    <div className="max-w-[860px] mx-auto px-4 md:px-8 pt-10 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3.5">Legal</div>
      <h1 className="text-mega text-espresso text-[clamp(34px,5vw,50px)] mb-8">Terms & Conditions</h1>
      <div className="soft-panel p-8 font-body text-[15px] leading-loose text-warmgray space-y-5">
        <p>
          By placing an order with RAWW, you agree to pay the listed price plus any applicable
          shipping fees. Orders are confirmed once payment is received (or, for Cash on Delivery,
          once dispatched).
        </p>
        <p>
          Product colors may vary slightly from photos due to natural fiber variation and screen
          display differences — this is expected, not a defect.
        </p>
        <p>
          RAWW reserves the right to cancel orders in cases of pricing errors, stock unavailability,
          or suspected fraud, with a full refund issued in such cases.
        </p>
      </div>
    </div>
  )
}

export function Contact() {
  return (
    <div className="max-w-[760px] mx-auto px-4 md:px-8 pt-10 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3.5">Get in Touch</div>
      <h1 className="text-mega text-espresso text-[clamp(34px,5vw,50px)] mb-6">Contact Us</h1>
      <p className="font-body text-[15px] leading-loose text-warmgray mb-8">
        Questions about an order, a piece, or anything else — we read every message.
      </p>
      <div className="soft-panel p-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <div className="font-body text-xs tracking-wide uppercase text-espresso font-bold mb-2">Email</div>
          <div className="font-body text-sm text-warmgray">hello@rawwstore.example</div>
        </div>
        <div>
          <div className="font-body text-xs tracking-wide uppercase text-espresso font-bold mb-2">Hours</div>
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
    <div className="max-w-[860px] mx-auto px-4 md:px-8 pt-10 pb-24">
      <div className="font-body text-xs tracking-[0.22em] uppercase text-sage font-bold mb-3.5">Help</div>
      <h1 className="text-mega text-espresso text-[clamp(34px,5vw,50px)] mb-4">Size Guide</h1>
      <p className="font-body text-[15px] text-warmgray mb-8">
        All measurements in centimeters, taken directly on the body.
      </p>
      <div className="soft-panel p-6 overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Size', 'Bust', 'Waist', 'Hip'].map((h) => (
                <th key={h} className="text-left font-body text-xs tracking-wide uppercase text-espresso font-bold py-3 px-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size} className="border-t border-espresso/8">
                <td className="py-3.5 px-3 font-body text-sm text-espresso font-bold">{r.size}</td>
                <td className="py-3.5 px-3 font-body text-sm text-warmgray">{r.bust}</td>
                <td className="py-3.5 px-3 font-body text-sm text-warmgray">{r.waist}</td>
                <td className="py-3.5 px-3 font-body text-sm text-warmgray">{r.hip}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
