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
  error,
  type = 'text',
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  disabled?: boolean
  error?: string
  type?: string
}) {
  return (
    <label className="block">
      <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray font-bold mb-2">{label}</div>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.value)}
        aria-invalid={!!error}
        className={`w-full soft-pill px-5 py-3.5 font-body text-[14.5px] text-espresso outline-none ${
          error ? 'ring-2 ring-red-500' : ''
        } ${disabled ? 'opacity-60' : ''}`}
      />
      {error && <div className="font-body text-xs text-red-600 mt-1.5 font-medium">{error}</div>}
    </label>
  )
}

export function Checkout() {
  const { cart, subtotal, clearCart, freeShippingThreshold } = useCart()
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
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})

  const [couponInput, setCouponInput] = useState('')
  const [couponChecking, setCouponChecking] = useState(false)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const shipping = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 90
  const discount = appliedCoupon?.discount ?? 0
  const total = Math.max(0, subtotal + shipping - discount)

  const applyCoupon = async () => {
    const code = couponInput.trim().toUpperCase()
    if (!code) return
    setCouponChecking(true)
    setCouponError(null)
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', code)
      .eq('active', true)
      .maybeSingle()
    setCouponChecking(false)

    if (error || !data) {
      setCouponError('That code isn\'t valid or has expired.')
      return
    }
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      setCouponError('That code has expired.')
      return
    }
    if (data.usage_limit && data.times_used >= data.usage_limit) {
      setCouponError('That code has reached its usage limit.')
      return
    }
    if (subtotal < Number(data.min_order)) {
      setCouponError(`Add ${fmt(Number(data.min_order) - subtotal)} more to use this code.`)
      return
    }

    const discountAmount =
      data.type === 'percentage' ? Math.round((subtotal * Number(data.amount)) / 100) : Number(data.amount)

    setAppliedCoupon({ code: data.code, discount: Math.min(discountAmount, subtotal) })
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput('')
    setCouponError(null)
  }

  const update = (k: keyof CheckoutForm, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const validateStep1 = () => {
    const next: Partial<Record<keyof CheckoutForm, string>> = {}
    if (!form.name.trim()) next.name = 'Required'
    if (!form.phone.trim()) next.phone = 'Required'
    else if (!/^[\d+\s()-]{7,}$/.test(form.phone.trim())) next.phone = 'Enter a valid phone number'
    if (!form.email.trim()) next.email = 'Required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email'
    if (!form.address.trim()) next.address = 'Required'
    if (!form.city.trim()) next.city = 'Required'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const placeOrder = async () => {
    setSubmitting(true)
    setSubmitError(null)
    const orderNum = `RAWW-${Math.floor(10000 + Math.random() * 89999)}`

    try {
      const orderId = crypto.randomUUID()

      const { error: orderError } = await supabase.from('orders').insert({
        id: orderId,
        order_number: orderNum,
        customer_name: form.name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        city: form.city,
        subtotal,
        shipping,
        discount,
        coupon_code: appliedCoupon?.code ?? null,
        total,
        payment_method: form.payment,
        status: 'pending',
      })

      if (orderError) throw orderError

      const items = cart.map((item) => ({
        order_id: orderId,
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
      <div className="max-w-[700px] mx-auto px-4 md:px-8 py-24 text-center">
        <div className="soft-panel p-12">
          <h2 className="text-mega text-espresso text-[32px] mb-4">Your bag is empty</h2>
          <p className="font-body text-warmgray mb-7">Add something rawwesome before checking out.</p>
          <Button onClick={() => navigate('/shop')}>Browse the Shop</Button>
        </div>
      </div>
    )
  }

  if (step === 3) {
    return (
      <div className="max-w-[620px] mx-auto px-4 md:px-8 py-24 text-center">
        <div className="soft-panel p-12">
          <div className="font-body text-[13px] tracking-wide uppercase text-sage font-bold mb-5">Order Confirmed</div>
          <h1 className="text-mega text-espresso text-[clamp(32px,5vw,48px)] mb-5">
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
      </div>
    )
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-10 pb-24">
      <h1 className="text-mega text-espresso text-[clamp(34px,5vw,52px)] mb-8">Checkout</h1>
      <div className="soft-pill inline-flex gap-1 mb-10 p-1.5">
        {['Contact & Address', 'Payment', 'Confirmation'].map((s, i) => (
          <span
            key={s}
            className={`font-body text-[11.5px] tracking-wide uppercase font-bold px-4 py-2.5 rounded-full ${
              step === i + 1 ? 'bg-espresso text-linen' : 'text-warmgray/60'
            }`}
          >
            {i + 1}. {s}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="soft-panel p-7 md:p-8">
          {step === 1 && (
            <div className="grid gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" value={form.name} onChange={(v) => update('name', v)} error={errors.name} />
                <Field label="Phone" value={form.phone} onChange={(v) => update('phone', v)} error={errors.phone} type="tel" />
              </div>
              <Field label="Email" value={form.email} onChange={(v) => update('email', v)} error={errors.email} type="email" />
              <Field label="Address" value={form.address} onChange={(v) => update('address', v)} error={errors.address} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="City" value={form.city} onChange={(v) => update('city', v)} error={errors.city} />
                <Field label="Country" value="Egypt" disabled />
              </div>
              <Button
                style={{ marginTop: 8, width: 'fit-content' }}
                onClick={() => validateStep1() && setStep(2)}
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
                    className={`flex items-center gap-3.5 rounded-2xl px-5 py-4.5 cursor-pointer transition-all ${
                      form.payment === p.id ? 'bg-espresso/6 ring-2 ring-espresso' : 'soft-pill'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={form.payment === p.id}
                      onChange={() => update('payment', p.id)}
                    />
                    <div>
                      <div className="font-body text-[14.5px] text-espresso font-bold">{p.label}</div>
                      <div className="font-body text-[12.5px] text-warmgray">{p.d}</div>
                    </div>
                  </label>
                ))}
              </div>
              {submitError && (
                <div className="font-body text-sm text-red-700 mb-4 font-medium">{submitError}</div>
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

        <div className="soft-panel p-7 self-start">
          <div className="font-body text-[13px] tracking-wide uppercase text-espresso font-bold mb-5">Order Summary</div>
          {cart.map((item, i) => (
            <div key={i} className="flex justify-between mb-3 font-body text-[13.5px] text-warmgray">
              <span>
                {item.product.name} × {item.qty}
              </span>
              <span className="font-semibold text-espresso">{fmt(item.product.price * item.qty)}</span>
            </div>
          ))}

          <div className="border-t border-espresso/8 mt-4 pt-4 mb-4">
            <div className="font-body text-[11px] tracking-wide uppercase text-warmgray font-bold mb-2">
              Coupon Code
            </div>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-sage/15 rounded-full px-4 py-2.5">
                <span className="font-body text-sm text-sage font-bold">{appliedCoupon.code} applied</span>
                <button onClick={removeCoupon} className="font-body text-xs text-sage underline font-semibold">
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => {
                    setCouponInput(e.target.value)
                    setCouponError(null)
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                  placeholder="Enter code"
                  className="flex-1 soft-pill px-4 py-2.5 font-body text-sm text-espresso outline-none min-w-0"
                />
                <button
                  onClick={applyCoupon}
                  disabled={couponChecking || !couponInput.trim()}
                  className="soft-pill px-4 py-2.5 font-body text-xs uppercase tracking-wide font-bold text-espresso disabled:opacity-50 shrink-0"
                >
                  {couponChecking ? '…' : 'Apply'}
                </button>
              </div>
            )}
            {couponError && <div className="font-body text-xs text-red-600 font-medium mt-2">{couponError}</div>}
          </div>

          <div className="border-t border-espresso/8 pt-4">
            <div className="flex justify-between font-body text-[13.5px] text-warmgray mb-2">
              <span>Subtotal</span>
              <span>{fmt(subtotal)}</span>
            </div>
            <div className="flex justify-between font-body text-[13.5px] text-warmgray mb-2">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : fmt(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between font-body text-[13.5px] text-sage font-semibold mb-3">
                <span>Discount</span>
                <span>−{fmt(discount)}</span>
              </div>
            )}
            <div className="flex justify-between font-display text-[20px] text-espresso font-extrabold mt-1">
              <span>Total</span>
              <span>{fmt(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
