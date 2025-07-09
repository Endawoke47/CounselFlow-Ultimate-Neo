import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Menu, 
  Search, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Bot,
  Plus,
  Upload,
  Download,
  Grid,
  List,
  Filter,
  Command,
  ChevronDown,
  Activity,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

interface HeaderProps {
  onMenuClick: () => void
  isCollapsed: boolean
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

export const Header: React.FC<HeaderProps> = ({ 
  onMenuClick, 
  isCollapsed,
  viewMode = 'list',
  onViewModeChange
}) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [quickActionsOpen, setQuickActionsOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  const searchRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length > 2) {
      // Mock search results - replace with actual search API
      setSearchResults([
        { type: 'contract', title: 'Service Agreement - TechCorp', id: '1' },
        { type: 'entity', title: 'Microsoft Corporation', id: '2' },
        { type: 'matter', title: 'IP Litigation Case #2024-001', id: '3' }
      ])
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  const quickActions = [
    {
      label: 'Create Contract',
      icon: Plus,
      action: () => navigate('/contracts/new'),
      color: 'teal'
    },
    {
      label: 'Upload Document',
      icon: Upload,
      action: () => navigate('/documents/upload'),
      color: 'blue'
    },
    {
      label: 'AI Assistant',
      icon: Bot,
      action: () => navigate('/ai-assistant'),
      color: 'purple'
    },
    {
      label: 'Export Data',
      icon: Download,
      action: () => navigate('/export'),
      color: 'green'
    }
  ]

  const notifications = [
    {
      id: '1',
      title: 'Contract Renewal Due',
      message: 'Service Agreement with TechCorp expires in 7 days',
      type: 'warning',
      time: '2 hours ago'
    },
    {
      id: '2',
      title: 'Document Review Complete',
      message: 'AI analysis completed for Partnership Agreement',
      type: 'success',
      time: '4 hours ago'
    },
    {
      id: '3',
      title: 'New Dispute Filed',
      message: 'IP Dispute #2024-003 requires immediate attention',
      type: 'error',
      time: '6 hours ago'
    }
  ]

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-30">
      <div className={cn(
        'px-4 sm:px-6 transition-all duration-300',
        isCollapsed ? 'lg:pl-20' : 'lg:pl-68'
      )}>
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center flex-1 max-w-3xl">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Enhanced Search */}
            <div className="ml-4 flex-1 relative" ref={searchRef}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search contracts, entities, matters, documents..."
                  className="block w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all text-sm"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <kbd className="hidden sm:inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs text-gray-500 bg-white">
                    <Command className="h-3 w-3 mr-1" />
                    K
                  </kbd>
                </div>
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-80 overflow-auto">
                  <div className="p-2">
                    {searchResults.length > 0 ? (
                      <>
                        <div className="text-xs font-medium text-gray-500 px-3 py-2">Search Results</div>
                        {searchResults.map((result: any, index) => (
                          <button
                            key={index}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                            onClick={() => {
                              navigate(`/${result.type}s/${result.id}`)
                              setShowSearchResults(false)
                              setSearchQuery('')
                            }}
                          >
                            <div className="text-sm font-medium text-gray-900">{result.title}</div>
                            <div className="text-xs text-gray-500 capitalize">{result.type}</div>
                          </button>
                        ))}
                      </>
                    ) : (
                      <div className="px-3 py-8 text-center text-gray-500 text-sm">
                        No results found for "{searchQuery}"
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2">
            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => onViewModeChange('list')}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    viewMode === 'list'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={cn(
                    'p-1.5 rounded-md transition-colors',
                    viewMode === 'grid'
                      ? 'bg-white text-teal-600 shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
                  )}
                >
                  <Grid className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Quick Actions */}
            <div className="relative">
              <button
                onClick={() => setQuickActionsOpen(!quickActionsOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>

              {quickActionsOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-500 px-3 py-2">Quick Actions</div>
                    {quickActions.map((action, index) => {
                      const Icon = action.icon
                      return (
                        <button
                          key={index}
                          onClick={() => {
                            action.action()
                            setQuickActionsOpen(false)
                          }}
                          className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                        >
                          <Icon className={cn(
                            'h-4 w-4 mr-3',
                            action.color === 'teal' && 'text-teal-500',
                            action.color === 'blue' && 'text-blue-500',
                            action.color === 'purple' && 'text-purple-500',
                            action.color === 'green' && 'text-green-500'
                          )} />
                          {action.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{notifications.length}</span>
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-auto">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start">
                          <div className={cn(
                            'w-2 h-2 rounded-full mt-2 mr-3',
                            notification.type === 'warning' && 'bg-yellow-400',
                            notification.type === 'success' && 'bg-green-400',
                            notification.type === 'error' && 'bg-red-400'
                          )} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Help */}
            <button
              onClick={() => navigate('/help')}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-gray-900">
                    {user?.first_name} {user?.last_name}
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {user?.role}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 hidden md:block" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {user?.first_name?.[0]}{user?.last_name?.[0]}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.first_name} {user?.last_name}
                        </div>
                        <div className="text-xs text-gray-500">{user?.email}</div>
                        <div className="text-xs text-teal-600 capitalize font-medium">{user?.role}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    
                    <Link
                      to="/activity"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Activity className="h-4 w-4 mr-3" />
                      Activity
                    </Link>
                    
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </Link>
                  </div>
                  
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}