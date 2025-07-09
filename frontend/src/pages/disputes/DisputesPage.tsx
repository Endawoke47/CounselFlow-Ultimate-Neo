import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import { 
  Scale,
  Gavel,
  AlertTriangle,
  Clock,
  DollarSign,
  FileText,
  Calendar,
  User,
  Building2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Timer,
  TrendingUp,
  Users,
  Target,
  Brain,
  Sparkles
} from 'lucide-react'
import { DataTable, Column, TableAction } from '@/components/ui/DataTable'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

// Types
interface Dispute {
  id: string
  dispute_number: string
  title: string
  description: string
  dispute_type: DisputeType
  status: DisputeStatus
  priority: DisputePriority
  amount_in_dispute: number
  currency: string
  filing_date: string
  expected_resolution_date?: string
  actual_resolution_date?: string
  plaintiff: string
  defendant: string
  law_firm?: string
  internal_counsel?: string
  external_counsel?: string
  jurisdiction: string
  court?: string
  case_number?: string
  related_contracts: string[]
  related_entities: string[]
  documents: any[]
  created_at: string
  updated_at: string
}

enum DisputeType {
  CONTRACT = 'contract',
  IP = 'intellectual_property',
  EMPLOYMENT = 'employment',
  REGULATORY = 'regulatory',
  COMMERCIAL = 'commercial',
  REAL_ESTATE = 'real_estate',
  PRODUCT_LIABILITY = 'product_liability',
  OTHER = 'other'
}

enum DisputeStatus {
  DRAFT = 'draft',
  FILED = 'filed',
  IN_DISCOVERY = 'in_discovery',
  MEDIATION = 'mediation',
  ARBITRATION = 'arbitration',
  TRIAL = 'trial',
  SETTLED = 'settled',
  DISMISSED = 'dismissed',
  RESOLVED = 'resolved',
  APPEALED = 'appealed'
}

enum DisputePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Mock data
const mockDisputes: Dispute[] = [
  {
    id: '1',
    dispute_number: 'DIS-2024-001',
    title: 'Contract Breach - Software License Agreement',
    description: 'Dispute over software license terms and usage violations',
    dispute_type: DisputeType.CONTRACT,
    status: DisputeStatus.IN_DISCOVERY,
    priority: DisputePriority.HIGH,
    amount_in_dispute: 500000,
    currency: 'USD',
    filing_date: '2024-01-15',
    expected_resolution_date: '2024-06-15',
    plaintiff: 'TechCorp Inc.',
    defendant: 'Our Company',
    law_firm: 'Smith & Associates',
    external_counsel: 'John Smith',
    jurisdiction: 'California',
    court: 'Superior Court of California',
    case_number: 'CV-2024-001234',
    related_contracts: ['CONT-2023-005'],
    related_entities: ['ENT-001'],
    documents: [],
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    dispute_number: 'DIS-2024-002',
    title: 'IP Infringement Claim',
    description: 'Patent infringement dispute over technology implementation',
    dispute_type: DisputeType.IP,
    status: DisputeStatus.MEDIATION,
    priority: DisputePriority.CRITICAL,
    amount_in_dispute: 2000000,
    currency: 'USD',
    filing_date: '2024-02-01',
    expected_resolution_date: '2024-08-01',
    plaintiff: 'Innovation Labs',
    defendant: 'Our Company',
    law_firm: 'IP Law Group',
    external_counsel: 'Sarah Johnson',
    jurisdiction: 'Delaware',
    court: 'Delaware District Court',
    case_number: 'DE-2024-002345',
    related_contracts: [],
    related_entities: ['ENT-002'],
    documents: [],
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z'
  }
]

const mockStats = {
  total_disputes: 15,
  active_disputes: 8,
  resolved_disputes: 5,
  total_amount_in_dispute: 12500000,
  pending_review: 2,
  settlement_rate: 65,
  average_resolution_time: 145
}

interface OutletContext {
  viewMode: 'grid' | 'list'
}

export const DisputesPage: React.FC = () => {
  const { viewMode } = useOutletContext<OutletContext>()
  const [disputes, setDisputes] = useState<Dispute[]>(mockDisputes)
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<DisputeStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<DisputePriority | ''>('')

  // Filter disputes based on search and filters
  const filteredDisputes = disputes.filter(dispute => {
    const matchesSearch = !searchQuery || 
      dispute.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.dispute_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.plaintiff.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dispute.defendant.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || dispute.status === statusFilter
    const matchesPriority = !priorityFilter || dispute.priority === priorityFilter
    
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Table columns
  const columns: Column<Dispute>[] = [
    {
      key: 'dispute_number',
      title: 'Dispute Number',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
            <Scale className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.dispute_type.replace('_', ' ')}</div>
          </div>
        </div>
      )
    },
    {
      key: 'title',
      title: 'Title',
      sortable: true,
      render: (value) => (
        <div className="max-w-xs">
          <div className="font-medium text-gray-900 truncate">{value}</div>
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
          value === DisputeStatus.RESOLVED || value === DisputeStatus.SETTLED ? 'bg-green-100 text-green-800' :
          value === DisputeStatus.FILED || value === DisputeStatus.IN_DISCOVERY ? 'bg-blue-100 text-blue-800' :
          value === DisputeStatus.TRIAL || value === DisputeStatus.ARBITRATION ? 'bg-orange-100 text-orange-800' :
          value === DisputeStatus.DISMISSED ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value === DisputeStatus.RESOLVED && <CheckCircle className="h-3 w-3 mr-1" />}
          {(value === DisputeStatus.TRIAL || value === DisputeStatus.ARBITRATION) && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1)}
        </span>
      )
    },
    {
      key: 'priority',
      title: 'Priority',
      sortable: true,
      render: (value) => (
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          value === DisputePriority.CRITICAL ? 'bg-red-100 text-red-800' :
          value === DisputePriority.HIGH ? 'bg-orange-100 text-orange-800' :
          value === DisputePriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'amount_in_dispute',
      title: 'Amount',
      sortable: true,
      align: 'right',
      render: (value, item) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            ${value.toLocaleString()} {item.currency}
          </div>
        </div>
      )
    },
    {
      key: 'filing_date',
      title: 'Filed',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'plaintiff',
      title: 'Plaintiff',
      render: (value) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-1" />
          {value}
        </div>
      )
    }
  ]

  // Table actions
  const tableActions: TableAction<Dispute>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (dispute) => {
        setSelectedDispute(dispute)
        setShowDetailsModal(true)
      }
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (dispute) => {
        setSelectedDispute(dispute)
        setShowEditModal(true)
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: (dispute) => {
        setSelectedDispute(dispute)
        setShowDeleteModal(true)
      }
    }
  ]

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf' | 'xlsx') => {
    toast.success(`Exporting disputes as ${format.toUpperCase()}...`)
  }

  // Handle import
  const handleImport = (file: File) => {
    toast.success('Importing disputes...')
  }

  // Handle create
  const handleCreate = (data: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowCreateModal(false)
      toast.success('Dispute created successfully')
    }, 1000)
  }

  // Handle update
  const handleUpdate = (data: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowEditModal(false)
      setSelectedDispute(null)
      toast.success('Dispute updated successfully')
    }, 1000)
  }

  // Handle delete
  const handleDelete = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowDeleteModal(false)
      setSelectedDispute(null)
      toast.success('Dispute deleted successfully')
    }, 1000)
  }

  return (
    <>
      <Helmet title="Dispute Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dispute Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage legal disputes, litigation, and claim resolution
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toast.success('Downloading import template...')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Template
            </button>
            
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Dispute
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Scale className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Disputes</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.total_disputes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.active_disputes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.resolved_disputes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Amount at Risk</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(mockStats.total_amount_in_dispute / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search disputes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as DisputeStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Statuses</option>
              {Object.values(DisputeStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as DisputePriority | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Priorities</option>
              {Object.values(DisputePriority).map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'list' ? (
          <DataTable
            data={filteredDisputes}
            columns={columns}
            loading={loading}
            searchable={false}
            filterable={false}
            selectable={true}
            sortable={true}
            actions={tableActions}
            onExport={handleExport}
            onImport={handleImport}
            emptyState={
              <div className="text-center py-12">
                <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No disputes found</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Get started by creating your first dispute case.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Dispute
                </button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDisputes.map((dispute) => (
              <div key={dispute.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Scale className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{dispute.dispute_number}</h3>
                        <p className="text-xs text-gray-500">{dispute.dispute_type.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      dispute.priority === DisputePriority.CRITICAL ? 'bg-red-100 text-red-800' :
                      dispute.priority === DisputePriority.HIGH ? 'bg-orange-100 text-orange-800' :
                      dispute.priority === DisputePriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {dispute.priority}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{dispute.title}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {dispute.plaintiff} vs {dispute.defendant}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${dispute.amount_in_dispute.toLocaleString()} {dispute.currency}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Filed: {new Date(dispute.filing_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      dispute.status === DisputeStatus.RESOLVED || dispute.status === DisputeStatus.SETTLED ? 'bg-green-100 text-green-800' :
                      dispute.status === DisputeStatus.FILED || dispute.status === DisputeStatus.IN_DISCOVERY ? 'bg-blue-100 text-blue-800' :
                      dispute.status === DisputeStatus.TRIAL || dispute.status === DisputeStatus.ARBITRATION ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {dispute.status.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedDispute(dispute)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedDispute(dispute)
                          setShowEditModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modals */}
        {/* Create Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Dispute"
          size="lg"
        >
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter dispute title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(DisputeType).map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(DisputePriority).map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter dispute description"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => handleCreate({})}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Dispute'}
            </button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Dispute"
          size="md"
        >
          <ModalBody>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Dispute</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{selectedDispute?.title}"? This action cannot be undone.
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
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Delete'}
            </button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}