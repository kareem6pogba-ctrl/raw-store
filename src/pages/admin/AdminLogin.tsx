import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../lib/AuthContext'
import { Button } from '../../components/Button'

export function AdminLogin() {
  const { session, signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  if (session) return <Navigate to="/admin" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const err = await signIn(email, password)
    setLoading(false)
    if (err) setError(err)
    else navigate('/admin')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'linear-gradient(180deg, #FAF6EF 0%, #EFE7D8 100%)' }}
    >
      <div className="w-full max-w-[400px] soft-panel p-10">
        <div className="font-display font-black text-[32px] text-espresso text-center mb-1">RAWW</div>
        <div className="font-body text-xs tracking-widest uppercase text-sage text-center font-bold mb-10">
          Admin
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="block">
            <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray font-bold mb-2">Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full soft-pill px-4 py-3.5 font-body text-sm text-espresso outline-none"
            />
          </label>
          <label className="block">
            <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray font-bold mb-2">Password</div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full soft-pill px-4 py-3.5 font-body text-sm text-espresso outline-none"
            />
          </label>
          {error && <div className="font-body text-sm text-red-700 font-medium">{error}</div>}
          <Button fullWidth disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
