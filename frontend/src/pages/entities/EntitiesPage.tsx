import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Building,
  Target
} from 'lucide-react'
import { DataTable, Column, TableAction } from '@/components/ui/DataTable'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { entitiesService } from '@/services/entitiesService'
import { Company, EntityType, CompanyStatus, CompanyFilters } from '@/types/entities'
import { PaginationParams } from '@/types/common'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'
import { CompanyForm } from './components/CompanyForm'
import { CompanyDetails } from './components/CompanyDetails'

export const EntitiesPage: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [filters, setFilters] = useState<CompanyFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sort_by: 'company_name',
    sort_order: 'asc'
  })

  const queryClient = useQueryClient()

  // Fetch companies
  const { data: companiesData, isLoading, error } = useQuery({
    queryKey: ['companies', pagination, filters],
    queryFn: () => entitiesService.getCompanies({ ...pagination, ...filters }),
    keepPreviousData: true
  })

  // Fetch company statistics
  const { data: stats } = useQuery({
    queryKey: ['company-stats'],
    queryFn: () => entitiesService.getCompanyStats()
  })

  // Create company mutation
  const createMutation = useMutation({
    mutationFn: entitiesService.createCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      queryClient.invalidateQueries(['company-stats'])
      setShowCreateModal(false)
      toast.success('Company created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create company')
    }
  })

  // Update company mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      entitiesService.updateCompany(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      setShowEditModal(false)
      setSelectedCompany(null)
      toast.success('Company updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update company')
    }
  })

  // Delete company mutation
  const deleteMutation = useMutation({
    mutationFn: entitiesService.deleteCompany,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      queryClient.invalidateQueries(['company-stats'])
      setShowDeleteModal(false)
      setSelectedCompany(null)
      toast.success('Company deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete company')
    }
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: entitiesService.bulkDeleteCompanies,
    onSuccess: () => {
      queryClient.invalidateQueries(['companies'])
      queryClient.invalidateQueries(['company-stats'])
      toast.success('Companies deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete companies')
    }
  })

  // Import mutation
  const importMutation = useMutation({
    mutationFn: entitiesService.importCompanies,
    onSuccess: (result) => {
      queryClient.invalidateQueries(['companies'])
      queryClient.invalidateQueries(['company-stats'])
      toast.success(
        `Import completed: ${result.successful_imports} successful, ${result.failed_imports} failed`
      )
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Import failed')
    }
  })

  // Table columns
  const columns: Column<Company>[] = [
    {
      key: 'company_name',
      title: 'Company Name',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Building2 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.entity_type}</div>
          </div>
        </div>
      )
    },
    {
      key: 'jurisdiction_of_incorporation',
      title: 'Jurisdiction',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          {value}
        </div>
      )
    },
    {
      key: 'company_status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          value === CompanyStatus.ACTIVE ? 'bg-green-100 text-green-800' :
          value === CompanyStatus.INACTIVE ? 'bg-yellow-100 text-yellow-800' :
          value === CompanyStatus.DISSOLVED ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value === CompanyStatus.ACTIVE && <CheckCircle className="h-3 w-3 mr-1" />}
          {value === CompanyStatus.INACTIVE && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'incorporation_date',
      title: 'Incorporated',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'industry_sector',
      title: 'Industry',
      render: (value) => value || '-'
    },
    {
      key: 'contracts_count',
      title: 'Contracts',
      align: 'center',
      render: (value) => (
        <span className="inline-flex items-center">
          <FileText className="h-4 w-4 text-gray-400 mr-1" />
          {value || 0}
        </span>
      )
    }
  ]

  // Table actions
  const tableActions: TableAction<Company>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (company) => {
        setSelectedCompany(company)
        setShowDetailsModal(true)
      }
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (company) => {
        setSelectedCompany(company)
        setShowEditModal(true)
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: (company) => {
        setSelectedCompany(company)
        setShowDeleteModal(true)
      }
    }
  ]

  // Bulk actions
  const bulkActions = [
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: (companies: Company[]) => {
        if (confirm(`Are you sure you want to delete ${companies.length} companies?`)) {
          bulkDeleteMutation.mutate(companies.map(c => c.id))
        }
      }
    }
  ]

  // Handle search
  const handleSearch = (query: string) => {
    setPagination(prev => ({ ...prev, search: query, page: 1 }))
  }

  // Handle sort
  const handleSort = (key: string, direction: 'asc' | 'desc') => {
    setPagination(prev => ({ ...prev, sort_by: key, sort_order: direction }))
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }))
  }

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf' | 'xlsx') => {
    try {
      await entitiesService.exportCompanies(format, filters)
      toast.success(`Export completed`)
    } catch (error) {
      toast.error('Export failed')
    }
  }

  // Handle import
  const handleImport = (file: File) => {
    importMutation.mutate(file)
  }

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
            <button
              onClick={() => entitiesService.downloadImportTemplate()}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Entity
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Entities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_companies}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.active_companies}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Compliant</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.compliance_overview.compliant}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Recent</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.recent_incorporations}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          data={companiesData?.items || []}
          columns={columns}
          loading={isLoading}
          error={error?.message}
          searchable={true}
          filterable={true}
          selectable={true}
          sortable={true}
          pagination={{
            page: pagination.page || 1,
            limit: pagination.limit || 25,
            total: companiesData?.total || 0,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange
          }}
          actions={tableActions}
          bulkActions={bulkActions}
          onSearch={handleSearch}
          onSort={handleSort}
          onExport={handleExport}
          onImport={handleImport}
          emptyState={
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No entities found</h3>
              <p className="text-sm text-gray-600 mb-6">
                Get started by creating your first corporate entity.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Entity
              </button>
            </div>
          }
        />

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Entity"
          size="lg"
        >
          <CompanyForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowCreateModal(false)}
            loading={createMutation.isLoading}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Entity"
          size="lg"
        >
          {selectedCompany && (
            <CompanyForm
              company={selectedCompany}
              onSubmit={(data) => updateMutation.mutate({ id: selectedCompany.id, data })}
              onCancel={() => setShowEditModal(false)}
              loading={updateMutation.isLoading}
            />
          )}
        </Modal>

        {/* Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Entity Details"
          size="xl"
        >
          {selectedCompany && (
            <CompanyDetails
              company={selectedCompany}
              onEdit={() => {
                setShowDetailsModal(false)
                setShowEditModal(true)
              }}
              onClose={() => setShowDetailsModal(false)}
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Entity"
          size="md"
        >
          <ModalBody>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Entity
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{selectedCompany?.company_name}"? 
                This action cannot be undone.
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => setShowDeleteModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedCompany && deleteMutation.mutate(selectedCompany.id)}
              disabled={deleteMutation.isLoading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {deleteMutation.isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                'Delete'
              )}
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}