import axios from 'axios'
import { User, LoginCredentials, RegisterData } from '@/types/auth'

const API_BASE_URL = 'http://localhost:8000/api/v1'

class AuthService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  constructor() {
    // Request interceptor to add auth token
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

    // Response interceptor to handle token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true

          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const response = await this.refreshToken(refreshToken)
              localStorage.setItem('access_token', response.access_token)
              
              // Retry the original request with the new token
              originalRequest.headers.Authorization = `Bearer ${response.access_token}`
              return this.api(originalRequest)
            }
          } catch (refreshError) {
            // Refresh token is invalid, redirect to login
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/auth/login'
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async login(credentials: LoginCredentials): Promise<{
    user: User
    access_token: string
    refresh_token: string
  }> {
    const response = await this.api.post('/auth/login', credentials)
    const { access_token, refresh_token } = response.data
    
    // Get user data
    const userResponse = await this.api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })
    
    return {
      user: userResponse.data,
      access_token,
      refresh_token,
    }
  }

  async register(data: RegisterData): Promise<{
    user: User
    access_token: string
    refresh_token: string
  }> {
    const response = await this.api.post('/auth/register', data)
    const user = response.data
    
    // Auto-login after registration
    const loginResponse = await this.login({
      email: data.email,
      password: data.password,
    })
    
    return loginResponse
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/auth/me')
    return response.data
  }

  async refreshToken(refreshToken: string): Promise<{
    access_token: string
    refresh_token?: string
  }> {
    const response = await this.api.post('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  }

  async logout(): Promise<void> {
    try {
      await this.api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async changePassword(data: {
    current_password: string
    new_password: string
  }): Promise<void> {
    await this.api.put('/auth/change-password', data)
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.api.post('/auth/request-password-reset', { email })
  }

  async resetPassword(data: {
    token: string
    new_password: string
  }): Promise<void> {
    await this.api.post('/auth/reset-password', data)
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.api.put('/auth/profile', data)
    return response.data
  }

  async deleteAccount(): Promise<void> {
    await this.api.delete('/auth/account')
  }
}

export const authService = new AuthService()