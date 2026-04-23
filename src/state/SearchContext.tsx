import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Item } from '../types/menue'
import { itemService } from '../utils/menuService'

export type SearchType = 'items' | 'categories'

export interface SearchPagination {
  page: number
  limit: number
  total: number
  hasMore: boolean
  isLoading: boolean
}

const DEFAULT_PAGINATION: SearchPagination = {
  page: 1,
  limit: 20,
  total: 0,
  hasMore: false,
  isLoading: false,
}

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (q: string) => void
  searchType: SearchType
  setSearchType: (t: SearchType) => void
  isSearchMode: boolean
  searchResults: Item[]
  searchPagination: SearchPagination
  executeSearch: (query: string, type?: SearchType, page?: number) => Promise<void>
  clearSearch: () => void
  updateSearchResult: (item: Item) => void
  removeSearchResult: (itemId: number) => void
}

const SearchContext = createContext<SearchContextType | null>(null)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<SearchType>('items')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchResults, setSearchResults] = useState<Item[]>([])
  const [searchPagination, setSearchPagination] = useState<SearchPagination>(DEFAULT_PAGINATION)

  const executeSearch = useCallback(async (
    query: string,
    type: SearchType = 'items',
    page = 1,
  ) => {
    if (!query.trim()) {
      setIsSearchMode(false)
      setSearchResults([])
      return
    }

    setIsSearchMode(true)
    setSearchPagination(prev => ({ ...prev, isLoading: true }))

    try {
      // TODO: when category search is ready → if (type === 'categories') { use categoryService }
      const response = await itemService.getAll({
        search: query,
        page,
        limit: 20,
        sortBy: 'name',
        order: 'asc',
      })

      setSearchResults(prev =>
        page === 1 ? response.data : [...prev, ...response.data],
      )
      setSearchPagination({
        page: response.page,
        limit: response.limit,
        total: response.total,
        hasMore: response.page * response.limit < response.total,
        isLoading: false,
      })
    } catch (err) {
      console.error('Search error:', err)
      setSearchPagination(prev => ({ ...prev, isLoading: false }))
    }
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setIsSearchMode(false)
    setSearchResults([])
    setSearchPagination(DEFAULT_PAGINATION)
  }, [])

  const updateSearchResult = useCallback((item: Item) => {
    setSearchResults(prev => prev.map(i => (i.id === item.id ? item : i)))
  }, [])

  const removeSearchResult = useCallback((itemId: number) => {
    setSearchResults(prev => prev.filter(i => i.id !== itemId))
  }, [])

  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        searchType,
        setSearchType,
        isSearchMode,
        searchResults,
        searchPagination,
        executeSearch,
        clearSearch,
        updateSearchResult,
        removeSearchResult,
      }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const ctx = useContext(SearchContext)
  if (!ctx) throw new Error('useSearch must be used within a SearchProvider')
  return ctx
}