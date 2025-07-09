export interface BaseEntity {
  id: string
  created_at: string
  updated_at?: string
  created_by?: string
  updated_by?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, any>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface SearchFilters {
  [key: string]: string | number | boolean | Date | null
}

export interface SortConfig {
  key: string
  direction: 'asc' | 'desc'
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'xlsx'
  fields?: string[]
  filters?: SearchFilters
}

export interface ImportResult {
  total_records: number
  successful_imports: number
  failed_imports: number
  errors: string[]
}

export interface FileUpload {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  error?: string
}

export interface NotificationData {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  action_url?: string
}

export interface AuditLogEntry {
  id: string
  entity_type: string
  entity_id: string
  action: 'create' | 'update' | 'delete' | 'view'
  changes: Record<string, { old_value: any; new_value: any }>
  user_id: string
  user_name: string
  timestamp: string
  ip_address: string
}