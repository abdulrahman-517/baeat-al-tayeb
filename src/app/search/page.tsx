'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { ProductCard } from '@/components/product/ProductCard'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchProducts()
    } else {
      setResults([])
    }
  }, [debouncedQuery])

  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    router.replace(`/search?${params.toString()}`, { scroll: false })
  }, [query])

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
        .limit(20)

      if (error) throw error
      setResults(data || [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن عباية، عود، بخور..."
            className="w-full pr-12 pl-12 py-4 bg-white border border-stone-200 rounded-2xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-1 hover:bg-stone-100 rounded-full"
            >
              <X className="w-4 h-4 text-stone-400" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-stone-200" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
                <div className="h-4 bg-stone-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : query.length >= 2 ? (
        results.length > 0 ? (
          <div>
            <p className="text-stone-500 mb-6">{results.length} نتيجة لـ &ldquo;{query}&rdquo;</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {results.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <p className="text-xl text-stone-400">لا توجد نتائج</p>
            <p className="text-stone-300 text-sm mt-1">جربي البحث بكلمات أخرى</p>
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <Search className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400">اكتبي كلمة للبحث عن المنتجات</p>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-800/20 border-t-amber-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">جاري التحميل...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
