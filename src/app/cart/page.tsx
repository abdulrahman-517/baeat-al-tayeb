'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, ArrowLeft, Minus, Plus, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useCartStore } from '@/lib/store'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const isEmpty = items.length === 0
  const [showCheckout, setShowCheckout] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    city: '',
    delivery_method: 'توصيل للمنزل',
    phone: '',
    notes: '',
  })
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleCheckout() {
    if (!customerInfo.name || !customerInfo.city) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_details: items,
          total_price: getTotal(),
          customer_info: customerInfo,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'فشل حفظ الطلب')
      }
      const message = generateWhatsAppMessage(items, getTotal(), customerInfo)
      openWhatsApp(message)
      setOrderPlaced(true)
      setTimeout(() => {
        clearCart()
        setShowCheckout(false)
        setOrderPlaced(false)
        setSubmitting(false)
      }, 2000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء إرسال الطلب'
      alert(msg)
      setSubmitting(false)
    }
  }

  if (isEmpty && !orderPlaced) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-stone-300" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">سلتك فارغة</h1>
          <p className="text-stone-500 mb-8">أضيفي بعض المنتجات الرائعة إلى سلتك</p>
          <Link
            href="/categories/clothing"
            className="inline-flex items-center gap-2 bg-amber-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            تسوقي الآن
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-stone-900">سلة المشتريات</h1>
        <span className="text-stone-500">{items.length} منتج</span>
      </div>

      <AnimatePresence mode="wait">
        {orderPlaced ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-stone-900 mb-2">تم إرسال الطلب!</h2>
            <p className="text-stone-500">سيتم التواصل معك قريباً عبر واتساب</p>
          </motion.div>
        ) : (
          <motion.div
            key="cart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Cart Items */}
            <div className="space-y-4">
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-stone-100"
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-stone-50 rounded-xl overflow-hidden shrink-0">
                    {item.product.images_urls?.[0] ? (
                      <img
                        src={item.product.images_urls[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-300">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-medium text-stone-900 hover:text-amber-800 transition-colors line-clamp-1"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-stone-500 mt-0.5">
                      المقاس: {item.selectedSize}
                    </p>
                    <p className="text-amber-800 font-bold mt-1">
                      {(item.product.price * item.quantity).toLocaleString()} ريال
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-200 rounded-xl">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-stone-50 rounded-r-xl transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                      <span className="px-3 text-sm font-medium text-stone-900 min-w-[24px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.selectedSize, item.quantity + 1)}
                        className="p-2 hover:bg-stone-50 rounded-l-xl transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 text-stone-500" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.selectedSize)}
                      className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-stone-400 hover:text-red-500" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checkout Form */}
            {showCheckout ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4"
              >
                <h2 className="text-xl font-bold text-stone-900 mb-4">معلومات التوصيل</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="الاسم"
                    placeholder="الاسم الكامل"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  />
                  <Input
                    label="المدينة"
                    placeholder="المدينة"
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                  />
                  <Input
                    label="رقم الهاتف"
                    placeholder="رقم الهاتف"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                  />
                  <div className="w-full">
                    <label className="block text-sm font-medium text-stone-700 mb-1.5">طريقة التوصيل</label>
                    <select
                      value={customerInfo.delivery_method}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, delivery_method: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                    >
                      <option value="توصيل للمنزل">توصيل للمنزل</option>
                      <option value="استلام من المتجر">استلام من المتجر</option>
                      <option value="توصيل لموقع العمل">توصيل لموقع العمل</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1.5">ملاحظات</label>
                  <textarea
                    placeholder="أي ملاحظات إضافية..."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="text-stone-500 hover:text-stone-700 transition-colors"
                  >
                    رجوع
                  </button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleCheckout}
                    loading={submitting}
                    disabled={!customerInfo.name || !customerInfo.city}
                  >
                    <MessageCircle className="w-5 h-5" />
                    إتمام الطلب عبر واتساب
                  </Button>
                </div>
              </motion.div>
            ) : (
              /* Cart Summary */
              <motion.div className="bg-white p-6 rounded-2xl border border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-stone-600">مجموع المنتجات</span>
                  <span className="text-stone-900 font-medium">{getTotal().toLocaleString()} ريال</span>
                </div>
                <div className="flex items-center justify-between mb-4 text-sm text-stone-500">
                  <span>الشحن</span>
                  <span>يحسب عند التأكيد</span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-stone-100 mb-6">
                  <span className="text-lg font-bold text-stone-900">الإجمالي</span>
                  <span className="text-2xl font-bold text-amber-800">{getTotal().toLocaleString()} ريال</span>
                </div>
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={() => setShowCheckout(true)}
                >
                  <MessageCircle className="w-5 h-5" />
                  إتمام الطلب عبر واتساب
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
