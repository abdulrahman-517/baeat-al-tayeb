'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
    bestSellers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStock, setLowStock] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const [
        { count: productsCount },
        { data: orders },
        { count: bestSellersCount },
        { count: pendingCount },
        { data: recent },
        { data: lowStockData },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders_log').select('total_price,status'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_best_seller', true),
        supabase.from('orders_log').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders_log').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('*').lt('stock_quantity', 5).neq('stock_quantity', 0),
      ])

      setStats({
        products: productsCount || 0,
        orders: orders?.length || 0,
        pendingOrders: pendingCount || 0,
        revenue: orders?.reduce((sum, o: any) => sum + Number(o.total_price), 0) || 0,
        bestSellers: bestSellersCount || 0,
      })
      setRecentOrders(recent || [])
      setLowStock(lowStockData?.length || 0)
    } catch {
      console.error('Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      label: 'إجمالي المنتجات',
      value: stats.products,
      icon: Package,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/products',
    },
    {
      label: 'الطلبات المعلقة',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-orange-50 text-orange-600',
      href: '/admin/orders',
      badge: stats.pendingOrders > 0 ? 'مطلوب مراجعة' : undefined,
    },
    {
      label: 'إجمالي الطلبات',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      href: '/admin/orders',
    },
    {
      label: 'الإيرادات',
      value: `${stats.revenue.toLocaleString()} ريال`,
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/orders',
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">لوحة التحكم</h1>
        <button
          onClick={fetchStats}
          className="text-sm text-stone-500 hover:text-stone-700 transition-colors"
        >
          تحديث
        </button>
      </div>

      {/* تنبيهات */}
      {(stats.pendingOrders > 0 || lowStock > 0) && (
        <div className="space-y-2 mb-6">
          {stats.pendingOrders > 0 && (
            <Link
              href="/admin/orders"
              className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 hover:bg-orange-100 transition-colors"
            >
              <Clock className="w-5 h-5" />
              يوجد {stats.pendingOrders} طلب{stats.pendingOrders > 1 ? 'ات' : ''} معلق{stats.pendingOrders > 1 ? 'ة' : ''} بانتظار المراجعة
            </Link>
          )}
          {lowStock > 0 && (
            <Link
              href="/admin/products"
              className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-5 h-5" />
              {lowStock} منتج على وشك النفاد من المخزون
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 animate-pulse">
              <div className="w-12 h-12 bg-stone-200 rounded-xl mb-4" />
              <div className="h-4 bg-stone-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-stone-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow relative"
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-stone-500 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-stone-900">{card.value}</p>
              {card.badge && (
                <span className="absolute top-4 right-4 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                  {card.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-900">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-amber-700 hover:text-amber-600">
            عرض الكل
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-stone-100 text-center">
            <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-stone-500">لا توجد طلبات بعد</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            {recentOrders.map((order: any, i: number) => {
              const customer = order.customer_info || {}
              const statusColors: Record<string, string> = {
                pending: 'bg-orange-100 text-orange-600',
                confirmed: 'bg-blue-100 text-blue-600',
                shipped: 'bg-purple-100 text-purple-600',
                delivered: 'bg-green-100 text-green-600',
                cancelled: 'bg-red-100 text-red-600',
              }
              const statusText: Record<string, string> = {
                pending: 'معلق',
                confirmed: 'مؤكد',
                shipped: 'تم الشحن',
                delivered: 'تم التوصيل',
                cancelled: 'ملغي',
              }
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 font-medium">
                      {i + 1}
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">{customer.name || 'عميل'}</p>
                      <p className="text-sm text-stone-400">{customer.city || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-800 font-bold">{Number(order.total_price).toLocaleString()} ريال</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>
                      {statusText[order.status] || order.status}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/admin/products/new"
            className="px-6 py-3 bg-amber-800 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium"
          >
            إضافة منتج جديد
          </Link>
          <Link
            href="/admin/hero-images"
            className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium"
          >
            إدارة صور الهيدر
          </Link>
          <Link
            href="/admin/orders"
            className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium"
          >
            عرض الطلبات
          </Link>
        </div>
      </div>
    </div>
  )
}
