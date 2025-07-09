import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  Eye,
  Edit,
  Trash2,
  Bot,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Calendar,
  Users,
  Shield,
  TrendingUp,
  FileCheck,
  Sparkles,
  Brain,
  Target,
  BarChart3
} from 'lucide-react'
import { DataTable, Column, TableAction } from '@/components/ui/DataTable'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { contractsService } from '@/services/contractsService'
import { Contract, ContractType, ContractStatus, ContractFilters } from '@/types/contracts'
import { PaginationParams } from '@/types/common'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'
import { ContractForm } from './components/ContractForm'
import { ContractDetails } from './components/ContractDetails'
import { AIContractGenerator } from './components/AIContractGenerator'
import { ContractAnalyzer } from './components/ContractAnalyzer'

export const ContractsPage: React.FC = () => {
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const [filters, setFilters] = useState<ContractFilters>({})
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    limit: 25,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  const queryClient = useQueryClient()

  // Fetch contracts
  const { data: contractsData, isLoading, error } = useQuery({
    queryKey: ['contracts', pagination, filters],
    queryFn: () => contractsService.getContracts({ ...pagination, ...filters }),
    keepPreviousData: true
  })

  // Fetch contract statistics
  const { data: stats } = useQuery({
    queryKey: ['contract-stats'],
    queryFn: () => contractsService.getContractStats()
  })

  // Fetch expiring contracts
  const { data: expiringContracts } = useQuery({
    queryKey: ['expiring-contracts'],
    queryFn: () => contractsService.getExpiringContracts(30)
  })

  // Create contract mutation
  const createMutation = useMutation({
    mutationFn: contractsService.createContract,
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts'])
      queryClient.invalidateQueries(['contract-stats'])
      setShowCreateModal(false)
      toast.success('Contract created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to create contract')
    }
  })

  // Update contract mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      contractsService.updateContract(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts'])
      setShowEditModal(false)
      setSelectedContract(null)
      toast.success('Contract updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to update contract')
    }
  })

  // Delete contract mutation
  const deleteMutation = useMutation({
    mutationFn: contractsService.deleteContract,
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts'])
      queryClient.invalidateQueries(['contract-stats'])
      setShowDeleteModal(false)
      setSelectedContract(null)
      toast.success('Contract deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete contract')
    }
  })

  // AI contract analysis mutation
  const analyzeMutation = useMutation({
    mutationFn: contractsService.analyzeContract,
    onSuccess: (result) => {
      queryClient.invalidateQueries(['contracts'])
      toast.success('Contract analysis completed')
      // Show analysis results
      console.log('Analysis result:', result)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Analysis failed')
    }
  })

  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: contractsService.bulkDeleteContracts,
    onSuccess: () => {
      queryClient.invalidateQueries(['contracts'])
      queryClient.invalidateQueries(['contract-stats'])
      toast.success('Contracts deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to delete contracts')
    }
  })

  // Bulk analyze mutation
  const bulkAnalyzeMutation = useMutation({
    mutationFn: contractsService.bulkAnalyzeContracts,
    onSuccess: (results) => {
      queryClient.invalidateQueries(['contracts'])
      toast.success(`Analysis completed for ${results.length} contracts`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Bulk analysis failed')
    }
  })

  // Import mutation
  const importMutation = useMutation({
    mutationFn: contractsService.importContracts,
    onSuccess: (result) => {
      queryClient.invalidateQueries(['contracts'])
      queryClient.invalidateQueries(['contract-stats'])
      toast.success(
        `Import completed: ${result.successful_imports} successful, ${result.failed_imports} failed`
      )
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Import failed')
    }
  })

  // Table columns
  const columns: Column<Contract>[] = [
    {
      key: 'title',
      title: 'Contract Title',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.contract_type}</div>
          </div>
        </div>
      )
    },
    {
      key: 'parties',
      title: 'Parties',
      render: (value: any[]) => (
        <div className="flex items-center">
          <Users className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">
            {value?.map(p => p.name).join(', ') || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          value === ContractStatus.ACTIVE ? 'bg-green-100 text-green-800' :
          value === ContractStatus.SIGNED ? 'bg-blue-100 text-blue-800' :
          value === ContractStatus.DRAFT ? 'bg-yellow-100 text-yellow-800' :
          value === ContractStatus.EXPIRED ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value === ContractStatus.ACTIVE && <CheckCircle className="h-3 w-3 mr-1" />}
          {value === ContractStatus.EXPIRED && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value === ContractStatus.DRAFT && <Clock className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1).replace('_', ' ')}
        </span>
      )
    },
    {
      key: 'start_date',
      title: 'Start Date',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          {new Date(value).toLocaleDateString()}
        </div>
      )
    },
    {
      key: 'end_date',
      title: 'End Date',
      sortable: true,
      render: (value) => value ? (
        <div className="flex items-center">
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          {new Date(value).toLocaleDateString()}
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
    {
      key: 'value',
      title: 'Value',
      sortable: true,
      align: 'right',
      render: (value, item) => value ? (
        <div className="flex items-center justify-end">
          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
          <span className="font-medium">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: item.currency || 'USD'
            }).format(value)}
          </span>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      )
    },
    {
      key: 'risk_score',
      title: 'Risk Score',
      sortable: true,
      align: 'center',
      render: (value) => value ? (
        <div className="flex items-center justify-center">
          <Shield className={cn(
            'h-4 w-4 mr-1',
            value < 30 ? 'text-green-500' :
            value < 70 ? 'text-yellow-500' :
            'text-red-500'
          )} />
          <span className={cn(
            'font-medium',
            value < 30 ? 'text-green-700' :
            value < 70 ? 'text-yellow-700' :
            'text-red-700'
          )}>
            {value}
          </span>
        </div>
      ) : (
        <span className="text-gray-400">-</span>
      )
    }
  ]

  // Table actions
  const tableActions: TableAction<Contract>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (contract) => {
        setSelectedContract(contract)
        setShowDetailsModal(true)
      }
    },
    {
      label: 'AI Analysis',
      icon: Brain,
      variant: 'primary',
      onClick: (contract) => {
        analyzeMutation.mutate(contract.id)
      }
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (contract) => {
        setSelectedContract(contract)
        setShowEditModal(true)
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: (contract) => {
        setSelectedContract(contract)
        setShowDeleteModal(true)
      }
    }
  ]

  // Bulk actions
  const bulkActions = [
    {
      label: 'Analyze Selected',
      icon: Brain,
      variant: 'primary' as const,
      onClick: (contracts: Contract[]) => {
        bulkAnalyzeMutation.mutate(contracts.map(c => c.id))
      }
    },
    {
      label: 'Delete Selected',
      icon: Trash2,
      variant: 'danger' as const,
      onClick: (contracts: Contract[]) => {
        if (confirm(`Are you sure you want to delete ${contracts.length} contracts?`)) {
          bulkDeleteMutation.mutate(contracts.map(c => c.id))
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
      await contractsService.exportContracts(format, filters)
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
      <Helmet title="Contract Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Contract Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered contract drafting, review, and management
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAnalyzer(true)}
              className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
            >
              <Zap className="h-4 w-4 mr-2" />
              AI Analyzer
            </button>
            
            <button
              onClick={() => setShowAIGenerator(true)}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generator
            </button>
            
            <button
              onClick={() => contractsService.downloadImportTemplate()}
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
              New Contract
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Contracts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_contracts}</p>
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
                  <p className="text-2xl font-bold text-gray-900">{stats.active_contracts}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.expiring_soon}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${new Intl.NumberFormat('en-US', { notation: 'compact' }).format(stats.total_value)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        <DataTable
          data={contractsData?.items || []}
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
            total: contractsData?.total || 0,
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
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
              <p className="text-sm text-gray-600 mb-6">
                Get started by creating your first contract or use our AI generator.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Contract
                </button>
                <button
                  onClick={() => setShowAIGenerator(true)}
                  className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Generator
                </button>
              </div>
            </div>
          }
        />

        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Contract"
          size="lg"
        >
          <ContractForm
            onSubmit={(data) => createMutation.mutate(data)}
            onCancel={() => setShowCreateModal(false)}
            loading={createMutation.isLoading}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Contract"
          size="lg"
        >
          {selectedContract && (
            <ContractForm
              contract={selectedContract}
              onSubmit={(data) => updateMutation.mutate({ id: selectedContract.id, data })}
              onCancel={() => setShowEditModal(false)}
              loading={updateMutation.isLoading}
            />
          )}
        </Modal>

        {/* Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Contract Details"
          size="xl"
        >
          {selectedContract && (
            <ContractDetails
              contract={selectedContract}
              onEdit={() => {
                setShowDetailsModal(false)
                setShowEditModal(true)
              }}
              onClose={() => setShowDetailsModal(false)}
            />
          )}
        </Modal>

        {/* AI Contract Generator */}
        <Modal
          isOpen={showAIGenerator}
          onClose={() => setShowAIGenerator(false)}
          title="AI Contract Generator"
          size="xl"
        >
          <AIContractGenerator
            onGenerate={(data) => {
              // Handle AI generation
              console.log('Generate contract:', data)
            }}
            onCancel={() => setShowAIGenerator(false)}
          />
        </Modal>

        {/* Contract Analyzer */}
        <Modal
          isOpen={showAnalyzer}
          onClose={() => setShowAnalyzer(false)}
          title="AI Contract Analyzer"
          size="xl"
        >
          <ContractAnalyzer
            onAnalyze={(data) => {
              // Handle analysis
              console.log('Analyze contract:', data)
            }}
            onCancel={() => setShowAnalyzer(false)}
          />
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Contract"
          size="md"
        >
          <ModalBody>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete Contract
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{selectedContract?.title}"? 
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
              onClick={() => selectedContract && deleteMutation.mutate(selectedContract.id)}
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