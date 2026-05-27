import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('Supabase environment variables are not configured')
  }
  return createClient(url, key)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { cart_details, total_price, customer_info } = body

    if (!cart_details || !total_price || !customer_info) {
      return NextResponse.json(
        { error: 'بيانات الطلب غير مكتملة' },
        { status: 400 }
      )
    }

    if (!customer_info.name || !customer_info.city) {
      return NextResponse.json(
        { error: 'الاسم والمدينة مطلوبان' },
        { status: 400 }
      )
    }

    const supabase = getServerSupabase()
    const { error } = await supabase
      .from('orders_log')
      .insert({
        cart_details,
        total_price,
        customer_info,
        status: 'pending',
      })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'فشل حفظ الطلب في قاعدة البيانات' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'تم استلام الطلب بنجاح' },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating order:', error)
    const message = error instanceof Error ? error.message : 'حدث خطأ أثناء معالجة الطلب'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const status = searchParams.get('status')
    const from = (page - 1) * limit
    const to = from + limit - 1

    const supabase = getServerSupabase()
    let query = supabase
      .from('orders_log')
      .select('*', { count: 'exact' })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error

    return NextResponse.json({
      orders: data,
      total: count,
      page,
      totalPages: count ? Math.ceil(count / limit) : 0,
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في جلب الطلبات' },
      { status: 500 }
    )
  }
}
