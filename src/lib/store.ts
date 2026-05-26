'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
  addItem: (product: Product, quantity: number, selectedSize: string) => void
  removeItem: (productId: string, selectedSize: string) => void
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity: number, selectedSize: string) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) => item.id === product.id && item.selectedSize === selectedSize
          )

          if (existingIndex > -1) {
            const newItems = [...state.items]
            newItems[existingIndex].quantity += quantity
            return { items: newItems }
          }

          return {
            items: [
              ...state.items,
              {
                id: `${product.id}-${selectedSize}`,
                product,
                quantity,
                selectedSize,
              },
            ],
          }
        })
      },

      removeItem: (productId: string, selectedSize: string) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.selectedSize === selectedSize)
          ),
        }))
      },

      updateQuantity: (productId: string, selectedSize: string, quantity: number) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId && item.selectedSize === selectedSize
              ? { ...item, quantity }
              : item
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        )
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'baeat-al-tayeb-cart',
    }
  )
)
