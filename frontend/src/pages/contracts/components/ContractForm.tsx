import React, { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Calendar,
  Plus,
  Trash2,
  Building,
  User,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  Users,
  Target,
  Settings
} from 'lucide-react'
import { Contract, ContractCreateRequest, ContractType, ContractStatus, ContractParty, KeyTerm, Milestone } from '@/types/contracts'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import { contractsService } from '@/services/contractsService'
import { entitiesService } from '@/services/entitiesService'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const contractSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  contract_type: z.nativeEnum(ContractType),
  parties: z.array(z.object({
    name: z.string().min(1, 'Name is required'),
    role: z.enum(['client', 'vendor', 'partner', 'contractor', 'other']),
    company_id: z.string().optional(),
    contact_person: z.string().optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional()
  })).min(1, 'At least one party is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  value: z.number().min(0).optional(),
  currency: z.string().optional(),
  description: z.string().optional(),
  company_id: z.string().optional(),
  matter_id: z.string().optional(),
  contract_number: z.string().optional(),
  renewal_terms: z.object({
    auto_renewal: z.boolean(),
    renewal_period: z.number().optional(),
    renewal_period_unit: z.enum(['days', 'months', 'years']).optional(),
    notice_period: z.number().optional(),
    notice_period_unit: z.enum(['days', 'months', 'years']).optional(),
    price_adjustment: z.number().optional(),
    price_adjustment_type: z.enum(['percentage', 'fixed']).optional()
  }).optional(),
  key_terms: z.array(z.object({
    category: z.string().min(1, 'Category is required'),
    term: z.string().min(1, 'Term is required'),
    value: z.string().optional(),
    description: z.string().optional(),
    is_critical: z.boolean().default(false)
  })).optional(),
  milestones: z.array(z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    due_date: z.string().min(1, 'Due date is required'),
    responsible_party: z.string().optional(),
    amount: z.number().min(0).optional(),
    currency: z.string().optional(),
    dependencies: z.array(z.string()).optional()
  })).optional(),
  template_id: z.string().optional(),
  parent_contract_id: z.string().optional()
})

type ContractFormData = z.infer<typeof contractSchema>

interface ContractFormProps {
  contract?: Contract
  onSubmit: (data: ContractCreateRequest) => void
  onCancel: () => void
  loading?: boolean
}

export const ContractForm: React.FC<ContractFormProps> = ({
  contract,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [currentTab, setCurrentTab] = useState<'basic' | 'parties' | 'terms' | 'milestones' | 'renewal'>('basic')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
    defaultValues: {
      title: contract?.title || '',
      contract_type: contract?.contract_type || ContractType.SERVICE_AGREEMENT,
      parties: contract?.parties || [{ name: '', role: 'client' }],
      start_date: contract?.start_date || '',
      end_date: contract?.end_date || '',
      value: contract?.value || undefined,
      currency: contract?.currency || 'USD',
      description: contract?.description || '',
      company_id: contract?.company_id || '',
      matter_id: contract?.matter_id || '',
      contract_number: contract?.contract_number || '',
      renewal_terms: contract?.renewal_terms || {
        auto_renewal: false,
        renewal_period: 12,
        renewal_period_unit: 'months',
        notice_period: 30,
        notice_period_unit: 'days'
      },
      key_terms: contract?.key_terms || [],
      milestones: contract?.milestones || [],
      template_id: contract?.template_id || '',
      parent_contract_id: contract?.parent_contract_id || ''
    }
  })

  const {
    fields: partyFields,
    append: appendParty,
    remove: removeParty
  } = useFieldArray({
    control,
    name: 'parties'
  })

  const {
    fields: termFields,
    append: appendTerm,
    remove: removeTerm
  } = useFieldArray({
    control,
    name: 'key_terms'
  })

  const {
    fields: milestoneFields,
    append: appendMilestone,
    remove: removeMilestone
  } = useFieldArray({
    control,
    name: 'milestones'
  })

  // Fetch companies for dropdown
  const { data: companies } = useQuery({
    queryKey: ['companies'],
    queryFn: () => entitiesService.getCompanies({ page: 1, limit: 100 })
  })

  // Fetch contract templates
  const { data: templates } = useQuery({
    queryKey: ['contract-templates'],
    queryFn: () => contractsService.getTemplates()
  })

  // Handle template selection
  const handleTemplateChange = async (templateId: string) => {
    if (!templateId) return
    
    try {
      const template = await contractsService.getTemplate(templateId)
      setSelectedTemplate(templateId)
      setValue('template_id', templateId)
      setValue('contract_type', template.contract_type)
      setValue('key_terms', template.default_terms || [])
      toast.success('Template applied successfully')
    } catch (error) {
      toast.error('Failed to load template')
    }
  }

  const handleFormSubmit = (data: ContractFormData) => {
    const submitData: ContractCreateRequest = {
      ...data,
      key_terms: data.key_terms?.map(term => ({
        category: term.category,
        term: term.term,
        value: term.value,
        description: term.description,
        is_critical: term.is_critical
      })),
      milestones: data.milestones?.map(milestone => ({
        title: milestone.title,
        description: milestone.description,
        due_date: milestone.due_date,
        completed: false,
        responsible_party: milestone.responsible_party,
        amount: milestone.amount,
        currency: milestone.currency,
        dependencies: milestone.dependencies
      }))
    }
    onSubmit(submitData)
  }

  const contractTypes = [
    { value: ContractType.NDA, label: 'Non-Disclosure Agreement' },
    { value: ContractType.SERVICE_AGREEMENT, label: 'Service Agreement' },
    { value: ContractType.EMPLOYMENT, label: 'Employment Contract' },
    { value: ContractType.LEASE, label: 'Lease Agreement' },
    { value: ContractType.PURCHASE, label: 'Purchase Agreement' },
    { value: ContractType.PARTNERSHIP, label: 'Partnership Agreement' },
    { value: ContractType.LICENSING, label: 'Licensing Agreement' },
    { value: ContractType.CONSULTING, label: 'Consulting Agreement' },
    { value: ContractType.DISTRIBUTION, label: 'Distribution Agreement' },
    { value: ContractType.JOINT_VENTURE, label: 'Joint Venture' },
    { value: ContractType.FRANCHISE, label: 'Franchise Agreement' },
    { value: ContractType.LOAN, label: 'Loan Agreement' },
    { value: ContractType.INSURANCE, label: 'Insurance Contract' },
    { value: ContractType.OTHER, label: 'Other' }
  ]

  const partyRoles = [
    { value: 'client', label: 'Client' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'partner', label: 'Partner' },
    { value: 'contractor', label: 'Contractor' },
    { value: 'other', label: 'Other' }
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'parties', label: 'Parties', icon: Users },
    { id: 'terms', label: 'Key Terms', icon: Target },
    { id: 'milestones', label: 'Milestones', icon: CheckCircle },
    { id: 'renewal', label: 'Renewal', icon: Clock }
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={cn(
                  'flex items-center py-2 px-1 border-b-2 font-medium text-sm',
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

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information Tab */}
        {currentTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Title *
                </label>
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className={cn(
                        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                        errors.title ? 'border-red-300' : 'border-gray-300'
                      )}
                      placeholder="Enter contract title"
                    />
                  )}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Type *
                </label>
                <Controller
                  name="contract_type"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {contractTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template
                </label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => handleTemplateChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a template</option>
                  {templates?.map(template => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Number
                </label>
                <Controller
                  name="contract_number"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Auto-generated if empty"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <Controller
                  name="start_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className={cn(
                        'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                        errors.start_date ? 'border-red-300' : 'border-gray-300'
                      )}
                    />
                  )}
                />
                {errors.start_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.start_date.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Controller
                  name="end_date"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Value
                </label>
                <div className="flex space-x-2">
                  <Controller
                    name="value"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        step="0.01"
                        min="0"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    )}
                  />
                  <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="CAD">CAD</option>
                        <option value="AUD">AUD</option>
                      </select>
                    )}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Related Company
                </label>
                <Controller
                  name="company_id"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select company</option>
                      {companies?.items.map(company => (
                        <option key={company.id} value={company.id}>
                          {company.company_name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <textarea
                    {...field}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contract description"
                  />
                )}
              />
            </div>
          </div>
        )}

        {/* Parties Tab */}
        {currentTab === 'parties' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Contract Parties</h3>
              <button
                type="button"
                onClick={() => appendParty({ name: '', role: 'client' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Party
              </button>
            </div>

            {partyFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Party {index + 1}</h4>
                  {partyFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParty(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name *
                    </label>
                    <Controller
                      name={`parties.${index}.name`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className={cn(
                            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                            errors.parties?.[index]?.name ? 'border-red-300' : 'border-gray-300'
                          )}
                          placeholder="Enter party name"
                        />
                      )}
                    />
                    {errors.parties?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.parties[index]?.name?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role *
                    </label>
                    <Controller
                      name={`parties.${index}.role`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {partyRoles.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person
                    </label>
                    <Controller
                      name={`parties.${index}.contact_person`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter contact person"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Controller
                      name={`parties.${index}.email`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="email"
                          className={cn(
                            'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500',
                            errors.parties?.[index]?.email ? 'border-red-300' : 'border-gray-300'
                          )}
                          placeholder="Enter email address"
                        />
                      )}
                    />
                    {errors.parties?.[index]?.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.parties[index]?.email?.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <Controller
                      name={`parties.${index}.phone`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="tel"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter phone number"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <Controller
                      name={`parties.${index}.address`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter address"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Key Terms Tab */}
        {currentTab === 'terms' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Key Terms</h3>
              <button
                type="button"
                onClick={() => appendTerm({ category: '', term: '', is_critical: false })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Term
              </button>
            </div>

            {termFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Term {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTerm(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <Controller
                      name={`key_terms.${index}.category`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Payment, Delivery, Warranty"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Term *
                    </label>
                    <Controller
                      name={`key_terms.${index}.term`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter term name"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Value
                    </label>
                    <Controller
                      name={`key_terms.${index}.value`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter term value"
                        />
                      )}
                    />
                  </div>

                  <div className="flex items-center">
                    <Controller
                      name={`key_terms.${index}.is_critical`}
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Critical Term</span>
                        </label>
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name={`key_terms.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter term description"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Milestones Tab */}
        {currentTab === 'milestones' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Milestones</h3>
              <button
                type="button"
                onClick={() => appendMilestone({ title: '', due_date: '' })}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Milestone
              </button>
            </div>

            {milestoneFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-700">Milestone {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <Controller
                      name={`milestones.${index}.title`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter milestone title"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <Controller
                      name={`milestones.${index}.due_date`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Responsible Party
                    </label>
                    <Controller
                      name={`milestones.${index}.responsible_party`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter responsible party"
                        />
                      )}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <Controller
                      name={`milestones.${index}.amount`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      )}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <Controller
                      name={`milestones.${index}.description`}
                      control={control}
                      render={({ field }) => (
                        <textarea
                          {...field}
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter milestone description"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Renewal Terms Tab */}
        {currentTab === 'renewal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Renewal Terms</h3>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Controller
                    name="renewal_terms.auto_renewal"
                    control={control}
                    render={({ field }) => (
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">Enable Auto-Renewal</span>
                      </label>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Renewal Period
                  </label>
                  <div className="flex space-x-2">
                    <Controller
                      name="renewal_terms.renewal_period"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="12"
                        />
                      )}
                    />
                    <Controller
                      name="renewal_terms.renewal_period_unit"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notice Period
                  </label>
                  <div className="flex space-x-2">
                    <Controller
                      name="renewal_terms.notice_period"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          min="1"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="30"
                        />
                      )}
                    />
                    <Controller
                      name="renewal_terms.notice_period_unit"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="days">Days</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Adjustment
                  </label>
                  <div className="flex space-x-2">
                    <Controller
                      name="renewal_terms.price_adjustment"
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="0.00"
                        />
                      )}
                    />
                    <Controller
                      name="renewal_terms.price_adjustment_type"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">Fixed</option>
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !isValid}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              contract ? 'Update Contract' : 'Create Contract'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}