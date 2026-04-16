export const superAdmin = {
  toggleUser: '/super-admin/users',
  toggleRestaurant: '/super-admin/restaurants',
  updateUser: '/super-admin/users',
  updateRestaurant: '/super-admin/restaurants',
  onboardUserAndRestaurant: '/super-admin/onboard',
  getRestaurants: '/super-admin/restaurants',
  getUsers: '/super-admin/users',
} as const

export const admin = {
  // Categories
  createCategory: '/admin/categories',
  updateCategory: (id: number) => `/admin/categories/${id}`,
  deleteCategory: (id: number) => `/admin/categories/${id}`,
  getCategories: '/admin/categories',
  toggleCategory: (id: number) => `/admin/categories/${id}/toggle`,

  // Items
  createItem: '/admin/items',
  updateItem: (id: number) => `/admin/items/${id}`,
  deleteItem: (id: number) => `/admin/items/${id}`,
  getItems: '/admin/items',
  toggleItemAvailability: (id: number) =>
    `/admin/items/${id}/toggle-availability`,

  // Stats
  stats : '/admin/stats'
} as const
