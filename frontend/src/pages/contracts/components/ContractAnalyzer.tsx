import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  Upload,
  FileText,
  Brain,
  Shield,
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  TrendingUp,
  Target,
  Eye,
  Download,
  Zap,
  Activity,
  BarChart3,
  Search,
  Clock,
  Users,
  Star,
  Lightbulb,
  Bug,
  Scale,
  Globe,
  BookOpen,
  Sparkles
} from 'lucide-react'
import { contractsService } from '@/services/contractsService'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

interface AnalysisResult {
  contract_id?: string
  file_name?: string
  risk_score: number
  compliance_score: number
  key_terms_extracted: Array<{
    category: string
    term: string
    value?: string
    is_critical: boolean
    confidence: number
  }>
  potential_issues: string[]
  recommendations: string[]
  missing_clauses: string[]
  unusual_terms: string[]
  analysis_date: string
  confidence_score: number
  language_complexity: 'low' | 'medium' | 'high'
  readability_score: number
}

interface ContractAnalyzerProps {
  onAnalyze: (data: any) => void
  onCancel: () => void
}

export const ContractAnalyzer: React.FC<ContractAnalyzerProps> = ({
  onAnalyze,
  onCancel
}) => {
  const [analysisMode, setAnalysisMode] = useState<'upload' | 'existing'>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedContract, setSelectedContract] = useState<string>('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [analysisStep, setAnalysisStep] = useState<'select' | 'analyze' | 'results'>('select')

  // Fetch existing contracts
  const { data: contracts } = useQuery({
    queryKey: ['contracts-list'],
    queryFn: () => contractsService.getContracts({ page: 1, limit: 100 }),
    enabled: analysisMode === 'existing'
  })

  // Analyze contract mutation
  const analyzeMutation = useMutation({
    mutationFn: async (data: { contractId?: string; file?: File }) => {
      if (data.contractId) {
        return contractsService.analyzeContract(data.contractId)
      } else if (data.file) {
        // Upload file and analyze
        const formData = new FormData()
        formData.append('file', data.file)
        const response = await fetch('/api/v1/contracts/analyze-upload', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        })
        if (!response.ok) throw new Error('Analysis failed')
        return response.json()
      }
      throw new Error('No contract or file provided')
    },
    onSuccess: (result) => {
      setAnalysisResult(result)
      setAnalysisStep('results')
      toast.success('Analysis completed successfully!')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Analysis failed')
    }
  })

  // File upload handler
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      toast.success('File uploaded successfully')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/rtf': ['.rtf']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024 // 10MB
  })

  const handleAnalyze = () => {
    if (analysisMode === 'upload' && uploadedFile) {
      analyzeMutation.mutate({ file: uploadedFile })
    } else if (analysisMode === 'existing' && selectedContract) {
      analyzeMutation.mutate({ contractId: selectedContract })
    } else {
      toast.error('Please select a contract or upload a file')
    }
  }

  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-800' }
    if (score < 70) return { level: 'Medium', color: 'yellow', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' }
    return { level: 'High', color: 'red', bgColor: 'bg-red-100', textColor: 'text-red-800' }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'low': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'high': return <AlertCircle className="h-4 w-4 text-red-500" />
      default: return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getReadabilityGrade = (score: number) => {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 mb-4">
          <Brain className="h-6 w-6 text-purple-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">AI Contract Analyzer</h2>
        <p className="text-sm text-gray-600">
          Get comprehensive AI-powered analysis of your contracts including risk assessment, compliance checking, and recommendations
        </p>
      </div>

      {/* Step: Select Contract */}
      {analysisStep === 'select' && (
        <div className="space-y-6">
          {/* Analysis Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Analysis Mode
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setAnalysisMode('upload')}
                className={cn(
                  'p-4 border rounded-lg text-left',
                  analysisMode === 'upload'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center mb-2">
                  <Upload className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Upload New File</span>
                </div>
                <p className="text-sm text-gray-600">
                  Upload a contract file (PDF, DOC, DOCX, TXT) for analysis
                </p>
              </button>

              <button
                onClick={() => setAnalysisMode('existing')}
                className={cn(
                  'p-4 border rounded-lg text-left',
                  analysisMode === 'existing'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <div className="flex items-center mb-2">
                  <FileText className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Existing Contract</span>
                </div>
                <p className="text-sm text-gray-600">
                  Analyze an existing contract from your database
                </p>
              </button>
            </div>
          </div>

          {/* Upload Area */}
          {analysisMode === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload Contract File
              </label>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : uploadedFile
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center">
                  {uploadedFile ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                      <p className="text-sm font-medium text-green-900 mb-2">
                        {uploadedFile.name}
                      </p>
                      <p className="text-xs text-green-700">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-sm font-medium text-gray-900 mb-2">
                        {isDragActive
                          ? 'Drop the contract file here'
                          : 'Drop contract file here or click to upload'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Supports PDF, DOC, DOCX, TXT, RTF (max 10MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Existing Contract Selection */}
          {analysisMode === 'existing' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Contract
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                {contracts?.items.map(contract => (
                  <button
                    key={contract.id}
                    onClick={() => setSelectedContract(contract.id)}
                    className={cn(
                      'w-full p-4 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0',
                      selectedContract === contract.id ? 'bg-blue-50 border-blue-200' : ''
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 rounded-lg mr-3">
                          <FileText className="h-4 w-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{contract.title}</p>
                          <p className="text-xs text-gray-500">
                            {contract.contract_type} • {contract.status}
                          </p>
                        </div>
                      </div>
                      {selectedContract === contract.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Analysis Options */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Analysis Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-orange-500 mr-2" />
                <span className="text-gray-700">Risk Assessment</span>
              </div>
              <div className="flex items-center">
                <Scale className="h-4 w-4 text-blue-500 mr-2" />
                <span className="text-gray-700">Compliance Check</span>
              </div>
              <div className="flex items-center">
                <Target className="h-4 w-4 text-purple-500 mr-2" />
                <span className="text-gray-700">Key Terms Extraction</span>
              </div>
              <div className="flex items-center">
                <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                <span className="text-gray-700">Recommendations</span>
              </div>
              <div className="flex items-center">
                <Bug className="h-4 w-4 text-red-500 mr-2" />
                <span className="text-gray-700">Issue Detection</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-gray-700">Readability Analysis</span>
              </div>
              <div className="flex items-center">
                <Search className="h-4 w-4 text-indigo-500 mr-2" />
                <span className="text-gray-700">Missing Clauses</span>
              </div>
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-pink-500 mr-2" />
                <span className="text-gray-700">Unusual Terms</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAnalyze}
              disabled={
                analyzeMutation.isLoading || 
                (analysisMode === 'upload' && !uploadedFile) ||
                (analysisMode === 'existing' && !selectedContract)
              }
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
            >
              {analyzeMutation.isLoading ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" color="white" />
                  <span className="ml-2">Analyzing...</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2" />
                  Analyze Contract
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step: Analysis Results */}
      {analysisStep === 'results' && analysisResult && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analysis Complete</h3>
            <p className="text-sm text-gray-600">
              {analysisResult.file_name || 'Contract'} analyzed successfully
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Shield className="h-5 w-5 text-orange-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Risk Score</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">{analysisResult.risk_score}</span>
                <span className={cn(
                  'ml-2 px-2 py-1 text-xs font-medium rounded-full',
                  getRiskLevel(analysisResult.risk_score).bgColor,
                  getRiskLevel(analysisResult.risk_score).textColor
                )}>
                  {getRiskLevel(analysisResult.risk_score).level}
                </span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Scale className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Compliance</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">{analysisResult.compliance_score}</span>
                <span className="text-sm text-gray-500 ml-1">%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Brain className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Confidence</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">{analysisResult.confidence_score}</span>
                <span className="text-sm text-gray-500 ml-1">%</span>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <BookOpen className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">Readability</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl font-bold text-gray-900">
                  {getReadabilityGrade(analysisResult.readability_score)}
                </span>
                <span className="text-sm text-gray-500 ml-1">
                  ({analysisResult.readability_score})
                </span>
              </div>
            </div>
          </div>

          {/* Language Complexity */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-900">Language Complexity</h4>
              {getComplexityIcon(analysisResult.language_complexity)}
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 capitalize mr-2">
                {analysisResult.language_complexity}
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                <div 
                  className={cn(
                    'h-2 rounded-full',
                    analysisResult.language_complexity === 'low' ? 'bg-green-500' :
                    analysisResult.language_complexity === 'medium' ? 'bg-yellow-500' :
                    'bg-red-500'
                  )}
                  style={{ 
                    width: `${
                      analysisResult.language_complexity === 'low' ? 33 :
                      analysisResult.language_complexity === 'medium' ? 66 : 100
                    }%` 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Key Terms Extracted */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Key Terms Extracted</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analysisResult.key_terms_extracted.map((term, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center">
                    <Target className="h-4 w-4 text-purple-500 mr-2" />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{term.term}</span>
                      <span className="text-xs text-gray-500 ml-2">({term.category})</span>
                      {term.is_critical && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <Star className="h-3 w-3 mr-1" />
                          Critical
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs text-gray-500">{term.confidence}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Issues and Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Potential Issues */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Potential Issues</h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisResult.potential_issues.map((issue, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 mt-2 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{issue}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Lightbulb className="h-4 w-4 text-yellow-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Recommendations</h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisResult.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-yellow-500 mt-2 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Clauses and Unusual Terms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Missing Clauses */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Search className="h-4 w-4 text-indigo-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Missing Clauses</h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisResult.missing_clauses.map((clause, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-2 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{clause}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Unusual Terms */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Sparkles className="h-4 w-4 text-pink-500 mr-2" />
                <h4 className="text-sm font-medium text-gray-900">Unusual Terms</h4>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {analysisResult.unusual_terms.map((term, index) => (
                  <div key={index} className="flex items-start">
                    <div className="h-1.5 w-1.5 rounded-full bg-pink-500 mt-2 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{term}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                const report = {
                  analysis_result: analysisResult,
                  timestamp: new Date().toISOString()
                }
                const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `contract-analysis-${Date.now()}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </button>
            <button
              onClick={() => {
                setAnalysisStep('select')
                setAnalysisResult(null)
                setUploadedFile(null)
                setSelectedContract('')
              }}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Analyze Another
            </button>
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}