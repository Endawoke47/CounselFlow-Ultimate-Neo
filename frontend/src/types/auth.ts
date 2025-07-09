export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: UserRole
  is_active: boolean
  created_at: string
  updated_at?: string
  last_login?: string
  avatar_url?: string
  phone?: string
  department?: string
  bar_number?: string
  bar_state?: string
  preferences?: UserPreferences
}

export enum UserRole {
  ADMIN = 'admin',
  PARTNER = 'partner',
  ATTORNEY = 'attorney',
  PARALEGAL = 'paralegal',
  SECRETARY = 'secretary',
  CLIENT = 'client',
  GUEST = 'guest',
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  notifications: {
    email: boolean
    desktop: boolean
    mobile: boolean
  }
  dashboard: {
    layout: 'default' | 'compact' | 'detailed'
    widgets: string[]
  }
}

export interface LoginCredentials {
  email: string
  password: string
  remember_me?: boolean
}

export interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  role?: UserRole
  bar_number?: string
  bar_state?: string
  phone?: string
  department?: string
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
  token_type: 'bearer'
  expires_in: number
}

export interface TokenPayload {
  sub: string
  email: string
  role: UserRole
  exp: number
  iat: number
  type?: 'access' | 'refresh'
}

export interface PasswordChangeData {
  current_password: string
  new_password: string
  confirm_password: string
}

export interface PasswordResetData {
  token: string
  new_password: string
  confirm_password: string
}

export interface ProfileUpdateData {
  first_name?: string
  last_name?: string
  phone?: string
  department?: string
  avatar_url?: string
  preferences?: Partial<UserPreferences>
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface RolePermissions {
  [UserRole.ADMIN]: Permission[]
  [UserRole.PARTNER]: Permission[]
  [UserRole.ATTORNEY]: Permission[]
  [UserRole.PARALEGAL]: Permission[]
  [UserRole.SECRETARY]: Permission[]
  [UserRole.CLIENT]: Permission[]
  [UserRole.GUEST]: Permission[]
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  permissions: Permission[]
}

export interface AuthError {
  message: string
  code: string
  field?: string
}