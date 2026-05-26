'use client'

import { motion } from 'framer-motion'
import { Sparkles, Heart, Award, Gem } from 'lucide-react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-4 bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611416456920-12c2c3b81ae8?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h1 className="text-4xl md:text-6xl font-bold mb-4">من نحن</h1>
            <p className="text-xl text-amber-200/80 max-w-2xl mx-auto leading-relaxed">
              في &ldquo;بائعة الطيب&rdquo; نؤمن أن الأناقة ليست مجرد مظهر، بل إحساس يرافقك في كل لحظة.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg text-stone-600 leading-relaxed mb-12">
            اخترنا لكم بعناية منتجات تجمع بين الفخامة الشرقية والذوق العصري، من الملابس الراقية إلى أفخر أنواع البخور والعطور.
            كل قطعة في متجرنا تحكي قصة، وكل عطر يأخذك في رحلة إلى عالم من الأناقة والتميز.
          </p>
        </motion.div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {[
            {
              icon: Heart,
              title: 'شغف بالتميز',
              desc: 'نختار بعناية كل منتج لنضمن لك أفضل تجربة تسوق.',
            },
            {
              icon: Award,
              title: 'جودة عالية',
              desc: 'نقدم فقط المنتجات الأصلية ذات الجودة الفائقة.',
            },
            {
              icon: Gem,
              title: 'فخامة شرقية',
              desc: 'نجمع بين الأصالة والحداثة في كل قطعة.',
            },
            {
              icon: Sparkles,
              title: 'عناية بالتفاصيل',
              desc: 'نهتم بأدق التفاصيل لنمنحك تجربة فريدة.',
            },
          ].map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg hover:border-amber-800/20 transition-all duration-300"
            >
              <value.icon className="w-8 h-8 text-amber-800 mb-3" />
              <h3 className="font-bold text-stone-900 text-lg mb-2">{value.title}</h3>
              <p className="text-stone-500 text-sm">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link
            href="/categories/clothing"
            className="inline-flex items-center gap-2 bg-amber-800 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-amber-700 transition-all duration-300 shadow-lg shadow-amber-900/20"
          >
            تسوقي الآن
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
