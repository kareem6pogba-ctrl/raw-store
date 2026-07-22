import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { ColorVariant, Product } from '../types'

interface VariantRow {
  id: string
  product_id: string
  color_name: string
  main_image: string | null
  hover_image: string | null
  video_url: string | null
  sort_order: number
  product_variant_gallery_images: { image_url: string; sort_order: number }[]
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const [productsRes, variantsRes] = await Promise.all([
        supabase
          .from('products')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('product_color_variants')
          .select('*, product_variant_gallery_images(image_url, sort_order)')
          .order('sort_order', { ascending: true }),
      ])

      if (!active) return

      if (productsRes.error) {
        setError(productsRes.error.message)
        setLoading(false)
        return
      }

      const variantsByProduct = new Map<string, ColorVariant[]>()
      for (const row of (variantsRes.data ?? []) as VariantRow[]) {
        const gallery = [...(row.product_variant_gallery_images ?? [])]
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((g) => g.image_url)
        const variant: ColorVariant = {
          id: row.id,
          color_name: row.color_name,
          main_image: row.main_image,
          hover_image: row.hover_image,
          video_url: row.video_url,
          gallery,
        }
        const list = variantsByProduct.get(row.product_id) ?? []
        list.push(variant)
        variantsByProduct.set(row.product_id, list)
      }

      const withVariants = ((productsRes.data ?? []) as Product[]).map((p) => ({
        ...p,
        variants: variantsByProduct.get(p.id) ?? [],
      }))

      setProducts(withVariants)
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return { products, loading, error }
}
