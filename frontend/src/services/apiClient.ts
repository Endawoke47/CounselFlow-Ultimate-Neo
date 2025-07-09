import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { ApiResponse, PaginationParams, PaginatedResponse } from '@/types/common'
import toast from 'react-hot-toast'

class ApiClient {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const response = await this.api.post('/auth/refresh', {
                refresh_token: refreshToken,
              })
              
              const { access_token } = response.data
              localStorage.setItem('access_token', access_token)
              
              originalRequest.headers.Authorization = `Bearer ${access_token}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
          }
        }

        // Handle different error types
        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        } else if (error.response?.status === 403) {
          toast.error('You do not have permission to perform this action.')
        } else if (error.response?.status === 404) {
          toast.error('Resource not found.')
        } else if (error.code === 'NETWORK_ERROR') {
          toast.error('Network error. Please check your connection.')
        }

        return Promise.reject(error)
      }
    )
  }

  // Generic CRUD operations
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.get(url, config)
    return response.data
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.post(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.put(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.patch(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.api.delete(url, config)
    return response.data
  }

  // Paginated requests
  async getPaginated<T>(
    url: string, 
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<T>>> {
    const response = await this.api.get(url, { params })
    return response.data
  }

  // File upload
  async uploadFile(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  }

  // File download
  async downloadFile(url: string, filename?: string): Promise<void> {
    const response = await this.api.get(url, {
      responseType: 'blob',
    })

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Bulk operations
  async bulkCreate<T>(url: string, items: any[]): Promise<ApiResponse<T[]>> {
    const response = await this.api.post(`${url}/bulk`, { items })
    return response.data
  }

  async bulkUpdate<T>(url: string, items: any[]): Promise<ApiResponse<T[]>> {
    const response = await this.api.put(`${url}/bulk`, { items })
    return response.data
  }

  async bulkDelete(url: string, ids: string[]): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`${url}/bulk`, { data: { ids } })
    return response.data
  }

  // Search functionality
  async search<T>(
    url: string,
    query: string,
    filters?: Record<string, any>
  ): Promise<ApiResponse<T[]>> {
    const response = await this.api.get(`${url}/search`, {
      params: { q: query, ...filters }
    })
    return response.data
  }

  // Export functionality
  async exportData(
    url: string,
    format: 'csv' | 'pdf' | 'xlsx',
    filters?: Record<string, any>
  ): Promise<void> {
    const response = await this.api.get(`${url}/export`, {
      params: { format, ...filters },
      responseType: 'blob',
    })

    const contentType = response.headers['content-type']
    const blob = new Blob([response.data], { type: contentType })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = `export.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }

  // Import functionality
  async importData(url: string, file: File): Promise<ApiResponse<any>> {
    const formData = new FormData()
    formData.append('file', file)

    const response = await this.api.post(`${url}/import`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  }

  // Get raw axios instance for custom requests
  getAxiosInstance(): AxiosInstance {
    return this.api
  }
}

export const apiClient = new ApiClient()