import { apiClient } from './apiClient'
import { 
  Contract, 
  ContractCreateRequest, 
  ContractUpdateRequest, 
  ContractFilters,
  ContractStats,
  ContractTemplate,
  AIContractRequest,
  AIContractResponse,
  ContractSearchResult,
  Amendment,
  Milestone
} from '@/types/contracts'
import { PaginationParams, PaginatedResponse } from '@/types/common'

class ContractsService {
  private readonly baseUrl = '/contracts'

  // Contract CRUD operations
  async getContracts(params?: PaginationParams & ContractFilters): Promise<PaginatedResponse<Contract>> {
    const response = await apiClient.getPaginated<Contract>(this.baseUrl, params)
    return response.data!
  }

  async getContract(id: string): Promise<Contract> {
    const response = await apiClient.get<Contract>(`${this.baseUrl}/${id}`)
    return response.data!
  }

  async createContract(data: ContractCreateRequest): Promise<Contract> {
    const response = await apiClient.post<Contract>(this.baseUrl, data)
    return response.data!
  }

  async updateContract(id: string, data: ContractUpdateRequest): Promise<Contract> {
    const response = await apiClient.put<Contract>(`${this.baseUrl}/${id}`, data)
    return response.data!
  }

  async deleteContract(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${id}`)
  }

  // AI-powered contract operations
  async analyzeContract(contractId: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/analyze`)
    return response.data!
  }

  async generateContract(request: AIContractRequest): Promise<AIContractResponse> {
    const response = await apiClient.post<AIContractResponse>('/ai/generate-contract', request)
    return response.data!
  }

  async reviewContract(contractId: string, reviewNotes?: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/review`, {
      notes: reviewNotes
    })
    return response.data!
  }

  async extractKeyTerms(contractId: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/extract-terms`)
    return response.data!
  }

  async assessRisk(contractId: string): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/assess-risk`)
    return response.data!
  }

  async checkCompliance(contractId: string, regulations?: string[]): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/check-compliance`, {
      regulations
    })
    return response.data!
  }

  async compareContracts(contractIds: string[]): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/compare`, {
      contract_ids: contractIds
    })
    return response.data!
  }

  // Contract templates
  async getTemplates(): Promise<ContractTemplate[]> {
    const response = await apiClient.get<ContractTemplate[]>(`${this.baseUrl}/templates`)
    return response.data!
  }

  async getTemplate(id: string): Promise<ContractTemplate> {
    const response = await apiClient.get<ContractTemplate>(`${this.baseUrl}/templates/${id}`)
    return response.data!
  }

  async createTemplate(data: Omit<ContractTemplate, 'id' | 'created_at' | 'created_by'>): Promise<ContractTemplate> {
    const response = await apiClient.post<ContractTemplate>(`${this.baseUrl}/templates`, data)
    return response.data!
  }

  async updateTemplate(id: string, data: Partial<ContractTemplate>): Promise<ContractTemplate> {
    const response = await apiClient.put<ContractTemplate>(`${this.baseUrl}/templates/${id}`, data)
    return response.data!
  }

  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/templates/${id}`)
  }

  // Document management
  async uploadDocument(
    contractId: string,
    file: File,
    documentType: string,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('document_type', documentType)
    formData.append('contract_id', contractId)

    const response = await apiClient.uploadFile(
      `${this.baseUrl}/${contractId}/documents`,
      file,
      onProgress
    )
    return response.data!
  }

  async getDocuments(contractId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/documents`)
    return response.data!
  }

  async downloadDocument(contractId: string, documentId: string): Promise<void> {
    await apiClient.downloadFile(
      `${this.baseUrl}/${contractId}/documents/${documentId}/download`,
      'document'
    )
  }

  async deleteDocument(contractId: string, documentId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${contractId}/documents/${documentId}`)
  }

  // Contract amendments
  async getAmendments(contractId: string): Promise<Amendment[]> {
    const response = await apiClient.get<Amendment[]>(`${this.baseUrl}/${contractId}/amendments`)
    return response.data!
  }

  async createAmendment(contractId: string, data: Omit<Amendment, 'id' | 'created_at' | 'created_by'>): Promise<Amendment> {
    const response = await apiClient.post<Amendment>(`${this.baseUrl}/${contractId}/amendments`, data)
    return response.data!
  }

  async updateAmendment(contractId: string, amendmentId: string, data: Partial<Amendment>): Promise<Amendment> {
    const response = await apiClient.put<Amendment>(`${this.baseUrl}/${contractId}/amendments/${amendmentId}`, data)
    return response.data!
  }

  async deleteAmendment(contractId: string, amendmentId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${contractId}/amendments/${amendmentId}`)
  }

  // Contract milestones
  async getMilestones(contractId: string): Promise<Milestone[]> {
    const response = await apiClient.get<Milestone[]>(`${this.baseUrl}/${contractId}/milestones`)
    return response.data!
  }

  async createMilestone(contractId: string, data: Omit<Milestone, 'id'>): Promise<Milestone> {
    const response = await apiClient.post<Milestone>(`${this.baseUrl}/${contractId}/milestones`, data)
    return response.data!
  }

  async updateMilestone(contractId: string, milestoneId: string, data: Partial<Milestone>): Promise<Milestone> {
    const response = await apiClient.put<Milestone>(`${this.baseUrl}/${contractId}/milestones/${milestoneId}`, data)
    return response.data!
  }

  async deleteMilestone(contractId: string, milestoneId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${contractId}/milestones/${milestoneId}`)
  }

  async completeMilestone(contractId: string, milestoneId: string): Promise<Milestone> {
    const response = await apiClient.post<Milestone>(`${this.baseUrl}/${contractId}/milestones/${milestoneId}/complete`)
    return response.data!
  }

  // Contract lifecycle management
  async signContract(contractId: string, signatureData: any): Promise<Contract> {
    const response = await apiClient.post<Contract>(`${this.baseUrl}/${contractId}/sign`, signatureData)
    return response.data!
  }

  async renewContract(contractId: string, renewalData: any): Promise<Contract> {
    const response = await apiClient.post<Contract>(`${this.baseUrl}/${contractId}/renew`, renewalData)
    return response.data!
  }

  async terminateContract(contractId: string, terminationData: any): Promise<Contract> {
    const response = await apiClient.post<Contract>(`${this.baseUrl}/${contractId}/terminate`, terminationData)
    return response.data!
  }

  async cancelContract(contractId: string, cancellationData: any): Promise<Contract> {
    const response = await apiClient.post<Contract>(`${this.baseUrl}/${contractId}/cancel`, cancellationData)
    return response.data!
  }

  // Search and analytics
  async searchContracts(query: string, filters?: ContractFilters): Promise<ContractSearchResult[]> {
    const response = await apiClient.search<ContractSearchResult>(this.baseUrl, query, filters)
    return response.data!
  }

  async getContractStats(): Promise<ContractStats> {
    const response = await apiClient.get<ContractStats>(`${this.baseUrl}/stats`)
    return response.data!
  }

  async getExpiringContracts(days: number = 30): Promise<Contract[]> {
    const response = await apiClient.get<Contract[]>(`${this.baseUrl}/expiring`, {
      params: { days }
    })
    return response.data!
  }

  async getContractsByCompany(companyId: string): Promise<Contract[]> {
    const response = await apiClient.get<Contract[]>(`${this.baseUrl}/by-company/${companyId}`)
    return response.data!
  }

  async getContractsByMatter(matterId: string): Promise<Contract[]> {
    const response = await apiClient.get<Contract[]>(`${this.baseUrl}/by-matter/${matterId}`)
    return response.data!
  }

  // Notifications and alerts
  async getNotifications(contractId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/notifications`)
    return response.data!
  }

  async createNotification(contractId: string, notificationData: any): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/notifications`, notificationData)
    return response.data!
  }

  async updateNotification(contractId: string, notificationId: string, data: any): Promise<any> {
    const response = await apiClient.put(`${this.baseUrl}/${contractId}/notifications/${notificationId}`, data)
    return response.data!
  }

  async deleteNotification(contractId: string, notificationId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${contractId}/notifications/${notificationId}`)
  }

  // Bulk operations
  async bulkCreateContracts(contracts: ContractCreateRequest[]): Promise<Contract[]> {
    const response = await apiClient.bulkCreate<Contract>(this.baseUrl, contracts)
    return response.data!
  }

  async bulkUpdateContracts(contracts: Partial<Contract>[]): Promise<Contract[]> {
    const response = await apiClient.bulkUpdate<Contract>(this.baseUrl, contracts)
    return response.data!
  }

  async bulkDeleteContracts(ids: string[]): Promise<void> {
    await apiClient.bulkDelete(this.baseUrl, ids)
  }

  async bulkAnalyzeContracts(ids: string[]): Promise<any[]> {
    const response = await apiClient.post(`${this.baseUrl}/bulk-analyze`, { contract_ids: ids })
    return response.data!
  }

  // Import/Export
  async importContracts(file: File): Promise<any> {
    const response = await apiClient.importData(this.baseUrl, file)
    return response.data!
  }

  async exportContracts(format: 'csv' | 'pdf' | 'xlsx', filters?: ContractFilters): Promise<void> {
    await apiClient.exportData(this.baseUrl, format, filters)
  }

  async downloadImportTemplate(format: 'csv' | 'xlsx' = 'csv'): Promise<void> {
    await apiClient.downloadFile(`${this.baseUrl}/template/${format}`, `contracts_template.${format}`)
  }

  // Contract versioning
  async getContractVersions(contractId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/versions`)
    return response.data!
  }

  async createContractVersion(contractId: string, versionData: any): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/versions`, versionData)
    return response.data!
  }

  async getContractVersion(contractId: string, versionId: string): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/versions/${versionId}`)
    return response.data!
  }

  async revertToVersion(contractId: string, versionId: string): Promise<Contract> {
    const response = await apiClient.post<Contract>(`${this.baseUrl}/${contractId}/versions/${versionId}/revert`)
    return response.data!
  }

  // Audit trail
  async getAuditTrail(contractId: string): Promise<any[]> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/audit-trail`)
    return response.data!
  }

  // Contract performance analytics
  async getContractPerformance(contractId: string): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/${contractId}/performance`)
    return response.data!
  }

  async getContractMetrics(): Promise<any> {
    const response = await apiClient.get(`${this.baseUrl}/metrics`)
    return response.data!
  }

  // Integration with other modules
  async linkToMatter(contractId: string, matterId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${contractId}/link-matter`, { matter_id: matterId })
  }

  async linkToCompany(contractId: string, companyId: string): Promise<void> {
    await apiClient.post(`${this.baseUrl}/${contractId}/link-company`, { company_id: companyId })
  }

  async createTaskFromContract(contractId: string, taskData: any): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/create-task`, taskData)
    return response.data!
  }

  async createRiskAssessment(contractId: string, riskData: any): Promise<any> {
    const response = await apiClient.post(`${this.baseUrl}/${contractId}/create-risk-assessment`, riskData)
    return response.data!
  }
}

export const contractsService = new ContractsService()