import { apiClient } from './apiClient'
import { 
  Company, 
  CompanyCreateRequest, 
  CompanyUpdateRequest, 
  CompanyFilters,
  CompanyStats 
} from '@/types/entities'
import { PaginationParams, PaginatedResponse, ApiResponse } from '@/types/common'

class EntitiesService {
  private readonly baseUrl = '/companies'

  // Get all companies with pagination and filtering
  async getCompanies(params?: PaginationParams & CompanyFilters): Promise<PaginatedResponse<Company>> {
    const response = await apiClient.getPaginated<Company>(this.baseUrl, params)
    return response.data!
  }

  // Get company by ID
  async getCompany(id: string): Promise<Company> {
    const response = await apiClient.get<Company>(`${this.baseUrl}/${id}`)
    return response.data!
  }

  // Create new company
  async createCompany(data: CompanyCreateRequest): Promise<Company> {
    const response = await apiClient.post<Company>(this.baseUrl, data)
    return response.data!
  }

  // Update company
  async updateCompany(id: string, data: CompanyUpdateRequest): Promise<Company> {
    const response = await apiClient.put<Company>(`${this.baseUrl}/${id}`, data)
    return response.data!
  }

  // Delete company
  async deleteCompany(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // Bulk operations
  async bulkCreateCompanies(companies: CompanyCreateRequest[]): Promise<Company[]> {
    const response = await apiClient.bulkCreate<Company>(this.baseUrl, companies)
    return response.data!
  }

  async bulkUpdateCompanies(companies: Partial<Company>[]): Promise<Company[]> {
    const response = await apiClient.bulkUpdate<Company>(this.baseUrl, companies)
    return response.data!
  }

  async bulkDeleteCompanies(ids: string[]): Promise<void> {
    await apiClient.bulkDelete(this.baseUrl, ids)
  }

  // Search companies
  async searchCompanies(query: string, filters?: CompanyFilters): Promise<Company[]> {
    const response = await apiClient.search<Company>(this.baseUrl, query, filters)
    return response.data!
  }

  // Get company statistics
  async getCompanyStats(): Promise<CompanyStats> {
    const response = await apiClient.get<CompanyStats>(`${this.baseUrl}/stats`)
    return response.data!
  }

  // Get company subsidiaries
  async getSubsidiaries(parentId: string): Promise<Company[]> {
    const response = await apiClient.get<Company[]>(`${this.baseUrl}/${parentId}/subsidiaries`)
    return response.data!
  }

  // Get company relationships (contracts, matters, etc.)
  async getCompanyRelationships(id: string): Promise<{
    contracts: any[]
    matters: any[]
    disputes: any[]
    risks: any[]
  }> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/relationships`)
    return response.data!
  }

  // Import/Export operations
  async importCompanies(file: File): Promise<{
    total_records: number
    successful_imports: number
    failed_imports: number
    errors: string[]
  }> {
    const response = await apiClient.importData(this.baseUrl, file)
    return response.data!
  }

  async exportCompanies(
    format: 'csv' | 'pdf' | 'xlsx',
    filters?: CompanyFilters
  ): Promise<void> {
    await apiClient.exportData(this.baseUrl, format, filters)
  }

  // Template downloads
  async downloadImportTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<void> {
    await apiClient.downloadFile(`${this.baseUrl}/template/${format}`, `companies_template.${format}`)
  }

  // Compliance operations
  async updateComplianceStatus(id: string, status: string, notes?: string): Promise<Company> {
    const response = await apiClient.patch<Company>(`${this.baseUrl}/${id}/compliance`, {
      status,
      notes
    })
    return response.data!
  }

  async getComplianceReport(id: string): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/${id}/compliance-report`)
    return response.data!
  }

  // Document management
  async uploadDocument(
    companyId: string,
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', documentType)
    formData.append('company_id', companyId)

    const response = await apiClient.uploadFile(
      `${this.baseUrl}/${companyId}/documents`,
      file,
      onProgress
    )
    return response.data!
  }

  async getDocuments(companyId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${companyId}/documents`)
    return response.data!
  }

  async deleteDocument(companyId: string, documentId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${companyId}/documents/${documentId}`)
  }

  // Audit trail
  async getAuditTrail(companyId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${companyId}/audit-trail`)
    return response.data!
  }
}

export const entitiesService = new EntitiesService()