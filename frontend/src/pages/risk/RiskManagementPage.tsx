import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Shield } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const RiskManagementPage: React.FC = () => {
  return (
    <>
      <Helmet title="Risk Management" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Risk Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered legal risk assessment and mitigation
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Risk Management System
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Advanced risk assessment and mitigation strategies.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-blue-700">Loading risk assessments...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}