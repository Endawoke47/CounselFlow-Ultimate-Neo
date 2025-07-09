import React, { useState, useMemo } from 'react'
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  Download,
  Upload,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  CheckSquare,
  Square
} from 'lucide-react'
import { cn } from '@/utils/cn'
import { LoadingSpinner } from './LoadingSpinner'

export interface Column<T> {
  key: keyof T | string
  title: string
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  width?: string
  align?: 'left' | 'center' | 'right'
}

export interface TableAction<T> {
  label: string
  icon?: React.ComponentType<{ className?: string }>
  onClick: (item: T) => void
  variant?: 'default' | 'danger' | 'primary'
  condition?: (item: T) => boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  error?: string
  searchable?: boolean
  filterable?: boolean
  selectable?: boolean
  sortable?: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    onLimitChange: (limit: number) => void
  }
  actions?: TableAction<T>[]
  bulkActions?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (selectedItems: T[]) => void
    variant?: 'default' | 'danger' | 'primary'
  }[]
  onSearch?: (query: string) => void
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  onFilter?: (filters: Record<string, any>) => void
  onExport?: (format: 'csv' | 'pdf' | 'xlsx') => void
  onImport?: (file: File) => void
  emptyState?: React.ReactNode
  className?: string
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  loading = false,
  error,
  searchable = true,
  filterable = true,
  selectable = false,
  sortable = true,
  pagination,
  actions = [],
  bulkActions = [],
  onSearch,
  onSort,
  onFilter,
  onExport,
  onImport,
  emptyState,
  className
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    onSearch?.(query)
  }

  // Handle sort
  const handleSort = (key: string) => {
    if (!sortable) return

    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }

    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(data.map(item => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedItems)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedItems(newSelected)
  }

  const isAllSelected = data.length > 0 && selectedItems.size === data.length
  const isIndeterminate = selectedItems.size > 0 && selectedItems.size < data.length

  // Get cell value
  const getCellValue = (item: T, key: string) => {
    return key.split('.').reduce((obj, k) => obj?.[k], item as any)
  }

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    const value = getCellValue(item, column.key as string)
    
    if (column.render) {
      return column.render(value, item)
    }

    if (value === null || value === undefined) {
      return <span className="text-gray-400">-</span>
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No'
    }

    if (value instanceof Date) {
      return value.toLocaleDateString()
    }

    return String(value)
  }

  const selectedItemsArray = useMemo(() => 
    data.filter(item => selectedItems.has(item.id)), 
    [data, selectedItems]
  )

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">Error loading data</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('bg-white rounded-lg shadow-sm', className)}>
      {/* Header with search and actions */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            {searchable && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
            )}

            {filterable && (
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {selectedItems.size > 0 && bulkActions.length > 0 && (
              <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm text-gray-600">
                  {selectedItems.size} selected
                </span>
                {bulkActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <button
                      key={index}
                      onClick={() => action.onClick(selectedItemsArray)}
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded text-sm font-medium',
                        action.variant === 'danger' 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : action.variant === 'primary'
                          ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 mr-1" />}
                      {action.label}
                    </button>
                  )
                })}
              </div>
            )}

            {onImport && (
              <label className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Import
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => e.target.files?.[0] && onImport(e.target.files[0])}
                  className="hidden"
                />
              </label>
            )}

            {onExport && (
              <div className="relative group">
                <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </button>
                <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => onExport('csv')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    CSV
                  </button>
                  <button
                    onClick={() => onExport('xlsx')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Excel
                  </button>
                  <button
                    onClick={() => onExport('pdf')}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="border-t pt-4">
            {/* Add filter components here based on column configuration */}
            <div className="text-sm text-gray-600">
              Filter panel will be implemented based on column configuration
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="w-12 px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                </th>
              )}
              
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                    column.sortable && sortable && 'cursor-pointer hover:bg-gray-100',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right'
                  )}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && sortable && handleSort(column.key as string)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && sortable && (
                      <div className="ml-2">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}

              {actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-8">
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="md" />
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (actions.length > 0 ? 1 : 0)} className="px-6 py-8">
                  {emptyState || (
                    <div className="text-center">
                      <div className="text-gray-500 mb-2">No data available</div>
                      <div className="text-sm text-gray-400">Try adjusting your search or filters</div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  {selectable && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(item.id)}
                        onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                  )}
                  
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={cn(
                        'px-6 py-4 whitespace-nowrap text-sm text-gray-900',
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {renderCell(item, column)}
                    </td>
                  ))}

                  {actions.length > 0 && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {actions
                          .filter(action => !action.condition || action.condition(item))
                          .map((action, actionIndex) => {
                            const Icon = action.icon
                            return (
                              <button
                                key={actionIndex}
                                onClick={() => action.onClick(item)}
                                className={cn(
                                  'p-1 rounded hover:bg-gray-100',
                                  action.variant === 'danger' && 'text-red-600 hover:bg-red-50',
                                  action.variant === 'primary' && 'text-blue-600 hover:bg-blue-50'
                                )}
                                title={action.label}
                              >
                                {Icon ? <Icon className="h-4 w-4" /> : action.label}
                              </button>
                            )
                          })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">Show</span>
            <select
              value={pagination.limit}
              onChange={(e) => pagination.onLimitChange(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span className="text-sm text-gray-700">
              of {pagination.total} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-700">
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}