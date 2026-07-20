import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'

const NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
]

export function AdminLayout() {
  const { session, loading, signOut } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-linen flex items-center justify-center font-body text-warmgray">Loading…</div>
  }

  if (!session) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-linen flex">
      <aside className="w-[220px] bg-espresso text-linen flex flex-col shrink-0">
        <div className="px-7 py-8 font-display text-2xl">RAW</div>
        <nav className="flex-1 px-4">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `block px-4 py-3 mb-1 font-body text-sm rounded-sm ${
                  isActive ? 'bg-linen/10 text-linen' : 'text-linen/65 hover:text-linen'
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-7">
          <button
            onClick={() => signOut()}
            className="w-full text-left px-4 py-3 font-body text-sm text-linen/65 hover:text-linen"
          >
            Sign Out
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  )
}
