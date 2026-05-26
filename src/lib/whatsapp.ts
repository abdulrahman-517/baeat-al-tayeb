import { CartItem } from '@/types'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '967771495633'

interface CustomerInfo {
  name: string
  city: string
  delivery_method: string
  phone?: string
  notes?: string
}

export function generateWhatsAppMessage(
  items: CartItem[],
  total: number,
  customerInfo: CustomerInfo
): string {
  const productLines = items
    .map(
      (item) =>
        `- ${item.product.name} ×${item.quantity}
   المقاس: ${item.selectedSize}
   السعر: ${(item.product.price * item.quantity).toLocaleString()} ريال`
    )
    .join('\n\n')

  const message = `السلام عليكم، أرغب بطلب المنتجات التالية من متجر بائعة الطيب:

${productLines}

الإجمالي: ${total.toLocaleString()} ريال

━━━━━━━━━━━━━━━━
معلومات العميل:
الاسم: ${customerInfo.name}
المدينة: ${customerInfo.city}
طريقة التوصيل: ${customerInfo.delivery_method}
${customerInfo.phone ? `رقم الهاتف: ${customerInfo.phone}` : ''}
${customerInfo.notes ? `ملاحظات: ${customerInfo.notes}` : ''}
━━━━━━━━━━━━━━━━

شكراً لكم، بائعة الطيب - أناقة تفوح بالفخامة`

  return encodeURIComponent(message)
}

export function openWhatsApp(message: string) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
  window.open(url, '_blank')
}
