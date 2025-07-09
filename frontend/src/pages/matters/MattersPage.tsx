import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useOutletContext } from 'react-router-dom'
import { 
  Briefcase,
  Calendar,
  Clock,
  DollarSign,
  FileText,
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
  AlertTriangle,
  Timer,
  TrendingUp,
  Users,
  Target,
  Star,
  MessageSquare,
  Activity,
  Archive,
  BookOpen,
  Scale,
  Gavel
} from 'lucide-react'
import { DataTable, Column, TableAction } from '@/components/ui/DataTable'
import { Modal, ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

// Types
interface Matter {
  id: string
  matter_number: string
  title: string
  description: string
  matter_type: MatterType
  status: MatterStatus
  priority: MatterPriority
  client: string
  responsible_attorney: string
  practice_area: string
  budget: number
  actual_cost: number
  currency: string
  open_date: string
  target_close_date?: string
  actual_close_date?: string
  billing_method: BillingMethod
  hourly_rate?: number
  fixed_fee?: number
  retainer_amount?: number
  related_entities: string[]
  related_contracts: string[]
  related_disputes: string[]
  documents: any[]
  time_entries: any[]
  expenses: any[]
  notes: any[]
  created_at: string
  updated_at: string
}

enum MatterType {
  LITIGATION = 'litigation',
  TRANSACTIONAL = 'transactional',
  REGULATORY = 'regulatory',
  IP = 'intellectual_property',
  EMPLOYMENT = 'employment',
  CORPORATE = 'corporate',
  REAL_ESTATE = 'real_estate',
  TAX = 'tax',
  BANKRUPTCY = 'bankruptcy',
  COMPLIANCE = 'compliance',
  OTHER = 'other'
}

enum MatterStatus {
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

enum MatterPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

enum BillingMethod {
  HOURLY = 'hourly',
  FIXED_FEE = 'fixed_fee',
  RETAINER = 'retainer',
  CONTINGENCY = 'contingency'
}

// Mock data
const mockMatters: Matter[] = [
  {
    id: '1',
    matter_number: 'MAT-2024-001',
    title: 'Corporate Acquisition - TechStart Inc.',
    description: 'Due diligence and acquisition documentation for technology startup',
    matter_type: MatterType.TRANSACTIONAL,
    status: MatterStatus.ACTIVE,
    priority: MatterPriority.HIGH,
    client: 'Global Ventures Corp',
    responsible_attorney: 'Sarah Johnson',
    practice_area: 'Corporate Law',
    budget: 150000,
    actual_cost: 85000,
    currency: 'USD',
    open_date: '2024-01-15',
    target_close_date: '2024-04-15',
    billing_method: BillingMethod.HOURLY,
    hourly_rate: 450,
    related_entities: ['ENT-001', 'ENT-002'],
    related_contracts: ['CONT-2024-001'],
    related_disputes: [],
    documents: [],
    time_entries: [],
    expenses: [],
    notes: [],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z'
  },
  {
    id: '2',
    matter_number: 'MAT-2024-002',
    title: 'Employment Dispute - Wrongful Termination',
    description: 'Defense of wrongful termination claim and employment litigation',
    matter_type: MatterType.EMPLOYMENT,
    status: MatterStatus.ACTIVE,
    priority: MatterPriority.URGENT,
    client: 'Manufacturing Solutions Ltd',
    responsible_attorney: 'Michael Chen',
    practice_area: 'Employment Law',
    budget: 75000,
    actual_cost: 32000,
    currency: 'USD',
    open_date: '2024-02-01',
    target_close_date: '2024-06-01',
    billing_method: BillingMethod.FIXED_FEE,
    fixed_fee: 65000,
    related_entities: ['ENT-003'],
    related_contracts: [],
    related_disputes: ['DIS-2024-001'],
    documents: [],
    time_entries: [],
    expenses: [],
    notes: [],
    created_at: '2024-02-01T00:00:00Z',
    updated_at: '2024-02-05T00:00:00Z'
  }
]

const mockStats = {
  total_matters: 24,
  active_matters: 16,
  completed_matters: 6,
  on_hold_matters: 2,
  total_budget: 2850000,
  total_actual_cost: 1920000,
  budget_utilization: 67.4,
  average_matter_value: 118750,
  billing_realization: 89.2
}

interface OutletContext {
  viewMode: 'grid' | 'list'
}

export const MattersPage: React.FC = () => {
  const { viewMode } = useOutletContext<OutletContext>()
  const [matters, setMatters] = useState<Matter[]>(mockMatters)
  const [selectedMatter, setSelectedMatter] = useState<Matter | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<MatterStatus | ''>('')
  const [priorityFilter, setPriorityFilter] = useState<MatterPriority | ''>('')
  const [practiceAreaFilter, setPracticeAreaFilter] = useState('')

  // Filter matters based on search and filters
  const filteredMatters = matters.filter(matter => {
    const matchesSearch = !searchQuery || 
      matter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.matter_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      matter.responsible_attorney.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = !statusFilter || matter.status === statusFilter
    const matchesPriority = !priorityFilter || matter.priority === priorityFilter
    const matchesPracticeArea = !practiceAreaFilter || matter.practice_area === practiceAreaFilter
    
    return matchesSearch && matchesStatus && matchesPriority && matchesPracticeArea
  })

  // Get unique practice areas
  const practiceAreas = [...new Set(matters.map(matter => matter.practice_area))]

  // Calculate budget utilization for each matter
  const getBudgetUtilization = (matter: Matter) => {
    return matter.budget > 0 ? (matter.actual_cost / matter.budget) * 100 : 0
  }

  // Table columns
  const columns: Column<Matter>[] = [
    {
      key: 'matter_number',
      title: 'Matter Number',
      sortable: true,
      render: (value, item) => (
        <div className="flex items-center">
          <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center mr-3">
            <Briefcase className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">{item.matter_type.replace('_', ' ')}</div>
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
      key: 'client',
      title: 'Client',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <Building2 className="h-4 w-4 text-gray-400 mr-1" />
          {value}
        </div>
      )
    },
    {
      key: 'responsible_attorney',
      title: 'Attorney',
      sortable: true,
      render: (value) => (
        <div className="flex items-center">
          <User className="h-4 w-4 text-gray-400 mr-1" />
          {value}
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
          value === MatterStatus.ACTIVE ? 'bg-green-100 text-green-800' :
          value === MatterStatus.ON_HOLD ? 'bg-yellow-100 text-yellow-800' :
          value === MatterStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
          value === MatterStatus.CANCELLED ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value === MatterStatus.ACTIVE && <CheckCircle className="h-3 w-3 mr-1" />}
          {value === MatterStatus.ON_HOLD && <Timer className="h-3 w-3 mr-1" />}
          {value === MatterStatus.COMPLETED && <Archive className="h-3 w-3 mr-1" />}
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
          value === MatterPriority.URGENT ? 'bg-red-100 text-red-800' :
          value === MatterPriority.HIGH ? 'bg-orange-100 text-orange-800' :
          value === MatterPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        )}>
          {value === MatterPriority.URGENT && <AlertTriangle className="h-3 w-3 mr-1" />}
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    {
      key: 'budget',
      title: 'Budget',
      sortable: true,
      align: 'right',
      render: (value, item) => (
        <div className="text-right">
          <div className="font-medium text-gray-900">
            ${value.toLocaleString()} {item.currency}
          </div>
          <div className="text-sm text-gray-500">
            ${item.actual_cost.toLocaleString()} spent
          </div>
        </div>
      )
    },
    {
      key: 'open_date',
      title: 'Opened',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    }
  ]

  // Table actions
  const tableActions: TableAction<Matter>[] = [
    {
      label: 'View Details',
      icon: Eye,
      onClick: (matter) => {
        setSelectedMatter(matter)
        setShowDetailsModal(true)
      }
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: (matter) => {
        setSelectedMatter(matter)
        setShowEditModal(true)
      }
    },
    {
      label: 'Delete',
      icon: Trash2,
      variant: 'danger',
      onClick: (matter) => {
        setSelectedMatter(matter)
        setShowDeleteModal(true)
      }
    }
  ]

  // Handle export
  const handleExport = async (format: 'csv' | 'pdf' | 'xlsx') => {
    toast.success(`Exporting matters as ${format.toUpperCase()}...`)
  }

  // Handle import
  const handleImport = (file: File) => {
    toast.success('Importing matters...')
  }

  // Handle create
  const handleCreate = (data: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowCreateModal(false)
      toast.success('Matter created successfully')
    }, 1000)
  }

  // Handle update
  const handleUpdate = (data: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowEditModal(false)
      setSelectedMatter(null)
      toast.success('Matter updated successfully')
    }, 1000)
  }

  // Handle delete
  const handleDelete = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setShowDeleteModal(false)
      setSelectedMatter(null)
      toast.success('Matter deleted successfully')
    }, 1000)
  }

  return (
    <>
      <Helmet title="Matter Management" />
      
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Matter Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Track and manage legal matters, cases, and client work
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
              New Matter
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-teal-50 rounded-lg">
                <Briefcase className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Matters</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.total_matters}</p>
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
                <p className="text-2xl font-bold text-gray-900">{mockStats.active_matters}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${(mockStats.total_budget / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Budget Utilization</p>
                <p className="text-2xl font-bold text-gray-900">{mockStats.budget_utilization}%</p>
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
                  placeholder="Search matters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as MatterStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Statuses</option>
              {Object.values(MatterStatus).map(status => (
                <option key={status} value={status}>
                  {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as MatterPriority | '')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Priorities</option>
              {Object.values(MatterPriority).map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
            
            <select
              value={practiceAreaFilter}
              onChange={(e) => setPracticeAreaFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">All Practice Areas</option>
              {practiceAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Display */}
        {viewMode === 'list' ? (
          <DataTable
            data={filteredMatters}
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
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No matters found</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Get started by creating your first legal matter.
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Matter
                </button>
              </div>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatters.map((matter) => (
              <div key={matter.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{matter.matter_number}</h3>
                        <p className="text-xs text-gray-500">{matter.practice_area}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      matter.priority === MatterPriority.URGENT ? 'bg-red-100 text-red-800' :
                      matter.priority === MatterPriority.HIGH ? 'bg-orange-100 text-orange-800' :
                      matter.priority === MatterPriority.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {matter.priority}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">{matter.title}</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building2 className="h-4 w-4 mr-2" />
                      {matter.client}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      {matter.responsible_attorney}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      ${matter.actual_cost.toLocaleString()} / ${matter.budget.toLocaleString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Opened: {new Date(matter.open_date).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {/* Budget utilization bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Budget Utilization</span>
                      <span>{getBudgetUtilization(matter).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={cn(
                          'h-2 rounded-full transition-all',
                          getBudgetUtilization(matter) > 90 ? 'bg-red-500' :
                          getBudgetUtilization(matter) > 75 ? 'bg-orange-500' :
                          'bg-green-500'
                        )}
                        style={{ width: `${Math.min(getBudgetUtilization(matter), 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      matter.status === MatterStatus.ACTIVE ? 'bg-green-100 text-green-800' :
                      matter.status === MatterStatus.ON_HOLD ? 'bg-yellow-100 text-yellow-800' :
                      matter.status === MatterStatus.COMPLETED ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    )}>
                      {matter.status.replace('_', ' ')}
                    </span>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMatter(matter)
                          setShowDetailsModal(true)
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMatter(matter)
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
          title="Create New Matter"
          size="lg"
        >
          <ModalBody>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Enter matter title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter client name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Attorney</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="Enter responsible attorney"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(MatterType).map(type => (
                      <option key={type} value={type}>
                        {type.replace('_', ' ').charAt(0).toUpperCase() + type.replace('_', ' ').slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500">
                    {Object.values(MatterPriority).map(priority => (
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
                  placeholder="Enter matter description"
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
              {loading ? <LoadingSpinner size="sm" color="white" /> : 'Create Matter'}
            </button>
          </ModalFooter>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Matter"
          size="md"
        >
          <ModalBody>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Matter</h3>
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete "{selectedMatter?.title}"? This action cannot be undone.
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