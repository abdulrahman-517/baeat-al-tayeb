'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Sparkles, ShoppingBag, BadgeCheck, Truck, MessageCircle } from 'lucide-react'
import { ProductCard } from '@/components/product/ProductCard'
import { useBestSellers } from '@/hooks/useProducts'

const categories = [
  {
    title: 'الملابس',
    slug: '/categories/clothing',
    description: 'عبايات، فساتين، أطقم نسائية',
    image: 'https://images.unsplash.com/photo-1766934587214-86e21b3ae093?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'البخور',
    slug: '/categories/incense',
    description: 'عود، بخور، مباخر فاخرة',
    image: 'https://images.unsplash.com/photo-1509726360306-3f44543aea4c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'العطور',
    slug: '/categories/perfumes',
    description: 'دهن عود، مسك، عطور شرقية',
    image: 'https://images.unsplash.com/photo-1757313251539-4a49688994d2?auto=format&fit=crop&w=800&q=80',
  },
]

export default function HomePage() {
  const { products: bestSellers, loading } = useBestSellers()

  const heroImages = [
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1563170351-be82bc888aa4?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1612902456551-333ac5afa26e?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1766934587214-86e21b3ae093?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1509726360306-3f44543aea4c?auto=format&fit=crop&w=1920&q=80',
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentIndex]}
                alt=""
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-br from-stone-900/80 via-stone-900/60 to-amber-950/80" />
        </div>

        {/* إطار ذهبي زخرفي */}
        <div className="absolute inset-x-10 top-10 bottom-10 border-x border-amber-500/20 pointer-events-none" />
        <div className="absolute inset-y-10 left-10 right-10 border-y border-amber-500/20 pointer-events-none" />
        <div className="absolute top-10 right-10 w-20 h-0.5 bg-gradient-to-l from-amber-500/60 to-transparent" />
        <div className="absolute top-10 right-10 w-0.5 h-20 bg-gradient-to-b from-amber-500/60 to-transparent" />
        <div className="absolute top-10 left-10 w-20 h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
        <div className="absolute top-10 left-10 w-0.5 h-20 bg-gradient-to-b from-amber-500/60 to-transparent" />
        <div className="absolute bottom-10 right-10 w-20 h-0.5 bg-gradient-to-l from-amber-500/60 to-transparent" />
        <div className="absolute bottom-10 right-10 w-0.5 h-20 bg-gradient-to-t from-amber-500/60 to-transparent" />
        <div className="absolute bottom-10 left-10 w-20 h-0.5 bg-gradient-to-r from-amber-500/60 to-transparent" />
        <div className="absolute bottom-10 left-10 w-0.5 h-20 bg-gradient-to-t from-amber-500/60 to-transparent" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* العنوان الفرعي */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-amber-400/80 text-base md:text-lg font-light tracking-[0.3em] mb-6"
            >
              مُتَجَرٌ نِسَائِيٌ فَاخِرٌ
            </motion.p>

            {/* الشعار الكبير */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 leading-tight"
            >
              بائعة
              <span className="text-amber-400">
                {" "}الطيب
              </span>
            </motion.h1>

            {/* الوصف */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-lg md:text-xl text-stone-400 font-light mb-12"
            >
              اكتشفي عالم الفخامة
            </motion.p>

            {/* الأزرار */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="flex items-center justify-center gap-4"
            >
              <Link
                href="/categories/clothing"
                className="bg-amber-600 text-white px-10 py-4 text-base font-medium tracking-wider hover:bg-amber-500 transition-all duration-300"
              >
                تسوق الآن
              </Link>
              <Link
                href="/about"
                className="border border-stone-600 text-stone-300 px-8 py-4 text-base font-medium tracking-wider hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300"
              >
                من نحن
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">أقسام المتجر</h2>
          <p className="text-stone-500 text-lg">تصفحي مجموعتنا</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={category.slug}
                className="group relative block h-80 rounded-2xl overflow-hidden bg-stone-800"
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20 group-hover:opacity-90 transition-opacity" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-3xl font-bold mb-2">{category.title}</h3>
                  <p className="text-white/80 mb-4">{category.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-white/50 pb-1 group-hover:border-white transition-colors">
                    تسوقي الآن
                    <ArrowLeft className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-2">الأكثر مبيعاً</h2>
              <p className="text-stone-500">أكثر المنتجات طلباً لدى عميلاتنا</p>
            </div>
            <Link
              href="/categories/clothing"
              className="hidden sm:flex items-center gap-2 text-amber-800 hover:text-amber-700 font-medium transition-colors"
            >
              عرض الكل
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl">
              <ShoppingBag className="w-16 h-16 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-400 text-lg">لا توجد منتجات مضافة بعد</p>
              <p className="text-stone-300 text-sm mt-1">يمكنك إضافة منتجات من لوحة التحكم</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: BadgeCheck,
              title: 'منتجات أصلية',
              desc: 'نضمن لك أفضل المنتجات الشرقية الفاخرة',
            },
            {
              icon: Truck,
              title: 'توصيل سريع',
              desc: 'نوصل طلبك لباب البيت بسرعة وأمان',
            },
            {
              icon: MessageCircle,
              title: 'دعم عبر واتساب',
              desc: 'تواصل معنا مباشرة لأي استفسار',
            },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-white rounded-2xl border border-stone-100 hover:shadow-lg hover:border-amber-800/20 transition-all duration-300"
            >
              <feature.icon className="w-10 h-10 mx-auto mb-4 text-stone-600" />
              <h3 className="font-bold text-stone-900 text-lg mb-2">{feature.title}</h3>
              <p className="text-stone-500 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
