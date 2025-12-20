// src/pages/Admin/menue/index.tsx
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Category, Item, ToastType } from '../../../types/menue'
import Toast from '../../../components/admin/common/Toast'
import SampleBanner from '../../../components/admin/menue/SampleBanner'
import CategoryCard from '../../../components/admin/menue/CategoryCard'
import CategoryFormModal from '../../../components/admin/menue/CategoryFormModal'
import ItemFormModal from '../../../components/admin/menue/ItemFormModal'

// Mock sample data - Replace with API calls in production
const MOCK_SAMPLE_DATA = {
  categories: [
    {
      id: 1,
      name: 'Starters',
      description: 'Appetizers and finger foods',
      sortOrder: 1,
      isActive: true,
    },
    {
      id: 2,
      name: 'Main Course',
      description: 'Main dishes',
      sortOrder: 2,
      isActive: true,
    },
    {
      id: 3,
      name: 'Breads',
      description: 'Indian breads',
      sortOrder: 3,
      isActive: true,
    },
    {
      id: 4,
      name: 'Beverages',
      description: 'Drinks and refreshments',
      sortOrder: 4,
      isActive: true,
    },
    {
      id: 5,
      name: 'Desserts',
      description: 'Sweet treats',
      sortOrder: 5,
      isActive: true,
    },
  ] as Category[],
  items: [
    {
      id: 1,
      categoryId: 1,
      name: 'Sample Paneer Tikka',
      description: 'Grilled cottage cheese cubes marinated in spices',
      price: 18000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 2,
      categoryId: 1,
      name: 'Sample Veg Spring Rolls',
      description: 'Crispy rolls filled with vegetables',
      price: 12000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 3,
      categoryId: 1,
      name: 'Sample Chicken Tikka',
      description: 'Marinated chicken pieces grilled to perfection',
      price: 22000,
      isVeg: false,
      isAvailable: true,
      sortOrder: 3,
    },
    {
      id: 4,
      categoryId: 1,
      name: 'Sample Tandoori Chicken',
      description: 'Chicken marinated in yogurt and spices',
      price: 28000,
      isVeg: false,
      isAvailable: true,
      sortOrder: 4,
    },
    {
      id: 5,
      categoryId: 2,
      name: 'Sample Butter Chicken',
      description: 'Tender chicken in rich tomato cream gravy',
      price: 28000,
      isVeg: false,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 6,
      categoryId: 2,
      name: 'Sample Dal Makhani',
      description: 'Black lentils cooked in butter and cream',
      price: 16000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 7,
      categoryId: 2,
      name: 'Sample Paneer Butter Masala',
      description: 'Cottage cheese in tomato gravy',
      price: 20000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 3,
    },
    {
      id: 8,
      categoryId: 2,
      name: 'Sample Chicken Biryani',
      description: 'Fragrant rice with spiced chicken',
      price: 25000,
      isVeg: false,
      isAvailable: true,
      sortOrder: 4,
    },
    {
      id: 9,
      categoryId: 2,
      name: 'Sample Veg Biryani',
      description: 'Aromatic rice with mixed vegetables',
      price: 18000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 5,
    },
    {
      id: 10,
      categoryId: 2,
      name: 'Sample Kadhai Paneer',
      description: 'Cottage cheese with bell peppers',
      price: 21000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 6,
    },
    {
      id: 11,
      categoryId: 3,
      name: 'Sample Butter Naan',
      description: 'Leavened flatbread with butter',
      price: 5000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 12,
      categoryId: 3,
      name: 'Sample Garlic Naan',
      description: 'Naan with garlic and coriander',
      price: 6000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 13,
      categoryId: 3,
      name: 'Sample Tandoori Roti',
      description: 'Whole wheat flatbread',
      price: 4000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 3,
    },
    {
      id: 14,
      categoryId: 3,
      name: 'Sample Lachha Paratha',
      description: 'Multi-layered flatbread',
      price: 6000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 4,
    },
    {
      id: 15,
      categoryId: 3,
      name: 'Sample Stuffed Kulcha',
      description: 'Stuffed leavened bread',
      price: 7000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 5,
    },
    {
      id: 16,
      categoryId: 4,
      name: 'Sample Lassi',
      description: 'Yogurt-based drink',
      price: 6000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 17,
      categoryId: 4,
      name: 'Sample Masala Chai',
      description: 'Spiced Indian tea',
      price: 3000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 18,
      categoryId: 4,
      name: 'Sample Fresh Lime Soda',
      description: 'Refreshing lime drink',
      price: 5000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 3,
    },
    {
      id: 19,
      categoryId: 4,
      name: 'Sample Cold Coffee',
      description: 'Chilled coffee drink',
      price: 8000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 4,
    },
    {
      id: 20,
      categoryId: 5,
      name: 'Sample Gulab Jamun',
      description: 'Sweet fried dough balls in syrup',
      price: 8000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 1,
    },
    {
      id: 21,
      categoryId: 5,
      name: 'Sample Rasmalai',
      description: 'Cottage cheese dumplings in cream',
      price: 10000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 2,
    },
    {
      id: 22,
      categoryId: 5,
      name: 'Sample Kulfi',
      description: 'Traditional Indian ice cream',
      price: 9000,
      isVeg: true,
      isAvailable: true,
      sortOrder: 3,
    },
  ] as Item[],
}

export default function MenuManagement() {
  const [categories, setCategories] = useState<Category[]>(
    MOCK_SAMPLE_DATA.categories,
  )
  const [items, setItems] = useState<Item[]>(MOCK_SAMPLE_DATA.items)

  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showItemModal, setShowItemModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const [editingItem, setEditingItem] = useState<Item | undefined>()
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1)

  const [toast, setToast] = useState<ToastType | null>(null)
  const [showBanner, setShowBanner] = useState(true)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
  }

  const isSampleItem = (name: string) => name.startsWith('Sample ')
  const hasSampleData = items.some((item) => isSampleItem(item.name))

  // Category CRUD
  const handleSaveCategory = (data: Partial<Category>) => {
    if (editingCategory) {
      setCategories((cats) =>
        cats.map((c) => (c.id === editingCategory.id ? { ...c, ...data } : c)),
      )
      showToast('Category updated successfully', 'success')
    } else {
      const newCategory: Category = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: data.name!,
        description: data.description,
        sortOrder: categories.length + 1,
        isActive: data.isActive ?? true,
      }
      setCategories([...categories, newCategory])
      showToast('Category created successfully', 'success')
    }
    setEditingCategory(undefined)
  }

  const handleDeleteCategory = (category: Category) => {
    const categoryItems = items.filter((i) => i.categoryId === category.id)
    if (categoryItems.length > 0) {
      if (
        !confirm(
          `Delete ${category.name} and its ${categoryItems.length} items?`,
        )
      )
        return
      setItems(items.filter((i) => i.categoryId !== category.id))
    }
    setCategories(categories.filter((c) => c.id !== category.id))
    showToast('Category deleted', 'success')
  }

  // Item CRUD
  const handleSaveItem = (data: Partial<Item>) => {
    if (editingItem) {
      setItems(
        items.map((i) => (i.id === editingItem.id ? { ...i, ...data } : i)),
      )
      showToast('Item updated successfully', 'success')
    } else {
      const newItem: Item = {
        id: Math.max(...items.map((i) => i.id), 0) + 1,
        categoryId: data.categoryId!,
        name: data.name!,
        description: data.description,
        price: data.price!,
        isVeg: data.isVeg!,
        isAvailable: data.isAvailable!,
        sortOrder:
          items.filter((i) => i.categoryId === data.categoryId).length + 1,
        imageUrl: data.imageUrl || null,
      }
      setItems([...items, newItem])
      showToast('Item added successfully', 'success')
    }
    setEditingItem(undefined)
  }

  const handleDeleteItem = (item: Item) => {
    if (!confirm(`Delete ${item.name}?`)) return
    setItems(items.filter((i) => i.id !== item.id))
    showToast('Item deleted', 'success')
  }

  const handleToggleItemAvailability = (item: Item) => {
    setItems(
      items.map((i) =>
        i.id === item.id ? { ...i, isAvailable: !i.isAvailable } : i,
      ),
    )
    showToast(
      item.isAvailable
        ? 'Item marked as unavailable'
        : 'Item marked as available',
      'success',
    )
  }

  const handleClearSampleData = () => {
    if (
      !confirm(
        'Clear all sample data? This will delete all sample categories and items. This cannot be undone.',
      )
    )
      return

    const sampleItemIds = items
      .filter((i) => isSampleItem(i.name))
      .map((i) => i.id)
    setItems(items.filter((i) => !sampleItemIds.includes(i.id)))

    showToast('Sample data cleared', 'success')
    setShowBanner(false)
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Menu Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your categories and menu items
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCategory(undefined)
            setShowCategoryModal(true)
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      {/* Sample Banner */}
      {showBanner && hasSampleData && (
        <SampleBanner
          onStartEditing={() => setShowBanner(false)}
          onClearAll={handleClearSampleData}
          onDismiss={() => setShowBanner(false)}
        />
      )}

      {/* Categories List */}
      {categories.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No categories yet
          </h3>
          <p className="text-gray-600 mb-4">
            Get started by adding your first category
          </p>
          <button
            onClick={() => setShowCategoryModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {categories
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                items={items
                  .filter((i) => i.categoryId === category.id)
                  .sort((a, b) => a.sortOrder - b.sortOrder)}
                onEdit={() => {
                  setEditingCategory(category)
                  setShowCategoryModal(true)
                }}
                onDelete={() => handleDeleteCategory(category)}
                onAddItem={() => {
                  setSelectedCategoryId(category.id)
                  setEditingItem(undefined)
                  setShowItemModal(true)
                }}
                onEditItem={(item) => {
                  setEditingItem(item)
                  setSelectedCategoryId(item.categoryId)
                  setShowItemModal(true)
                }}
                onDeleteItem={handleDeleteItem}
                onToggleItemAvailability={handleToggleItemAvailability}
              />
            ))}
        </div>
      )}

      {/* Modals */}
      <CategoryFormModal
        isOpen={showCategoryModal}
        onClose={() => {
          setShowCategoryModal(false)
          setEditingCategory(undefined)
        }}
        onSave={handleSaveCategory}
        category={editingCategory}
      />

      <ItemFormModal
        isOpen={showItemModal}
        onClose={() => {
          setShowItemModal(false)
          setEditingItem(undefined)
        }}
        onSave={handleSaveItem}
        item={editingItem}
        categoryId={selectedCategoryId}
        categories={categories}
      />
    </div>
  )
}
