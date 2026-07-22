import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ImageUploadField } from './ImageUploadField'
import type { ColorOption } from '../../types'

interface VariantState {
  id?: string
  main_image: string
  hover_image: string
  gallery: string[]
}

export function ColorVariantManager({ productId, colors }: { productId: string; colors: ColorOption[] }) {
  const [variants, setVariants] = useState<Record<string, VariantState>>({})
  const [loading, setLoading] = useState(true)
  const [savingColor, setSavingColor] = useState<string | null>(null)
  const [savedColor, setSavedColor] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('product_color_variants')
        .select('*, product_variant_gallery_images(image_url, sort_order)')
        .eq('product_id', productId)

      const next: Record<string, VariantState> = {}
      for (const c of colors) {
        const row = (data ?? []).find((r) => r.color_name === c.name)
        next[c.name] = {
          id: row?.id,
          main_image: row?.main_image ?? '',
          hover_image: row?.hover_image ?? '',
          gallery: row
            ? [...(row.product_variant_gallery_images ?? [])]
                .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
                .map((g: { image_url: string }) => g.image_url)
            : [],
        }
      }
      setVariants(next)
      setLoading(false)
    }
    load()
  }, [productId, colors])

  const update = (colorName: string, patch: Partial<VariantState>) => {
    setVariants((v) => ({ ...v, [colorName]: { ...v[colorName], ...patch } }))
  }

  const addGalleryImage = (colorName: string, url: string) => {
    setVariants((v) => ({
      ...v,
      [colorName]: { ...v[colorName], gallery: [...v[colorName].gallery, url] },
    }))
  }

  const removeGalleryImage = (colorName: string, idx: number) => {
    setVariants((v) => ({
      ...v,
      [colorName]: { ...v[colorName], gallery: v[colorName].gallery.filter((_, i) => i !== idx) },
    }))
  }

  const moveGalleryImage = (colorName: string, idx: number, dir: -1 | 1) => {
    setVariants((v) => {
      const gallery = [...v[colorName].gallery]
      const target = idx + dir
      if (target < 0 || target >= gallery.length) return v
      ;[gallery[idx], gallery[target]] = [gallery[target], gallery[idx]]
      return { ...v, [colorName]: { ...v[colorName], gallery } }
    })
  }

  const saveColor = async (colorName: string) => {
    setSavingColor(colorName)
    const state = variants[colorName]

    const { data: upserted, error: upsertError } = await supabase
      .from('product_color_variants')
      .upsert(
        {
          id: state.id,
          product_id: productId,
          color_name: colorName,
          main_image: state.main_image || null,
          hover_image: state.hover_image || null,
        },
        { onConflict: 'product_id,color_name' }
      )
      .select()
      .single()

    if (upsertError || !upserted) {
      setSavingColor(null)
      return
    }

    await supabase.from('product_variant_gallery_images').delete().eq('variant_id', upserted.id)
    if (state.gallery.length > 0) {
      await supabase.from('product_variant_gallery_images').insert(
        state.gallery.map((image_url, i) => ({ variant_id: upserted.id, image_url, sort_order: i }))
      )
    }

    update(colorName, { id: upserted.id })
    setSavingColor(null)
    setSavedColor(colorName)
    setTimeout(() => setSavedColor(null), 2000)
  }

  if (colors.length === 0) {
    return (
      <div className="font-body text-sm text-warmgray bg-linen/60 rounded-2xl p-5">
        Add colors above first, then per-color images will appear here.
      </div>
    )
  }

  if (loading) {
    return <div className="font-body text-sm text-warmgray">Loading variant images…</div>
  }

  return (
    <div className="grid gap-5">
      {colors.map((c) => {
        const state = variants[c.name]
        if (!state) return null
        return (
          <div key={c.name} className="bg-linen/60 rounded-2xl p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span
                className="w-5 h-5 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(58,36,24,0.15)]"
                style={{ background: c.hex }}
              />
              <span className="font-body text-sm text-espresso font-bold">{c.name}</span>
            </div>

            <div className="grid gap-4">
              <ImageUploadField
                label="Main Image"
                value={state.main_image}
                onChange={(v) => update(c.name, { main_image: v })}
              />
              <ImageUploadField
                label="Hover Image"
                value={state.hover_image}
                onChange={(v) => update(c.name, { hover_image: v })}
              />

              <div>
                <div className="font-body text-[11.5px] tracking-wide uppercase text-warmgray font-bold mb-2">
                  Additional Gallery Images
                </div>
                {state.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-3">
                    {state.gallery.map((url, idx) => (
                      <div key={url + idx} className="relative w-20 h-24 rounded-xl overflow-hidden bg-white shadow-[0_10px_24px_-16px_rgba(58,36,24,0.15)]">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 flex justify-between bg-espresso/70 px-1 py-0.5">
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(c.name, idx, -1)}
                            disabled={idx === 0}
                            className="text-linen text-xs disabled:opacity-30"
                            aria-label="Move earlier"
                          >
                            ←
                          </button>
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(c.name, idx)}
                            className="text-linen text-xs"
                            aria-label="Remove image"
                          >
                            ✕
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGalleryImage(c.name, idx, 1)}
                            disabled={idx === state.gallery.length - 1}
                            className="text-linen text-xs disabled:opacity-30"
                            aria-label="Move later"
                          >
                            →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <ImageUploadField
                  label="Add another image"
                  value=""
                  onChange={(v) => v && addGalleryImage(c.name, v)}
                />
              </div>

              <button
                type="button"
                onClick={() => saveColor(c.name)}
                disabled={savingColor === c.name}
                className="soft-pill w-fit px-5 py-2.5 font-body text-xs uppercase tracking-wide font-bold text-espresso disabled:opacity-50"
              >
                {savingColor === c.name ? 'Saving…' : savedColor === c.name ? 'Saved ✓' : `Save ${c.name} Images`}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
