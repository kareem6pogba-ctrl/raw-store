import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/Button'

export function AdminSettings() {
  const [threshold, setThreshold] = useState('1500')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data, error: err } = await supabase
        .from('store_settings')
        .select('free_shipping_threshold')
        .eq('id', 1)
        .single()
      if (!err && data) setThreshold(String(data.free_shipping_threshold))
      setLoading(false)
    }
    load()
  }, [])

  const save = async () => {
    setSaving(true)
    setError(null)
    setSaved(false)
    const value = Number(threshold)
    if (Number.isNaN(value) || value < 0) {
      setError('Enter a valid amount.')
      setSaving(false)
      return
    }
    const { error: err } = await supabase
      .from('store_settings')
      .update({ free_shipping_threshold: value, updated_at: new Date().toISOString() })
      .eq('id', 1)
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-mega text-espresso text-[32px] mb-2">Settings</h1>
      <p className="font-body text-sm text-warmgray mb-8">Store-wide configuration for the live site.</p>

      <div className="bg-linen/60 rounded-3xl p-7 max-w-[480px]">
        <div className="font-body text-xs tracking-wide uppercase text-espresso font-bold mb-2">
          Free Shipping Threshold
        </div>
        <p className="font-body text-xs text-warmgray mb-4">
          Orders at or above this amount (EGP) ship free. Shown site-wide automatically.
        </p>
        {loading ? (
          <div className="font-body text-sm text-warmgray">Loading…</div>
        ) : (
          <>
            <div className="flex gap-3 items-center">
              <div className="flex-1 flex items-center soft-pill px-4">
                <span className="font-body text-sm text-warmgray font-semibold mr-1">EGP</span>
                <input
                  type="number"
                  min="0"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="flex-1 bg-transparent py-3 font-body text-sm text-espresso outline-none"
                />
              </div>
              <Button small onClick={save} disabled={saving}>
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save'}
              </Button>
            </div>
            {error && <div className="font-body text-xs text-red-600 font-medium mt-2">{error}</div>}
          </>
        )}
      </div>
    </div>
  )
}
