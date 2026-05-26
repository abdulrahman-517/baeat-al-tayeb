'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
    bestSellers: 0,
  })
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
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders_log').select('total_price'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_best_seller', true),
      ])

      setStats({
        products: productsCount || 0,
        orders: orders?.length || 0,
        revenue: orders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0,
        bestSellers: bestSellersCount || 0,
      })
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
      label: 'الطلبات',
      value: stats.orders,
      icon: ShoppingCart,
      color: 'bg-green-50 text-green-600',
      href: '/admin/orders',
    },
    {
      label: 'الأكثر مبيعاً',
      value: stats.bestSellers,
      icon: TrendingUp,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/products',
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
      <h1 className="text-2xl font-bold text-stone-900 mb-6">لوحة التحكم</h1>

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
              className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6" />
              </div>
              <p className="text-stone-500 text-sm mb-1">{card.label}</p>
              <p className="text-2xl font-bold text-stone-900">{card.value}</p>
            </Link>
          ))}
        </div>
      )}

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
