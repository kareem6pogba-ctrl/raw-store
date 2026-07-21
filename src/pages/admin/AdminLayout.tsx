import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/settings', label: 'Settings' },
]

export function AdminLayout() {
  const { session, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center font-body text-warmgray"
        style={{ background: 'linear-gradient(180deg, #FAF6EF 0%, #EFE7D8 100%)' }}
      >
        Loading…
      </div>
    )
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row p-4 gap-4"
      style={{ background: 'linear-gradient(180deg, #FAF6EF 0%, #EFE7D8 100%)' }}
    >
      <aside className="soft-panel-dark w-full md:w-[240px] shrink-0 flex md:flex-col p-4 md:p-6 items-center md:items-stretch gap-2">
        <div className="font-display font-black text-2xl text-linen px-2 md:mb-6 shrink-0">RAWW</div>
        <nav className="flex md:flex-col gap-1 flex-1 overflow-x-auto">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `block px-4 py-2.5 font-body text-sm font-semibold rounded-full whitespace-nowrap transition-colors ${
                  isActive ? 'bg-linen text-espresso' : 'text-linen/65 hover:text-linen hover:bg-white/5'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => signOut()}
          className="px-4 py-2.5 font-body text-sm font-semibold text-linen/65 hover:text-linen rounded-full hover:bg-white/5 transition-colors shrink-0 md:mt-2"
        >
          Sign Out
        </button>
      </aside>
      <main className="flex-1 min-w-0 soft-panel overflow-hidden">
        <Outlet />
      </main>
    </div>
  )
}
