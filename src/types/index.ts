export interface Category {
  id: string
  name: string
  slug: string
  created_at?: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  original_price?: number | null
  sizes: string[]
  category_id: string
  category?: Category
  stock_quantity: number
  images_urls: string[]
  created_at: string
  is_best_seller: boolean
  is_featured?: boolean
  rating?: number
  reviews_count?: number
  type?: string
  color?: string
}

export interface CartItem {
  id: string
  product: Product
  quantity: number
  selectedSize: string
}

export interface AdminUser {
  id: string
  email: string
  role: string
  created_at?: string
}

export interface OrderLog {
  id: string
  cart_details: CartItem[]
  total_price: number
  customer_info: {
    name: string
    city: string
    delivery_method: string
    phone?: string
    notes?: string
  }
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  created_at: string
}

export interface ProductFilters {
  minPrice?: number
  maxPrice?: number
  size?: string
  type?: string
  color?: string
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name'
}
