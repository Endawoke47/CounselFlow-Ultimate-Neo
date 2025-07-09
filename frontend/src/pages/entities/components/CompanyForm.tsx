import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, Building2, MapPin, Calendar, Globe, Phone, Mail, User, Percent } from 'lucide-react'
import { ModalBody, ModalFooter } from '@/components/ui/Modal'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { Company, CompanyCreateRequest, EntityType, CompanyStatus } from '@/types/entities'
import { cn } from '@/utils/cn'

const shareholderSchema = z.object({
  name: z.string().min(1, 'Shareholder name is required'),
  percentage: z.number().min(0).max(100),
  share_class: z.string().optional(),
  voting_rights: z.boolean().optional(),
  contact_info: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional()
  }).optional()
})

const directorSchema = z.object({
  name: z.string().min(1, 'Director name is required'),
  title: z.string().min(1, 'Title is required'),
  appointment_date: z.string().optional(),
  resignation_date: z.string().optional(),
  contact_info: z.object({
    email: z.string().email().optional().or(z.literal('')),
    phone: z.string().optional(),
    address: z.string().optional()
  }).optional()
})

const companySchema = z.object({
  company_name: z.string().min(1, 'Company name is required'),
  entity_type: z.nativeEnum(EntityType),
  jurisdiction_of_incorporation: z.string().min(1, 'Jurisdiction is required'),
  incorporation_date: z.string().min(1, 'Incorporation date is required'),
  registered_address: z.string().min(1, 'Registered address is required'),
  business_address: z.string().optional(),
  industry_sector: z.string().optional(),
  company_number: z.string().optional(),
  tax_id: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  description: z.string().optional(),
  parent_company_id: z.string().optional(),
  shareholders_info: z.array(shareholderSchema).optional(),
  directors_info: z.array(directorSchema).optional(),
  company_status: z.nativeEnum(CompanyStatus).optional()
})

type CompanyFormData = z.infer<typeof companySchema>

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: CompanyCreateRequest) => void
  onCancel: () => void
  loading?: boolean
}

export const CompanyForm: React.FC<CompanyFormProps> = ({
  company,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'details' | 'shareholders' | 'directors'>('basic')

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company_name: company?.company_name || '',
      entity_type: company?.entity_type || EntityType.CORPORATION,
      jurisdiction_of_incorporation: company?.jurisdiction_of_incorporation || '',
      incorporation_date: company?.incorporation_date || '',
      registered_address: company?.registered_address || '',
      business_address: company?.business_address || '',
      industry_sector: company?.industry_sector || '',
      company_number: company?.company_number || '',
      tax_id: company?.tax_id || '',
      website: company?.website || '',
      phone: company?.phone || '',
      email: company?.email || '',
      description: company?.description || '',
      parent_company_id: company?.parent_company_id || '',
      company_status: company?.company_status || CompanyStatus.ACTIVE,
      shareholders_info: company?.shareholders_info || [{ name: '', percentage: 0 }],
      directors_info: company?.directors_info || [{ name: '', title: '' }]
    }
  })

  const {
    fields: shareholderFields,
    append: appendShareholder,
    remove: removeShareholder
  } = useFieldArray({
    control,
    name: 'shareholders_info'
  })

  const {
    fields: directorFields,
    append: appendDirector,
    remove: removeDirector
  } = useFieldArray({
    control,
    name: 'directors_info'
  })

  const handleFormSubmit = (data: CompanyFormData) => {
    onSubmit(data)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building2 },
    { id: 'details', label: 'Details', icon: Globe },
    { id: 'shareholders', label: 'Shareholders', icon: User },
    { id: 'directors', label: 'Directors', icon: User }
  ]

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <ModalBody>
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  type="button"
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

        {/* Basic Information */}
        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  {...register('company_name')}
                  type="text"
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.company_name && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="Enter company name"
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.company_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entity Type *
                </label>
                <select
                  {...register('entity_type')}
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.entity_type && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                >
                  <option value={EntityType.CORPORATION}>Corporation</option>
                  <option value={EntityType.LLC}>LLC</option>
                  <option value={EntityType.PARTNERSHIP}>Partnership</option>
                  <option value={EntityType.SUBSIDIARY}>Subsidiary</option>
                  <option value={EntityType.JOINT_VENTURE}>Joint Venture</option>
                  <option value={EntityType.BRANCH}>Branch</option>
                  <option value={EntityType.REPRESENTATIVE_OFFICE}>Representative Office</option>
                  <option value={EntityType.OTHER}>Other</option>
                </select>
                {errors.entity_type && (
                  <p className="mt-1 text-sm text-red-600">{errors.entity_type.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurisdiction of Incorporation *
                </label>
                <input
                  {...register('jurisdiction_of_incorporation')}
                  type="text"
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.jurisdiction_of_incorporation && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="e.g., Delaware, UK, Singapore"
                />
                {errors.jurisdiction_of_incorporation && (
                  <p className="mt-1 text-sm text-red-600">{errors.jurisdiction_of_incorporation.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incorporation Date *
                </label>
                <input
                  {...register('incorporation_date')}
                  type="date"
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.incorporation_date && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                />
                {errors.incorporation_date && (
                  <p className="mt-1 text-sm text-red-600">{errors.incorporation_date.message}</p>
                )}
              </div>

              {company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Status
                  </label>
                  <select
                    {...register('company_status')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={CompanyStatus.ACTIVE}>Active</option>
                    <option value={CompanyStatus.INACTIVE}>Inactive</option>
                    <option value={CompanyStatus.DISSOLVED}>Dissolved</option>
                    <option value={CompanyStatus.SUSPENDED}>Suspended</option>
                    <option value={CompanyStatus.PENDING}>Pending</option>
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registered Address *
              </label>
              <textarea
                {...register('registered_address')}
                rows={3}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                  errors.registered_address && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                )}
                placeholder="Enter registered address"
              />
              {errors.registered_address && (
                <p className="mt-1 text-sm text-red-600">{errors.registered_address.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business Address
              </label>
              <textarea
                {...register('business_address')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter business address (if different from registered address)"
              />
            </div>
          </div>
        )}

        {/* Details */}
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Sector
                </label>
                <input
                  {...register('industry_sector')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Technology, Healthcare, Finance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Number
                </label>
                <input
                  {...register('company_number')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Official company registration number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tax ID
                </label>
                <input
                  {...register('tax_id')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Tax identification number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  {...register('website')}
                  type="url"
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.website && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="https://www.example.com"
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className={cn(
                    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500',
                    errors.email && 'border-red-300 focus:border-red-500 focus:ring-red-500'
                  )}
                  placeholder="contact@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the company's business activities"
              />
            </div>
          </div>
        )}

        {/* Shareholders */}
        {activeTab === 'shareholders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Shareholders</h3>
              <button
                type="button"
                onClick={() => appendShareholder({ name: '', percentage: 0 })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Shareholder
              </button>
            </div>

            {shareholderFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Shareholder {index + 1}</h4>
                  {shareholderFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeShareholder(index)}
                      className="text-red-600 hover:text-red-800"
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
                    <input
                      {...register(`shareholders_info.${index}.name`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Shareholder name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Percentage *
                    </label>
                    <input
                      {...register(`shareholders_info.${index}.percentage`, { valueAsNumber: true })}
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Share Class
                    </label>
                    <input
                      {...register(`shareholders_info.${index}.share_class`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Common, Preferred"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      {...register(`shareholders_info.${index}.contact_info.email`)}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="shareholder@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Directors */}
        {activeTab === 'directors' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Directors</h3>
              <button
                type="button"
                onClick={() => appendDirector({ name: '', title: '' })}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Director
              </button>
            </div>

            {directorFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Director {index + 1}</h4>
                  {directorFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDirector(index)}
                      className="text-red-600 hover:text-red-800"
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
                    <input
                      {...register(`directors_info.${index}.name`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Director name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      {...register(`directors_info.${index}.title`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., CEO, CFO, Director"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Appointment Date
                    </label>
                    <input
                      {...register(`directors_info.${index}.appointment_date`)}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      {...register(`directors_info.${index}.contact_info.email`)}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="director@example.com"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner size="sm" color="white" />
          ) : (
            company ? 'Update Entity' : 'Create Entity'
          )}
        </button>
      </ModalFooter>
    </form>
  )
}