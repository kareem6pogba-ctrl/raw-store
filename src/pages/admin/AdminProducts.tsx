import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/Button'
import type { Product } from '../../types'

const fmt = (n: number) => `EGP ${n.toLocaleString()}`

const BLANK: Omit<Product, 'is_published' | 'stock'> = {
  id: '',
  name: '',
  price: 0,
  category: 'Tops',
  description: '',
  fabric: '',
  colors: [{ name: 'Ivory', hex: '#F4EDE2' }],
  sizes: ['S', 'M', 'L'],
  image_main: '',
  image_alt: '',
  tag: null,
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Product | null>(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts((data ?? []) as Product[])
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const openNew = () => {
    setEditing({ ...BLANK, is_published: true, stock: 100 } as Product)
    setShowForm(true)
  }

  const openEdit = (p: Product) => {
    setEditing({ ...p })
    setShowForm(true)
  }

  const togglePublish = async (p: Product) => {
    await supabase.from('products').update({ is_published: !p.is_published }).eq('id', p.id)
    load()
  }

  const remove = async (p: Product) => {
    if (!confirm(`Delete "${p.name}"? This cannot be undone.`)) return
    await supabase.from('products').delete().eq('id', p.id)
    load()
  }

  const save = async (p: Product, isNew: boolean) => {
    const payload = {
      id: p.id.trim() || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      name: p.name,
      price: p.price,
      category: p.category,
      description: p.description,
      fabric: p.fabric,
      colors: p.colors,
      sizes: p.sizes,
      image_main: p.image_main,
      image_alt: p.image_alt,
      tag: p.tag || null,
      is_published: p.is_published,
      stock: p.stock,
    }
    if (isNew) {
      await supabase.from('products').insert(payload)
    } else {
      await supabase.from('products').update(payload).eq('id', p.id)
    }
    setShowForm(false)
    setEditing(null)
    load()
  }

  return (
    <div className="px-10 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-[32px] text-espresso font-normal">Products</h1>
        <Button small onClick={openNew}>
          + Add Product
        </Button>
      </div>

      {loading ? (
        <div className="font-body text-warmgray">Loading…</div>
      ) : (
        <div className="bg-white">
          <div className="grid grid-cols-[60px_1.6fr_0.7fr_0.7fr_0.7fr_1fr] gap-4 px-6 py-3 border-b border-espresso/10 font-body text-[11px] tracking-wide uppercase text-warmgray">
            <span></span>
            <span>Product</span>
            <span>Category</span>
            <span>Price</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          {products.map((p) => (
            <div key={p.id} className="grid grid-cols-[60px_1.6fr_0.7fr_0.7fr_0.7fr_1fr] gap-4 px-6 py-3.5 border-b border-espresso/10 items-center">
              <div className="w-11 h-14 bg-beige overflow-hidden">
                <img src={p.image_main ?? ''} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="font-body text-sm text-espresso">{p.name}</div>
              <div className="font-body text-sm text-warmgray">{p.category}</div>
              <div className="font-body text-sm text-warmgray">{fmt(p.price)}</div>
              <button
                onClick={() => togglePublish(p)}
                className={`font-body text-xs uppercase tracking-wide w-fit px-2.5 py-1 ${
                  p.is_published ? 'bg-sage/20 text-sage' : 'bg-warmgray/10 text-warmgray'
                }`}
              >
                {p.is_published ? 'Published' : 'Draft'}
              </button>
              <div className="flex gap-4">
                <button onClick={() => openEdit(p)} className="font-body text-xs text-espresso underline">
                  Edit
                </button>
                <button onClick={() => remove(p)} className="font-body text-xs text-red-700 underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && <div className="p-6 font-body text-sm text-warmgray">No products yet.</div>}
        </div>
      )}

      {showForm && editing && (
        <ProductForm
          product={editing}
          isNew={!products.some((p) => p.id === editing.id)}
          onCancel={() => {
            setShowForm(false)
            setEditing(null)
          }}
          onSave={save}
        />
      )}
    </div>
  )
}

function ProductForm({
  product,
  isNew,
  onCancel,
  onSave,
}: {
  product: Product
  isNew: boolean
  onCancel: () => void
  onSave: (p: Product, isNew: boolean) => void
}) {
  const [form, setForm] = useState<Product>(product)
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 bg-espresso/40 z-50 flex items-center justify-center p-6">
      <div className="bg-linen w-full max-w-[560px] max-h-[88vh] overflow-y-auto p-8">
        <h2 className="font-display text-2xl text-espresso mb-6">{isNew ? 'Add Product' : 'Edit Product'}</h2>
        <div className="grid gap-4">
          {isNew && (
            <TextField label="ID (leave blank to auto-generate from name)" value={form.id} onChange={(v) => set('id', v)} />
          )}
          <TextField label="Name" value={form.name} onChange={(v) => set('name', v)} />
          <div className="grid grid-cols-2 gap-4">
            <TextField label="Price (EGP)" type="number" value={String(form.price)} onChange={(v) => set('price', Number(v))} />
            <div>
              <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">Category</div>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
              >
                {['Tops', 'Bottoms', 'Sets'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <TextArea label="Description" value={form.description ?? ''} onChange={(v) => set('description', v)} />
          <TextField label="Fabric" value={form.fabric ?? ''} onChange={(v) => set('fabric', v)} />
          <TextField label="Main Image URL" value={form.image_main ?? ''} onChange={(v) => set('image_main', v)} />
          <TextField label="Alt Image URL" value={form.image_alt ?? ''} onChange={(v) => set('image_alt', v)} />
          <TextField label="Tag (e.g. New, Best Seller — optional)" value={form.tag ?? ''} onChange={(v) => set('tag', v)} />
          <TextField
            label="Sizes (comma-separated)"
            value={form.sizes.join(', ')}
            onChange={(v) => set('sizes', v.split(',').map((s) => s.trim()).filter(Boolean))}
          />
          <div>
            <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">
              Colors (name:hex, comma-separated — e.g. Ivory:#F4EDE2, Sage:#7A8471)
            </div>
            <input
              value={form.colors.map((c) => `${c.name}:${c.hex}`).join(', ')}
              onChange={(e) =>
                set(
                  'colors',
                  e.target.value
                    .split(',')
                    .map((pair) => {
                      const [name, hex] = pair.split(':').map((s) => s.trim())
                      return { name: name ?? '', hex: hex ?? '#000000' }
                    })
                    .filter((c) => c.name)
                )
              }
              className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
            />
          </div>
          <TextField label="Stock" type="number" value={String(form.stock)} onChange={(v) => set('stock', Number(v))} />
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => set('is_published', e.target.checked)}
            />
            <span className="font-body text-sm text-espresso">Published (visible on live site)</span>
          </label>
        </div>

        <div className="flex gap-3.5 mt-8">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onSave(form, isNew)}>Save Product</Button>
        </div>
      </div>
    </div>
  )
}

function TextField({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <label className="block">
      <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
      />
    </label>
  )
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray mb-2">{label}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full border border-espresso/15 bg-white px-3.5 py-3 font-body text-sm text-espresso outline-none"
      />
    </label>
  )
}
