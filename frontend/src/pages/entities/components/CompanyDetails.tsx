import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Globe, 
  Phone, 
  Mail, 
  User, 
  Percent,
  FileText,
  Scale,
  Shield,
  Edit,
  ExternalLink,
  Download,
  Eye,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Users,
  History
} from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { entitiesService } from '@/services/entitiesService'
import { Company, CompanyStatus } from '@/types/entities'
import { cn } from '@/utils/cn'

interface CompanyDetailsProps {
  company: Company
  onEdit: () => void
  onClose: () => void
}

export const CompanyDetails: React.FC<CompanyDetailsProps> = ({
  company,
  onEdit,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'relationships' | 'documents' | 'audit'>('overview')

  // Fetch company relationships
  const { data: relationships, isLoading: relationshipsLoading } = useQuery({
    queryKey: ['company-relationships', company.id],
    queryFn: () => entitiesService.getCompanyRelationships(company.id),
    enabled: activeTab === 'relationships'
  })

  // Fetch company documents
  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ['company-documents', company.id],
    queryFn: () => entitiesService.getDocuments(company.id),
    enabled: activeTab === 'documents'
  })

  // Fetch audit trail
  const { data: auditTrail, isLoading: auditLoading } = useQuery({
    queryKey: ['company-audit', company.id],
    queryFn: () => entitiesService.getAuditTrail(company.id),
    enabled: activeTab === 'audit'
  })

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'relationships', label: 'Relationships', icon: Users },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'audit', label: 'Audit Trail', icon: History }
  ]

  const getStatusColor = (status: CompanyStatus) => {
    switch (status) {
      case CompanyStatus.ACTIVE:
        return 'bg-green-100 text-green-800'
      case CompanyStatus.INACTIVE:
        return 'bg-yellow-100 text-yellow-800'
      case CompanyStatus.DISSOLVED:
        return 'bg-red-100 text-red-800'
      case CompanyStatus.SUSPENDED:
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <ModalBody>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{company.company_name}</h2>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-sm text-gray-500">{company.entity_type}</span>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  getStatusColor(company.company_status)
                )}>
                  {company.company_status === CompanyStatus.ACTIVE && <CheckCircle className="h-3 w-3 mr-1" />}
                  {company.company_status === CompanyStatus.INACTIVE && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {company.company_status.charAt(0).toUpperCase() + company.company_status.slice(1)}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'py-2 px-1 border-b-2 font-medium text-sm flex items-center',
                    activeTab === tab.id
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

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Jurisdiction</p>
                      <p className="text-sm text-gray-600">{company.jurisdiction_of_incorporation}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Incorporated</p>
                      <p className="text-sm text-gray-600">
                        {new Date(company.incorporation_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {company.industry_sector && (
                    <div className="flex items-start space-x-3">
                      <TrendingUp className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Industry</p>
                        <p className="text-sm text-gray-600">{company.industry_sector}</p>
                      </div>
                    </div>
                  )}

                  {company.company_number && (
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Company Number</p>
                        <p className="text-sm text-gray-600">{company.company_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
                
                <div className="space-y-3">
                  {company.website && (
                    <div className="flex items-start space-x-3">
                      <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Website</p>
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          {company.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  )}

                  {company.phone && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{company.phone}</p>
                      </div>
                    </div>
                  )}

                  {company.email && (
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <a
                          href={`mailto:${company.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {company.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Addresses */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Addresses</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Registered Address</h4>
                  <p className="text-sm text-gray-600">{company.registered_address}</p>
                </div>
                
                {company.business_address && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Business Address</h4>
                    <p className="text-sm text-gray-600">{company.business_address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Shareholders */}
            {company.shareholders_info && company.shareholders_info.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Shareholders</h3>
                
                <div className="space-y-3">
                  {company.shareholders_info.map((shareholder, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{shareholder.name}</p>
                          {shareholder.share_class && (
                            <p className="text-sm text-gray-600">{shareholder.share_class}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Percent className="h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{shareholder.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Directors */}
            {company.directors_info && company.directors_info.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Directors</h3>
                
                <div className="space-y-3">
                  {company.directors_info.map((director, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{director.name}</p>
                          <p className="text-sm text-gray-600">{director.title}</p>
                        </div>
                      </div>
                      {director.appointment_date && (
                        <p className="text-sm text-gray-500">
                          Since {new Date(director.appointment_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {company.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="text-gray-600">{company.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Relationships Tab */}
        {activeTab === 'relationships' && (
          <div className="space-y-6">
            {relationshipsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Contracts ({relationships?.contracts?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {relationships?.contracts?.map((contract: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{contract.title}</p>
                        <p className="text-sm text-gray-600">{contract.type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Scale className="h-5 w-5 mr-2" />
                    Disputes ({relationships?.disputes?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {relationships?.disputes?.map((dispute: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{dispute.title}</p>
                        <p className="text-sm text-gray-600">{dispute.status}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    Matters ({relationships?.matters?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {relationships?.matters?.map((matter: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{matter.title}</p>
                        <p className="text-sm text-gray-600">{matter.type}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Risk Assessments ({relationships?.risks?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {relationships?.risks?.map((risk: any, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-900">{risk.title}</p>
                        <p className="text-sm text-gray-600">{risk.level}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {documentsLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Company Documents</h3>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    <Download className="h-4 w-4 mr-2" />
                    Upload Document
                  </button>
                </div>

                <div className="space-y-2">
                  {documents?.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-600">{doc.type}</p>
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
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {auditLoading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Audit Trail</h3>
                
                <div className="space-y-3">
                  {auditTrail?.map((entry: any, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <History className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{entry.action}</p>
                          <p className="text-sm text-gray-500">{new Date(entry.timestamp).toLocaleString()}</p>
                        </div>
                        <p className="text-sm text-gray-600">{entry.description}</p>
                        <p className="text-xs text-gray-500">by {entry.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Close
        </button>
      </ModalFooter>
    </div>
  )
}