import { BaseEntity } from './common'

export interface Contract extends BaseEntity {
  title: string
  contract_type: ContractType
  status: ContractStatus
  parties: ContractParty[]
  start_date: string
  end_date?: string
  value?: number
  currency?: string
  description?: string
  company_id?: string
  matter_id?: string
  contract_number?: string
  renewal_terms?: RenewalTerms
  key_terms: KeyTerm[]
  documents: ContractDocument[]
  ai_analysis?: AIAnalysis
  risk_score?: number
  compliance_score?: number
  template_id?: string
  parent_contract_id?: string
  amendments: Amendment[]
  milestones: Milestone[]
  notifications: ContractNotification[]
}

export enum ContractType {
  NDA = 'nda',
  SERVICE_AGREEMENT = 'service_agreement',
  EMPLOYMENT = 'employment',
  LEASE = 'lease',
  PURCHASE = 'purchase',
  PARTNERSHIP = 'partnership',
  LICENSING = 'licensing',
  CONSULTING = 'consulting',
  DISTRIBUTION = 'distribution',
  JOINT_VENTURE = 'joint_venture',
  FRANCHISE = 'franchise',
  LOAN = 'loan',
  INSURANCE = 'insurance',
  OTHER = 'other'
}

export enum ContractStatus {
  DRAFT = 'draft',
  UNDER_REVIEW = 'under_review',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  SIGNED = 'signed',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  TERMINATED = 'terminated',
  CANCELLED = 'cancelled',
  AMENDED = 'amended',
  RENEWED = 'renewed'
}

export interface ContractParty {
  id?: string
  name: string
  role: 'client' | 'vendor' | 'partner' | 'contractor' | 'other'
  company_id?: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  signature_date?: string
  signed_by?: string
}

export interface RenewalTerms {
  auto_renewal: boolean
  renewal_period?: number
  renewal_period_unit?: 'days' | 'months' | 'years'
  notice_period?: number
  notice_period_unit?: 'days' | 'months' | 'years'
  price_adjustment?: number
  price_adjustment_type?: 'percentage' | 'fixed'
}

export interface KeyTerm {
  id?: string
  category: string
  term: string
  value?: string
  description?: string
  is_critical?: boolean
  ai_extracted?: boolean
}

export interface ContractDocument {
  id: string
  name: string
  type: 'main' | 'amendment' | 'exhibit' | 'schedule' | 'other'
  file_url: string
  file_size: number
  mime_type: string
  uploaded_at: string
  uploaded_by: string
  version: number
  is_signed?: boolean
  signature_info?: SignatureInfo[]
}

export interface SignatureInfo {
  signer_name: string
  signer_role: string
  signature_date: string
  signature_type: 'electronic' | 'wet' | 'digital'
  signature_valid: boolean
}

export interface AIAnalysis {
  risk_score: number
  compliance_score: number
  key_terms_extracted: KeyTerm[]
  potential_issues: string[]
  recommendations: string[]
  missing_clauses: string[]
  unusual_terms: string[]
  analysis_date: string
  confidence_score: number
  language_complexity: 'low' | 'medium' | 'high'
  readability_score: number
}

export interface Amendment {
  id: string
  amendment_number: number
  description: string
  effective_date: string
  changes: ContractChange[]
  document_id?: string
  status: 'draft' | 'approved' | 'executed'
  created_at: string
  created_by: string
}

export interface ContractChange {
  section: string
  change_type: 'addition' | 'deletion' | 'modification'
  old_value?: string
  new_value?: string
  description: string
}

export interface Milestone {
  id: string
  title: string
  description?: string
  due_date: string
  completed: boolean
  completed_date?: string
  responsible_party?: string
  amount?: number
  currency?: string
  dependencies?: string[]
}

export interface ContractNotification {
  id: string
  type: 'renewal' | 'expiration' | 'milestone' | 'payment' | 'review'
  message: string
  due_date: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  sent: boolean
  sent_date?: string
  acknowledged: boolean
  acknowledged_date?: string
  acknowledged_by?: string
}

export interface ContractTemplate {
  id: string
  name: string
  contract_type: ContractType
  description?: string
  content: string
  variables: TemplateVariable[]
  default_terms: KeyTerm[]
  created_at: string
  created_by: string
  updated_at?: string
  updated_by?: string
  version: number
  is_active: boolean
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'select'
  description?: string
  required: boolean
  default_value?: string
  options?: string[]
  validation?: string
}

export interface ContractCreateRequest {
  title: string
  contract_type: ContractType
  parties: Omit<ContractParty, 'id'>[]
  start_date: string
  end_date?: string
  value?: number
  currency?: string
  description?: string
  company_id?: string
  matter_id?: string
  contract_number?: string
  renewal_terms?: RenewalTerms
  key_terms?: Omit<KeyTerm, 'id'>[]
  template_id?: string
  parent_contract_id?: string
  milestones?: Omit<Milestone, 'id'>[]
}

export interface ContractUpdateRequest extends Partial<ContractCreateRequest> {
  status?: ContractStatus
}

export interface ContractFilters {
  contract_type?: ContractType
  status?: ContractStatus
  company_id?: string
  matter_id?: string
  start_date_from?: string
  start_date_to?: string
  end_date_from?: string
  end_date_to?: string
  value_min?: number
  value_max?: number
  risk_score_min?: number
  risk_score_max?: number
  expiring_soon?: boolean
  requires_renewal?: boolean
  has_issues?: boolean
  created_after?: string
  created_before?: string
}

export interface ContractStats {
  total_contracts: number
  active_contracts: number
  expiring_soon: number
  total_value: number
  by_type: Record<ContractType, number>
  by_status: Record<ContractStatus, number>
  average_risk_score: number
  high_risk_contracts: number
  compliance_overview: {
    compliant: number
    non_compliant: number
    pending_review: number
  }
  recent_activity: {
    created: number
    signed: number
    expired: number
    renewed: number
  }
}

export interface AIContractRequest {
  contract_text?: string
  contract_type: ContractType
  parties: string[]
  key_terms: Record<string, string>
  template_id?: string
  requirements?: string[]
  jurisdiction?: string
  language?: string
}

export interface AIContractResponse {
  contract_draft: string
  confidence_score: number
  key_terms_included: KeyTerm[]
  suggestions: string[]
  warnings: string[]
  estimated_risk_score: number
  compliance_notes: string[]
  next_steps: string[]
}

export interface ContractSearchResult {
  id: string
  title: string
  contract_type: ContractType
  status: ContractStatus
  parties: string[]
  start_date: string
  end_date?: string
  value?: number
  currency?: string
  relevance_score: number
  matched_terms: string[]
  company_name?: string
  matter_title?: string
}