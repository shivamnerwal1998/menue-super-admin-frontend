// src/types/menue.ts

export interface Category {
  id: number
  name: string
  description?: string
  sortOrder: number
  isActive: boolean
  itemCount?: number
  entityId?: number
  parentId?: number | null
  level?: number
  createdAt?: string
  updatedAt?: string
  children?: Category[] // ✅ NEW: For nested structure
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
  updatedAt?: string
  category?: {
    id: number
    name: string
  }
}

export interface ToastType {
  message: string
  type: 'success' | 'error'
}

// ✅ API Response Types
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

export interface ValidationError {
  field: string
  message: string
}

export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: ValidationError[]
  }
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ✅ NEW: Pagination Types
export interface PaginatedResponse<T> {
  success: true
  total: number
  page: number
  limit: number
  data: T[]
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// ✅ Form Data Types (for API requests)
export interface CreateCategoryRequest {
  name: string
  description?: string
  isActive: boolean
  sortOrder: number
  parentId: number | null
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  isActive?: boolean
  sortOrder?: number
  parentId?: number | null
}

export interface CreateItemRequest {
  name: string
  description?: string
  price: number // in paise
  categoryId: number
  imageUrl?: string | null
  isVeg: boolean
  isAvailable: boolean
  sortOrder: number
}

export interface UpdateItemRequest {
  name?: string
  description?: string
  price?: number // in paise
  categoryId?: number
  imageUrl?: string | null
  isVeg?: boolean
  isAvailable?: boolean
  sortOrder?: number
}