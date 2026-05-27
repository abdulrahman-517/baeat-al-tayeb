'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { supabase } from '@/lib/supabase'
import { Category } from '@/types'

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<{
    name: string
    description: string
    price: string
    purchase_price: string
    original_price: string
    sizes: string
    category_id: string
    stock_quantity: string
    images_urls: string[]
    is_best_seller: boolean
    is_featured: boolean
    type: string
    color: string
  }>({
    name: '',
    description: '',
    price: '',
    purchase_price: '',
    original_price: '',
    sizes: '',
    category_id: '',
    stock_quantity: '0',
    images_urls: [],
    is_best_seller: false,
    is_featured: false,
    type: '',
    color: '',
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*')
    setCategories(data || [])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const sizes = formData.sizes
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const images = formData.images_urls

      const { error } = await supabase.from('products').insert({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price) : 0,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        sizes,
        category_id: formData.category_id || null,
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        images_urls: images,
        is_best_seller: formData.is_best_seller,
        is_featured: formData.is_featured,
        type: formData.type || null,
        color: formData.color || null,
      })

      if (error) throw error
      router.push('/admin/products')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">إضافة منتج جديد</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-stone-100 space-y-4">
        <Input
          label="اسم المنتج"
          placeholder="اسم المنتج"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1.5">الوصف</label>
          <textarea
            placeholder="وصف المنتج..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="السعر (ريال)"
            type="number"
            placeholder="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
          <Input
            label="سعر الشراء"
            type="number"
            placeholder="0"
            value={formData.purchase_price}
            onChange={(e) => setFormData({ ...formData, purchase_price: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="السعر الأصلي (اختياري)"
            type="number"
            placeholder="0"
            value={formData.original_price}
            onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1.5">القسم</label>
            <select
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-stone-200 bg-white text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-800/20"
            >
              <option value="">اختر القسم</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="المخزون"
            type="number"
            placeholder="0"
            value={formData.stock_quantity}
            onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
          />
        </div>

        <Input
          label="المقاسات (مفصولة بفواصل)"
          placeholder="XS, S, M, L, XL"
          value={formData.sizes}
          onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="النوع (اختياري)"
            placeholder="مثل: عبايات, فساتين"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          />
          <Input
            label="اللون (اختياري)"
            placeholder="مثل: أسود, ذهبي"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
          />
        </div>

        <ImageUpload
          images={formData.images_urls}
          onChange={(urls) => setFormData({ ...formData, images_urls: urls })}
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_best_seller}
              onChange={(e) => setFormData({ ...formData, is_best_seller: e.target.checked })}
              className="w-4 h-4 text-amber-800 focus:ring-amber-800 rounded"
            />
            <span className="text-sm text-stone-700">الأكثر مبيعاً</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.is_featured}
              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
              className="w-4 h-4 text-amber-800 focus:ring-amber-800 rounded"
            />
            <span className="text-sm text-stone-700">مميز</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" size="lg" loading={loading}>
            إضافة المنتج
          </Button>
          <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>
            إلغاء
          </Button>
        </div>
      </form>
    </div>
  )
}
