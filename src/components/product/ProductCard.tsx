'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useCartStore } from '@/lib/store'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '')
  const [isAdded, setIsAdded] = useState(false)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1, selectedSize)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  function getDiscountPercentage(): number | null {
    if (!product.original_price) return null
    return Math.round((1 - product.price / product.original_price) * 100)
  }

  const discount = getDiscountPercentage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group"
    >
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative bg-stone-50 rounded-2xl overflow-hidden mb-3 aspect-[3/4]">
          {product.images_urls?.[0] ? (
            <img
              src={product.images_urls[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <ShoppingBag className="w-12 h-12" />
            </div>
          )}

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button className="absolute top-3 left-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
            <Heart className="w-4 h-4 text-stone-600" />
          </button>

          {/* Add to Cart Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-stone-900 py-2.5 rounded-xl font-medium text-sm hover:bg-amber-800 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              {isAdded ? 'تمت الإضافة ✓' : 'أضف للسلة'}
            </button>
          </div>

          {/* Size Options */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="absolute bottom-3 right-3 flex gap-1">
              {product.sizes.slice(0, 3).map((size) => (
                <span
                  key={size}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setSelectedSize(size)
                  }}
                  className={`px-2 py-0.5 text-xs rounded-md border ${
                    selectedSize === size
                      ? 'bg-amber-800 text-white border-amber-800'
                      : 'bg-white/90 text-stone-600 border-stone-200'
                  }`}
                >
                  {size}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-1">
          <h3 className="font-medium text-stone-900 text-sm leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          {product.category && (
            <p className="text-xs text-stone-400 mb-1.5">{product.category.name}</p>
          )}
          <div className="flex items-center gap-2">
            <span className="text-amber-800 font-bold text-sm">
              {product.price.toLocaleString()} ريال
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-stone-400 text-xs line-through">
                {product.original_price.toLocaleString()} ريال
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
