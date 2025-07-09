-- CounselFlow Ultimate Database Schema
-- Comprehensive legal management system with AI integration
-- Author: AI Assistant
-- Date: 2025-01-15

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- CORE AUTHENTICATION & USER MANAGEMENT
-- ========================================

-- User Roles Enum
CREATE TYPE user_role AS ENUM (
    'admin',
    'partner', 
    'attorney',
    'paralegal',
    'secretary',
    'client',
    'guest'
);

-- Security Levels
CREATE TYPE security_level AS ENUM (
    'public',
    'confidential',
    'attorney_client',
    'work_product',
    'highly_confidential'
);

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL DEFAULT 'attorney',
    
    -- Professional Information
    bar_number VARCHAR(50) UNIQUE,
    bar_state VARCHAR(10),
    law_firm_id UUID,
    department VARCHAR(100),
    
    -- Security & Access
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    security_clearance security_level DEFAULT 'confidential',
    last_login TIMESTAMP,
    
    -- Profile Information
    phone VARCHAR(20),
    profile_picture_url TEXT,
    bio TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    -- Indexes
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_law_firm (law_firm_id),
    INDEX idx_users_active (is_active)
);

-- ========================================
-- ENTITY MANAGEMENT MODULE
-- ========================================

-- Entity Types
CREATE TYPE entity_type AS ENUM (
    'holding_company',
    'subsidiary', 
    'joint_venture',
    'partnership',
    'trust',
    'foundation',
    'branch_office'
);

-- Entity Status
CREATE TYPE entity_status AS ENUM (
    'active',
    'inactive',
    'dormant',
    'in_liquidation',
    'dissolved'
);

-- Companies/Entities Table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(255) NOT NULL,
    entity_type entity_type NOT NULL DEFAULT 'subsidiary',
    
    -- Incorporation Details
    jurisdiction_of_incorporation VARCHAR(100) NOT NULL,
    incorporation_date DATE NOT NULL,
    company_number VARCHAR(100) UNIQUE,
    tax_id VARCHAR(100),
    
    -- Status & Classification
    company_status entity_status DEFAULT 'active',
    industry_sector VARCHAR(100),
    
    -- Address Information
    registered_address TEXT NOT NULL,
    business_address TEXT,
    
    -- Financial Information
    fiscal_year_end DATE,
    reporting_currency VARCHAR(10) DEFAULT 'USD',
    share_capital DECIMAL(15,2),
    
    -- Relationships
    parent_entity_id UUID,
    
    -- Shareholders Information (JSON for flexibility)
    shareholders_info JSONB,
    
    -- Directors Information (JSON for flexibility)
    directors_info JSONB,
    
    -- Compliance & Risk
    regulatory_bodies TEXT[],
    compliance_status VARCHAR(50) DEFAULT 'compliant',
    risk_score VARCHAR(20) DEFAULT 'low',
    
    -- Document Management
    document_storage_path TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Notes
    company_notes TEXT,
    
    -- Indexes
    INDEX idx_companies_jurisdiction (jurisdiction_of_incorporation),
    INDEX idx_companies_parent (parent_entity_id),
    INDEX idx_companies_status (company_status),
    INDEX idx_companies_type (entity_type)
);

-- ========================================
-- MATTER MANAGEMENT MODULE
-- ========================================

-- Matter Types
CREATE TYPE matter_type AS ENUM (
    'contract',
    'dispute',
    'regulatory',
    'corporate',
    'employment',
    'ip',
    'real_estate',
    'tax',
    'merger_acquisition',
    'general'
);

-- Matter Status
CREATE TYPE matter_status AS ENUM (
    'active',
    'pending',
    'closed',
    'on_hold',
    'escalated'
);

-- Priority Levels
CREATE TYPE priority_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Matters Table
CREATE TABLE matters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    matter_name VARCHAR(255) NOT NULL,
    matter_type matter_type NOT NULL,
    matter_status matter_status DEFAULT 'active',
    priority priority_level DEFAULT 'medium',
    
    -- Description & Context
    description TEXT,
    matter_subtype VARCHAR(100),
    
    -- Relationships
    company_id UUID REFERENCES companies(id),
    matter_owner_id UUID REFERENCES users(id),
    lead_attorney_id UUID REFERENCES users(id),
    business_owner_id UUID,
    department_id UUID,
    
    -- External Resources
    external_counsel_id UUID,
    external_advisors JSONB,
    
    -- Key Dates (JSON for flexibility)
    key_dates JSONB,
    
    -- Document Storage
    storage_link TEXT,
    documents JSONB,
    
    -- Risk Assessment
    risk_id UUID,
    risk_name TEXT,
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    
    -- Collaboration
    internal_stakeholders JSONB,
    related_matters UUID[],
    
    -- Tags & Classification
    tags TEXT[],
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    
    -- Indexes
    INDEX idx_matters_company (company_id),
    INDEX idx_matters_owner (matter_owner_id),
    INDEX idx_matters_attorney (lead_attorney_id),
    INDEX idx_matters_status (matter_status),
    INDEX idx_matters_type (matter_type),
    INDEX idx_matters_priority (priority)
);

-- ========================================
-- CONTRACT MANAGEMENT MODULE
-- ========================================

-- Contract Types
CREATE TYPE contract_type AS ENUM (
    'sales',
    'procurement',
    'nda',
    'partnership',
    'licensing',
    'employment',
    'lease',
    'service_agreement',
    'msa',
    'sow'
);

-- Contract Status
CREATE TYPE contract_status AS ENUM (
    'draft',
    'under_review',
    'in_negotiation',
    'pending_signature',
    'executed',
    'active',
    'expired',
    'terminated'
);

-- Contracts Table
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_title TEXT NOT NULL,
    contract_type contract_type NOT NULL,
    contract_subtype VARCHAR(100),
    
    -- Description & Context
    description TEXT,
    status contract_status DEFAULT 'draft',
    priority priority_level DEFAULT 'medium',
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    company_id UUID REFERENCES companies(id),
    counterparty_id UUID,
    counterparty_name TEXT,
    
    -- Parties Involved (JSON for flexibility)
    parties_involved JSONB,
    
    -- Key Dates
    effective_date DATE,
    start_date DATE,
    execution_date DATE,
    expiration_date DATE,
    
    -- Financial Terms
    value_amount DECIMAL(15,2),
    value_currency VARCHAR(10) DEFAULT 'USD',
    payment_terms TEXT,
    payment_frequency VARCHAR(50),
    
    -- Legal Terms
    governing_law TEXT,
    jurisdiction_id UUID,
    dispute_resolution TEXT,
    venue TEXT,
    
    -- Auto-Renewal
    auto_renewal BOOLEAN DEFAULT FALSE,
    renewal_terms TEXT,
    renewal_notice_period INTEGER, -- days
    
    -- Termination
    termination_notice_period INTEGER, -- days
    termination_for_convenience BOOLEAN DEFAULT FALSE,
    termination_penalties TEXT,
    
    -- Key Provisions
    confidentiality_provisions TEXT,
    data_protection_provisions TEXT,
    intellectual_property_provisions TEXT,
    limitation_of_liability TEXT,
    indemnification TEXT,
    insurance_requirements TEXT,
    
    -- Compliance & Performance
    compliance_requirements TEXT[],
    compliance_status VARCHAR(50) DEFAULT 'compliant',
    key_obligations JSONB,
    key_deliverables JSONB,
    performance_metrics JSONB,
    
    -- Document Management
    executed_document_id UUID,
    document_id UUID,
    attachments JSONB,
    version_number INTEGER DEFAULT 1,
    
    -- Approval Process
    approval_required BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(50) DEFAULT 'pending',
    approver_id UUID REFERENCES users(id),
    approval_date DATE,
    
    -- AI Analysis
    ai_risk_score DECIMAL(5,2),
    ai_analysis JSONB,
    ai_recommendations TEXT,
    
    -- Ownership & Responsibility
    internal_business_owner_id UUID REFERENCES users(id),
    internal_legal_owner_id UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_contracts_matter (matter_id),
    INDEX idx_contracts_company (company_id),
    INDEX idx_contracts_status (status),
    INDEX idx_contracts_type (contract_type),
    INDEX idx_contracts_expiration (expiration_date),
    INDEX idx_contracts_counterparty (counterparty_name)
);

-- ========================================
-- DISPUTE MANAGEMENT MODULE
-- ========================================

-- Dispute Types
CREATE TYPE dispute_type AS ENUM (
    'litigation',
    'arbitration',
    'mediation',
    'regulatory_proceeding',
    'investigation',
    'settlement_negotiation'
);

-- Dispute Status
CREATE TYPE dispute_status AS ENUM (
    'pre_filing',
    'filed',
    'discovery',
    'hearing_trial',
    'settlement_discussions',
    'resolved',
    'appeal',
    'closed'
);

-- Disputes Table
CREATE TABLE disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispute_title TEXT NOT NULL,
    dispute_type dispute_type NOT NULL,
    dispute_subtype VARCHAR(100),
    dispute_status dispute_status DEFAULT 'pre_filing',
    priority priority_level DEFAULT 'medium',
    
    -- Description & Context
    description TEXT,
    internal_reference TEXT,
    external_reference TEXT,
    case_number TEXT,
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    company_id UUID REFERENCES companies(id),
    department_id UUID,
    
    -- Our Role
    role_in_dispute VARCHAR(50), -- claimant, defendant, third_party
    
    -- Parties Involved
    parties_involved JSONB,
    opposing_parties JSONB,
    opposing_counsel JSONB,
    
    -- Legal Representation
    our_counsel_id UUID,
    external_counsel_id UUID,
    lead_attorney_id UUID REFERENCES users(id),
    internal_team JSONB,
    
    -- Jurisdiction & Venue
    jurisdiction TEXT,
    venue TEXT,
    court_or_tribunal_name TEXT,
    judge_arbitrator TEXT,
    governing_law TEXT,
    
    -- Key Dates
    filing_date DATE,
    initiation_date DATE,
    service_date DATE,
    response_deadline DATE,
    key_dates JSONB,
    
    -- Claims & Relief
    claims JSONB,
    relief_sought TEXT,
    counterclaims JSONB,
    
    -- Financial Information
    amount_claimed DECIMAL(15,2),
    amount_counterclaimed DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    estimated_cost DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    legal_budget DECIMAL(15,2),
    settlement_authority DECIMAL(15,2),
    settlement_amount DECIMAL(15,2),
    
    -- Insurance
    insurance_coverage BOOLEAN DEFAULT FALSE,
    insurance_policy_id UUID,
    insurance_carrier TEXT,
    insurance_limits DECIMAL(15,2),
    deductible_amount DECIMAL(15,2),
    
    -- Risk Assessment
    risk_assessment VARCHAR(50),
    risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
    probability_of_success INTEGER CHECK (probability_of_success >= 0 AND probability_of_success <= 100),
    risk_factors JSONB,
    
    -- Strategy & Analysis
    strategy TEXT,
    strengths TEXT,
    weaknesses TEXT,
    
    -- Discovery & Evidence
    litigation_hold BOOLEAN DEFAULT FALSE,
    litigation_hold_date DATE,
    discovery_status JSONB,
    evidence_summary TEXT,
    key_documents UUID[],
    
    -- Resolution
    resolution_type VARCHAR(50),
    resolution_date DATE,
    resolution_summary TEXT,
    settlement_terms TEXT,
    judgment_amount DECIMAL(15,2),
    
    -- Appeals
    appeal_status VARCHAR(50) DEFAULT 'no_appeal',
    appeal_deadline DATE,
    
    -- Compliance & Reporting
    compliance_requirements TEXT[],
    
    -- Financial Provisions
    provision_amount DECIMAL(15,2),
    provision_date DATE,
    provision_notes TEXT,
    
    -- Document Management
    document_repository TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_disputes_matter (matter_id),
    INDEX idx_disputes_company (company_id),
    INDEX idx_disputes_status (dispute_status),
    INDEX idx_disputes_type (dispute_type),
    INDEX idx_disputes_attorney (lead_attorney_id),
    INDEX idx_disputes_filing_date (filing_date)
);

-- ========================================
-- TASK MANAGEMENT MODULE
-- ========================================

-- Task Status
CREATE TYPE task_status AS ENUM (
    'not_started',
    'in_progress',
    'on_hold',
    'completed',
    'blocked',
    'pending',
    'overdue'
);

-- Task Types
CREATE TYPE task_type AS ENUM (
    'task',
    'approval',
    'review',
    'meeting',
    'decision',
    'other'
);

-- Tasks Table (Actions)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    task_type task_type DEFAULT 'task',
    status task_status DEFAULT 'not_started',
    priority priority_level DEFAULT 'medium',
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    assigned_to_id UUID REFERENCES users(id),
    created_by UUID REFERENCES users(id),
    
    -- Time Management
    start_date TIMESTAMP,
    due_date TIMESTAMP,
    completion_date TIMESTAMP,
    estimated_hours DECIMAL(5,2),
    actual_hours DECIMAL(5,2),
    
    -- Dependencies
    dependencies UUID[],
    
    -- Recurrence
    recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    
    -- Collaboration
    notes TEXT,
    subtasks JSONB,
    attachments JSONB,
    
    -- Reminders
    reminder_settings JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_tasks_matter (matter_id),
    INDEX idx_tasks_assigned (assigned_to_id),
    INDEX idx_tasks_status (status),
    INDEX idx_tasks_due_date (due_date),
    INDEX idx_tasks_priority (priority)
);

-- ========================================
-- RISK MANAGEMENT MODULE
-- ========================================

-- Risk Categories
CREATE TYPE risk_category AS ENUM (
    'legal',
    'regulatory',
    'financial',
    'operational',
    'reputational',
    'strategic'
);

-- Risk Levels
CREATE TYPE risk_level AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);

-- Risk Status
CREATE TYPE risk_status AS ENUM (
    'identified',
    'assessed',
    'mitigated',
    'monitored',
    'closed'
);

-- Risk Assessments Table
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_title VARCHAR(255) NOT NULL,
    risk_category risk_category NOT NULL,
    risk_description TEXT,
    
    -- Risk Evaluation
    inherent_likelihood VARCHAR(20),
    inherent_impact VARCHAR(20),
    residual_likelihood VARCHAR(20),
    residual_impact VARCHAR(20),
    priority risk_level DEFAULT 'medium',
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    company_id UUID REFERENCES companies(id),
    contract_id UUID REFERENCES contracts(id),
    
    -- Mitigation
    mitigation_plan TEXT,
    mitigation_status VARCHAR(50),
    
    -- Ownership
    risk_owner_id UUID REFERENCES users(id),
    business_owner_id UUID,
    department_id UUID,
    
    -- Dates
    identification_date DATE,
    review_date DATE,
    resolution_date DATE,
    
    -- Scoring
    inherent_risk_score INTEGER,
    residual_risk_score INTEGER,
    
    -- Financial Impact
    financial_impact_min DECIMAL(15,2),
    financial_impact_max DECIMAL(15,2),
    currency VARCHAR(10) DEFAULT 'USD',
    
    -- Compliance
    regulatory_implications BOOLEAN DEFAULT FALSE,
    related_regulations TEXT[],
    
    -- Document Management
    document_access TEXT,
    document_links TEXT[],
    
    -- Reputational Assessment
    reputational_risk_assessment VARCHAR(20),
    
    -- Status & Workflow
    status risk_status DEFAULT 'identified',
    escalation_path TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    
    -- AI Analysis
    ai_analysis JSONB,
    ai_confidence DECIMAL(3,2),
    
    -- Indexes
    INDEX idx_risk_assessments_matter (matter_id),
    INDEX idx_risk_assessments_company (company_id),
    INDEX idx_risk_assessments_category (risk_category),
    INDEX idx_risk_assessments_level (priority),
    INDEX idx_risk_assessments_status (status)
);

-- ========================================
-- POLICY MANAGEMENT MODULE
-- ========================================

-- Policy Types
CREATE TYPE policy_type AS ENUM (
    'compliance',
    'hr',
    'it',
    'finance',
    'legal',
    'governance',
    'operational'
);

-- Policy Status
CREATE TYPE policy_status AS ENUM (
    'draft',
    'active',
    'under_review',
    'superseded',
    'archived'
);

-- Policy Audience
CREATE TYPE policy_audience AS ENUM (
    'all_staff',
    'management_only',
    'legal_team',
    'specific_departments'
);

-- Policies Table
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_name VARCHAR(255) NOT NULL,
    policy_type policy_type NOT NULL,
    policy_subtype VARCHAR(100),
    policy_description TEXT,
    
    -- Content
    full_text TEXT,
    document_upload_id UUID,
    
    -- Applicability
    applicable_jurisdiction TEXT,
    applicable_entities UUID[],
    policy_audience policy_audience DEFAULT 'all_staff',
    policy_scope TEXT,
    
    -- Dates
    effective_date DATE,
    expiry_date DATE,
    review_frequency VARCHAR(50),
    next_review_date DATE,
    last_reviewed_date DATE,
    
    -- Ownership & Approval
    policy_owner_id UUID REFERENCES users(id),
    approver_id UUID REFERENCES users(id),
    approval_status VARCHAR(50) DEFAULT 'pending',
    approval_date DATE,
    
    -- Status
    policy_status policy_status DEFAULT 'draft',
    
    -- Department
    department_id UUID,
    
    -- Compliance
    compliance_requirements JSONB,
    training_required BOOLEAN DEFAULT FALSE,
    acknowledgment_required BOOLEAN DEFAULT FALSE,
    
    -- Versioning
    version_number INTEGER DEFAULT 1,
    version_history JSONB,
    
    -- Risk
    policy_risk_level risk_level,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    tags TEXT[],
    
    -- Indexes
    INDEX idx_policies_type (policy_type),
    INDEX idx_policies_status (policy_status),
    INDEX idx_policies_owner (policy_owner_id),
    INDEX idx_policies_approval_status (approval_status)
);

-- ========================================
-- KNOWLEDGE MANAGEMENT MODULE
-- ========================================

-- Knowledge Types
CREATE TYPE knowledge_type AS ENUM (
    'template',
    'clause',
    'precedent',
    'policy',
    'memo',
    'checklist',
    'guide'
);

-- Knowledge Management Table
CREATE TABLE knowledge_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    knowledge_type knowledge_type NOT NULL,
    knowledge_subtype VARCHAR(100),
    description TEXT,
    
    -- Content
    full_text TEXT,
    document_upload_id UUID,
    
    -- Classification
    applicable_jurisdiction TEXT,
    language VARCHAR(10) DEFAULT 'English',
    
    -- Versioning
    version_number INTEGER DEFAULT 1,
    version_date DATE,
    effective_date DATE,
    expiry_date DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Ownership
    department_id UUID,
    created_by UUID REFERENCES users(id),
    
    -- Review
    review_due_date DATE,
    last_reviewed_date DATE,
    approver_id UUID REFERENCES users(id),
    approval_date DATE,
    approval_status VARCHAR(50),
    
    -- Relationships
    related_matters UUID[],
    related_knowledge_ids UUID[],
    
    -- Access Control
    permissions_level VARCHAR(50) DEFAULT 'internal_use',
    
    -- Usage & Feedback
    usage_count INTEGER DEFAULT 0,
    user_feedback JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_knowledge_type (knowledge_type),
    INDEX idx_knowledge_status (status),
    INDEX idx_knowledge_department (department_id),
    INDEX idx_knowledge_created_by (created_by)
);

-- ========================================
-- LICENSING & REGULATORY COMPLIANCE MODULE
-- ========================================

-- License Types
CREATE TYPE license_type AS ENUM (
    'business_license',
    'financial',
    'environmental',
    'health_safety',
    'data_protection',
    'professional',
    'operational'
);

-- License Status
CREATE TYPE license_status AS ENUM (
    'active',
    'pending_renewal',
    'under_review',
    'suspended',
    'expired'
);

-- Licenses Table
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_name VARCHAR(255) NOT NULL,
    license_type license_type NOT NULL,
    license_subtype VARCHAR(100),
    
    -- Regulatory Authority
    regulatory_authority VARCHAR(255) NOT NULL,
    jurisdiction VARCHAR(100) NOT NULL,
    license_number VARCHAR(100),
    
    -- Dates
    issue_date DATE,
    effective_date DATE,
    expiry_date DATE,
    renewal_frequency VARCHAR(50),
    next_renewal_date DATE,
    application_deadline DATE,
    
    -- Status
    status license_status DEFAULT 'active',
    
    -- Ownership
    entity_id UUID REFERENCES companies(id),
    license_owner_id UUID REFERENCES users(id),
    business_owner_id UUID,
    department_id UUID,
    
    -- Compliance
    compliance_requirements JSONB,
    compliance_status VARCHAR(50) DEFAULT 'compliant',
    last_compliance_review_date DATE,
    next_compliance_review_date DATE,
    
    -- Risk
    compliance_risk_level risk_level,
    risk_score INTEGER,
    
    -- Actions
    compliance_actions_required TEXT,
    
    -- Documents
    compliance_documents JSONB,
    
    -- Contacts
    regulatory_contacts JSONB,
    
    -- Financial
    fees_amount DECIMAL(15,2),
    fees_currency VARCHAR(10) DEFAULT 'USD',
    penalties_noncompliance TEXT,
    
    -- Notifications
    notification_settings JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_licenses_entity (entity_id),
    INDEX idx_licenses_type (license_type),
    INDEX idx_licenses_status (status),
    INDEX idx_licenses_expiry (expiry_date),
    INDEX idx_licenses_jurisdiction (jurisdiction)
);

-- ========================================
-- OUTSOURCING & LEGAL SPEND MODULE
-- ========================================

-- Provider Types
CREATE TYPE provider_type AS ENUM (
    'external_counsel',
    'valuer',
    'auctioneer',
    'consultant',
    'expert_witness',
    'other'
);

-- Service Providers Table
CREATE TABLE service_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name VARCHAR(255) NOT NULL,
    provider_type provider_type NOT NULL,
    
    -- Contact Information
    contact_person_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    
    -- Location
    jurisdiction VARCHAR(100),
    address TEXT,
    
    -- Business Details
    registration_number VARCHAR(100),
    tax_pin VARCHAR(100),
    industry_specialization TEXT,
    
    -- Engagement Details
    preferred_provider BOOLEAN DEFAULT FALSE,
    engaged_by_entity_ids UUID[],
    current_engagement_status VARCHAR(50) DEFAULT 'not_engaged',
    
    -- Performance
    average_rating DECIMAL(3,2),
    last_engaged_date DATE,
    
    -- Services
    services_offered TEXT,
    
    -- Compliance
    compliance_status VARCHAR(50) DEFAULT 'pending_review',
    
    -- Documents
    engagement_documents UUID[],
    
    -- Financial
    fee_structure TEXT,
    payment_terms TEXT,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    review_notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_service_providers_type (provider_type),
    INDEX idx_service_providers_status (current_engagement_status),
    INDEX idx_service_providers_jurisdiction (jurisdiction)
);

-- Outsourcing Expenses Table
CREATE TABLE outsourcing_expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_title VARCHAR(255) NOT NULL,
    expense_description TEXT,
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    entity_id UUID REFERENCES companies(id),
    service_provider_id UUID REFERENCES service_providers(id),
    service_provider_name VARCHAR(255),
    provider_type provider_type,
    
    -- Invoice Details
    invoice_number VARCHAR(100),
    invoice_date DATE,
    due_date DATE,
    
    -- Financial
    currency VARCHAR(10) DEFAULT 'USD',
    amount_invoiced DECIMAL(15,2),
    amount_approved DECIMAL(15,2),
    amount_paid DECIMAL(15,2),
    
    -- Approval Process
    approval_status VARCHAR(50) DEFAULT 'pending',
    approval_date DATE,
    approved_by UUID REFERENCES users(id),
    
    -- Payment
    payment_status VARCHAR(50) DEFAULT 'pending',
    payment_date DATE,
    payment_method VARCHAR(50),
    
    -- Cost Center
    cost_center VARCHAR(100),
    budget_reference VARCHAR(100),
    
    -- Category
    expense_category VARCHAR(100),
    
    -- Related Objects
    dispute_id UUID,
    contract_id UUID,
    
    -- Documents
    related_documents JSONB,
    
    -- Ownership
    expense_owner_id UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_outsourcing_expenses_matter (matter_id),
    INDEX idx_outsourcing_expenses_entity (entity_id),
    INDEX idx_outsourcing_expenses_provider (service_provider_id),
    INDEX idx_outsourcing_expenses_status (approval_status),
    INDEX idx_outsourcing_expenses_payment (payment_status)
);

-- ========================================
-- DOCUMENT MANAGEMENT
-- ========================================

-- Document Types
CREATE TYPE document_type AS ENUM (
    'contract',
    'policy',
    'legal_memo',
    'correspondence',
    'pleading',
    'evidence',
    'constitutional_document',
    'board_resolution',
    'financial_report',
    'license',
    'other'
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    document_type document_type NOT NULL,
    
    -- File Information
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    company_id UUID REFERENCES companies(id),
    contract_id UUID REFERENCES contracts(id),
    
    -- Content
    extracted_text TEXT,
    
    -- AI Analysis
    ai_summary TEXT,
    ai_tags TEXT[],
    ai_analysis JSONB,
    
    -- Security
    is_privileged BOOLEAN DEFAULT TRUE,
    access_level security_level DEFAULT 'confidential',
    encryption_key_id VARCHAR(100),
    
    -- Version Control
    version INTEGER DEFAULT 1,
    parent_document_id UUID,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    uploaded_by UUID REFERENCES users(id),
    
    -- Indexes
    INDEX idx_documents_matter (matter_id),
    INDEX idx_documents_company (company_id),
    INDEX idx_documents_contract (contract_id),
    INDEX idx_documents_type (document_type),
    INDEX idx_documents_uploaded_by (uploaded_by)
);

-- ========================================
-- KEY DATES MODULE
-- ========================================

-- Date Types
CREATE TYPE date_type AS ENUM (
    'deadline',
    'hearing',
    'filing',
    'renewal',
    'expiration',
    'review',
    'payment',
    'compliance',
    'other'
);

-- Key Dates Table
CREATE TABLE key_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date_title VARCHAR(255) NOT NULL,
    date_type date_type NOT NULL,
    description TEXT,
    
    -- Date Information
    key_date DATE NOT NULL,
    due_time TIME,
    end_date DATE,
    
    -- Relationships
    matter_id UUID REFERENCES matters(id),
    entity_id UUID REFERENCES companies(id),
    
    -- Responsibility
    assigned_to_id UUID REFERENCES users(id),
    external_contact_id UUID,
    
    -- Priority & Status
    priority priority_level DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'upcoming',
    
    -- Reminders
    reminder_required BOOLEAN DEFAULT TRUE,
    reminder_settings JSONB,
    
    -- Completion
    completion_date DATE,
    completion_notes TEXT,
    
    -- Recurrence
    recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    
    -- Documents
    related_documents JSONB,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    tags TEXT[],
    
    -- Indexes
    INDEX idx_key_dates_matter (matter_id),
    INDEX idx_key_dates_entity (entity_id),
    INDEX idx_key_dates_assigned (assigned_to_id),
    INDEX idx_key_dates_date (key_date),
    INDEX idx_key_dates_type (date_type)
);

-- ========================================
-- INTERNAL LEGAL ADVICE MODULE
-- ========================================

-- Advice Types
CREATE TYPE advice_type AS ENUM (
    'regulatory',
    'contractual',
    'compliance',
    'ip',
    'employment',
    'litigation_risk',
    'corporate',
    'data_protection'
);

-- Advice Status
CREATE TYPE advice_status AS ENUM (
    'pending',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);

-- Internal Legal Advice Table
CREATE TABLE internal_legal_advice (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    advice_title VARCHAR(255) NOT NULL,
    advice_description TEXT,
    
    -- Request Information
    request_date DATE,
    due_date DATE,
    priority priority_level DEFAULT 'medium',
    
    -- Requester Information
    entity_id UUID REFERENCES companies(id),
    requesting_department_id UUID,
    requesting_user_id UUID REFERENCES users(id),
    
    -- Assignment
    assigned_legal_id UUID REFERENCES users(id),
    advice_status advice_status DEFAULT 'pending',
    
    -- Dates
    initial_response_date DATE,
    completion_date DATE,
    
    -- Advice Content
    advice_summary TEXT,
    detailed_advice TEXT,
    advice_type advice_type,
    
    -- Risk Assessment
    risk_assessment risk_level,
    risk_score INTEGER,
    
    -- Follow-up
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    
    -- Documents
    related_documents JSONB,
    
    -- Approval
    approval_required BOOLEAN DEFAULT FALSE,
    approved_by_id UUID REFERENCES users(id),
    approval_date DATE,
    
    -- Feedback
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comments TEXT,
    
    -- Time Tracking
    time_spent_hours DECIMAL(5,2),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    internal_notes TEXT,
    tags TEXT[],
    
    -- Indexes
    INDEX idx_internal_advice_entity (entity_id),
    INDEX idx_internal_advice_requester (requesting_user_id),
    INDEX idx_internal_advice_assigned (assigned_legal_id),
    INDEX idx_internal_advice_status (advice_status),
    INDEX idx_internal_advice_type (advice_type)
);

-- ========================================
-- AUDIT & SECURITY LOGS
-- ========================================

-- Audit Log Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Event Information
    event_type VARCHAR(50) NOT NULL,
    event_category VARCHAR(30) NOT NULL,
    user_id UUID REFERENCES users(id),
    
    -- Context
    resource_type VARCHAR(50),
    resource_id VARCHAR(100),
    client_ip INET,
    user_agent TEXT,
    
    -- Details
    action VARCHAR(100) NOT NULL,
    details JSONB,
    before_state JSONB,
    after_state JSONB,
    
    -- Security
    privilege_level security_level,
    encryption_used BOOLEAN DEFAULT FALSE,
    
    -- Timestamp
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_audit_logs_timestamp (timestamp DESC),
    INDEX idx_audit_logs_user (user_id),
    INDEX idx_audit_logs_resource (resource_type, resource_id),
    INDEX idx_audit_logs_event (event_type)
);

-- ========================================
-- INDEXES FOR PERFORMANCE
-- ========================================

-- Multi-column indexes for common queries
CREATE INDEX idx_matters_company_status ON matters(company_id, matter_status);
CREATE INDEX idx_contracts_company_status ON contracts(company_id, status);
CREATE INDEX idx_disputes_company_status ON disputes(company_id, dispute_status);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to_id, status);
CREATE INDEX idx_risk_assessments_company_status ON risk_assessments(company_id, status);

-- Text search indexes
CREATE INDEX idx_companies_name_gin ON companies USING gin(to_tsvector('english', company_name));
CREATE INDEX idx_matters_name_gin ON matters USING gin(to_tsvector('english', matter_name));
CREATE INDEX idx_contracts_title_gin ON contracts USING gin(to_tsvector('english', contract_title));

-- ========================================
-- VIEWS FOR COMMON QUERIES
-- ========================================

-- Active Matters View
CREATE VIEW active_matters AS
SELECT 
    m.*,
    c.company_name,
    u.first_name || ' ' || u.last_name AS lead_attorney_name
FROM matters m
JOIN companies c ON m.company_id = c.id
LEFT JOIN users u ON m.lead_attorney_id = u.id
WHERE m.matter_status = 'active';

-- Expiring Contracts View
CREATE VIEW expiring_contracts AS
SELECT 
    c.*,
    comp.company_name,
    EXTRACT(DAYS FROM (c.expiration_date - CURRENT_DATE)) AS days_to_expiry
FROM contracts c
JOIN companies comp ON c.company_id = comp.id
WHERE c.expiration_date IS NOT NULL 
AND c.expiration_date <= CURRENT_DATE + INTERVAL '90 days'
AND c.status = 'active';

-- High Risk Items View
CREATE VIEW high_risk_items AS
SELECT 
    'risk_assessment' as item_type,
    id,
    risk_title as title,
    priority as risk_level,
    created_at
FROM risk_assessments
WHERE priority IN ('high', 'critical')
UNION ALL
SELECT 
    'contract' as item_type,
    id,
    contract_title as title,
    CASE 
        WHEN ai_risk_score > 7 THEN 'high'
        WHEN ai_risk_score > 4 THEN 'medium'
        ELSE 'low'
    END as risk_level,
    created_at
FROM contracts
WHERE ai_risk_score > 4;

-- ========================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ========================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_modified_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.modified_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-updating timestamps
CREATE TRIGGER update_companies_modified_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();
CREATE TRIGGER update_matters_modified_at BEFORE UPDATE ON matters FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();
CREATE TRIGGER update_contracts_modified_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();
CREATE TRIGGER update_disputes_modified_at BEFORE UPDATE ON disputes FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();
CREATE TRIGGER update_tasks_modified_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();
CREATE TRIGGER update_risk_assessments_modified_at BEFORE UPDATE ON risk_assessments FOR EACH ROW EXECUTE FUNCTION update_modified_at_column();

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_event_type VARCHAR(50),
    p_event_category VARCHAR(30),
    p_user_id UUID,
    p_resource_type VARCHAR(50),
    p_resource_id VARCHAR(100),
    p_action VARCHAR(100),
    p_details JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO audit_logs (
        event_type,
        event_category,
        user_id,
        resource_type,
        resource_id,
        action,
        details
    ) VALUES (
        p_event_type,
        p_event_category,
        p_user_id,
        p_resource_type,
        p_resource_id,
        p_action,
        p_details
    );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- SAMPLE DATA INSERTION
-- ========================================

-- Insert sample admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, is_verified)
VALUES ('admin@counselflow.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgG4TdGD2YdFI2K', 'Admin', 'User', 'admin', true, true);

-- Insert sample company
INSERT INTO companies (company_name, jurisdiction_of_incorporation, incorporation_date, registered_address, industry_sector, shareholders_info, directors_info, created_by)
VALUES (
    'Acme Corporation Ltd',
    'United Kingdom',
    '2020-01-15',
    '123 Business Street, London, EC2V 8AS',
    'Technology',
    '[{"name": "John Smith", "percentage": 60, "share_class": "Ordinary"}, {"name": "Jane Doe", "percentage": 40, "share_class": "Ordinary"}]',
    '[{"name": "John Smith", "title": "CEO", "appointed_date": "2020-01-15"}, {"name": "Jane Doe", "title": "CTO", "appointed_date": "2020-01-15"}]',
    (SELECT id FROM users WHERE email = 'admin@counselflow.com' LIMIT 1)
);

-- Create completion message
SELECT 'CounselFlow Ultimate Database Schema created successfully!' AS message;