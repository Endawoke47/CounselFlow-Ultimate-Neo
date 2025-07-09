import React from 'react'
import { Outlet } from 'react-router-dom'
import { Scale } from 'lucide-react'

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            CounselFlow Ultimate Neo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enterprise-grade AI-powered legal management system
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <Outlet />
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2024 CounselFlow Ultimate Neo. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}