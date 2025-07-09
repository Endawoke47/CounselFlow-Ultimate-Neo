import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { 
  SearchIcon, 
  MailIcon, 
  NotificationIcon, 
  ChevronDownIcon, 
  LogoutIcon, 
  UserIcon, 
  SettingsIcon 
} from './icons'

export const TopNav: React.FC = () => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    { id: 1, title: 'Contract Renewal Due', message: 'Microsoft Agreement expires in 7 days', time: '2h ago', type: 'warning' },
    { id: 2, title: 'New Matter Assigned', message: 'Patent filing for Project Alpha', time: '4h ago', type: 'info' },
    { id: 3, title: 'Compliance Alert', message: 'GDPR audit scheduled for next week', time: '1d ago', type: 'alert' },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contracts, matters, policies..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Email */}
        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <MailIcon className="h-5 w-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
          >
            <NotificationIcon className="h-5 w-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">{notifications.length}</span>
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                    <div className="flex items-start">
                      <div className={`w-2 h-2 rounded-full mt-2 mr-3 ${
                        notification.type === 'warning' ? 'bg-yellow-400' :
                        notification.type === 'alert' ? 'bg-red-400' : 'bg-blue-400'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-gray-200">
                <button className="w-full text-center text-sm text-teal-600 hover:text-teal-700 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80'}
              alt="User avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="py-2">
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <UserIcon className="h-4 w-4 mr-3" />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-3" />
                  Settings
                </button>
                <div className="border-t border-gray-200 my-2" />
                <button
                  onClick={logout}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <LogoutIcon className="h-4 w-4 mr-3" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}