// src/pages/Admin/menu/index.tsx
import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import {
  Category,
  Item,
  ToastType,
  ValidationError,
} from '../../../types/menue'
import Toast from '../../../components/admin/common/Toast'
import Spinner from '../../../components/admin/common/Spinner'
import CategoryCard from '../../../components/admin/menue/CategoryCard'
import CategoryFormModal from '../../../components/admin/menue/CategoryFormModal'
import ItemFormModal from '../../../components/admin/menue/ItemFormModal'
import LoadMoreButton from '../../../components/admin/common/LoadMoreButton'
import { categoryService, itemService } from '../../../utils/menuService'
import theme, { getThemeClasses } from '../../../configs/theme.ts'
import { useSearch } from '../../../state/SearchContext'
import { asAppError } from '../../../utils/api.ts'


export default function MenuManagement() {
  // ── Search state lives in context ────────────────────────────────────────
  const {
    isSearchMode,
    searchResults,
    searchPagination,
    searchQuery,
    searchType,
    executeSearch,
    clearSearch,
    updateSearchResult,
    removeSearchResult,
  } = useSearch()

  // ── Local state ──────────────────────────────────────────────────────────
  const [categories, setCategories] = useState<Category[]>([])
  const [categoryPagination, setCategoryPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
    isLoading: false,
  })

  // null = not yet attempted; true = in progress; false = done
  const [initialLoading, setInitialLoading] = useState(true)

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

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1)
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null)

  const [toast, setToast] = useState<ToastType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    [],
  )
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(
    new Set(),
  )

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async (page = 1) => {
    // Only set the full-page spinner on first load (page 1 with no data yet)
    if (page === 1 && categories.length === 0) {
      setInitialLoading(true)
    }
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

      setCategories((prev) =>
        page === 1 ? newCategories : [...prev, ...newCategories],
      )

      setCategoryPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore:
          response.total > 10 &&
          response.page * response.limit < response.total,
        isLoading: false,
      })
    } catch (err) {
      const error = asAppError(err)
      console.error('Load categories error:', error)
      showToast(error.message || 'Failed to load categories', 'error')
      setCategoryPagination((prev) => ({ ...prev, isLoading: false }))
    } finally {
      setInitialLoading(false)
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
        const next = [...prev]
        const filtered = next.filter((c) => c.parentId !== parentId)
        filtered.splice(parentIndex + 1, 0, ...childCategories)
        return filtered
      })
    } catch (err) {
      const error = asAppError(err)
      console.error('Load children error:', error)
      showToast(error.message || 'Failed to load subcategories', 'error')
    }
  }

  const loadItemsForCategory = async (categoryId: number, page = 1) => {
    setItemsByCategory((prev) => ({
      ...prev,
      [categoryId]: {
        ...(prev[categoryId] || {
          items: [],
          page: 1,
          limit: 10,
          total: 0,
          hasMore: false,
        }),
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
          items:
            page === 1
              ? response.data
              : [...(prev[categoryId]?.items || []), ...response.data],
          page: response.page,
          limit: response.limit,
          total: response.total,
          hasMore: response.page * response.limit < response.total,
          isLoading: false,
        },
      }))
    } catch (err) {
      const error = asAppError(err)
      console.error('Load items error:', error)
      showToast(error.message || 'Failed to load items', 'error')
      setItemsByCategory((prev) => ({
        ...prev,
        [categoryId]: {
          ...(prev[categoryId] || {
            items: [],
            page: 1,
            limit: 10,
            total: 0,
            hasMore: false,
          }),
          isLoading: false,
        },
      }))
    }
  }

  // ── Category expansion ───────────────────────────────────────────────────
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

  // ── Category CRUD ────────────────────────────────────────────────────────
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
                ? {
                    ...response.data,
                    itemCount: c.itemCount,
                    childrenCount: (c as any).childrenCount,
                  }
                : c,
            ),
          )
          showToast('Category updated successfully', 'success')
          setShowCategoryModal(false)
          setEditingCategory(undefined)

          if (isSearchMode) {
            executeSearch(searchQuery, searchType, 1)
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
            setExpandedCategories((prev) =>
              new Set(prev).add(newCategory.parentId!),
            )
            await loadCategoryChildren(newCategory.parentId)
          } else {
            setCategories((prev) => [...prev, newCategory])
          }

          setItemsByCategory((prev) => ({
            ...prev,
            [response.data.id]: {
              items: [],
              page: 1,
              limit: 2,
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
    } catch (err) {
      const error = asAppError(err)
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
    const categoryItems = itemsByCategory[category.id]?.items || []

    let confirmMessage = `Delete "${category.name}"?`
    if (hasChildren)
      confirmMessage += '\n\nThis will also delete all subcategories.'
    if (categoryItems.length > 0)
      confirmMessage += `\n\nThis category contains ${categoryItems.length} item(s).`
    confirmMessage += '\n\nThis action cannot be undone.'

    if (!confirm(confirmMessage)) return

    try {
      await categoryService.delete(category.id)

      const deleteWithChildren = (catId: number) => {
        const children = categories.filter((c) => c.parentId === catId)
        children.forEach((child) => deleteWithChildren(child.id))
        setCategories((cats) => cats.filter((c) => c.id !== catId))
        setItemsByCategory((prev) => {
          const next = { ...prev }
          delete next[catId]
          return next
        })
      }

      deleteWithChildren(category.id)
      showToast('Category deleted successfully', 'success')
    } catch (err) {
      const error = asAppError(err)
      console.error('Delete category error:', error)
      showToast(error.message || 'Failed to delete category', 'error')
    }
  }

  const handleToggleCategoryActive = async (category: Category) => {
    try {
      const response = await categoryService.toggleActive(category.id)

      if (response.success) {
        setCategories((cats) =>
          cats.map((c) =>
            c.id === category.id
              ? { ...c, isActive: response.data.isActive }
              : c,
          ),
        )
        showToast(
          `Category ${
            response.data.isActive ? 'activated' : 'deactivated'
          } successfully`,
          'success',
        )
      }
    } catch (err) {
      const error = asAppError(err)
      console.error('Toggle category error:', error)
      showToast(error.message || 'Failed to toggle category status', 'error')
    }
  }

  // ── Item CRUD ────────────────────────────────────────────────────────────
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
          const oldCategoryId = editingItem.categoryId
          const newCategoryId = response.data.categoryId

          if (oldCategoryId !== newCategoryId) {
            if (itemsByCategory[oldCategoryId]) {
              setItemsByCategory((prev) => ({
                ...prev,
                [oldCategoryId]: {
                  ...prev[oldCategoryId],
                  items: prev[oldCategoryId].items.filter(
                    (i) => i.id !== editingItem.id,
                  ),
                  total: prev[oldCategoryId].total - 1,
                },
              }))
              setCategories((prev) =>
                prev.map((c) =>
                  c.id === oldCategoryId
                    ? { ...c, itemCount: Math.max(0, (c.itemCount || 0) - 1) }
                    : c,
                ),
              )
            }
            if (itemsByCategory[newCategoryId]) {
              setItemsByCategory((prev) => ({
                ...prev,
                [newCategoryId]: {
                  ...prev[newCategoryId],
                  items: [...prev[newCategoryId].items, response.data],
                  total: prev[newCategoryId].total + 1,
                },
              }))
              setCategories((prev) =>
                prev.map((c) =>
                  c.id === newCategoryId
                    ? { ...c, itemCount: (c.itemCount || 0) + 1 }
                    : c,
                ),
              )
            }
          } else {
            if (itemsByCategory[oldCategoryId]) {
              setItemsByCategory((prev) => ({
                ...prev,
                [oldCategoryId]: {
                  ...prev[oldCategoryId],
                  items: prev[oldCategoryId].items.map((i) =>
                    i.id === editingItem.id ? response.data : i,
                  ),
                },
              }))
            }
          }

          if (isSearchMode) updateSearchResult(response.data)

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
          sortOrder:
            data.sortOrder ||
            (itemsByCategory[data.categoryId!]?.items.length || 0) + 1,
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
              c.id === data.categoryId
                ? { ...c, itemCount: (c.itemCount || 0) + 1 }
                : c,
            ),
          )
          showToast('Item added successfully', 'success')
          setShowItemModal(false)
        }
      }
    } catch (err) {
      const error = asAppError(err)
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
    if (!confirm(`Delete "${item.name}"?\n\nThis action cannot be undone.`))
      return

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
          c.id === item.categoryId
            ? { ...c, itemCount: Math.max(0, (c.itemCount || 0) - 1) }
            : c,
        ),
      )

      if (isSearchMode) removeSearchResult(item.id)

      showToast('Item deleted successfully', 'success')
    } catch (err) {
      const error = asAppError(err)
      console.error('Delete item error:', error)
      showToast(error.message || 'Failed to delete item', 'error')
    }
  }

  const handleToggleItemAvailability = async (item: Item) => {
    try {
      const response = await itemService.toggleAvailability(item.id)

      if (response.success) {
        const updatedItem = { ...item, ...response.data }

        if (itemsByCategory[item.categoryId]) {
          setItemsByCategory((prev) => ({
            ...prev,
            [item.categoryId]: {
              ...prev[item.categoryId],
              items: prev[item.categoryId].items.map((i) =>
                i.id === item.id ? updatedItem : i,
              ),
            },
          }))
        }

        if (isSearchMode) updateSearchResult(updatedItem)

        showToast(
          item.isAvailable
            ? 'Item marked as unavailable'
            : 'Item marked as available',
          'success',
        )
      }
    } catch (err) {
      const error = asAppError(err)
      showToast(error.message || 'Failed to update item', 'error')
    }
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
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

    cats.forEach((cat) => categoryMap.set(cat.id, { ...cat, children: [] }))
    cats.forEach((cat) => {
      const category = categoryMap.get(cat.id)!
      if (cat.parentId === null) {
        rootCategories.push(category)
      } else {
        const parent =
          cat.parentId !== undefined ? categoryMap.get(cat.parentId) : undefined
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(category)
        }
      }
    })

    const sortCategories = (categories: Category[]) => {
      categories.sort((a, b) => a.sortOrder - b.sortOrder)
      categories.forEach((cat) => {
        if (cat.children?.length) sortCategories(cat.children)
      })
    }

    sortCategories(rootCategories)
    return rootCategories
  }

  const renderCategory = (category: Category, level = 0) => {
    const categoryItems = itemsByCategory[category.id]?.items || []
    const itemsPagination = itemsByCategory[category.id]
    const isExpanded = expandedCategories.has(category.id)
    const liveChildrenCount = categories.filter(
      (c) => c.parentId === category.id,
    ).length

    return (
      <div key={category.id}>
        <CategoryCard
          category={category}
          items={isExpanded ? categoryItems : []}
          isExpanded={isExpanded}
          onToggleExpand={() => handleToggleCategory(category.id)}
          onEdit={() => handleOpenCategoryModal(category)}
          onDelete={() => handleDeleteCategory(category)}
          onToggleActive={() => handleToggleCategoryActive(category)}
          onAddItem={() => handleOpenItemModal(undefined, category.id)}
          onAddSubcategory={
            level < 2
              ? () => handleOpenCategoryModal(undefined, category.id)
              : undefined
          }
          onEditItem={(item) => handleOpenItemModal(item)}
          onDeleteItem={handleDeleteItem}
          onToggleItemAvailability={handleToggleItemAvailability}
          onLoadMoreItems={
            itemsPagination?.hasMore
              ? () =>
                  loadItemsForCategory(category.id, itemsPagination.page + 1)
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
          liveChildrenCount={liveChildrenCount}
        >
          {category.children?.length && isExpanded ? (
            <div className="space-y-3 mt-3">
              {category.children.map((child) =>
                renderCategory(child, level + 1),
              )}
            </div>
          ) : null}
        </CategoryCard>
      </div>
    )
  }

  const categoryTree = buildCategoryTree(categories)

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-bold ${theme.secondary.text}`}
          >
            Menu Management
          </h1>
          <p className={`${theme.secondary.textMuted} mt-1`}>
            {isSearchMode
              ? `Showing ${searchPagination.total} result${
                  searchPagination.total !== 1 ? 's' : ''
                } for "${searchQuery}"`
              : 'Manage your categories and menu items'}
          </p>
        </div>
        <button
          onClick={() => handleOpenCategoryModal()}
          className={`inline-flex items-center justify-center gap-2 px-4 py-2 ${getThemeClasses.buttonPrimary()} shadow-sm`}
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* ── Search Results ── */}
      {isSearchMode && (
        <div className={getThemeClasses.searchBar()}>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${theme.secondary.text}`}>
              Search Results ({searchPagination.total})
            </h2>
            <button
              onClick={clearSearch}
              className={`text-sm ${theme.accent.textDark} font-medium`}
            >
              ← Back to Categories
            </button>
          </div>

          {searchPagination.isLoading && searchResults.length === 0 ? (
            <div className="py-12 flex justify-center">
              <Spinner size="md" message="Searching…" />
            </div>
          ) : searchResults.length === 0 ? (
            <div className={`text-center py-8 ${theme.secondary.textMuted}`}>
              No items found for "{searchQuery}"
            </div>
          ) : (
            <>
              <div className="grid gap-3">
                {searchResults.map((item) => {
                  const category = categories.find(
                    (c) => c.id === item.categoryId,
                  )
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-4 border ${theme.secondary.border} rounded-lg hover:border-indigo-300 transition`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4
                            className={`font-medium ${theme.secondary.text} truncate`}
                          >
                            {item.name}
                          </h4>
                          {item.isVeg ? (
                            <span className="w-5 h-5 flex-shrink-0 border-2 border-green-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-green-600" />
                            </span>
                          ) : (
                            <span className="w-5 h-5 flex-shrink-0 border-2 border-red-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-red-600" />
                            </span>
                          )}
                        </div>
                        {item.description && (
                          <p
                            className={`text-sm ${theme.secondary.textMuted} mb-1 truncate`}
                          >
                            {item.description}
                          </p>
                        )}
                        <p className={`text-xs ${theme.secondary.textSubtle}`}>
                          {category?.name || 'Unknown Category'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-3">
                        <span
                          className={`text-base sm:text-lg font-semibold ${theme.secondary.text}`}
                        >
                          ₹{(item.price / 100).toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleToggleItemAvailability(item)}
                          className={`px-2 sm:px-3 py-1 rounded text-xs font-medium ${
                            item.isAvailable
                              ? `${theme.status.success.bg} ${theme.status.success.text}`
                              : `${theme.status.error.bg} ${theme.status.error.text}`
                          }`}
                        >
                          {item.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                        <button
                          onClick={() => handleOpenItemModal(item)}
                          className={`px-2 sm:px-3 py-1 ${theme.accent.bgLight} ${theme.accent.textDark} rounded text-sm font-medium hover:${theme.accent.bgLightHover} transition`}
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
                  onLoadMore={() =>
                    executeSearch(
                      searchQuery,
                      searchType,
                      searchPagination.page + 1,
                    )
                  }
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

      {/* ── Category Tree ── */}
      {!isSearchMode && (
        <>
          {/* Full-page spinner on initial load — no pre-filled values shown */}
          {initialLoading ? (
            <div
              className={`${theme.secondary.bg} rounded-xl border ${theme.secondary.border} py-20 flex justify-center`}
            >
              <Spinner
                size="lg"
                message="Loading menu…"
                submessage="Fetching your categories and items"
              />
            </div>
          ) : categoryTree.length === 0 ? (
            <div
              className={`${theme.secondary.bg} rounded-xl border-2 border-dashed ${theme.secondary.border} p-12 text-center`}
            >
              <div
                className={`w-16 h-16 ${theme.secondary.bgMuted} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                <Plus className={`w-8 h-8 ${theme.secondary.textSubtle}`} />
              </div>
              <h3
                className={`text-lg font-medium ${theme.secondary.text} mb-2`}
              >
                No categories yet
              </h3>
              <p className={`${theme.secondary.textMuted} mb-4`}>
                Get started by adding your first category
              </p>
              <button
                onClick={() => handleOpenCategoryModal()}
                className={`inline-flex items-center gap-2 px-6 py-3 ${getThemeClasses.buttonPrimary()}`}
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
                  currentCount={
                    categories.filter((c) => c.parentId === null).length
                  }
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
