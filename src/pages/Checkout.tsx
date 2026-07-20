import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../lib/CartContext'
import { supabase } from '../lib/supabase'
import { Button } from '../components/Button'
import type { CheckoutForm } from '../types'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  disabled?: boolean
}) {
  return (
    <label className="block">
      <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">{label}</div>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        className={`w-full border-0 border-b border-espresso/10 bg-transparent py-2.5 font-body text-[14.5px] text-espresso outline-none ${
          disabled ? 'opacity-60' : ''
        }`}
      />
    </label>
  )
}

export function Checkout() {
  const { cart, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [form, setForm] = useState<CheckoutForm>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    payment: 'cod',
  })

  const shipping = subtotal >= 1500 || subtotal === 0 ? 0 : 90
  const total = subtotal + shipping

  const update = (k: keyof CheckoutForm, v: string) => setForm((f) => ({ ...f, [k]: v }))

  const placeOrder = async () => {
    setSubmitting(true)
    setSubmitError(null)
    const orderNum = `RAW-${Math.floor(10000 + Math.random() * 89999)}`

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNum,
          customer_name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          subtotal,
          shipping,
          total,
          payment_method: form.payment,
          status: 'pending',
        })
        .select()
        .single()

      if (orderError) throw orderError

      const items = cart.map((item) => ({
        order_id: order.id,
        product_id: item.product.id,
        product_name: item.product.name,
        color: item.color.name,
        size: item.size,
        quantity: item.qty,
        unit_price: item.product.price,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(items)
      if (itemsError) throw itemsError

      setOrderNumber(orderNum)
      clearCart()
      setStep(3)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong placing your order.')
    } finally {
      setSubmitting(false)
    }
  }

  if (cart.length === 0 && step < 3) {
    return (
      <div className="max-w-[700px] mx-auto px-8 py-24 text-center">
        <h2 className="font-display text-[30px] text-espresso mb-4">Your bag is empty</h2>
        <p className="font-body text-warmgray mb-7">Add something raw before checking out.</p>
        <Button onClick={() => navigate('/shop')}>Browse the Shop</Button>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-[620px] mx-auto px-8 py-24 text-center">
        <div className="font-body text-[15px] tracking-wide uppercase text-sage mb-5">Order Confirmed</div>
        <h1 className="font-display text-[40px] text-espresso mb-5 font-normal">
          Thank you, {form.name.split(' ')[0] || 'friend'}.
        </h1>
        <p className="font-body text-[15px] leading-loose text-warmgray mb-3">
          Order <strong className="text-espresso">#{orderNumber}</strong> has been placed.
        </p>
        <p className="font-body text-sm leading-loose text-warmgray mb-10">
          A confirmation is on its way to {form.email || 'your inbox'}. Expect delivery in 2–4 business days.
        </p>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-8 pt-14 pb-24">
      <h1 className="font-display text-[38px] text-espresso font-normal mb-10">Checkout</h1>
      <div className="flex gap-5 mb-12 font-body text-[12.5px] tracking-wide uppercase">
        {['Contact & Address', 'Payment', 'Confirmation'].map((s, i) => (
          <span key={s} className={step === i + 1 ? 'text-espresso' : 'text-warmgray/50'}>
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-16">
        <div>
          {step === 1 && (
            <div className="grid gap-4.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                <Field label="Full Name" value={form.name} onChange={(v) => update('name', v)} />
                <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} />
              </div>
              <Field label="Email" value={form.email} onChange={(v) => update('email', v)} />
              <Field label="Address" value={form.address} onChange={(v) => update('address', v)} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4.5">
                <Field label="City" value={form.city} onChange={(v) => update('city', v)} />
                <Field label="Country" value="Egypt" disabled />
              </div>
              <Button
                style={{ marginTop: 8, width: 'fit-content' }}
                onClick={() => form.name && form.address && form.city && setStep(2)}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="grid gap-3.5 mb-7">
                {[
                  { id: 'cod', label: 'Cash on Delivery', d: 'Pay when your order arrives.' },
                  { id: 'online', label: 'Online Payment', d: 'Card payment — placeholder gateway.' },
                ].map((p) => (
                  <label
                    key={p.id}
                    className={`flex items-center gap-3.5 border px-5 py-4.5 cursor-pointer ${
                      form.payment === p.id ? 'border-espresso' : 'border-espresso/10'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={form.payment === p.id}
                      onChange={() => update('payment', p.id)}
                    />
                    <div>
                      <div className="font-body text-[14.5px] text-espresso font-medium">{p.label}</div>
                      <div className="font-body text-[12.5px] text-warmgray">{p.d}</div>
                    </div>
                  </label>
                ))}
              </div>
              {submitError && (
                <div className="font-body text-sm text-red-700 mb-4">{submitError}</div>
              )}
              <div className="flex gap-3.5">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={placeOrder} disabled={submitting}>
                  {submitting ? 'Placing Order…' : 'Place Order'}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-7 self-start">
          <div className="font-body text-[13px] tracking-wide uppercase text-espresso mb-5">Order Summary</div>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-3 font-body text-[13.5px] text-warmgray">
              <span>
                {item.product.name} × {item.qty}
              </span>
              <span>{fmt(item.product.price * item.qty)}</span>
            </div>
          ))}
          <div className="border-t border-espresso/10 mt-4 pt-4">
            <div className="flex justify-between font-body text-[13.5px] text-warmgray mb-2">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-[13.5px] text-warmgray mb-3">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
            </div>
            <div className="flex justify-between font-display text-[19px] text-espresso">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
