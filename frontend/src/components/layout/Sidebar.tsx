import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Building2,
  FileText,
  Scale,
  Briefcase,
  Shield,
  BookOpen,
  Users,
  Gavel,
  Target,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  HelpCircle,
  Menu,
  X
} from 'lucide-react'
import { cn } from '@/utils/cn'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    description: 'Overview and analytics'
  },
  { 
    name: 'Entity Management', 
    href: '/entities', 
    icon: Building2,
    description: 'Companies and legal entities'
  },
  { 
    name: 'Contract Management', 
    href: '/contracts', 
    icon: FileText,
    description: 'Contract lifecycle management'
  },
  { 
    name: 'Dispute Management', 
    href: '/disputes', 
    icon: Scale,
    description: 'Legal disputes and litigation'
  },
  { 
    name: 'Matter Management', 
    href: '/matters', 
    icon: Briefcase,
    description: 'Legal matters and cases'
  },
  { 
    name: 'Risk Management', 
    href: '/risk', 
    icon: Shield,
    description: 'Risk assessment and mitigation'
  },
  { 
    name: 'Policy Management', 
    href: '/policy', 
    icon: BookOpen,
    description: 'Policies and compliance'
  },
  { 
    name: 'Knowledge Management', 
    href: '/knowledge', 
    icon: Users,
    description: 'Legal knowledge base'
  },
  { 
    name: 'Licensing & Regulatory', 
    href: '/licensing', 
    icon: Gavel,
    description: 'Licenses and regulations'
  },
  { 
    name: 'Outsourcing & Spend', 
    href: '/outsourcing', 
    icon: Target,
    description: 'Legal spend management'
  },
  { 
    name: 'Task Management', 
    href: '/tasks', 
    icon: CheckSquare,
    description: 'Tasks and workflows'
  }
]

const bottomNavigation = [
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Application settings'
  },
  {
    name: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    description: 'Help and documentation'
  }
]

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  onToggle, 
  isMobileOpen, 
  onMobileClose 
}) => {
  const location = useLocation()

  const isActiveRoute = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:flex lg:flex-col bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-40',
          isCollapsed ? 'lg:w-16' : 'lg:w-64'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <Link to="/dashboard" className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold text-gray-900">CounselFlow</span>
                <div className="text-xs text-gray-500">Ultimate Neo</div>
              </div>
            </Link>
          )}
          {isCollapsed && (
            <Link to="/dashboard" className="flex items-center justify-center w-full">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
            </Link>
          )}
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-colors',
                      isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  {!isCollapsed && (
                    <div className="ml-3 flex-1 min-w-0">
                      <span className="truncate">{item.name}</span>
                      <div className="text-xs text-gray-400 mt-0.5 truncate">
                        {item.description}
                      </div>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-teal-500 rounded-l-lg" />
                  )}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Bottom Menu */}
          <div className="mt-8 pt-4 border-t border-gray-200">
            <div className="space-y-1">
              {bottomNavigation.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.href)

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0',
                        isActive ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    {!isCollapsed && (
                      <span className="ml-3 truncate">{item.name}</span>
                    )}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.name}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Mobile sidebar */}
      <div className={cn(
        'relative z-50 lg:hidden',
        isMobileOpen ? 'fixed inset-0' : 'hidden'
      )}>
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={onMobileClose} />
        
        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Link to="/dashboard" className="flex items-center" onClick={onMobileClose}>
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-lg font-bold text-gray-900">CounselFlow</span>
                <div className="text-xs text-gray-500">Ultimate Neo</div>
              </div>
            </Link>
            
            <button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              onClick={onMobileClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <nav className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = isActiveRoute(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0 mr-3',
                      isActive ? 'text-teal-600' : 'text-gray-400'
                    )}
                  />
                  <div>
                    <div>{item.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.description}</div>
                  </div>
                </Link>
              )
            })}
            
            {/* Bottom Menu for Mobile */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              {bottomNavigation.map((item) => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.href)
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      'flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-gradient-to-r from-teal-50 to-teal-100 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 flex-shrink-0 mr-3',
                        isActive ? 'text-teal-600' : 'text-gray-400'
                      )}
                    />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}