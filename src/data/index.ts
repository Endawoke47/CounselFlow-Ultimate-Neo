// Unified Data Management System for CounselFlow
// This system handles all cross-module data referencing and analytics

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  status: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
}

export interface Contract extends BaseEntity {
  contractId: string;
  contractName: string;
  client: string;
  counterparty: string;
  contractValue_USD: number;
  contractValue_NGN: number;
  contractValue_ZAR: number;
  effectiveDate: string;
  terminationClause: string;
  governingLaw: string;
  linkedMatterID?: string;
  linkedDisputeID?: string;
  spendToDate_USD: number;
  spendToDate_NGN: number;
  spendToDate_ZAR: number;
  practiceArea: string;
  industry: string;
  source: string;
  dataClause: string;
  riskFlag: boolean;
  provisionInBooks: boolean;
}

export interface Matter extends BaseEntity {
  matterID: string;
  title: string;
  client: string;
  attorney: string;
  practiceArea: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: string;
  linkedContractID?: string;
  linkedDisputeID?: string;
  legalTeam: string;
  jurisdiction: string;
  industry: string;
  description?: string;
}

export interface Dispute extends BaseEntity {
  disputeID: string;
  dispute: string;
  client: string;
  counterparty: string;
  jurisdiction: string;
  value_USD: number;
  value_NGN: number;
  value_ZAR: number;
  filed: string;
  nextHearing: string;
  linkedContractID?: string;
  linkedMatterID?: string;
  practiceArea: string;
  externalCounsel: string;
  country: string;
  timeline_7d: string;
  timeline_30d: string;
  timeline_90d: string;
  timeline_365d: string;
  parties: string;
  governingLaw: string;
}

export interface Risk extends BaseEntity {
  riskID: string;
  description: string;
  sourceModule: 'Contract' | 'Dispute' | 'Matter' | 'Policy' | 'Licensing';
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigationPlan: string;
  owner: string;
  dueDate: string;
  riskLevel: string;
  outcomeProbability: string;
  riskFlag: boolean;
}

export interface Task extends BaseEntity {
  taskID: string;
  taskDescription: string;
  assignedUser: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  linkedMatterID?: string;
  progressNote: string;
}

export interface Policy extends BaseEntity {
  policyID: string;
  entity: string;
  subject: string;
  effectiveDate: string;
  linkToDocument: string;
}

export interface License extends BaseEntity {
  licenseID: string;
  licenseType: string;
  country: string;
  entity: string;
  expiryDate: string;
  issuer: string;
  linkedComplianceObligations: string;
}

export interface Knowledge extends BaseEntity {
  knowledgeID: string;
  type: 'Clause' | 'Template' | 'Playbook' | 'Precedent' | 'Regulation';
  subject: string;
  tags: string[];
  jurisdiction: string;
  sourceModule: string;
  content?: string;
  documentPath?: string;
}

export interface Entity extends BaseEntity {
  entityID: string;
  entityName: string;
  entityType: 'Corporation' | 'Partnership' | 'LLC' | 'Trust' | 'Individual';
  jurisdiction: string;
  registrationNumber: string;
  incorporationDate: string;
  industry: string;
  parentCompany?: string;
  subsidiaries: string[];
  keyContacts: Contact[];
  complianceStatus: 'Compliant' | 'Non-Compliant' | 'Under Review';
}

export interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: 'Primary' | 'Secondary' | 'Legal' | 'Finance' | 'Operations';
}

export interface Spend extends BaseEntity {
  spendID: string;
  vendor: string;
  matter: string;
  amountPaid: number;
  currency: 'USD' | 'NGN' | 'ZAR' | 'EUR';
  slaStatus: 'Met' | 'Pending' | 'Overdue';
  invoiceStatus: 'Paid' | 'Unpaid' | 'Disputed';
  performanceScore: number;
}

// Cross-reference mapping system
export interface CrossReference {
  sourceType: string;
  sourceId: string;
  targetType: string;
  targetId: string;
  relationshipType: 'linked' | 'parent' | 'child' | 'related' | 'dependency';
  createdAt: string;
}

// Analytics interfaces
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  category: 'financial' | 'operational' | 'compliance' | 'risk' | 'performance';
}

export interface ChartData {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'donut' | 'area' | 'scatter';
  title: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  categories?: string[];
  colors?: string[];
}

// Data Management Class
export class DataManager {
  private static instance: DataManager;
  private contracts: Contract[] = [];
  private matters: Matter[] = [];
  private disputes: Dispute[] = [];
  private risks: Risk[] = [];
  private tasks: Task[] = [];
  private policies: Policy[] = [];
  private licenses: License[] = [];
  private knowledge: Knowledge[] = [];
  private entities: Entity[] = [];
  private spend: Spend[] = [];
  private crossReferences: CrossReference[] = [];

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  private initializeData(): void {
    // Initialize with provided data
    this.loadContracts();
    this.loadMatters();
    this.loadDisputes();
    this.loadRisks();
    this.loadTasks();
    this.loadPolicies();
    this.loadLicenses();
    this.loadKnowledge();
    this.loadEntities();
    this.loadSpend();
    this.createCrossReferences();
  }

  private loadContracts(): void {
    this.contracts = [
      {
        id: 'c1',
        contractId: 'C-2024-SA-001',
        contractName: 'Cape Town Rail Expansion EPC Agreement',
        client: 'Transnet SOC Ltd',
        counterparty: 'CRCC (China Railway Construction Corp)',
        contractValue_USD: 520000000,
        contractValue_NGN: 0,
        contractValue_ZAR: 780000000,
        effectiveDate: '2024-01-15',
        terminationClause: 'Termination for convenience with 90-day notice',
        governingLaw: 'South African Law',
        linkedMatterID: 'M-2024-SA-002',
        linkedDisputeID: 'D-2024-SA-011',
        spendToDate_USD: 52000000,
        spendToDate_NGN: 0,
        spendToDate_ZAR: 78000000,
        practiceArea: 'Infrastructure',
        industry: 'Infrastructure',
        source: 'Contracts',
        dataClause: 'Yes',
        riskFlag: true,
        provisionInBooks: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'c2',
        contractId: 'C-2023-NG-009',
        contractName: 'Oando Gas Supply Agreement with TotalEnergies',
        client: 'Oando PLC',
        counterparty: 'TotalEnergies Nigeria',
        contractValue_USD: 625000000,
        contractValue_NGN: 9400000000,
        contractValue_ZAR: 0,
        effectiveDate: '2023-08-01',
        terminationClause: 'Breach-triggered with arbitration clause',
        governingLaw: 'Nigerian Law',
        linkedMatterID: 'M-2023-NG-012',
        linkedDisputeID: 'D-2023-NG-020',
        spendToDate_USD: 62500000,
        spendToDate_NGN: 940000000,
        spendToDate_ZAR: 0,
        practiceArea: 'Energy',
        industry: 'Energy',
        source: 'Contracts',
        dataClause: 'No',
        riskFlag: true,
        provisionInBooks: true,
        createdAt: '2023-08-01T10:00:00Z',
        updatedAt: '2023-08-01T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadMatters(): void {
    this.matters = [
      {
        id: 'm1',
        matterID: 'M-2024-SA-002',
        title: 'Cape Town Rail Expansion EPC Agreement',
        client: 'Transnet SOC Ltd',
        attorney: 'ENS Africa',
        practiceArea: 'Infrastructure',
        priority: 'high',
        dueDate: '2025-07-15',
        linkedContractID: 'C-2024-SA-001',
        linkedDisputeID: 'D-2024-SA-011',
        legalTeam: 'Bowmans LLP',
        jurisdiction: 'South Africa',
        industry: 'Infrastructure',
        description: 'EPC Agreement management and dispute resolution',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'm2',
        matterID: 'M-2023-NG-012',
        title: 'Oando Gas Supply Agreement with TotalEnergies',
        client: 'Oando PLC',
        attorney: 'Banwo & Ighodalo',
        practiceArea: 'Energy',
        priority: 'critical',
        dueDate: '2025-08-01',
        linkedContractID: 'C-2023-NG-009',
        linkedDisputeID: 'D-2023-NG-020',
        legalTeam: 'Aelex Nigeria',
        jurisdiction: 'Nigeria',
        industry: 'Energy',
        description: 'Gas supply agreement breach and arbitration',
        createdAt: '2023-08-01T10:00:00Z',
        updatedAt: '2023-08-01T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadDisputes(): void {
    this.disputes = [
      {
        id: 'd1',
        disputeID: 'D-2024-SA-011',
        dispute: 'Delay and cost overrun claims under EPC agreement',
        client: 'Transnet SOC Ltd',
        counterparty: 'CRCC',
        jurisdiction: 'Johannesburg Arbitration Tribunal',
        value_USD: 28000000,
        value_NGN: 0,
        value_ZAR: 42000000,
        filed: '2024-05-12',
        nextHearing: '2025-09-10',
        linkedContractID: 'C-2024-SA-001',
        linkedMatterID: 'M-2024-SA-002',
        practiceArea: 'Infrastructure / Arbitration',
        externalCounsel: 'Bowmans LLP',
        country: 'South Africa',
        timeline_7d: 'Hearing memo submitted',
        timeline_30d: 'Panel formed, ToR signed',
        timeline_90d: 'Notice to arbitrate served',
        timeline_365d: 'Delays reported on Phase II - Contractor missed milestones',
        parties: 'Transnet SOC Ltd - CRCC (China Railway Construction Corp)',
        governingLaw: 'South African Law',
        createdAt: '2024-05-12T10:00:00Z',
        updatedAt: '2024-05-12T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'd2',
        disputeID: 'D-2023-NG-020',
        dispute: 'Failure by TotalEnergies to meet minimum gas offtake obligations',
        client: 'Oando PLC',
        counterparty: 'TotalEnergies Nigeria',
        jurisdiction: 'Lagos State High Court',
        value_USD: 625000000,
        value_NGN: 9400000000,
        value_ZAR: 0,
        filed: '2023-10-20',
        nextHearing: '2025-07-15',
        linkedContractID: 'C-2023-NG-009',
        linkedMatterID: 'M-2023-NG-012',
        practiceArea: 'Energy / Contract Law',
        externalCounsel: 'Aelex Nigeria',
        country: 'Nigeria',
        timeline_7d: 'Expert valuation submitted',
        timeline_30d: 'Settlement talks collapsed',
        timeline_90d: 'Litigation initiated',
        timeline_365d: 'Multiple notices served on supply lapses',
        parties: 'Oando PLC - TotalEnergies Nigeria',
        governingLaw: 'Nigerian Law',
        createdAt: '2023-10-20T10:00:00Z',
        updatedAt: '2023-10-20T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadRisks(): void {
    this.risks = [
      {
        id: 'r1',
        riskID: 'RSK-009',
        description: 'Retaliatory action risk from Algeria after mining license revocation',
        sourceModule: 'Dispute',
        impact: 'Critical',
        severity: 'Critical',
        mitigationPlan: 'File ICSID arbitration, seek EU backing',
        owner: 'GC, SaharaMinerals',
        dueDate: '2025-08-30',
        riskLevel: 'High',
        outcomeProbability: '70% favorable',
        riskFlag: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'r2',
        riskID: 'RSK-010',
        description: '₦9.4B arbitration loss exposure on gas supply contract',
        sourceModule: 'Contract',
        impact: 'High',
        severity: 'High',
        mitigationPlan: 'Engage new expert witness & renegotiate timelines',
        owner: 'GC, NaijaGas',
        dueDate: '2025-09-10',
        riskLevel: 'Critical',
        outcomeProbability: '50/50',
        riskFlag: true,
        createdAt: '2023-10-20T10:00:00Z',
        updatedAt: '2023-10-20T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadTasks(): void {
    this.tasks = [
      {
        id: 't1',
        taskID: 'TSK-001',
        taskDescription: 'Draft arbitration brief for cement plant dispute',
        assignedUser: 'Isaac Malema (Legal Counsel, PPC SA)',
        priority: 'High',
        dueDate: '2025-07-15',
        linkedMatterID: 'MTR-009',
        progressNote: '7d ago: Arbitration trigger confirmed',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 't2',
        taskID: 'TSK-002',
        taskDescription: 'Follow up with EFCC on financial audit request',
        assignedUser: 'Ngozi Umeh (Compliance Officer, Shell Nigeria)',
        priority: 'Critical',
        dueDate: '2025-07-12',
        linkedMatterID: 'MTR-011',
        progressNote: '30d: Shell flagged in audit list',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'pending'
      }
    ];
  }

  private loadPolicies(): void {
    this.policies = [
      {
        id: 'p1',
        policyID: 'PLC-010',
        entity: 'SaharaMinerals (Algeria)',
        subject: 'Anti-Bribery & Corruption Policy',
        effectiveDate: '2024-08-01',
        linkToDocument: '/docs/sahara_abc_policy.pdf',
        createdAt: '2024-08-01T10:00:00Z',
        updatedAt: '2024-08-01T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'p2',
        policyID: 'PLC-011',
        entity: 'NaijaCredit (Nigeria)',
        subject: 'Data Breach Notification Protocol',
        effectiveDate: '2025-01-15',
        linkToDocument: '/docs/naijacredit_ndpr_response.pdf',
        createdAt: '2025-01-15T10:00:00Z',
        updatedAt: '2025-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadLicenses(): void {
    this.licenses = [
      {
        id: 'l1',
        licenseID: 'LIC-007',
        licenseType: 'Export Mining License',
        country: 'Algeria',
        entity: 'SaharaMinerals',
        expiryDate: 'N/A',
        issuer: 'Ministry of Energy & Mining',
        linkedComplianceObligations: 'Quarterly EIA submission',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'cancelled'
      },
      {
        id: 'l2',
        licenseID: 'LIC-008',
        licenseType: 'Tier 1 Banking License',
        country: 'Nigeria',
        entity: 'NaijaCredit',
        expiryDate: '2026-01-30',
        issuer: 'Central Bank of Nigeria',
        linkedComplianceObligations: 'NDPR, AML, Capital adequacy',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadKnowledge(): void {
    this.knowledge = [
      {
        id: 'k1',
        knowledgeID: 'KM-101',
        type: 'Clause',
        subject: 'Termination for convenience in infra contracts',
        tags: ['Infra', 'Termination'],
        jurisdiction: 'South Africa',
        sourceModule: 'Contracts',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 'k2',
        knowledgeID: 'KM-102',
        type: 'Template',
        subject: 'NDPR Compliance Memo Template',
        tags: ['Data', 'Nigeria', 'Privacy'],
        jurisdiction: 'Nigeria',
        sourceModule: 'Policy',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadEntities(): void {
    this.entities = [
      {
        id: 'e1',
        entityID: 'ENT-001',
        entityName: 'Transnet SOC Ltd',
        entityType: 'Corporation',
        jurisdiction: 'South Africa',
        registrationNumber: 'SA-2024-001',
        incorporationDate: '1990-01-01',
        industry: 'Infrastructure',
        parentCompany: 'South African Government',
        subsidiaries: ['Transnet Rail', 'Transnet Port Authority'],
        keyContacts: [
          {
            id: 'c1',
            name: 'John Smith',
            title: 'Chief Legal Officer',
            email: 'john.smith@transnet.co.za',
            phone: '+27-11-123-4567',
            role: 'Primary'
          }
        ],
        complianceStatus: 'Compliant',
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private loadSpend(): void {
    this.spend = [
      {
        id: 's1',
        spendID: 'SPND-001',
        vendor: 'ENS Africa (Johannesburg)',
        matter: 'MTR-009',
        amountPaid: 4500000,
        currency: 'ZAR',
        slaStatus: 'Met',
        invoiceStatus: 'Paid',
        performanceScore: 92,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      },
      {
        id: 's2',
        spendID: 'SPND-002',
        vendor: 'Aelex Nigeria',
        matter: 'MTR-011',
        amountPaid: 21200000,
        currency: 'NGN',
        slaStatus: 'Pending',
        invoiceStatus: 'Unpaid',
        performanceScore: 75,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        createdBy: 'system',
        status: 'active'
      }
    ];
  }

  private createCrossReferences(): void {
    this.crossReferences = [
      {
        sourceType: 'Contract',
        sourceId: 'C-2024-SA-001',
        targetType: 'Matter',
        targetId: 'M-2024-SA-002',
        relationshipType: 'linked',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        sourceType: 'Contract',
        sourceId: 'C-2024-SA-001',
        targetType: 'Dispute',
        targetId: 'D-2024-SA-011',
        relationshipType: 'linked',
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        sourceType: 'Matter',
        sourceId: 'M-2024-SA-002',
        targetType: 'Dispute',
        targetId: 'D-2024-SA-011',
        relationshipType: 'linked',
        createdAt: '2024-01-15T10:00:00Z'
      }
    ];
  }

  // Public methods for data access
  public getContracts(): Contract[] {
    return this.contracts;
  }

  public getMatters(): Matter[] {
    return this.matters;
  }

  public getDisputes(): Dispute[] {
    return this.disputes;
  }

  public getRisks(): Risk[] {
    return this.risks;
  }

  public getTasks(): Task[] {
    return this.tasks;
  }

  public getPolicies(): Policy[] {
    return this.policies;
  }

  public getLicenses(): License[] {
    return this.licenses;
  }

  public getKnowledge(): Knowledge[] {
    return this.knowledge;
  }

  public getEntities(): Entity[] {
    return this.entities;
  }

  public getSpend(): Spend[] {
    return this.spend;
  }

  public getCrossReferences(): CrossReference[] {
    return this.crossReferences;
  }

  // Cross-reference methods
  public getLinkedItems(sourceType: string, sourceId: string): CrossReference[] {
    return this.crossReferences.filter(
      ref => ref.sourceType === sourceType && ref.sourceId === sourceId
    );
  }

  public getRelatedItems(targetType: string, targetId: string): CrossReference[] {
    return this.crossReferences.filter(
      ref => ref.targetType === targetType && ref.targetId === targetId
    );
  }

  // Analytics methods
  public getAnalyticsMetrics(): AnalyticsMetric[] {
    return [
      {
        id: 'contracts_month',
        name: 'Contracts This Month',
        value: 24,
        trend: 'up',
        change: '+12%',
        period: 'monthly',
        category: 'operational'
      },
      {
        id: 'compliance_issues',
        name: 'Compliance Issues',
        value: 6,
        trend: 'down',
        change: '-8%',
        period: 'monthly',
        category: 'compliance'
      },
      {
        id: 'active_matters',
        name: 'Active Matters',
        value: 18,
        trend: 'up',
        change: '+3%',
        period: 'monthly',
        category: 'operational'
      },
      {
        id: 'legal_spend',
        name: 'Legal Spend',
        value: 127000,
        trend: 'up',
        change: '+5%',
        period: 'monthly',
        category: 'financial'
      }
    ];
  }

  public getChartData(): ChartData[] {
    return [
      {
        id: 'monthly_contracts',
        type: 'bar',
        title: 'Monthly Contract Volume',
        data: [
          { month: 'Jan', contracts: 18 },
          { month: 'Feb', contracts: 22 },
          { month: 'Mar', contracts: 19 },
          { month: 'Apr', contracts: 25 },
          { month: 'May', contracts: 24 },
          { month: 'Jun', contracts: 28 }
        ],
        xAxis: 'month',
        yAxis: 'contracts'
      },
      {
        id: 'dispute_status',
        type: 'pie',
        title: 'Dispute Status Distribution',
        data: [
          { status: 'Active', count: 12 },
          { status: 'Pending', count: 8 },
          { status: 'Resolved', count: 25 },
          { status: 'Arbitration', count: 5 }
        ],
        categories: ['Active', 'Pending', 'Resolved', 'Arbitration'],
        colors: ['#ef4444', '#f59e0b', '#10b981', '#3b82f6']
      },
      {
        id: 'risk_severity',
        type: 'donut',
        title: 'Risk Severity Breakdown',
        data: [
          { severity: 'Critical', count: 3 },
          { severity: 'High', count: 8 },
          { severity: 'Medium', count: 15 },
          { severity: 'Low', count: 12 }
        ],
        categories: ['Critical', 'High', 'Medium', 'Low'],
        colors: ['#dc2626', '#ea580c', '#ca8a04', '#16a34a']
      }
    ];
  }

  // Search methods
  public searchAll(query: string): any[] {
    const results: any[] = [];
    const searchTerm = query.toLowerCase();

    // Search contracts
    this.contracts.forEach(contract => {
      if (contract.contractName.toLowerCase().includes(searchTerm) ||
          contract.client.toLowerCase().includes(searchTerm) ||
          contract.counterparty.toLowerCase().includes(searchTerm)) {
        results.push({ ...contract, type: 'Contract' });
      }
    });

    // Search matters
    this.matters.forEach(matter => {
      if (matter.title.toLowerCase().includes(searchTerm) ||
          matter.client.toLowerCase().includes(searchTerm) ||
          matter.attorney.toLowerCase().includes(searchTerm)) {
        results.push({ ...matter, type: 'Matter' });
      }
    });

    // Search disputes
    this.disputes.forEach(dispute => {
      if (dispute.dispute.toLowerCase().includes(searchTerm) ||
          dispute.client.toLowerCase().includes(searchTerm) ||
          dispute.counterparty.toLowerCase().includes(searchTerm)) {
        results.push({ ...dispute, type: 'Dispute' });
      }
    });

    // Search knowledge
    this.knowledge.forEach(knowledge => {
      if (knowledge.subject.toLowerCase().includes(searchTerm) ||
          knowledge.tags.some(tag => tag.toLowerCase().includes(searchTerm))) {
        results.push({ ...knowledge, type: 'Knowledge' });
      }
    });

    return results;
  }

  // Data manipulation methods
  public addContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newContract: Contract = {
      ...contract,
      id: `c${this.contracts.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.contracts.push(newContract);
  }

  public updateContract(id: string, updates: Partial<Contract>): void {
    const index = this.contracts.findIndex(c => c.id === id);
    if (index !== -1) {
      this.contracts[index] = {
        ...this.contracts[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }
  }

  public deleteContract(id: string): void {
    this.contracts = this.contracts.filter(c => c.id !== id);
  }

  // Similar methods for other entities...
}

// Export singleton instance
export const dataManager = DataManager.getInstance();
export default dataManager;