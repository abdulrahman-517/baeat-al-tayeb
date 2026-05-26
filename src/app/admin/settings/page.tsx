'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { supabase } from '@/lib/supabase'
import { Save } from 'lucide-react'

export default function AdminSettingsPage() {
  const [whatsappNumber, setWhatsappNumber] = useState(
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '967771495633'
  )
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-stone-900 mb-6">الإعدادات</h1>

      <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-6">
        <h2 className="text-lg font-semibold text-stone-900">إعدادات واتساب</h2>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="رقم واتساب (بدون +)"
            placeholder="967771495633"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            dir="ltr"
          />

          <div className="bg-amber-50 p-4 rounded-xl text-sm text-amber-800">
            <p className="font-medium mb-1">ملاحظة:</p>
            <p>رقم واتساب المستخدم لإرسال الطلبات. يجب أن يكون الرقم مسجلاً في واتساب.</p>
          </div>

          <Button type="submit" variant="primary" size="lg">
            <Save className="w-5 h-5" />
            {saved ? 'تم الحفظ ✓' : 'حفظ الإعدادات'}
          </Button>
        </form>
      </div>

      {/* API Info */}
      <div className="bg-white p-6 rounded-2xl border border-stone-100 space-y-3 mt-6">
        <h2 className="text-lg font-semibold text-stone-900">معلومات إضافية</h2>
        <div className="text-sm text-stone-600 space-y-2">
          <p>
            <span className="text-stone-400">إصدار التطبيق:</span>{' '}
            <span className="text-stone-900">1.0.0</span>
          </p>
          <p>
            <span className="text-stone-400">البيئة:</span>{' '}
            <span className="text-stone-900">
              {process.env.NODE_ENV === 'production' ? 'إنتاج' : 'تطوير'}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
