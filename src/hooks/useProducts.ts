'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, ProductFilters } from '@/types'

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [JSON.stringify(filters)])

  async function fetchProducts() {
    try {
      setLoading(true)
      let query = supabase
        .from('products')
        .select('*, category:categories(*)')

      if (filters?.minPrice) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters?.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters?.size) {
        query = query.contains('sizes', [filters.size])
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.color) {
        query = query.eq('color', filters.color)
      }

      switch (filters?.sortBy) {
        case 'price_asc':
          query = query.order('price', { ascending: true })
          break
        case 'price_desc':
          query = query.order('price', { ascending: false })
          break
        case 'name':
          query = query.order('name')
          break
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false })
          break
      }

      const { data, error } = await query

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetchProduct()
  }, [slug])

  async function fetchProduct() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', slug)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتج')
    } finally {
      setLoading(false)
    }
  }

  return { product, loading, error }
}

export function useBestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBestSellers()
  }, [])

  async function fetchBestSellers() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('is_best_seller', true)
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error
      setProducts(data || [])
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  return { products, loading }
}

export function useCategoryProducts(slug: string) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    fetchProducts()
  }, [slug])

  async function fetchProducts() {
    try {
      setLoading(true)
      const { data: category, error: catError } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .single()

      if (catError) throw catError
      if (!category) throw new Error('القسم غير موجود')

      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ في تحميل المنتجات')
    } finally {
      setLoading(false)
    }
  }

  return { products, loading, error, refetch: fetchProducts }
}
