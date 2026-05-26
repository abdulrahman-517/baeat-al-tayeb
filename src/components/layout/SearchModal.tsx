'use client'

import { useRouter } from 'next/navigation'
import { Search, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSearch } from '@/hooks/useSearch'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter()
  const { query, setQuery, results, loading } = useSearch()

  function handleSelectProduct(id: string) {
    onClose()
    router.push(`/products/${id}`)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex items-center gap-3 p-4 border-b border-stone-100">
              <Search className="w-5 h-5 text-stone-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن عباية، عود، بخور..."
                className="flex-1 bg-transparent text-stone-900 placeholder:text-stone-400 focus:outline-none text-lg"
              />
              {query && (
                <button onClick={() => setQuery('')} className="p-1 hover:bg-stone-100 rounded-full">
                  <X className="w-4 h-4 text-stone-400" />
                </button>
              )}
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-amber-800 animate-spin" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="w-full flex items-center gap-4 p-3 hover:bg-stone-50 rounded-xl transition-colors text-right"
                    >
                      <div className="w-16 h-16 bg-stone-100 rounded-xl overflow-hidden shrink-0">
                        {product.images_urls?.[0] && (
                          <img
                            src={product.images_urls[0]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 truncate">{product.name}</p>
                        <p className="text-sm text-amber-800 font-medium">
                          {product.price.toLocaleString()} ريال
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="text-center py-12 text-stone-400">
                  لا توجد نتائج للبحث &ldquo;{query}&rdquo;
                </div>
              ) : (
                <div className="text-center py-12 text-stone-400">
                  ابدأ بالبحث عن المنتجات...
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
