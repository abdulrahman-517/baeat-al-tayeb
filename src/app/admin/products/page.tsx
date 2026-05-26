'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/types'

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id)
      if (error) throw error
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setDeleteConfirm(null)
    } catch (err) {
      console.error(err)
    }
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-amber-800 text-white px-4 py-2.5 rounded-xl hover:bg-amber-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full pr-12 pl-4 py-3 bg-white border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
        />
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-stone-100 animate-pulse flex gap-4">
              <div className="w-16 h-16 bg-stone-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-stone-200 rounded w-1/3" />
                <div className="h-3 bg-stone-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 bg-stone-50 rounded-xl overflow-hidden shrink-0">
                {product.images_urls?.[0] ? (
                  <img src={product.images_urls[0]} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <Package className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">{product.name}</p>
                <div className="flex items-center gap-3 text-sm text-stone-500 mt-0.5">
                  <span>{product.category?.name}</span>
                  <span>{product.price.toLocaleString()} ريال</span>
                  <span>المخزون: {product.stock_quantity}</span>
                  {product.is_best_seller && (
                    <span className="text-amber-800 font-medium">✓ الأكثر مبيعاً</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/products/edit/${product.id}`}
                  className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4 text-stone-500" />
                </Link>
                {deleteConfirm === product.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 bg-red-500 text-white text-xs rounded-lg hover:bg-red-600"
                    >
                      تأكيد
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-stone-100 text-stone-600 text-xs rounded-lg hover:bg-stone-200"
                    >
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(product.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-400 text-lg">لا توجد منتجات</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 mt-4 text-amber-800 hover:text-amber-700 font-medium"
          >
            <Plus className="w-4 h-4" />
            إضافة أول منتج
          </Link>
        </div>
      )}
    </div>
  )
}
