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
    <div className="min-h-screen bg-linen flex items-center justify-center px-8">
      <div className="w-full max-w-[380px]">
        <div className="font-display text-[32px] text-espresso text-center mb-1">RAWW</div>
        <div className="font-body text-xs tracking-widest uppercase text-sage text-center mb-10">
          Admin
        </div>
        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="block">
            <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Email</div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none focus:border-espresso"
            />
          </label>
          <label className="block">
            <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Password</div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none focus:border-espresso"
            />
          </label>
          {error && <div className="font-body text-sm text-red-700">{error}</div>}
          <Button fullWidth disabled={loading}>
            {loading ? 'Signing In…' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  )
}
