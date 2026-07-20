import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

interface OrderRow {
  customer_name: string
  email: string | null
  phone: string | null
  city: string | null
  total: number
  created_at: string
}

interface CustomerSummary {
  name: string
  email: string
  phone: string
  city: string
  orderCount: number
  totalSpent: number
  lastOrder: string
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('customer_name, email, phone, city, total, created_at')
        .order('created_at', { ascending: false })

      const rows = (data ?? []) as OrderRow[]
      const byEmail = new Map<string, CustomerSummary>()

      for (const r of rows) {
        const key = (r.email || r.customer_name).toLowerCase()
        const existing = byEmail.get(key)
        if (existing) {
          existing.orderCount += 1
          existing.totalSpent += Number(r.total)
        } else {
          byEmail.set(key, {
            name: r.customer_name,
            email: r.email ?? '—',
            phone: r.phone ?? '—',
            city: r.city ?? '—',
            orderCount: 1,
            totalSpent: Number(r.total),
            lastOrder: r.created_at,
          })
        }
      }

      setCustomers(Array.from(byEmail.values()).sort((a, b) => b.totalSpent - a.totalSpent))
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="px-10 py-10">
      <h1 className="font-display text-[32px] text-espresso font-normal mb-2">Customers</h1>
      <p className="font-body text-sm text-warmgray mb-8">
        Derived automatically from order history — no separate signup required.
      </p>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : customers.length === 0 ? (
        <div className="bg-white p-6 font-body text-sm text-warmgray">No customers yet.</div>
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr_1fr] gap-4 px-6 py-3 border-b border-espresso/10 font-body text-[11px] tracking-wide uppercase text-warmgray">
            <span>Name</span>
            <span>Email</span>
            <span>Phone</span>
            <span>City</span>
            <span>Orders</span>
            <span>Total Spent</span>
          </div>
          {customers.map((c) => (
            <div
              key={c.email + c.name}
              className="grid grid-cols-[1.4fr_1.4fr_1fr_0.8fr_0.9fr_1fr] gap-4 px-6 py-3.5 border-b border-espresso/10 items-center"
            >
              <span className="font-body text-sm text-espresso">{c.name}</span>
              <span className="font-body text-sm text-warmgray truncate">{c.email}</span>
              <span className="font-body text-sm text-warmgray">{c.phone}</span>
              <span className="font-body text-sm text-warmgray">{c.city}</span>
              <span className="font-body text-sm text-warmgray">{c.orderCount}</span>
              <span className="font-body text-sm text-espresso">{fmt(c.totalSpent)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
