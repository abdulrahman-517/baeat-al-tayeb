'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ShoppingBag, Heart, Share2, ChevronRight, ChevronLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/store'
import { useProduct } from '@/hooks/useProducts'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const { product, loading, error } = useProduct(slug)
  const addItem = useCartStore((state) => state.addItem)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isAdded, setIsAdded] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-800/20 border-t-amber-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">جاري تحميل المنتج...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">عذراً</p>
          <p className="text-stone-400">{error || 'المنتج غير موجود'}</p>
        </div>
      </div>
    )
  }

  function handleAddToCart() {
    if (!product) return
    addItem(product, quantity, selectedSize || product.sizes?.[0] || '')
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  function handleBuyNow() {
    if (!product) return
    const items = [{ id: product.id, product, quantity, selectedSize: selectedSize || product.sizes?.[0] || '' }]
    const total = product.price * quantity
    const message = generateWhatsAppMessage(items, total, {
      name: '',
      city: '',
      delivery_method: '',
    })
    openWhatsApp(message)
  }

  const sizes = product.sizes || []
  const images = product.images_urls?.length ? product.images_urls : []

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="relative">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-[4/5] bg-stone-50 rounded-3xl overflow-hidden"
          >
            {images.length > 0 ? (
              <img
                src={images[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <ShoppingBag className="w-20 h-20" />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i === 0 ? images.length - 1 : i - 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronRight className="w-5 h-5 text-stone-700" />
                </button>
                <button
                  onClick={() => setCurrentImageIndex((i) => (i === images.length - 1 ? 0 : i + 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5 text-stone-700" />
                </button>
              </>
            )}

            {/* Discount Badge */}
            {product.original_price && product.original_price > product.price && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                -{Math.round((1 - product.price / product.original_price) * 100)}%
              </div>
            )}
          </motion.div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-colors ${
                    index === currentImageIndex ? 'border-amber-800' : 'border-transparent hover:border-stone-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-sm text-amber-800 font-medium mb-2">
              {product.category.name}
            </span>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-stone-200'}`}
                />
              ))}
            </div>
            <span className="text-sm text-stone-400">({product.reviews_count || 0} تقييم)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl font-bold text-amber-800">
              {product.price.toLocaleString()} ريال
            </span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-lg text-stone-400 line-through">
                {product.original_price.toLocaleString()} ريال
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-stone-600 leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-stone-900 mb-3">
                المقاس: <span className="text-amber-800">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-amber-800 text-white border-amber-800 shadow-lg shadow-amber-900/20'
                        : 'border-stone-200 text-stone-600 hover:border-amber-800 hover:text-amber-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <h3 className="font-semibold text-stone-900 mb-3">الكمية</h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-12 h-12 border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-50 transition-colors text-lg"
              >
                -
              </button>
              <span className="w-16 text-center text-lg font-medium text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock_quantity || 99, q + 1))}
                className="w-12 h-12 border border-stone-200 rounded-xl flex items-center justify-center hover:bg-stone-50 transition-colors text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {isAdded ? 'تمت الإضافة ✓' : 'أضف للسلة'}
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={handleBuyNow}
            >
              <ShoppingBag className="w-5 h-5" />
              شراء عبر واتساب
            </Button>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-4 mb-8">
            <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-500 transition-colors">
              <Heart className="w-4 h-4" />
              أضف للمفضلة
            </button>
            <button className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-800 transition-colors">
              <Share2 className="w-4 h-4" />
              مشاركة
            </button>
          </div>

          {/* Features */}
          <div className="border-t border-stone-100 pt-6 space-y-4">
            {[
              { icon: Truck, text: 'توصيل سريع لجميع المدن' },
              { icon: Shield, text: 'منتجات أصلية 100%' },
              { icon: RefreshCw, text: 'سياسة استرجاع مرنة' },
            ].map((feature) => (
              <div key={feature.text} className="flex items-center gap-3 text-sm text-stone-600">
                <feature.icon className="w-5 h-5 text-amber-800 shrink-0" />
                {feature.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
