'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Upload, Loader2, Image, Check, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { uploadImages } from '@/lib/upload'
import { HeroImage } from '@/types'

export default function AdminHeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    const { data, error } = await supabase
      .from('hero_images')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setImages(data || [])
    setLoading(false)
  }

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    try {
      const urls = await uploadImages(Array.from(files))
      const newImages = urls.map((url, i) => ({
        image_url: url,
        alt_text: '',
        sort_order: images.length + i,
        is_active: true,
      }))
      const { error } = await supabase.from('hero_images').insert(newImages)
      if (error) throw error
      await fetchImages()
    } catch (err: any) {
      alert(err?.message || 'فشل رفع الصورة')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function removeImage(id: string) {
    const { error } = await supabase.from('hero_images').delete().eq('id', id)
    if (!error) setImages((prev) => prev.filter((img) => img.id !== id))
  }

  async function toggleActive(id: string, current: boolean) {
    const { error } = await supabase.from('hero_images').update({ is_active: !current }).eq('id', id)
    if (!error) {
      setImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, is_active: !current } : img))
      )
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return
    const items = [...images]
    const temp = items[index]
    items[index] = items[index - 1]
    items[index - 1] = temp
    await updateOrder(items)
  }

  async function moveDown(index: number) {
    if (index === images.length - 1) return
    const items = [...images]
    const temp = items[index]
    items[index] = items[index + 1]
    items[index + 1] = temp
    await updateOrder(items)
  }

  async function updateOrder(items: HeroImage[]) {
    const updates = items.map((item, i) => ({
      id: item.id,
      sort_order: i,
    }))
    const { error } = await supabase.from('hero_images').upsert(updates)
    if (!error) setImages(items)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-amber-800 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-stone-900">صور الهيدر</h1>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-800 text-white rounded-xl text-sm font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            إضافة صور
          </button>
        </div>
      </div>

      <p className="text-stone-500 text-sm mb-6">
        هذه الصور تظهر في الواجهة الرئيسية للمتجر بشكل متحرك. يمكنك إضافة صور جديدة أو حذف أو ترتيب الصور.
      </p>

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
          <Image className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <p className="text-stone-500">لا توجد صور بعد</p>
          <p className="text-stone-400 text-sm mt-1">أضف صور الهيدر من الزر أعلاه</p>
        </div>
      ) : (
        <div className="space-y-4">
          {images.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-stone-100 p-4 flex items-center gap-4"
            >
              <div className="w-32 h-20 rounded-xl overflow-hidden bg-stone-50 flex-shrink-0">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-stone-500 truncate">{img.image_url}</p>
                <p className="text-xs text-stone-400 mt-0.5">الترتيب: {img.sort_order + 1}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleActive(img.id, img.is_active)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    img.is_active
                      ? 'bg-green-50 text-green-600'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {img.is_active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="w-8 h-8 rounded-lg bg-stone-50 text-stone-500 flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(index)}
                  disabled={index === images.length - 1}
                  className="w-8 h-8 rounded-lg bg-stone-50 text-stone-500 flex items-center justify-center hover:bg-stone-100 transition-colors disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeImage(img.id)}
                  className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
