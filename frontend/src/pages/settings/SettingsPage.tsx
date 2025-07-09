import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Settings } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const SettingsPage: React.FC = () => {
  return (
    <>
      <Helmet title="Settings" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your account and application settings
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Settings Panel
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Comprehensive application and user settings management.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-blue-700">Loading settings...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}