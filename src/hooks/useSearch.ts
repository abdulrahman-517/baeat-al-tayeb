'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'
import { useDebounce } from './useDebounce'

export function useSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults([])
      setLoading(false)
      return
    }

    searchProducts()
  }, [debouncedQuery])

  async function searchProducts() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .or(
          `name.ilike.%${debouncedQuery}%,description.ilike.%${debouncedQuery}%,type.ilike.%${debouncedQuery}%`
        )
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setResults(data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return { query, setQuery, results, loading }
}
