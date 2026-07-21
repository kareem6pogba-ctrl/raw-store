import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

interface OrderRow {
  id: string
  order_number: string
  customer_name: string
  total: number
  status: string
  created_at: string
}

export function AdminDashboard() {
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [productCount, setProductCount] = useState(0)
  const [customerCount, setCustomerCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ordersRes, productsRes, customersRes] = await Promise.all([
        supabase.from('orders').select('id, order_number, customer_name, total, status, created_at').order('created_at', { ascending: false }),
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('email', { count: 'exact', head: true }),
      ])
      setOrders((ordersRes.data ?? []) as OrderRow[])
      setProductCount(productsRes.count ?? 0)
      setCustomerCount(customersRes.count ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  const revenue = orders.reduce((s, o) => s + Number(o.total), 0)
  const avgOrder = orders.length ? revenue / orders.length : 0

  const stats = [
    { label: 'Revenue', value: fmt(revenue) },
    { label: 'Orders', value: orders.length.toString() },
    { label: 'Avg. Order Value', value: fmt(Math.round(avgOrder)) },
    { label: 'Products Live', value: productCount.toString() },
    { label: 'Orders Placed By', value: `${customerCount} customers` },
  ]

  const statusColor: Record<string, string> = {
    pending: 'text-sage',
    confirmed: 'text-espresso',
    packed: 'text-espresso',
    shipped: 'text-espresso',
    delivered: 'text-green-700',
    cancelled: 'text-red-700',
    returned: 'text-red-700',
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-mega text-espresso text-[32px] mb-8">Dashboard</h1>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} className="bg-linen/60 rounded-3xl p-5">
                <div className="font-body text-[11px] tracking-wide uppercase text-warmgray font-bold mb-2">{s.label}</div>
                <div className="font-display text-2xl text-espresso font-extrabold">{s.value}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="font-body text-xs tracking-widest uppercase text-espresso font-bold">Recent Orders</div>
            <Link to="/admin/orders" className="font-body text-xs text-sage underline font-semibold">
              View All
            </Link>
          </div>
          <div className="bg-linen/60 rounded-3xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="p-6 font-body text-sm text-warmgray">No orders yet.</div>
            ) : (
              orders.slice(0, 8).map((o) => (
                <div key={o.id} className="flex items-center justify-between px-6 py-4 border-b border-espresso/8 last:border-0">
                  <div>
                    <div className="font-body text-sm text-espresso font-bold">#{o.order_number}</div>
                    <div className="font-body text-xs text-warmgray">{o.customer_name}</div>
                  </div>
                  <div className={`font-body text-xs uppercase tracking-wide font-bold ${statusColor[o.status] ?? 'text-espresso'}`}>
                    {o.status}
                  </div>
                  <div className="font-body text-sm text-espresso font-bold">{fmt(Number(o.total))}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
