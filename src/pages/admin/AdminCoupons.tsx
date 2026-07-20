import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/Button'
import { ConfirmModal } from '../../components/ConfirmModal'

interface Coupon {
  code: string
  type: 'percentage' | 'fixed'
  amount: number
  min_order: number
  usage_limit: number | null
  times_used: number
  expires_at: string | null
  active: boolean
}

const BLANK: Coupon = {
  code: '',
  type: 'percentage',
  amount: 10,
  min_order: 0,
  usage_limit: null,
  times_used: 0,
  expires_at: null,
  active: true,
}

export function AdminCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Coupon>(BLANK)
  const [pendingDelete, setPendingDelete] = useState<Coupon | null>(null)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('coupons').select('*').order('code')
    setCoupons((data ?? []) as Coupon[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const toggleActive = async (c: Coupon) => {
    await supabase.from('coupons').update({ active: !c.active }).eq('code', c.code)
    load()
  }

  const confirmRemove = async () => {
    if (!pendingDelete) return
    await supabase.from('coupons').delete().eq('code', pendingDelete.code)
    setPendingDelete(null)
    load()
  }

  const save = async () => {
    setError(null)
    if (!form.code.trim()) {
      setError('Code is required.')
      return
    }
    const { error: err } = await supabase.from('coupons').insert({
      code: form.code.trim().toUpperCase(),
      type: form.type,
      amount: form.amount,
      min_order: form.min_order,
      usage_limit: form.usage_limit,
      active: form.active,
    })
    if (err) {
      setError(err.message)
      return
    }
    setShowForm(false)
    setForm(BLANK)
    load()
  }

  return (
    <div className="px-10 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-[32px] text-espresso font-normal">Coupons</h1>
        <Button
          small
          onClick={() => {
            setForm(BLANK)
            setShowForm(true)
          }}
        >
          + Add Coupon
        </Button>
      </div>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-3 border-b border-espresso/10 font-body text-[11px] tracking-wide uppercase text-warmgray">
            <span>Code</span>
            <span>Discount</span>
            <span>Min. Order</span>
            <span>Used</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {coupons.map((c) => (
            <div key={c.code} className="grid grid-cols-[1fr_1fr_1fr_0.8fr_0.8fr_1fr] gap-4 px-6 py-3.5 border-b border-espresso/10 items-center">
              <span className="font-body text-sm text-espresso font-medium">{c.code}</span>
              <span className="font-body text-sm text-warmgray">
                {c.type === 'percentage' ? `${c.amount}%` : `EGP ${c.amount}`}
              </span>
              <span className="font-body text-sm text-warmgray">EGP {c.min_order}</span>
              <span className="font-body text-sm text-warmgray">
                {c.times_used}
                {c.usage_limit ? ` / ${c.usage_limit}` : ''}
              </span>
              <button
                onClick={() => toggleActive(c)}
                className={`font-body text-xs uppercase tracking-wide w-fit px-2.5 py-1 ${
                  c.active ? 'bg-sage/20 text-sage' : 'bg-warmgray/10 text-warmgray'
                }`}
              >
                {c.active ? 'Active' : 'Disabled'}
              </button>
              <button onClick={() => setPendingDelete(c)} className="font-body text-xs text-red-700 underline w-fit">
                Delete
              </button>
            </div>
          ))}
          {coupons.length === 0 && <div className="p-6 font-body text-sm text-warmgray">No coupons yet.</div>}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-espresso/40 z-50 flex items-center justify-center p-6">
          <div className="bg-linen w-full max-w-[440px] p-7">
            <h2 className="font-display text-xl text-espresso mb-6">Add Coupon</h2>
            <div className="grid gap-4">
              <label className="block">
                <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Code</div>
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
                />
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Type</div>
                  <select
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as Coupon['type'] }))}
                    className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
                  >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </label>
                <label className="block">
                  <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Amount</div>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm((f) => ({ ...f, amount: Number(e.target.value) }))}
                    className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
                  />
                </label>
              </div>
              <label className="block">
                <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">
                  Minimum Order (EGP)
                </div>
                <input
                  type="number"
                  value={form.min_order}
                  onChange={(e) => setForm((f) => ({ ...f, min_order: Number(e.target.value) }))}
                  className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
                />
              </label>
              {error && <div className="font-body text-sm text-red-700">{error}</div>}
            </div>
            <div className="flex gap-3.5 mt-8">
              <Button variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save Coupon</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!pendingDelete}
        title="Delete Coupon"
        message={`Delete "${pendingDelete?.code}"? Customers will no longer be able to use it.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmRemove}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}
