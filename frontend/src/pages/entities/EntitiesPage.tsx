import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Building2, Plus, Search, Filter, Download, Upload } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export const EntitiesPage: React.FC = () => {
  return (
    <>
      <Helmet title="Entity Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Entity Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage your corporate entities and legal structures
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              New Entity
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search entities..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>
        </div>

        {/* Entity List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Corporate Entities</h2>
          </div>
          
          <div className="p-6">
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Entity Management System
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                This module will manage your corporate entities, subsidiaries, and legal structures with AI-powered compliance tracking.
              </p>
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
                <LoadingSpinner size="sm" />
                <span className="ml-2 text-sm text-blue-700">Loading entities...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}