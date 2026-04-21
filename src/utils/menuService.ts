import { admin } from './constants'
import {
  Category,
  Item,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateItemRequest,
  UpdateItemRequest,
  ApiSuccessResponse,
  PaginatedResponse,
} from '../types/menue'
import { api } from './api'

/**
 * GET Query Parameters
 */  type CategoryStats = {
   total: number;
   active: number;
   inactive: number;
 };
 
 type ItemStats = {
   total: number;
   available: number;
   unavailable: number;
   veg: number;
   nonVeg: number;
 };
 
 export type StatsData = {
   categories: CategoryStats;
   items: ItemStats;
 };

 export type RestaurantData = {
  id: number
  name: string
  contact: string
  email: string
  address: string | null
  gmapLink: string | null
  instagram: string | null
  facebook: string | null
  website: string | null
  isActive: boolean
  createdAt: string
  qrAddress: string
}


interface GetCategoriesParams {
  page?: number
  limit?: number
  parentId?: number | null
  sortBy?: 'name' | 'sortOrder' | 'createdAt'
  order?: 'asc' | 'desc'
}

interface GetItemsParams {
  page?: number
  limit?: number
  categoryId?: number
  search?: string
  isVeg?: boolean
  isAvailable?: boolean
  sortBy?: 'name' | 'price' | 'sortOrder' | 'createdAt'
  order?: 'asc' | 'desc'
}

/**
 * Category Service
 */
export const categoryService = {
  /**
   * Get all categories with pagination and filters
   * GET /admin/categories?page=1&limit=10&sortBy=sortOrder&order=asc
   */
  getAll: async (
    params: GetCategoriesParams = {},
  ): Promise<PaginatedResponse<Category>> => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.parentId !== undefined) {
      queryParams.append(
        'parentId',
        params.parentId === null ? 'null' : params.parentId.toString(),
      )
    }
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.order) queryParams.append('order', params.order)

    const endpoint = queryParams.toString()
      ? `${admin.getCategories}?${queryParams.toString()}`
      : admin.getCategories

    const response = await api.get<
      ApiSuccessResponse<PaginatedResponse<Category>>
    >(endpoint)
    return response.data
  },

  /**
   * Create a new category
   * POST /admin/categories
   */
  create: async (
    data: CreateCategoryRequest,
  ): Promise<ApiSuccessResponse<Category>> => {
    return await api.post<ApiSuccessResponse<Category>>(
      admin.createCategory,
      data,
    )
  },

  /**
   * Update a category
   * PATCH /admin/categories/:id
   */
  update: async (
    id: number,
    data: UpdateCategoryRequest,
  ): Promise<ApiSuccessResponse<Category>> => {
    return await api.patch<ApiSuccessResponse<Category>>(
      admin.updateCategory(id),
      data,
    )
  },

  /**
   * Delete a category
   * DELETE /admin/categories/:id
   */
  delete: async (id: number): Promise<ApiSuccessResponse<null>> => {
    return await api.delete<ApiSuccessResponse<null>>(admin.deleteCategory(id))
  },

  /**
   * Toggle category active/inactive status
   * PATCH /admin/categories/:id/toggle
   * NO BODY REQUIRED - Backend automatically toggles current status
   */
  toggleActive: async (id: number): Promise<ApiSuccessResponse<Category>> => {
    return await api.patch<ApiSuccessResponse<Category>>(
      admin.toggleCategory(id),
    )
  },
}

/**
 * Item Service
 */
export const itemService = {
  /**
   * Get all items with pagination and filters
   * GET /admin/items?page=1&limit=20&categoryId=1&search=paneer&isVeg=true
   */
  getAll: async (
    params: GetItemsParams = {},
  ): Promise<PaginatedResponse<Item>> => {
    const queryParams = new URLSearchParams()

    if (params.page) queryParams.append('page', params.page.toString())
    if (params.limit) queryParams.append('limit', params.limit.toString())
    if (params.categoryId)
      queryParams.append('categoryId', params.categoryId.toString())
    if (params.search) queryParams.append('search', params.search)
    if (params.isVeg !== undefined)
      queryParams.append('isVeg', params.isVeg.toString())
    if (params.isAvailable !== undefined)
      queryParams.append('isAvailable', params.isAvailable.toString())
    if (params.sortBy) queryParams.append('sortBy', params.sortBy)
    if (params.order) queryParams.append('order', params.order)

    const endpoint = queryParams.toString()
      ? `${admin.getItems}?${queryParams.toString()}`
      : admin.getItems

    const response = await api.get<ApiSuccessResponse<PaginatedResponse<Item>>>(
      endpoint,
    )
    return response.data
  },

  /**
   * Create a new item
   * POST /admin/items
   */
  create: async (
    data: CreateItemRequest,
  ): Promise<ApiSuccessResponse<Item>> => {
    return await api.post<ApiSuccessResponse<Item>>(admin.createItem, data)
  },

  /**
   * Update an item
   * PATCH /admin/items/:id
   */
  update: async (
    id: number,
    data: UpdateItemRequest,
  ): Promise<ApiSuccessResponse<Item>> => {
    return await api.patch<ApiSuccessResponse<Item>>(admin.updateItem(id), data)
  },

  /**
   * Delete an item
   * DELETE /admin/items/:id
   */
  delete: async (id: number): Promise<ApiSuccessResponse<null>> => {
    return await api.delete<ApiSuccessResponse<null>>(admin.deleteItem(id))
  },

  /**
   * Toggle item availability
   * PATCH /admin/items/:id/toggle-availability
   * NO BODY REQUIRED - Backend automatically toggles current status
   */
  toggleAvailability: async (id: number): Promise<ApiSuccessResponse<Item>> => {
    return await api.patch<ApiSuccessResponse<Item>>(
      admin.toggleItemAvailability(id),
    )
  },

 getStats: async (): Promise<StatsData> => {
  const response = await api.get<ApiSuccessResponse<StatsData>>(admin.stats);
  return response.data;
},


  /**
   * Get restaurant/entity details
   * GET /admin/entity
   */
  getEntity: async (): Promise<RestaurantData> => {
    const response = await api.get<ApiSuccessResponse<RestaurantData>>(admin.entity)
    return response.data
  }

  
}
