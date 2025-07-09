import { BaseEntity } from './common'

export interface Company extends BaseEntity {
  company_name: string
  entity_type: EntityType
  jurisdiction_of_incorporation: string
  incorporation_date: string
  registered_address: string
  business_address?: string
  company_status: CompanyStatus
  industry_sector?: string
  company_number?: string
  tax_id?: string
  website?: string
  phone?: string
  email?: string
  description?: string
  parent_company_id?: string
  shareholders_info: Shareholder[]
  directors_info: Director[]
  subsidiaries?: Company[]
  contracts_count?: number
  matters_count?: number
  compliance_status?: ComplianceStatus
}

export enum EntityType {
  CORPORATION = 'corporation',
  LLC = 'llc',
  PARTNERSHIP = 'partnership',
  SUBSIDIARY = 'subsidiary',
  JOINT_VENTURE = 'joint_venture',
  BRANCH = 'branch',
  REPRESENTATIVE_OFFICE = 'representative_office',
  OTHER = 'other'
}

export enum CompanyStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DISSOLVED = 'dissolved',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum ComplianceStatus {
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING_REVIEW = 'pending_review',
  OVERDUE = 'overdue'
}

export interface Shareholder {
  id?: string
  name: string
  percentage: number
  share_class?: string
  voting_rights?: boolean
  contact_info?: ContactInfo
}

export interface Director {
  id?: string
  name: string
  title: string
  appointment_date?: string
  resignation_date?: string
  contact_info?: ContactInfo
}

export interface ContactInfo {
  email?: string
  phone?: string
  address?: string
}

export interface CompanyCreateRequest {
  company_name: string
  entity_type: EntityType
  jurisdiction_of_incorporation: string
  incorporation_date: string
  registered_address: string
  business_address?: string
  industry_sector?: string
  company_number?: string
  tax_id?: string
  website?: string
  phone?: string
  email?: string
  description?: string
  parent_company_id?: string
  shareholders_info?: Shareholder[]
  directors_info?: Director[]
}

export interface CompanyUpdateRequest extends Partial<CompanyCreateRequest> {
  company_status?: CompanyStatus
}

export interface CompanyFilters {
  entity_type?: EntityType
  company_status?: CompanyStatus
  jurisdiction_of_incorporation?: string
  industry_sector?: string
  parent_company_id?: string
  compliance_status?: ComplianceStatus
  created_after?: string
  created_before?: string
}

export interface CompanyStats {
  total_companies: number
  active_companies: number
  by_entity_type: Record<EntityType, number>
  by_jurisdiction: Record<string, number>
  by_status: Record<CompanyStatus, number>
  recent_incorporations: number
  compliance_overview: {
    compliant: number
    non_compliant: number
    pending_review: number
    overdue: number
  }
}