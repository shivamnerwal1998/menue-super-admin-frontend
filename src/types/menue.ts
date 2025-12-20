// src/types/menu.ts

export interface Category {
  id: number
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
  itemCount?: number
  entityId?: number
}

export interface Item {
  id: number
  categoryId: number
  name: string
  description?: string
  price: number // in paise (₹180 = 18000)
  isVeg: boolean
  isAvailable: boolean
  sortOrder: number
  imageUrl?: string | null
}

export interface ToastType {
  message: string
  type: 'success' | 'error'
}