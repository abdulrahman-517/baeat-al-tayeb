'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Search, Eye, Filter, Loader2, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { OrderLog } from '@/types'

function calcOrderProfit(cart: any[]): number {
  return (cart || []).reduce((sum, item: any) => {
    const price = Number(item.product?.price || 0)
    const purchase = Number(item.product?.purchase_price || 0)
    return sum + (price - purchase) * Number(item.quantity)
  }, 0)
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  shipped: 'تم الشحن',
  delivered: 'تم التوصيل',
  cancelled: 'ملغي',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderLog[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<OrderLog | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  async function fetchOrders() {
    setLoading(true)
    try {
      let query = supabase.from('orders_log').select('*')
      if (statusFilter) query = query.eq('status', statusFilter)
      const { data, error } = await query.order('created_at', { ascending: false })
      if (error) throw error
      setOrders(data || [])
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  async function updateStatus(id: string, status: string) {
    if (status === 'cancelled') {
      const confirmed = window.confirm('هل أنت متأكد من إلغاء هذا الطلب؟')
      if (!confirmed) return
    }
    try {
      const { error } = await supabase.from('orders_log').update({ status }).eq('id', id)
      if (error) throw error
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as any } : o)))
      if (selectedOrder?.id === id) setSelectedOrder({ ...selectedOrder, status: status as any })
    } catch {
      console.error('Failed to update status')
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true
    const name = order.customer_info?.name || ''
    const city = order.customer_info?.city || ''
    const term = searchTerm.toLowerCase()
    return name.toLowerCase().includes(term) || city.toLowerCase().includes(term)
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">الطلبات</h1>
        <span className="text-sm text-stone-500">إجمالي: {orders.length} طلب</span>
      </div>

      {/* فلتر + بحث */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="بحث باسم العميل أو المدينة..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-stone-400" />
          {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-amber-800 text-white'
                  : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {s ? statusLabels[s] : 'الكل'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <motion.div
              key={order.id}
              layout
              className="bg-white p-6 rounded-2xl border border-stone-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-stone-900">
                      {order.customer_info?.name || 'عميل'}
                    </h3>
                    {order.customer_info?.city && (
                      <span className="text-sm text-stone-400">- {order.customer_info.city}</span>
                    )}
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-sm text-stone-500">
                    {new Date(order.created_at).toLocaleDateString('ar-YE', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-amber-800">
                    {Number(order.total_price).toLocaleString()} ريال
                  </p>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1 justify-end">
                    <TrendingUp className="w-3 h-3" />
                    ربح: {calcOrderProfit(order.cart_details).toLocaleString()} ريال
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {selectedOrder?.id === order.id ? 'إخفاء التفاصيل' : 'التفاصيل'}
                </button>
              </div>

              {selectedOrder?.id === order.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 pt-4 border-t border-stone-100 space-y-4"
                >
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-stone-500">الاسم:</span><span className="mr-2 text-stone-900">{order.customer_info?.name}</span></div>
                    <div><span className="text-stone-500">المدينة:</span><span className="mr-2 text-stone-900">{order.customer_info?.city}</span></div>
                    <div><span className="text-stone-500">التوصيل:</span><span className="mr-2 text-stone-900">{order.customer_info?.delivery_method}</span></div>
                    {order.customer_info?.phone && (
                      <div><span className="text-stone-500">الهاتف:</span><span className="mr-2 text-stone-900" dir="ltr">{order.customer_info.phone}</span></div>
                    )}
                    {order.customer_info?.notes && (
                      <div className="col-span-2"><span className="text-stone-500">ملاحظات:</span><span className="mr-2 text-stone-900">{order.customer_info.notes}</span></div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-stone-700 mb-2">المنتجات:</p>
                    <div className="space-y-2">
                      {Array.isArray(order.cart_details) && order.cart_details.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-sm bg-stone-50 p-3 rounded-xl">
                          <div>
                            <span className="text-stone-900">{item.product?.name}</span>
                            <span className="text-stone-400 mx-2">×</span>
                            <span className="text-stone-600">{item.quantity}</span>
                            {item.selectedSize && <span className="text-stone-400 mr-2">مقاس: {item.selectedSize}</span>}
                          </div>
                          <span className="text-amber-800 font-medium">
                            {(Number(item.product?.price) * Number(item.quantity)).toLocaleString()} ريال
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-sm text-stone-500">تحديث الحالة:</span>
                    {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStatus(order.id, status)}
                        className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-colors ${
                          order.status === status
                            ? statusColors[status]
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {statusLabels[status]}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <ShoppingCart className="w-16 h-16 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500 text-lg">
            {searchTerm || statusFilter ? 'لا توجد طلبات تطابق البحث' : 'لا توجد طلبات بعد'}
          </p>
        </div>
      )}
    </div>
  )
}
