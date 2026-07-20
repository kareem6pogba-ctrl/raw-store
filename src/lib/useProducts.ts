import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Product } from '../types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    async function load() {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      if (!active) return
      if (error) {
        setError(error.message)
      } else {
        setProducts((data ?? []) as Product[])
      }
      setLoading(false)
    }
    load()
    return () => {
      active = false
    }
  }, [])

  return { products, loading, error }
}
