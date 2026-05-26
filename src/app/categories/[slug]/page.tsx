'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { useCategoryProducts } from '@/hooks/useProducts'

const categoryNames: Record<string, string> = {
  clothing: 'الملابس',
  incense: 'البخور',
  perfumes: 'العطور',
}

const categoryDescriptions: Record<string, string> = {
  clothing: 'عبايات، فساتين، أطقم نسائية وشالات',
  incense: 'بخور عود، معمول، مباخر فاخرة',
  perfumes: 'دهن عود، مسك، عطور شرقية أصيلة',
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params.slug as string
  const { products, loading, error } = useCategoryProducts(slug)
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [sortBy, setSortBy] = useState<string>('newest')

  const filteredProducts = products
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter((p) => !selectedSize || p.sizes?.includes(selectedSize))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price_asc': return a.price - b.price
        case 'price_desc': return b.price - a.price
        case 'name': return a.name.localeCompare(b.name)
        default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">عذراً</p>
          <p className="text-stone-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section className="bg-gradient-to-l from-amber-900 to-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            {categoryNames[slug] || slug}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-amber-200 text-lg"
          >
            {categoryDescriptions[slug] || ''}
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            الفلاتر
            {showFilters && <X className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            >
              <option value="newest">الأحدث</option>
              <option value="price_asc">السعر: الأقل أولاً</option>
              <option value="price_desc">السعر: الأعلى أولاً</option>
              <option value="name">الاسم</option>
            </select>
            <span className="text-sm text-stone-400">
              {filteredProducts.length} منتج
            </span>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 shrink-0"
            >
              <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-6 sticky top-28">
                {/* Price Range */}
                <div>
                  <h4 className="font-semibold text-stone-900 mb-3">نطاق السعر</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-stone-500">من</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-stone-500">إلى</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Size Filter */}
                <div>
                  <h4 className="font-semibold text-stone-900 mb-3">المقاس</h4>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                          selectedSize === size
                            ? 'bg-amber-800 text-white border-amber-800'
                            : 'border-stone-200 text-stone-600 hover:border-amber-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => { setPriceRange([0, 100000]); setSelectedSize('') }}
                  className="w-full py-2 text-sm text-amber-800 hover:text-amber-700 font-medium transition-colors"
                >
                  مسح الفلاتر
                </button>
              </div>
            </motion.aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-xl text-stone-400 mb-2">لا توجد منتجات</p>
                <p className="text-stone-300">لم يتم العثور على منتجات في هذا القسم</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
