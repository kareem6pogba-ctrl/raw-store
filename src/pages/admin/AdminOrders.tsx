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
    <div className="p-6 md:p-10">
      <h1 className="text-mega text-espresso text-[32px] mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['All', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`font-body text-[11.5px] tracking-wide uppercase font-bold px-4 py-2.5 rounded-full transition-colors ${
              filter === s ? 'bg-espresso text-linen' : 'bg-linen/60 text-espresso hover:bg-linen'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : (
        <div className="bg-linen/60 rounded-3xl overflow-hidden">
          {list.length === 0 && <div className="p-6 font-body text-sm text-warmgray">No orders match this filter.</div>}
          {list.map((o) => {
            const orderItems = items.filter((i) => i.order_id === o.id)
            const isOpen = expanded === o.id
            return (
              <div key={o.id} className="border-b border-espresso/8 last:border-0">
                <div
                  className="grid grid-cols-[1.3fr_1fr_1fr_0.8fr_0.9fr_40px] gap-4 px-6 py-4 items-center cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : o.id)}
                >
                  <div>
                    <div className="font-body text-sm text-espresso font-bold">#{o.order_number}</div>
                    <div className="font-body text-xs text-warmgray">{new Date(o.created_at).toLocaleDateString()}</div>
                  </div>
                  <div className="font-body text-sm text-espresso font-medium">{o.customer_name}</div>
                  <div className="font-body text-xs text-warmgray">{o.city}</div>
                  <div className="font-body text-sm text-espresso font-bold">{fmt(Number(o.total))}</div>
                  <select
                    value={o.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className="font-body text-xs uppercase tracking-wide font-bold rounded-full px-3 py-2 bg-white shadow-[0_4px_12px_-6px_rgba(58,36,24,0.15)]"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <span className="text-espresso text-center font-bold">{isOpen ? '−' : '+'}</span>
                </div>
                {isOpen && (
                  <div className="px-6 pb-5">
                    <div className="grid grid-cols-2 gap-6 mb-4 font-body text-xs text-warmgray bg-white rounded-2xl p-5">
                      <div>
                        <div className="text-espresso font-bold mb-1.5">Contact</div>
                        {o.email && <div>{o.email}</div>}
                        {o.phone && <div>{o.phone}</div>}
                      </div>
                      <div>
                        <div className="text-espresso font-bold mb-1.5">Delivery</div>
                        <div>{o.address}</div>
                        <div>{o.city}</div>
                      </div>
                      <div className="col-span-2 border-t border-espresso/8 pt-3 mt-1">
                        <div className="text-espresso font-bold mb-2">Items</div>
                        {orderItems.map((it) => (
                          <div key={it.id} className="flex justify-between mb-1.5">
                            <span>
                              {it.product_name} · {it.color} · {it.size} × {it.quantity}
                            </span>
                            <span className="font-semibold text-espresso">{fmt(it.unit_price * it.quantity)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between text-espresso mt-3 pt-3 border-t border-espresso/8 font-semibold">
                          <span>Payment: {o.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</span>
                          <span>Subtotal {fmt(Number(o.subtotal))} + Shipping {fmt(Number(o.shipping))}</span>
                        </div>
                      </div>
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
