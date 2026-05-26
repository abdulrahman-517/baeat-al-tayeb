'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image, Loader2 } from 'lucide-react'
import { uploadImages } from '@/lib/upload'

interface ImageUploadProps {
  images: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
}

export function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return
    const remaining = maxImages - images.length
    if (remaining <= 0) return

    setUploading(true)
    try {
      const filesArray = Array.from(files).slice(0, remaining)
      const urls = await uploadImages(filesArray)
      onChange([...images, ...urls])
    } catch (err: any) {
      alert(err?.message || 'فشل رفع الصورة - تأكد من إنشاء Bucket في Supabase Storage')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-stone-700">صور المنتج</label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-square bg-stone-50 rounded-xl overflow-hidden border border-stone-200 group">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square bg-stone-50 border-2 border-dashed border-stone-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-amber-800 hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-amber-800 animate-spin" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-stone-400" />
                <span className="text-xs text-stone-400">إضافة صورة</span>
              </>
            )}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-stone-400">
        {images.length}/{maxImages} صور - الصيغ المدعومة: JPG, PNG, WebP
      </p>
    </div>
  )
}
