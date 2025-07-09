import React, { useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Sparkles,
  Plus,
  Trash2,
  FileText,
  Bot,
  CheckCircle,
  AlertTriangle,
  Copy,
  Download,
  Edit,
  RefreshCw,
  Target,
  Users,
  Globe,
  Code,
  Zap,
  Brain,
  Settings,
  Star,
  AlertCircle
} from 'lucide-react'
import { ContractType, AIContractRequest, AIContractResponse } from '@/types/contracts'
import { contractsService } from '@/services/contractsService'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const generatorSchema = z.object({
  contract_type: z.nativeEnum(ContractType),
  parties: z.array(z.string().min(1, 'Party name is required')).min(2, 'At least 2 parties required'),
  key_terms: z.record(z.string().min(1, 'Value is required')),
  template_id: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  jurisdiction: z.string().optional(),
  language: z.string().optional(),
  contract_text: z.string().optional()
})

type GeneratorFormData = z.infer<typeof generatorSchema>

interface AIContractGeneratorProps {
  onGenerate: (data: AIContractRequest) => void
  onCancel: () => void
}

export const AIContractGenerator: React.FC<AIContractGeneratorProps> = ({
  onGenerate,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState<'setup' | 'generate' | 'review'>('setup')
  const [generatedContract, setGeneratedContract] = useState<AIContractResponse | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<GeneratorFormData>({
    resolver: zodResolver(generatorSchema),
    defaultValues: {
      contract_type: ContractType.SERVICE_AGREEMENT,
      parties: ['', ''],
      key_terms: {},
      template_id: '',
      requirements: [],
      jurisdiction: 'United States',
      language: 'English',
      contract_text: ''
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
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement
  } = useFieldArray({
    control,
    name: 'requirements'
  })

  // Fetch contract templates
  const { data: templates } = useQuery({
    queryKey: ['contract-templates'],
    queryFn: () => contractsService.getTemplates()
  })

  // Generate contract mutation
  const generateMutation = useMutation({
    mutationFn: contractsService.generateContract,
    onSuccess: (result) => {
      setGeneratedContract(result)
      setCurrentStep('review')
      toast.success('Contract generated successfully!')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to generate contract')
    }
  })

  const contractTypes = [
    { value: ContractType.NDA, label: 'Non-Disclosure Agreement', description: 'Protect confidential information' },
    { value: ContractType.SERVICE_AGREEMENT, label: 'Service Agreement', description: 'Define service terms and conditions' },
    { value: ContractType.EMPLOYMENT, label: 'Employment Contract', description: 'Employee terms and conditions' },
    { value: ContractType.LEASE, label: 'Lease Agreement', description: 'Property rental terms' },
    { value: ContractType.PURCHASE, label: 'Purchase Agreement', description: 'Sale of goods or services' },
    { value: ContractType.PARTNERSHIP, label: 'Partnership Agreement', description: 'Business partnership terms' },
    { value: ContractType.LICENSING, label: 'Licensing Agreement', description: 'License intellectual property' },
    { value: ContractType.CONSULTING, label: 'Consulting Agreement', description: 'Professional consulting services' },
    { value: ContractType.DISTRIBUTION, label: 'Distribution Agreement', description: 'Product distribution terms' },
    { value: ContractType.JOINT_VENTURE, label: 'Joint Venture', description: 'Collaborative business venture' },
    { value: ContractType.FRANCHISE, label: 'Franchise Agreement', description: 'Franchise business model' },
    { value: ContractType.LOAN, label: 'Loan Agreement', description: 'Financial lending terms' },
    { value: ContractType.INSURANCE, label: 'Insurance Contract', description: 'Insurance coverage terms' },
    { value: ContractType.OTHER, label: 'Other', description: 'Custom contract type' }
  ]

  const keyTermsTemplates = {
    [ContractType.NDA]: [
      { key: 'confidentiality_period', label: 'Confidentiality Period', placeholder: '5 years' },
      { key: 'permitted_use', label: 'Permitted Use', placeholder: 'Evaluation purposes only' },
      { key: 'return_obligation', label: 'Return Obligation', placeholder: 'Within 30 days' }
    ],
    [ContractType.SERVICE_AGREEMENT]: [
      { key: 'service_description', label: 'Service Description', placeholder: 'Software development services' },
      { key: 'payment_terms', label: 'Payment Terms', placeholder: 'Monthly invoicing, 30-day terms' },
      { key: 'delivery_timeline', label: 'Delivery Timeline', placeholder: '6 months' },
      { key: 'intellectual_property', label: 'Intellectual Property', placeholder: 'Client owns all deliverables' }
    ],
    [ContractType.EMPLOYMENT]: [
      { key: 'position', label: 'Position', placeholder: 'Software Engineer' },
      { key: 'salary', label: 'Salary', placeholder: '$80,000 annually' },
      { key: 'benefits', label: 'Benefits', placeholder: 'Health, dental, 401k' },
      { key: 'vacation', label: 'Vacation', placeholder: '3 weeks annually' }
    ],
    [ContractType.LEASE]: [
      { key: 'property_address', label: 'Property Address', placeholder: '123 Main St, City, State' },
      { key: 'monthly_rent', label: 'Monthly Rent', placeholder: '$2,500' },
      { key: 'lease_term', label: 'Lease Term', placeholder: '12 months' },
      { key: 'security_deposit', label: 'Security Deposit', placeholder: '$5,000' }
    ]
  }

  const languages = [
    { value: 'English', label: 'English' },
    { value: 'Spanish', label: 'Spanish' },
    { value: 'French', label: 'French' },
    { value: 'German', label: 'German' },
    { value: 'Italian', label: 'Italian' },
    { value: 'Portuguese', label: 'Portuguese' },
    { value: 'Chinese', label: 'Chinese' },
    { value: 'Japanese', label: 'Japanese' }
  ]

  const jurisdictions = [
    { value: 'United States', label: 'United States' },
    { value: 'United Kingdom', label: 'United Kingdom' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Australia', label: 'Australia' },
    { value: 'Germany', label: 'Germany' },
    { value: 'France', label: 'France' },
    { value: 'Netherlands', label: 'Netherlands' },
    { value: 'Singapore', label: 'Singapore' }
  ]

  const watchedContractType = watch('contract_type')
  const currentKeyTerms = keyTermsTemplates[watchedContractType] || []

  const handleTemplateChange = async (templateId: string) => {
    if (!templateId) return
    
    try {
      const template = await contractsService.getTemplate(templateId)
      setSelectedTemplate(templateId)
      setValue('template_id', templateId)
      setValue('contract_type', template.contract_type)
      
      // Set key terms from template
      const keyTerms: Record<string, string> = {}
      template.default_terms.forEach(term => {
        keyTerms[term.category] = term.value || ''
      })
      setValue('key_terms', keyTerms)
      
      toast.success('Template applied successfully')
    } catch (error) {
      toast.error('Failed to load template')
    }
  }

  const handleGenerate = (data: GeneratorFormData) => {
    const request: AIContractRequest = {
      contract_type: data.contract_type,
      parties: data.parties.filter(p => p.trim() !== ''),
      key_terms: data.key_terms,
      template_id: data.template_id,
      requirements: data.requirements?.filter(r => r.trim() !== ''),
      jurisdiction: data.jurisdiction,
      language: data.language,
      contract_text: data.contract_text
    }
    
    generateMutation.mutate(request)
  }

  const handleCopyContract = () => {
    if (generatedContract) {
      navigator.clipboard.writeText(generatedContract.contract_draft)
      toast.success('Contract copied to clipboard')
    }
  }

  const handleCreateContract = () => {
    if (generatedContract) {
      onGenerate({
        contract_type: watch('contract_type'),
        parties: watch('parties').filter(p => p.trim() !== ''),
        key_terms: watch('key_terms'),
        template_id: watch('template_id'),
        requirements: watch('requirements')?.filter(r => r.trim() !== ''),
        jurisdiction: watch('jurisdiction'),
        language: watch('language'),
        contract_text: generatedContract.contract_draft
      })
    }
  }

  const steps = [
    { id: 'setup', label: 'Setup', icon: Settings },
    { id: 'generate', label: 'Generate', icon: Bot },
    { id: 'review', label: 'Review', icon: CheckCircle }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = 
              (step.id === 'setup' && (currentStep === 'generate' || currentStep === 'review')) ||
              (step.id === 'generate' && currentStep === 'review')
            
            return (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-full border-2',
                  isActive || isCompleted 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="ml-3">
                  <p className={cn(
                    'text-sm font-medium',
                    isActive || isCompleted ? 'text-blue-600' : 'text-gray-400'
                  )}>
                    {step.label}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'flex-1 h-0.5 mx-6',
                    isCompleted ? 'bg-blue-600' : 'bg-gray-300'
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Setup Step */}
      {currentStep === 'setup' && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Contract Generator</h2>
            <p className="text-sm text-gray-600">
              Let our AI help you create a professional contract tailored to your needs
            </p>
          </div>

          <form onSubmit={handleSubmit(handleGenerate)} className="space-y-6">
            {/* Contract Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Contract Type *
              </label>
              <Controller
                name="contract_type"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {contractTypes.map(type => (
                      <label
                        key={type.value}
                        className={cn(
                          'relative flex cursor-pointer rounded-lg p-4 border',
                          field.value === type.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <input
                          type="radio"
                          value={type.value}
                          checked={field.value === type.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="sr-only"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{type.label}</p>
                              <p className="text-xs text-gray-500">{type.description}</p>
                            </div>
                          </div>
                        </div>
                        {field.value === type.value && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </label>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* Template Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Use Template (Optional)
              </label>
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a template</option>
                {templates?.filter(t => t.contract_type === watchedContractType).map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Parties */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Contract Parties *
                </label>
                <button
                  type="button"
                  onClick={() => appendParty('')}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Party
                </button>
              </div>
              <div className="space-y-2">
                {partyFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <Users className="h-4 w-4 text-gray-400" />
                    </div>
                    <Controller
                      name={`parties.${index}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Party ${index + 1} name`}
                        />
                      )}
                    />
                    {partyFields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeParty(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {errors.parties && (
                <p className="mt-1 text-sm text-red-600">{errors.parties.message}</p>
              )}
            </div>

            {/* Key Terms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Key Terms *
              </label>
              <div className="space-y-3">
                {currentKeyTerms.map(term => (
                  <div key={term.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      {term.label}
                    </label>
                    <Controller
                      name={`key_terms.${term.key}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={term.placeholder}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Requirements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Special Requirements
                </label>
                <button
                  type="button"
                  onClick={() => appendRequirement('')}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-600 bg-blue-100 hover:bg-blue-200"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Requirement
                </button>
              </div>
              <div className="space-y-2">
                {requirementFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <div className="p-2 bg-gray-50 rounded-md">
                      <Target className="h-4 w-4 text-gray-400" />
                    </div>
                    <Controller
                      name={`requirements.${index}`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter special requirement"
                        />
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="p-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Jurisdiction and Language */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jurisdiction
                </label>
                <Controller
                  name="jurisdiction"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {jurisdictions.map(jurisdiction => (
                        <option key={jurisdiction.value} value={jurisdiction.value}>
                          {jurisdiction.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {languages.map(language => (
                        <option key={language.value} value={language.value}>
                          {language.label}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
            </div>

            {/* Actions */}
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
                disabled={generateMutation.isLoading || !isValid}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {generateMutation.isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" color="white" />
                    <span className="ml-2">Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Contract
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review Step */}
      {currentStep === 'review' && generatedContract && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Contract Generated Successfully!</h2>
            <p className="text-sm text-gray-600">
              Review the AI-generated contract and make any necessary adjustments
            </p>
          </div>

          {/* AI Analysis Summary */}
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Brain className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="text-sm font-medium text-blue-900">AI Analysis Summary</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{generatedContract.confidence_score}%</p>
                <p className="text-blue-700">Confidence Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{generatedContract.estimated_risk_score}</p>
                <p className="text-blue-700">Risk Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{generatedContract.key_terms_included.length}</p>
                <p className="text-blue-700">Key Terms</p>
              </div>
            </div>
          </div>

          {/* Suggestions and Warnings */}
          {(generatedContract.suggestions.length > 0 || generatedContract.warnings.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContract.suggestions.length > 0 && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                    <h4 className="text-sm font-medium text-green-900">Suggestions</h4>
                  </div>
                  <ul className="text-sm text-green-800 space-y-1">
                    {generatedContract.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {generatedContract.warnings.length > 0 && (
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="h-4 w-4 text-orange-600 mr-2" />
                    <h4 className="text-sm font-medium text-orange-900">Warnings</h4>
                  </div>
                  <ul className="text-sm text-orange-800 space-y-1">
                    {generatedContract.warnings.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Contract Content */}
          <div className="bg-white border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Generated Contract</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyContract}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedContract.contract_draft], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = 'generated-contract.txt'
                    a.click()
                    URL.revokeObjectURL(url)
                  }}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                  {generatedContract.contract_draft}
                </pre>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          {generatedContract.next_steps.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Target className="h-4 w-4 text-blue-600 mr-2" />
                <h4 className="text-sm font-medium text-blue-900">Next Steps</h4>
              </div>
              <ul className="text-sm text-blue-800 space-y-1">
                {generatedContract.next_steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep('setup')}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Generate New
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateContract}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Contract
            </button>
          </div>
        </div>
      )}
    </div>
  )
}