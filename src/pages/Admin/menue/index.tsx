import { useState, useEffect } from 'react'
import { Plus, Search, X } from 'lucide-react'
import {
  Category,
  Item,
  ToastType,
  ValidationError,
} from '../../../types/menue'
import Toast from '../../../components/admin/common/Toast'
import CategoryCard from '../../../components/admin/menue/CategoryCard'
import CategoryFormModal from '../../../components/admin/menue/CategoryFormModal'
import ItemFormModal from '../../../components/admin/menue/ItemFormModal'
import LoadMoreButton from '../../../components/admin/common/LoadMoreButton'
import { categoryService, itemService } from '../../../utils/menuService'

export default function MenuManagement() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
    isLoading: false,
  })

  const [itemsByCategory, setItemsByCategory] = useState<
    Record<
      number,
      {
        items: Item[]
        page: number
        limit: number
        total: number
        hasMore: boolean
        isLoading: boolean
      }
    >
  >({})

  const [searchQuery, setSearchQuery] = useState('')
  const [searchItems, setSearchItems] = useState(true)
  const [searchResults, setSearchResults] = useState<Item[]>([])
  const [searchPagination, setSearchPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    hasMore: false,
    isLoading: false,
  })
  const [isSearchMode, setIsSearchMode] = useState(false)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const [toast, setToast] = useState<ToastType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

  // ============================================
  // INITIAL LOAD
  // ============================================
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async (page = 1) => {
    setCategoryPagination((prev) => ({ ...prev, isLoading: true }))

    try {
      const response = await categoryService.getAll({
        page,
        limit: 10,
        parentId: null,
        sortBy: 'sortOrder',
        order: 'asc',
      })

      const newCategories = response.data.map((cat: any) => ({
        ...cat,
        itemCount: cat._count?.items || 0,
        childrenCount: cat._count?.children || 0,
      }))

      setCategories((prev) => (page === 1 ? newCategories : [...prev, ...newCategories]))

      const shouldLoadMore = response.total > 10 && response.page * response.limit < response.total

      setCategoryPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore: shouldLoadMore,
        isLoading: false,
      })
    } catch (error: any) {
      console.error('Load categories error:', error)
      showToast(error.message || 'Failed to load categories', 'error')
      setCategoryPagination((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const loadCategoryChildren = async (parentId: number) => {
    try {
      const response = await categoryService.getAll({
        page: 1,
        limit: 100,
        parentId,
        sortBy: 'sortOrder',
        order: 'asc',
      })

      const childCategories = response.data.map((cat: any) => ({
        ...cat,
        itemCount: cat._count?.items || 0,
        childrenCount: cat._count?.children || 0,
      }))

      setCategories((prev) => {
        const parentIndex = prev.findIndex((c) => c.id === parentId)
        if (parentIndex === -1) return prev

        const newCategories = [...prev]
        const filtered = newCategories.filter((c) => c.parentId !== parentId)
        filtered.splice(parentIndex + 1, 0, ...childCategories)
        return filtered
      })
    } catch (error: any) {
      console.error('Load children error:', error)
      showToast(error.message || 'Failed to load subcategories', 'error')
    }
  }

  const loadItemsForCategory = async (categoryId: number, page = 1) => {
    setItemsByCategory((prev) => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || { items: [], page: 1, limit: 10, total: 0, hasMore: false }),
        isLoading: true,
      },
    }))

    try {
      const response = await itemService.getAll({
        categoryId,
        page,
        limit: 10,
        sortBy: 'sortOrder',
        order: 'asc',
      })

      setItemsByCategory((prev) => ({
        ...prev,
        [categoryId]: {
          items: page === 1 ? response.data : [...(prev[categoryId]?.items || []), ...response.data],
          page: response.page,
          limit: response.limit,
          total: response.total,
          hasMore: response.page * response.limit < response.total,
          isLoading: false,
        },
      }))
    } catch (error: any) {
      console.error('Load items error:', error)
      showToast(error.message || 'Failed to load items', 'error')
      setItemsByCategory((prev) => ({
        ...prev,
        [categoryId]: {
          ...(prev[categoryId] || { items: [], page: 1, limit: 10, total: 0, hasMore: false }),
          isLoading: false,
        },
      }))
    }
  }

  // ============================================
  // SEARCH
  // ============================================
  const handleSearch = async (page = 1) => {
    if (!searchQuery.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    setIsSearchMode(true)
    setSearchPagination((prev) => ({ ...prev, isLoading: true }))

    try {
      if (searchItems) {
        const response = await itemService.getAll({
          search: searchQuery,
          page,
          limit: 20,
          sortBy: 'name',
          order: 'asc',
        })

        setSearchResults(page === 1 ? response.data : [...searchResults, ...response.data])
        setSearchPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          hasMore: response.page * response.limit < response.total,
          isLoading: false,
        })
      }
    } catch (error: any) {
      console.error('Search error:', error)
      showToast(error.message || 'Search failed', 'error')
      setSearchPagination((prev) => ({ ...prev, isLoading: false }))
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setIsSearchMode(false)
    setSearchResults([])
    setSearchPagination({ page: 1, limit: 20, total: 0, hasMore: false, isLoading: false })
  }

  // ============================================
  // CATEGORY EXPANSION
  // ============================================
  const handleToggleCategory = (categoryId: number) => {
    const isExpanded = expandedCategories.has(categoryId)

    if (isExpanded) {
      setExpandedCategories((prev) => {
        const next = new Set(prev)
        next.delete(categoryId)
        return next
      })
    } else {
      setExpandedCategories((prev) => new Set(prev).add(categoryId))

      if (!itemsByCategory[categoryId]) {
        loadItemsForCategory(categoryId)
      }

      const category = categories.find((c) => c.id === categoryId)
      if (category && (category as any).childrenCount > 0) {
        const hasChildren = categories.some((c) => c.parentId === categoryId)
        if (!hasChildren) {
          loadCategoryChildren(categoryId)
        }
      }
    }
  }

  // ============================================
  // CATEGORY CRUD
  // ============================================
  const handleSaveCategory = async (data: Partial<Category>) => {
    setIsLoading(true)
    setValidationErrors([])

    try {
      if (editingCategory) {
        const response = await categoryService.update(editingCategory.id, {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          sortOrder: data.sortOrder,
          parentId: data.parentId || null,
        })

        if (response.success) {
          setCategories((cats) =>
            cats.map((c) => 
              c.id === editingCategory.id 
                ? { ...response.data, itemCount: c.itemCount, childrenCount: (c as any).childrenCount } 
                : c
            ),
          )
          showToast('Category updated successfully', 'success')
          setShowCategoryModal(false)
          setEditingCategory(undefined)

          if (isSearchMode) {
            handleSearch(1)
          }
        }
      } else {
        const response = await categoryService.create({
          name: data.name!,
          description: data.description,
          isActive: data.isActive ?? true,
          sortOrder: data.sortOrder ?? categories.length + 1,
          parentId: data.parentId || selectedParentId,
        })

        if (response.success) {
          const newCategory = {
            ...response.data,
            itemCount: 0,
            childrenCount: 0,
          }

          if (newCategory.parentId) {
            // Auto-expand parent category to show new subcategory
            setExpandedCategories((prev) => new Set(prev).add(newCategory.parentId!))
            // Load children to get the new subcategory
            await loadCategoryChildren(newCategory.parentId)
          } else {
            // Add root category directly
            setCategories((prev) => [...prev, newCategory])
          }

          setItemsByCategory((prev) => ({
            ...prev,
            [response.data.id]: {
              items: [],
              page: 1,
              limit: 10,
              total: 0,
              hasMore: false,
              isLoading: false,
            },
          }))

          showToast('Category created successfully', 'success')
          setShowCategoryModal(false)
          setSelectedParentId(null)
        }
      }
    } catch (error: any) {
      console.error('Category save error:', error)

      if (error.code === 'VALIDATION_ERROR' && error.details) {
        setValidationErrors(error.details)
        showToast('Please fix the validation errors', 'error')
        return
      }

      showToast(error.message || 'Failed to save category', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCategory = async (category: Category) => {
    const hasChildren = categories.some((c) => c.parentId === category.id)
    if (hasChildren && !confirm(`Delete ${category.name} and all its subcategories?`)) return

    const categoryItems = itemsByCategory[category.id]?.items || []
    if (categoryItems.length > 0 && !confirm(`Delete ${category.name} and its ${categoryItems.length} items?`)) return

    try {
      await categoryService.delete(category.id)

      const deleteWithChildren = (catId: number) => {
        const children = categories.filter((c) => c.parentId === catId)
        children.forEach((child) => deleteWithChildren(child.id))
        setCategories((cats) => cats.filter((c) => c.id !== catId))
        setItemsByCategory((prev) => {
          const newItems = { ...prev }
          delete newItems[catId]
          return newItems
        })
      }

      deleteWithChildren(category.id)
      showToast('Category deleted', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to delete category', 'error')
    }
  }

  // ============================================
  // ITEM CRUD
  // ============================================
  const handleSaveItem = async (data: Partial<Item>) => {
    setIsLoading(true)
    setValidationErrors([])

    try {
      if (editingItem) {
        const response = await itemService.update(editingItem.id, {
          name: data.name,
          description: data.description,
          price: data.price,
          categoryId: data.categoryId,
          imageUrl: data.imageUrl,
          isVeg: data.isVeg,
          isAvailable: data.isAvailable,
          sortOrder: data.sortOrder,
        })

        if (response.success) {
          setItemsByCategory((prev) => ({
            ...prev,
            [editingItem.categoryId]: {
              ...prev[editingItem.categoryId],
              items: prev[editingItem.categoryId].items.map((i) =>
                i.id === editingItem.id ? response.data : i,
              ),
            },
          }))

          if (isSearchMode) {
            setSearchResults((prev) =>
              prev.map((i) => (i.id === editingItem.id ? response.data : i)),
            )
          }

          showToast('Item updated successfully', 'success')
          setShowItemModal(false)
          setEditingItem(undefined)
        }
      } else {
        const response = await itemService.create({
          name: data.name!,
          description: data.description,
          price: data.price!,
          categoryId: data.categoryId!,
          imageUrl: data.imageUrl || null,
          isVeg: data.isVeg!,
          isAvailable: data.isAvailable!,
          sortOrder: data.sortOrder || (itemsByCategory[data.categoryId!]?.items.length || 0) + 1,
        })

        if (response.success) {
          setItemsByCategory((prev) => ({
            ...prev,
            [data.categoryId!]: {
              ...prev[data.categoryId!],
              items: [...(prev[data.categoryId!]?.items || []), response.data],
              total: (prev[data.categoryId!]?.total || 0) + 1,
            },
          }))

          setCategories((prev) =>
            prev.map((c) =>
              c.id === data.categoryId ? { ...c, itemCount: (c.itemCount || 0) + 1 } : c,
            ),
          )

          showToast('Item added successfully', 'success')
          setShowItemModal(false)
        }
      }
    } catch (error: any) {
      console.error('Item save error:', error)

      if (error.code === 'VALIDATION_ERROR' && error.details) {
        setValidationErrors(error.details)
        showToast('Please fix the validation errors', 'error')
        return
      }

      showToast(error.message || 'Failed to save item', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteItem = async (item: Item) => {
    if (!confirm(`Delete ${item.name}?`)) return

    try {
      await itemService.delete(item.id)

      setItemsByCategory((prev) => ({
        ...prev,
        [item.categoryId]: {
          ...prev[item.categoryId],
          items: prev[item.categoryId].items.filter((i) => i.id !== item.id),
          total: prev[item.categoryId].total - 1,
        },
      }))

      setCategories((prev) =>
        prev.map((c) =>
          c.id === item.categoryId ? { ...c, itemCount: Math.max(0, (c.itemCount || 0) - 1) } : c,
        ),
      )

      if (isSearchMode) {
        setSearchResults((prev) => prev.filter((i) => i.id !== item.id))
      }

      showToast('Item deleted', 'success')
    } catch (error: any) {
      showToast(error.message || 'Failed to delete item', 'error')
    }
  }

  const handleToggleItemAvailability = async (item: Item) => {
    try {
      const response = await itemService.toggleAvailability(item.id)

      if (response.success) {
        setItemsByCategory((prev) => ({
          ...prev,
          [item.categoryId]: {
            ...prev[item.categoryId],
            items: prev[item.categoryId].items.map((i) =>
              i.id === item.id ? response.data : i,
            ),
          },
        }))

        if (isSearchMode) {
          setSearchResults((prev) =>
            prev.map((i) => (i.id === item.id ? response.data : i)),
          )
        }

        showToast(
          item.isAvailable ? 'Item marked as unavailable' : 'Item marked as available',
          'success',
        )
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to update item', 'error')
    }
  }

  // ============================================
  // HELPERS
  // ============================================
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const handleOpenCategoryModal = (category?: Category, parentId?: number) => {
    setEditingCategory(category)
    setSelectedParentId(parentId || null)
    setValidationErrors([])
    setShowCategoryModal(true)
  }

  const handleOpenItemModal = (item?: Item, catId?: number) => {
    setEditingItem(item)
    setSelectedCategoryId(catId || item?.categoryId || 1)
    setValidationErrors([])
    setShowItemModal(true)
  }

  const handleCloseModal = () => {
    setShowCategoryModal(false)
    setShowItemModal(false)
    setEditingCategory(undefined)
    setEditingItem(undefined)
    setSelectedParentId(null)
    setValidationErrors([])
  }

  const buildCategoryTree = (cats: Category[]): Category[] => {
    const categoryMap = new Map<number, Category>()
    const rootCategories: Category[] = []

    cats.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, children: [] })
    })

    cats.forEach((cat) => {
      const category = categoryMap.get(cat.id)!
      if (cat.parentId === null) {
        rootCategories.push(category)
      } else {
        const parent = categoryMap.get(cat.parentId)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(category)
        }
      }
    })

    const sortCategories = (categories: Category[]) => {
      categories.sort((a, b) => a.sortOrder - b.sortOrder)
      categories.forEach((cat) => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children)
        }
      })
    }

    sortCategories(rootCategories)
    return rootCategories
  }

  const renderCategory = (category: Category, level: number = 0) => {
    const categoryItems = itemsByCategory[category.id]?.items || []
    const itemsPagination = itemsByCategory[category.id]
    const isExpanded = expandedCategories.has(category.id)

    return (
      <div key={category.id} onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) return
        handleToggleCategory(category.id)
      }}>
        <CategoryCard
          category={category}
          items={isExpanded ? categoryItems : []}
          onEdit={() => handleOpenCategoryModal(category)}
          onDelete={() => handleDeleteCategory(category)}
          onAddItem={() => handleOpenItemModal(undefined, category.id)}
          onAddSubcategory={level < 2 ? () => handleOpenCategoryModal(undefined, category.id) : undefined}
          onEditItem={(item) => handleOpenItemModal(item)}
          onDeleteItem={handleDeleteItem}
          onToggleItemAvailability={handleToggleItemAvailability}
          onLoadMoreItems={
            itemsPagination?.hasMore
              ? () => loadItemsForCategory(category.id, itemsPagination.page + 1)
              : undefined
          }
          itemsPagination={
            itemsPagination
              ? {
                  currentCount: itemsPagination.items.length,
                  totalCount: itemsPagination.total,
                  hasMore: itemsPagination.hasMore,
                  isLoading: itemsPagination.isLoading,
                }
              : undefined
          }
          level={level}
        >
          {category.children && category.children.length > 0 && isExpanded && (
            <div className="space-y-3 mt-3">
              {category.children.map((child) => renderCategory(child, level + 1))}
            </div>
          )}
        </CategoryCard>
      </div>
    )
  }

  const categoryTree = buildCategoryTree(categories)

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-600 mt-1">Manage your categories and menu items</p>
        </div>
        <button
          onClick={() => handleOpenCategoryModal()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex gap-2 mb-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(1)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => handleSearch(1)}
            disabled={!searchQuery.trim()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Search
          </button>
          {isSearchMode && (
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={searchItems}
              onChange={(e) => setSearchItems(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Search Items
          </label>
        </div>
      </div>

      {isSearchMode && (
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Search Results ({searchPagination.total})</h2>
            <button onClick={handleClearSearch} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Categories
            </button>
          </div>

          {searchPagination.isLoading && searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No items found for "{searchQuery}"</div>
          ) : (
            <>
              <div className="grid gap-3">
                {searchResults.map((item) => {
                  const category = categories.find((c) => c.id === item.categoryId)
                  return (
                    <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          {item.isVeg ? (
                            <span className="w-5 h-5 border-2 border-green-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-green-600"></span>
                            </span>
                          ) : (
                            <span className="w-5 h-5 border-2 border-red-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-red-600"></span>
                            </span>
                          )}
                        </div>
                        {item.description && <p className="text-sm text-gray-600 mb-1">{item.description}</p>}
                        <p className="text-xs text-gray-500">{category?.name || 'Unknown Category'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold text-gray-900">₹{(item.price / 100).toFixed(2)}</span>
                        <button
                          onClick={() => handleToggleItemAvailability(item)}
                          className={`px-3 py-1 rounded text-xs font-medium ${
                            item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                        <button
                          onClick={() => handleOpenItemModal(item)}
                          className="px-3 py-1 bg-blue-50 text-blue-600 rounded text-sm font-medium hover:bg-blue-100 transition"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {searchPagination.hasMore && (
                <LoadMoreButton
                  onLoadMore={() => handleSearch(searchPagination.page + 1)}
                  hasMore={searchPagination.hasMore}
                  isLoading={searchPagination.isLoading}
                  currentCount={searchResults.length}
                  totalCount={searchPagination.total}
                  itemName="items"
                />
              )}
            </>
          )}
        </div>
      )}

      {!isSearchMode && (
        <>
          {categoryTree.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first category</p>
              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
              >
                <Plus className="w-5 h-5" />
                Add Category
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {categoryTree.map((category) => renderCategory(category, 0))}
              </div>

              {categoryPagination.hasMore && (
                <LoadMoreButton
                  onLoadMore={() => loadCategories(categoryPagination.page + 1)}
                  hasMore={categoryPagination.hasMore}
                  isLoading={categoryPagination.isLoading}
                  currentCount={categories.filter((c) => c.parentId === null).length}
                  totalCount={categoryPagination.total}
                  itemName="categories"
                />
              )}
            </>
          )}
        </>
      )}

      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={handleCloseModal}
        onSave={handleSaveCategory}
        category={editingCategory}
        isLoading={isLoading}
        validationErrors={validationErrors}
        categories={categories}
        parentId={selectedParentId}
      />

      <ItemFormModal
        isOpen={showItemModal}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={editingItem}
        categoryId={selectedCategoryId}
        categories={categories}
        isLoading={isLoading}
        validationErrors={validationErrors}
      />
    </div>
  )
}