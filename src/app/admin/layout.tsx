'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Image,
} from 'lucide-react'

const sidebarLinks = [
  { href: '/admin', label: 'لوحة التحكم', icon: LayoutDashboard },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/hero-images', label: 'صور الهيدر', icon: Image },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingCart },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    checkUser()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/admin/login')
      }
    })
    return () => subscription?.unsubscribe()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user && pathname !== '/admin/login') {
        router.push('/admin/login')
        return
      }
      setUser(user)
    } catch {
      if (pathname !== '/admin/login') {
        router.push('/admin/login')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-800/20 border-t-amber-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-stone-500">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <p className="text-stone-500">جاري إعادة التوجيه...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 right-4 z-50 lg:hidden p-2 bg-white rounded-xl shadow-lg border border-stone-200"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 right-0 z-40 w-72 bg-white border-l border-stone-200 transform transition-transform duration-300
          lg:relative lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/admin" className="text-2xl font-bold text-stone-900">
              بائعة<span className="text-amber-800"> الطيب</span>
            </Link>
            <p className="text-sm text-stone-400 mt-1">لوحة التحكم</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-800'
                      : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-stone-100 pt-4 space-y-3">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-amber-800" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-stone-900 truncate">{user.email}</p>
                <p className="text-xs text-stone-400">مدير</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              تسجيل الخروج
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-8 pt-20 lg:pt-8">{children}</main>
    </div>
  )
}
