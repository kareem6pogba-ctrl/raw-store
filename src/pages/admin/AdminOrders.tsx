import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`
const STATUSES = ['pending', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned']

interface OrderRow {
  id: string
  order_number: string
  customer_name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  total: number
  subtotal: number
  shipping: number
  payment_method: string
  status: string
  created_at: string
}

interface OrderItemRow {
  id: string
  order_id: string
  product_name: string
  color: string | null
  size: string | null
  quantity: number
  unit_price: number
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [items, setItems] = useState<OrderItemRow[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('All')

  const load = async () => {
    setLoading(true)
    const [ordersRes, itemsRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('order_items').select('*'),
    ])
    setOrders((ordersRes.data ?? []) as OrderRow[])
    setItems((itemsRes.data ?? []) as OrderItemRow[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)))
  }

  const list = filter === 'All' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[32px] text-espresso font-normal mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-[11.5px] tracking-wide uppercase px-3.5 py-2 border ${
              filter === s ? 'bg-espresso text-linen border-espresso' : 'border-espresso/15 text-espresso'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : (
        <div className="bg-white">
          {list.length === 0 && <div className="p-6 font-body text-sm text-warmgray">No orders match this filter.</div>}
          {list.map((o) => {
            const orderItems = items.filter((i) => i.order_id === o.id)
            const isOpen = expanded === o.id
            return (
              <div key={o.id} className="border-b border-espresso/10">
                <div
                  className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr_0.9fr_40px] gap-4 px-6 py-4 items-center cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                >
                  <div>
                    <div className="font-body text-sm text-espresso font-medium">#{o.order_number}</div>
                    <div className="font-body text-xs text-warmgray">{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="font-body text-sm text-espresso">{o.customer_name}</div>
                  <div className="font-body text-xs text-warmgray">{o.city}</div>
                  <div className="font-body text-sm text-espresso">{fmt(Number(o.total))}</div>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="font-body text-xs uppercase tracking-wide border border-espresso/15 px-2 py-1.5 bg-white"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="text-espresso text-center">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="px-6 pb-5 bg-linen/40">
                    <div className="grid grid-cols-2 gap-6 mb-4 font-body text-xs text-warmgray">
                      <div>
                        <div className="text-espresso mb-1">Contact</div>
                        {o.email && <div>{o.email}</div>}
                        {o.phone && <div>{o.phone}</div>}
                      </div>
                      <div>
                        <div className="text-espresso mb-1">Delivery</div>
                        <div>{o.address}</div>
                        <div>{o.city}</div>
                      </div>
                    </div>
                    <div className="text-espresso font-body text-xs mb-2">Items</div>
                    {orderItems.map((it) => (
                      <div key={it.id} className="flex justify-between font-body text-xs text-warmgray mb-1.5">
                        <span>
                          {it.product_name} · {it.color} · {it.size} × {it.quantity}
                        </span>
                        <span>{fmt(it.unit_price * it.quantity)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-body text-xs text-espresso mt-3 pt-3 border-t border-espresso/10">
                      <span>Payment: {o.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                      <span>Subtotal {fmt(Number(o.subtotal))} + Shipping {fmt(Number(o.shipping))}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
