'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Package, ShoppingCart, TrendingUp, DollarSign, AlertTriangle, Clock, RefreshCw, Shield, Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DashboardStats {
  products: number
  orders: number
  pendingOrders: number
  revenue: number
  bestSellers: number
  totalProfit: number
  todayOrders: number
  todayRevenue: number
  todayProfit: number
  monthOrders: number
  monthRevenue: number
  monthProfit: number
  lowStock: number
  outOfStock: number
}

interface RecentOrder {
  id: string
  customer_info: any
  total_price: number
  status: string
  created_at: string
  cart_details: any[]
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    orders: 0,
    pendingOrders: 0,
    revenue: 0,
    bestSellers: 0,
    totalProfit: 0,
    todayOrders: 0,
    todayRevenue: 0,
    todayProfit: 0,
    monthOrders: 0,
    monthRevenue: 0,
    monthProfit: 0,
    lowStock: 0,
    outOfStock: 0,
  })
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [bestSellerProducts, setBestSellerProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showResetForm, setShowResetForm] = useState<string | null>(null)
  const [resetPassword, setResetPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

      const [
        { count: productsCount },
        { data: allOrders },
        { count: pendingCount },
        { count: bestSellersCount },
        { data: recent },
        { data: lowStockData },
        { data: outOfStockData },
        { data: bestSellers },
      ] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders_log').select('total_price, created_at, status, cart_details'),
        supabase.from('orders_log').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_best_seller', true),
        supabase.from('orders_log').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('products').select('id, name, stock_quantity').gt('stock_quantity', 0).lt('stock_quantity', 5),
        supabase.from('products').select('id, name, stock_quantity').eq('stock_quantity', 0),
        supabase.from('products').select('name, price, purchase_price').eq('is_best_seller', true).limit(5),
      ])

      const orders = allOrders || []
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total_price), 0)
      const todayOrders = orders.filter((o: any) => o.created_at >= todayStart)
      const monthOrders = orders.filter((o: any) => o.created_at >= monthStart)

      // Calculate profit from order products (estimated from purchase_price)
      let totalCost = 0
      for (const order of orders) {
        const items = order.cart_details || []
        for (const item of items) {
          const purchasePrice = item.product?.purchase_price || 0
          totalCost += Number(purchasePrice) * Number(item.quantity)
        }
      }

      let todayCost = 0
      for (const order of todayOrders) {
        const items = order.cart_details || []
        for (const item of items) {
          const purchasePrice = item.product?.purchase_price || 0
          todayCost += Number(purchasePrice) * Number(item.quantity)
        }
      }

      let monthCost = 0
      for (const order of monthOrders) {
        const items = order.cart_details || []
        for (const item of items) {
          const purchasePrice = item.product?.purchase_price || 0
          monthCost += Number(purchasePrice) * Number(item.quantity)
        }
      }

      const todayRevenue = todayOrders.reduce((sum: number, o: any) => sum + Number(o.total_price), 0)
      const monthRevenue = monthOrders.reduce((sum: number, o: any) => sum + Number(o.total_price), 0)

      setStats({
        products: productsCount || 0,
        orders: orders.length,
        pendingOrders: pendingCount || 0,
        revenue: totalRevenue,
        bestSellers: bestSellersCount || 0,
        totalProfit: totalRevenue - totalCost,
        todayOrders: todayOrders.length,
        todayRevenue,
        todayProfit: todayRevenue - todayCost,
        monthOrders: monthOrders.length,
        monthRevenue,
        monthProfit: monthRevenue - monthCost,
        lowStock: lowStockData?.length || 0,
        outOfStock: outOfStockData?.length || 0,
      })

      setRecentOrders(recent || [])
      setBestSellerProducts(bestSellers || [])
    } catch {
      console.error('Failed to fetch stats')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  async function handleReset(section: string) {
    setResetError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: '', // We validate password against the current user's session
        password: resetPassword,
      })
      if (error) throw new Error('كلمة المرور غير صحيحة')

      switch (section) {
        case 'orders': {
          const confirmed = window.confirm('هل أنت متأكد من حذف جميع الطلبات؟ هذا الإجراء لا يمكن التراجع عنه.')
          if (!confirmed) return
          const { error: delError } = await supabase.from('orders_log').delete().neq('id', 'none')
          if (delError) throw delError
          break
        }
        case 'products': {
          const confirmed = window.confirm('هل أنت متأكد من حذف جميع المنتجات؟ هذا الإجراء لا يمكن التراجع عنه.')
          if (!confirmed) return
          const { error: delError } = await supabase.from('products').delete().neq('id', 'none')
          if (delError) throw delError
          break
        }
        case 'stats': {
          const confirmed = window.confirm('هل تريد إعادة تعيين الإحصائيات؟ سيتم حذف جميع الطلبات.')
          if (!confirmed) return
          const { error: delError } = await supabase.from('orders_log').delete().neq('id', 'none')
          if (delError) throw delError
          break
        }
      }

      setShowResetForm(null)
      setResetPassword('')
      fetchStats()
      alert('تمت العملية بنجاح')
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'فشل التحقق')
    }
  }

  const statCards = [
    { label: 'إجمالي المنتجات', value: stats.products, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
    { label: 'الطلبات المعلقة', value: stats.pendingOrders, icon: Clock, color: 'bg-orange-50 text-orange-600', href: '/admin/orders', badge: stats.pendingOrders > 0 ? 'مطلوب مراجعة' : undefined },
    { label: 'إجمالي الطلبات', value: stats.orders, icon: ShoppingCart, color: 'bg-green-50 text-green-600', href: '/admin/orders' },
    { label: 'إجمالي الإيرادات', value: `${stats.revenue.toLocaleString()} ريال`, icon: DollarSign, color: 'bg-purple-50 text-purple-600', href: '/admin/orders' },
    { label: 'صافي الربح', value: `${stats.totalProfit.toLocaleString()} ريال`, icon: TrendingUp, color: stats.totalProfit >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600', href: '/admin/orders' },
    { label: 'الأكثر مبيعاً', value: stats.bestSellers, icon: TrendingUp, color: 'bg-amber-50 text-amber-600', href: '/admin/products' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">لوحة التحكم</h1>
          <p className="text-sm text-stone-400 mt-1">ملخص المتجر وإحصائيات الأداء</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-500 hover:text-stone-700 bg-white border border-stone-200 rounded-xl hover:bg-stone-50 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          تحديث
        </button>
      </div>

      {/* Alerts */}
      {(stats.pendingOrders > 0 || stats.lowStock > 0 || stats.outOfStock > 0) && (
        <div className="space-y-2 mb-6">
          {stats.pendingOrders > 0 && (
            <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl text-sm text-orange-700 hover:bg-orange-100 transition-colors">
              <Clock className="w-5 h-5 shrink-0" />
              {stats.pendingOrders} طلب {stats.pendingOrders > 1 ? 'معلقة' : 'معلق'} بانتظار المراجعة
            </Link>
          )}
          {stats.lowStock > 0 && (
            <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700 hover:bg-amber-100 transition-colors">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {stats.lowStock} منتج على وشك النفاد
            </Link>
          )}
          {stats.outOfStock > 0 && (
            <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 hover:bg-red-100 transition-colors">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {stats.outOfStock} منتج نفد من المخزون
            </Link>
          )}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-stone-100 animate-pulse">
              <div className="w-12 h-12 bg-stone-200 rounded-xl mb-4" />
              <div className="h-4 bg-stone-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-stone-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card) => (
              <Link key={card.label} href={card.href} className="bg-white p-6 rounded-2xl border border-stone-100 hover:shadow-lg transition-all relative group">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon className="w-6 h-6" />
                </div>
                <p className="text-stone-500 text-sm mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-stone-900">{card.value}</p>
                {card.badge && (
                  <span className="absolute top-4 left-4 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full animate-pulse">
                    {card.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Daily / Monthly Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-100">
              <h3 className="font-semibold text-stone-900 mb-4">اليوم</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-stone-500">الطلبات</span><span className="font-medium">{stats.todayOrders}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">الإيرادات</span><span className="font-medium">{stats.todayRevenue.toLocaleString()} ريال</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">صافي الربح</span><span className={`font-medium ${stats.todayProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{stats.todayProfit.toLocaleString()} ريال</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100">
              <h3 className="font-semibold text-stone-900 mb-4">هذا الشهر</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-stone-500">الطلبات</span><span className="font-medium">{stats.monthOrders}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">الإيرادات</span><span className="font-medium">{stats.monthRevenue.toLocaleString()} ريال</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">صافي الربح</span><span className={`font-medium ${stats.monthProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{stats.monthProfit.toLocaleString()} ريال</span></div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-stone-100">
              <h3 className="font-semibold text-stone-900 mb-4">المخزون</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-stone-500">منتج متوفر</span><span className="font-medium">{stats.products - stats.outOfStock}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">على وشك النفاد</span><span className="font-medium text-amber-600">{stats.lowStock}</span></div>
                <div className="flex justify-between text-sm"><span className="text-stone-500">نفد بالكامل</span><span className={`font-medium ${stats.outOfStock > 0 ? 'text-red-600' : ''}`}>{stats.outOfStock}</span></div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recent Orders */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-stone-900">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-sm text-amber-700 hover:text-amber-600">عرض الكل</Link>
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
                pending: 'معلق', confirmed: 'مؤكد', shipped: 'تم الشحن', delivered: 'تم التوصيل', cancelled: 'ملغي',
              }
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 font-medium">{i + 1}</div>
                    <div>
                      <p className="font-medium text-stone-900">{customer.name || 'عميل'}</p>
                      <p className="text-sm text-stone-400">{customer.city || ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-800 font-bold">{Number(order.total_price).toLocaleString()} ريال</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || ''}`}>{statusText[order.status] || order.status}</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Best Seller Products */}
      {bestSellerProducts.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-stone-900 mb-4">المنتجات الأكثر مبيعاً</h2>
          <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
            {bestSellerProducts.map((p: any, i: number) => {
              const profit = Number(p.price) - Number(p.purchase_price || 0)
              return (
                <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-stone-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-stone-400 text-sm">{i + 1}</span>
                    <span className="font-medium text-stone-900">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <span>{p.price.toLocaleString()} ريال</span>
                    <span className="text-emerald-600">ربح: {profit.toLocaleString()} ريال</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">إجراءات سريعة</h2>
        <div className="flex flex-wrap gap-4">
          <Link href="/admin/products/new" className="px-6 py-3 bg-amber-800 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">إضافة منتج جديد</Link>
          <Link href="/admin/hero-images" className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium">إدارة صور الهيدر</Link>
          <Link href="/admin/orders" className="px-6 py-3 bg-white text-stone-700 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors font-medium">عرض الطلبات</Link>
        </div>
      </div>

      {/* Reset Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">إعادة تعيين</h2>
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'orders', label: 'إعادة تعيين الطلبات' },
            { key: 'products', label: 'إعادة تعيين المنتجات' },
            { key: 'stats', label: 'إعادة تعيين الإحصائيات' },
          ].map((item) => (
            <div key={item.key}>
              <button
                onClick={() => { setShowResetForm(showResetForm === item.key ? null : item.key); setResetPassword(''); setResetError('') }}
                className="px-6 py-3 bg-white text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
              >
                {item.label}
              </button>
              {showResetForm === item.key && (
                <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4" onClick={() => setShowResetForm(null)}>
                  <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-xl" onClick={e => e.stopPropagation()}>
                    <h3 className="font-bold text-stone-900 mb-2">تأكيد العملية</h3>
                    <p className="text-sm text-stone-500 mb-4">يرجى إدخال كلمة المرور لتأكيد {item.label}</p>
                    {resetError && <p className="text-sm text-red-500 mb-3">{resetError}</p>}
                    <div className="relative mb-4">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="كلمة المرور"
                        value={resetPassword}
                        onChange={e => setResetPassword(e.target.value)}
                        className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 pl-10"
                        dir="ltr"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleReset(item.key)} disabled={!resetPassword} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
                        تأكيد الحذف
                      </button>
                      <button onClick={() => setShowResetForm(null)} className="flex-1 px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-sm font-medium hover:bg-stone-200 transition-colors">
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
