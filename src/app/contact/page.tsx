'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Music2, Mail, Phone, MapPin, Send, Camera } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const text = encodeURIComponent(
      `الاسم: ${formData.name}\nالبريد: ${formData.email}\n\nالرسالة:\n${formData.message}`
    )
    window.open(`https://wa.me/967771495633?text=${text}`, '_blank')
    setSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-l from-amber-900 to-stone-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            تواصل معنا
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-amber-200 text-lg"
          >
            نحن هنا للإجابة على استفساراتك
          </motion.p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">معلومات التواصل</h2>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    label: 'هاتف',
                    value: '+967 771 495 633',
                    href: 'tel:+967771495633',
                  },
                  {
                    icon: Mail,
                    label: 'بريد إلكتروني',
                    value: 'info@baeataltayeb.com',
                    href: 'mailto:info@baeataltayeb.com',
                  },
                  {
                    icon: MapPin,
                    label: 'الموقع',
                    value: 'اليمن',
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-medium text-stone-900 hover:text-amber-800 transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium text-stone-900">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-6">تابعينا على</h2>
              <div className="flex gap-4">
                <a
                  href="https://wa.me/967771495633"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-green-500 text-white rounded-xl flex items-center justify-center hover:bg-green-600 transition-colors hover:-translate-y-1"
                >
                  <MessageCircle className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-opacity hover:-translate-y-1"
                >
                  <Camera className="w-6 h-6" />
                </a>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-14 h-14 bg-stone-900 text-white rounded-xl flex items-center justify-center hover:bg-stone-800 transition-colors hover:-translate-y-1"
                >
                  <Music2 className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl border border-stone-100">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">أرسلي لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="الاسم"
                placeholder="اسمك الكريم"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Input
                label="البريد الإلكتروني"
                type="email"
                placeholder="بريدك الإلكتروني"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1.5">الرسالة</label>
                <textarea
                  placeholder="اكتبي رسالتك هنا..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 transition-all"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" fullWidth>
                <Send className="w-5 h-5" />
                {sent ? 'تم الإرسال ✓' : 'إرسال'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
