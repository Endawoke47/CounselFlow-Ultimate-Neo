import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  DollarSign,
  FileText,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Edit,
  Download,
  Upload,
  Shield,
  Target,
  TrendingUp,
  Eye,
  History,
  Bell,
  Link,
  Brain,
  Activity,
  Paperclip,
  Star,
  AlertCircle
} from 'lucide-react'
import { Contract, ContractStatus, ContractType } from '@/types/contracts'
import { contractsService } from '@/services/contractsService'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import { format } from 'date-fns'

interface ContractDetailsProps {
  contract: Contract
  onEdit: () => void
  onClose: () => void
}

export const ContractDetails: React.FC<ContractDetailsProps> = ({
  contract,
  onEdit,
  onClose
}) => {
  const [currentTab, setCurrentTab] = useState<'overview' | 'parties' | 'terms' | 'milestones' | 'documents' | 'analysis' | 'history'>('overview')

  // Fetch contract amendments
  const { data: amendments } = useQuery({
    queryKey: ['contract-amendments', contract.id],
    queryFn: () => contractsService.getAmendments(contract.id),
    enabled: !!contract.id
  })

  // Fetch contract documents
  const { data: documents } = useQuery({
    queryKey: ['contract-documents', contract.id],
    queryFn: () => contractsService.getDocuments(contract.id),
    enabled: !!contract.id
  })

  // Fetch contract performance
  const { data: performance } = useQuery({
    queryKey: ['contract-performance', contract.id],
    queryFn: () => contractsService.getContractPerformance(contract.id),
    enabled: !!contract.id
  })

  // Fetch audit trail
  const { data: auditTrail } = useQuery({
    queryKey: ['contract-audit', contract.id],
    queryFn: () => contractsService.getAuditTrail(contract.id),
    enabled: !!contract.id
  })

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case ContractStatus.SIGNED:
        return 'bg-blue-100 text-blue-800'
      case ContractStatus.DRAFT:
        return 'bg-yellow-100 text-yellow-800'
      case ContractStatus.EXPIRED:
        return 'bg-red-100 text-red-800'
      case ContractStatus.TERMINATED:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: ContractStatus) => {
    switch (status) {
      case ContractStatus.ACTIVE:
        return <CheckCircle className="h-3 w-3" />
      case ContractStatus.EXPIRED:
        return <AlertTriangle className="h-3 w-3" />
      case ContractStatus.DRAFT:
        return <Clock className="h-3 w-3" />
      default:
        return null
    }
  }

  const getRiskColor = (riskScore?: number) => {
    if (!riskScore) return 'text-gray-500'
    if (riskScore < 30) return 'text-green-500'
    if (riskScore < 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount)
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'terms', label: 'Terms', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'documents', label: 'Documents', icon: Paperclip },
    { id: 'analysis', label: 'AI Analysis', icon: Brain },
    { id: 'history', label: 'History', icon: History }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.title}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(contract.status))}>
                {getStatusIcon(contract.status)}
                <span className="ml-1">{contract.status.charAt(0).toUpperCase() + contract.status.slice(1).replace('_', ' ')}</span>
              </span>
              <span className="text-sm text-gray-500">{contract.contract_type.replace('_', ' ').toUpperCase()}</span>
              {contract.contract_number && (
                <span className="text-sm text-gray-500">#{contract.contract_number}</span>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            <button
              onClick={() => contractsService.downloadDocument(contract.id, 'main')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-1" />
              Download
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Start Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {format(new Date(contract.start_date), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Value</p>
              <p className="text-lg font-semibold text-gray-900">
                {contract.value ? formatCurrency(contract.value, contract.currency) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Shield className={cn('h-5 w-5', getRiskColor(contract.risk_score))} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Risk Score</p>
              <p className={cn('text-lg font-semibold', getRiskColor(contract.risk_score))}>
                {contract.risk_score || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Milestones</p>
              <p className="text-lg font-semibold text-gray-900">
                {contract.milestones?.filter(m => m.completed).length || 0} / {contract.milestones?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id as any)}
                  className={cn(
                    'flex items-center py-4 px-1 border-b-2 font-medium text-sm',
                    currentTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {currentTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contract Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="text-sm text-gray-900">{contract.contract_type.replace('_', ' ').toUpperCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="text-sm text-gray-900">{contract.status.replace('_', ' ').toUpperCase()}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                      <dd className="text-sm text-gray-900">{format(new Date(contract.start_date), 'MMMM dd, yyyy')}</dd>
                    </div>
                    {contract.end_date && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="text-sm text-gray-900">{format(new Date(contract.end_date), 'MMMM dd, yyyy')}</dd>
                      </div>
                    )}
                    {contract.value && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Value</dt>
                        <dd className="text-sm text-gray-900">{formatCurrency(contract.value, contract.currency)}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  {performance ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Completion Rate</span>
                        <span className="text-sm font-medium text-gray-900">{performance.completion_rate}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Days Remaining</span>
                        <span className="text-sm font-medium text-gray-900">{performance.days_remaining}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">On Track</span>
                        <span className={cn('text-sm font-medium', performance.on_track ? 'text-green-600' : 'text-red-600')}>
                          {performance.on_track ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No performance data available</div>
                  )}
                </div>
              </div>

              {contract.description && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{contract.description}</p>
                </div>
              )}
            </div>
          )}

          {/* Parties Tab */}
          {currentTab === 'parties' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contract Parties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contract.parties.map((party, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">{party.name}</h4>
                        <p className="text-xs text-gray-500">{party.role.toUpperCase()}</p>
                      </div>
                    </div>
                    <dl className="space-y-2">
                      {party.contact_person && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Contact Person</dt>
                          <dd className="text-sm text-gray-900">{party.contact_person}</dd>
                        </div>
                      )}
                      {party.email && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Email</dt>
                          <dd className="text-sm text-gray-900">{party.email}</dd>
                        </div>
                      )}
                      {party.phone && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Phone</dt>
                          <dd className="text-sm text-gray-900">{party.phone}</dd>
                        </div>
                      )}
                      {party.address && (
                        <div>
                          <dt className="text-xs font-medium text-gray-500">Address</dt>
                          <dd className="text-sm text-gray-900">{party.address}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms Tab */}
          {currentTab === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Key Terms</h3>
              {contract.key_terms.length > 0 ? (
                <div className="space-y-3">
                  {contract.key_terms.map((term, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">{term.term}</span>
                            {term.is_critical && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <Star className="h-3 w-3 mr-1" />
                                Critical
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">{term.category}</p>
                          {term.value && (
                            <p className="text-sm text-gray-700 mb-2">
                              <span className="font-medium">Value:</span> {term.value}
                            </p>
                          )}
                          {term.description && (
                            <p className="text-sm text-gray-600">{term.description}</p>
                          )}
                        </div>
                        {term.ai_extracted && (
                          <div className="ml-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Extracted
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No key terms defined</p>
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {currentTab === 'milestones' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contract Milestones</h3>
              {contract.milestones.length > 0 ? (
                <div className="space-y-3">
                  {contract.milestones.map((milestone, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span className="text-sm font-medium text-gray-900">{milestone.title}</span>
                            {milestone.completed ? (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Completed
                              </span>
                            ) : (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 mr-1" />
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mb-2">
                            Due: {format(new Date(milestone.due_date), 'MMM dd, yyyy')}
                          </p>
                          {milestone.description && (
                            <p className="text-sm text-gray-600 mb-2">{milestone.description}</p>
                          )}
                          {milestone.responsible_party && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Responsible:</span> {milestone.responsible_party}
                            </p>
                          )}
                        </div>
                        {milestone.amount && (
                          <div className="ml-4 text-right">
                            <p className="text-sm font-medium text-gray-900">
                              {formatCurrency(milestone.amount, milestone.currency)}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No milestones defined</p>
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {currentTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Contract Documents</h3>
                <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-1" />
                  Upload Document
                </button>
              </div>
              {documents && documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <FileText className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                            <p className="text-xs text-gray-500">
                              {doc.type} • {(doc.file_size / 1024).toFixed(1)} KB • 
                              {format(new Date(doc.uploaded_at), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Paperclip className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No documents uploaded</p>
                </div>
              )}
            </div>
          )}

          {/* AI Analysis Tab */}
          {currentTab === 'analysis' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">AI Analysis</h3>
              {contract.ai_analysis ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Shield className="h-5 w-5 text-orange-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Risk Score</span>
                      </div>
                      <p className="text-2xl font-bold text-orange-600">{contract.ai_analysis.risk_score}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Compliance Score</span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">{contract.ai_analysis.compliance_score}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center mb-2">
                        <Activity className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="text-sm font-medium text-gray-900">Confidence</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">{contract.ai_analysis.confidence_score}%</p>
                    </div>
                  </div>

                  {contract.ai_analysis.potential_issues.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Potential Issues</h4>
                      <div className="space-y-2">
                        {contract.ai_analysis.potential_issues.map((issue, index) => (
                          <div key={index} className="flex items-start">
                            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{issue}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {contract.ai_analysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Recommendations</h4>
                      <div className="space-y-2">
                        {contract.ai_analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No AI analysis available</p>
                  <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                    <Brain className="h-4 w-4 mr-2" />
                    Run AI Analysis
                  </button>
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {currentTab === 'history' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Contract History</h3>
              {auditTrail && auditTrail.length > 0 ? (
                <div className="space-y-3">
                  {auditTrail.map((entry, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{entry.action}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')} • {entry.user}
                          </p>
                          {entry.details && (
                            <p className="text-sm text-gray-600 mt-2">{entry.details}</p>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="p-2 bg-gray-50 rounded-lg">
                            <History className="h-4 w-4 text-gray-600" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No history available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}