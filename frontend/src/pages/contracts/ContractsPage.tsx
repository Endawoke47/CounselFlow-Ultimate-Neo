import React from 'react'
import { Helmet } from 'react-helmet-async'
import { FileText, Plus, Search, Filter, Download, Upload, Bot } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const ContractsPage: React.FC = () => {
  return (
    <>
      <Helmet title="Contract Management" />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered contract drafting, review, and management
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100">
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              AI-Powered Contract Management
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Advanced contract lifecycle management with AI-powered drafting, review, and risk analysis.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-blue-700">Loading contract system...</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}